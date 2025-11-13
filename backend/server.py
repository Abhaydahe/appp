from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
import os
import logging
import jwt
import uuid

from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app
app = FastAPI()

# Create a router with /api prefix
api_router = APIRouter(prefix="/api")


# ============= MODELS =============

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: str  # jobseeker, employer, freelancer, client
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    full_name: str
    user_type: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    skills: List[str] = []
    hourly_rate: Optional[float] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    rating: float = 0.0
    completed_projects: int = 0
    verification_status: str = "unverified"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    hourly_rate: Optional[float] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Job Models
class JobCreate(BaseModel):
    title: str
    company_name: str
    description: str
    requirements: List[str]
    category: str
    job_type: str
    experience_level: str
    salary_min: float
    salary_max: float
    location: str
    skills: List[str]

class Job(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    employer_id: str
    title: str
    company_name: str
    description: str
    requirements: List[str]
    category: str
    job_type: str
    experience_level: str
    salary_min: float
    salary_max: float
    location: str
    skills: List[str]
    status: str = "active"
    views: int = 0
    applicants_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Project Models
class ProjectCreate(BaseModel):
    title: str
    description: str
    category: str
    budget_type: str
    budget_min: float
    budget_max: float
    duration: str
    skills: List[str]

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    title: str
    description: str
    category: str
    budget_type: str
    budget_min: float
    budget_max: float
    duration: str
    skills: List[str]
    status: str = "open"
    views: int = 0
    proposals_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Job Application Models
class JobApplicationCreate(BaseModel):
    job_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None

class JobApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    job_id: str
    applicant_id: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Proposal Models
class ProposalCreate(BaseModel):
    project_id: str
    cover_letter: str
    proposed_budget: float
    delivery_time: str

class Proposal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    freelancer_id: str
    cover_letter: str
    proposed_budget: float
    delivery_time: str
    status: str = "pending"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Notification Models
class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    message: str
    type: str
    link: Optional[str] = None
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ============= HELPER FUNCTIONS =============

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def serialize_datetime(obj):
    """Helper to serialize datetime objects"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    return obj

async def create_notification(user_id: str, title: str, message: str, type: str, link: Optional[str] = None):
    """Helper to create notifications"""
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type,
        link=link
    )
    doc = notification.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.notifications.insert_one(doc)


# ============= AUTHENTICATION ROUTES =============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user profile
    user_profile = UserProfile(
        email=user_data.email,
        full_name=user_data.full_name,
        user_type=user_data.user_type,
        phone=user_data.phone
    )
    
    # Hash password and save
    user_dict = user_profile.model_dump()
    user_dict['hashed_password'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['updated_at'] = user_dict['updated_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token({"sub": user_profile.id})
    
    # Remove sensitive data
    user_dict.pop('hashed_password')
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_dict
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user['id']})
    
    # Remove sensitive data
    user.pop('hashed_password')
    user.pop('_id', None)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


# ============= USER PROFILE ROUTES =============

@api_router.get("/users/{user_id}")
async def get_user_profile(user_id: str):
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.put("/users/{user_id}")
async def update_user_profile(
    user_id: str,
    update_data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    if current_user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": update_dict}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    return updated_user


# ============= JOB ROUTES =============

@api_router.post("/jobs", response_model=Job)
async def create_job(job_data: JobCreate, current_user: dict = Depends(get_current_user)):
    if current_user['user_type'] != 'employer':
        raise HTTPException(status_code=403, detail="Only employers can create jobs")
    
    job = Job(
        employer_id=current_user['id'],
        **job_data.model_dump()
    )
    
    doc = job.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.jobs.insert_one(doc)
    return job

@api_router.get("/jobs", response_model=List[Job])
async def get_jobs(
    search: Optional[str] = None,
    location: Optional[str] = None,
    category: Optional[str] = None,
    job_type: Optional[str] = None,
    experience_level: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    query = {"status": "active"}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"company_name": {"$regex": search, "$options": "i"}},
            {"skills": {"$regex": search, "$options": "i"}}
        ]
    
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    if category:
        query["category"] = category
    
    if job_type:
        query["job_type"] = job_type
    
    if experience_level:
        query["experience_level"] = experience_level
    
    jobs = await db.jobs.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for job in jobs:
        if isinstance(job['created_at'], str):
            job['created_at'] = datetime.fromisoformat(job['created_at'])
        if isinstance(job['updated_at'], str):
            job['updated_at'] = datetime.fromisoformat(job['updated_at'])
    
    return jobs

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Increment views
    await db.jobs.update_one({"id": job_id}, {"$inc": {"views": 1}})
    job['views'] += 1
    
    if isinstance(job['created_at'], str):
        job['created_at'] = datetime.fromisoformat(job['created_at'])
    if isinstance(job['updated_at'], str):
        job['updated_at'] = datetime.fromisoformat(job['updated_at'])
    
    return job

@api_router.put("/jobs/{job_id}", response_model=Job)
async def update_job(
    job_id: str,
    job_data: JobCreate,
    current_user: dict = Depends(get_current_user)
):
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job['employer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to update this job")
    
    update_dict = job_data.model_dump()
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.jobs.update_one({"id": job_id}, {"$set": update_dict})
    
    updated_job = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if isinstance(updated_job['created_at'], str):
        updated_job['created_at'] = datetime.fromisoformat(updated_job['created_at'])
    if isinstance(updated_job['updated_at'], str):
        updated_job['updated_at'] = datetime.fromisoformat(updated_job['updated_at'])
    
    return updated_job

@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, current_user: dict = Depends(get_current_user)):
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job['employer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")
    
    await db.jobs.update_one({"id": job_id}, {"$set": {"status": "closed"}})
    return {"message": "Job deleted successfully"}

@api_router.get("/jobs/employer/{employer_id}", response_model=List[Job])
async def get_employer_jobs(employer_id: str):
    jobs = await db.jobs.find({"employer_id": employer_id}, {"_id": 0}).to_list(100)
    
    for job in jobs:
        if isinstance(job['created_at'], str):
            job['created_at'] = datetime.fromisoformat(job['created_at'])
        if isinstance(job['updated_at'], str):
            job['updated_at'] = datetime.fromisoformat(job['updated_at'])
    
    return jobs


# ============= PROJECT ROUTES =============

@api_router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, current_user: dict = Depends(get_current_user)):
    if current_user['user_type'] != 'client':
        raise HTTPException(status_code=403, detail="Only clients can create projects")
    
    project = Project(
        client_id=current_user['id'],
        **project_data.model_dump()
    )
    
    doc = project.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.projects.insert_one(doc)
    return project

@api_router.get("/projects", response_model=List[Project])
async def get_projects(
    search: Optional[str] = None,
    category: Optional[str] = None,
    budget_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    query = {"status": "open"}
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"skills": {"$regex": search, "$options": "i"}}
        ]
    
    if category:
        query["category"] = category
    
    if budget_type:
        query["budget_type"] = budget_type
    
    projects = await db.projects.find(query, {"_id": 0}).skip(skip).limit(limit).to_list(limit)
    
    for project in projects:
        if isinstance(project['created_at'], str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
        if isinstance(project['updated_at'], str):
            project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Increment views
    await db.projects.update_one({"id": project_id}, {"$inc": {"views": 1}})
    project['views'] += 1
    
    if isinstance(project['created_at'], str):
        project['created_at'] = datetime.fromisoformat(project['created_at'])
    if isinstance(project['updated_at'], str):
        project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return project

@api_router.get("/projects/client/{client_id}", response_model=List[Project])
async def get_client_projects(client_id: str):
    projects = await db.projects.find({"client_id": client_id}, {"_id": 0}).to_list(100)
    
    for project in projects:
        if isinstance(project['created_at'], str):
            project['created_at'] = datetime.fromisoformat(project['created_at'])
        if isinstance(project['updated_at'], str):
            project['updated_at'] = datetime.fromisoformat(project['updated_at'])
    
    return projects


# ============= JOB APPLICATION ROUTES =============

@api_router.post("/applications", response_model=JobApplication)
async def create_application(
    application_data: JobApplicationCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user['user_type'] != 'jobseeker':
        raise HTTPException(status_code=403, detail="Only job seekers can apply to jobs")
    
    # Check if already applied
    existing = await db.applications.find_one({
        "job_id": application_data.job_id,
        "applicant_id": current_user['id']
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    application = JobApplication(
        applicant_id=current_user['id'],
        **application_data.model_dump()
    )
    
    doc = application.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.applications.insert_one(doc)
    
    # Increment applicants count
    await db.jobs.update_one(
        {"id": application_data.job_id},
        {"$inc": {"applicants_count": 1}}
    )
    
    # Get job details for notification
    job = await db.jobs.find_one({"id": application_data.job_id})
    if job:
        await create_notification(
            user_id=job['employer_id'],
            title="New Job Application",
            message=f"{current_user['full_name']} applied to {job['title']}",
            type="application",
            link=f"/jobs/{job['id']}"
        )
    
    return application

@api_router.get("/applications/job/{job_id}", response_model=List[JobApplication])
async def get_job_applications(job_id: str, current_user: dict = Depends(get_current_user)):
    # Verify the current user is the employer of this job
    job = await db.jobs.find_one({"id": job_id})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if job['employer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to view applications")
    
    applications = await db.applications.find({"job_id": job_id}, {"_id": 0}).to_list(100)
    
    for app in applications:
        if isinstance(app['created_at'], str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app['updated_at'], str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return applications

@api_router.get("/applications/user/{user_id}", response_model=List[JobApplication])
async def get_user_applications(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these applications")
    
    applications = await db.applications.find({"applicant_id": user_id}, {"_id": 0}).to_list(100)
    
    for app in applications:
        if isinstance(app['created_at'], str):
            app['created_at'] = datetime.fromisoformat(app['created_at'])
        if isinstance(app['updated_at'], str):
            app['updated_at'] = datetime.fromisoformat(app['updated_at'])
    
    return applications

@api_router.put("/applications/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    application = await db.applications.find_one({"id": application_id})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Get job to verify employer
    job = await db.jobs.find_one({"id": application['job_id']})
    if not job or job['employer_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to update this application")
    
    await db.applications.update_one(
        {"id": application_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Notify applicant
    await create_notification(
        user_id=application['applicant_id'],
        title="Application Status Update",
        message=f"Your application for {job['title']} has been {status}",
        type="application_update",
        link=f"/jobs/{job['id']}"
    )
    
    return {"message": "Application status updated"}


# ============= PROPOSAL ROUTES =============

@api_router.post("/proposals", response_model=Proposal)
async def create_proposal(
    proposal_data: ProposalCreate,
    current_user: dict = Depends(get_current_user)
):
    if current_user['user_type'] != 'freelancer':
        raise HTTPException(status_code=403, detail="Only freelancers can submit proposals")
    
    # Check if already submitted
    existing = await db.proposals.find_one({
        "project_id": proposal_data.project_id,
        "freelancer_id": current_user['id']
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already submitted a proposal for this project")
    
    proposal = Proposal(
        freelancer_id=current_user['id'],
        **proposal_data.model_dump()
    )
    
    doc = proposal.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.proposals.insert_one(doc)
    
    # Increment proposals count
    await db.projects.update_one(
        {"id": proposal_data.project_id},
        {"$inc": {"proposals_count": 1}}
    )
    
    # Get project details for notification
    project = await db.projects.find_one({"id": proposal_data.project_id})
    if project:
        await create_notification(
            user_id=project['client_id'],
            title="New Proposal Received",
            message=f"{current_user['full_name']} submitted a proposal for {project['title']}",
            type="proposal",
            link=f"/projects/{project['id']}"
        )
    
    return proposal

@api_router.get("/proposals/project/{project_id}", response_model=List[Proposal])
async def get_project_proposals(project_id: str, current_user: dict = Depends(get_current_user)):
    # Verify the current user is the client of this project
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project['client_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to view proposals")
    
    proposals = await db.proposals.find({"project_id": project_id}, {"_id": 0}).to_list(100)
    
    for prop in proposals:
        if isinstance(prop['created_at'], str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
        if isinstance(prop['updated_at'], str):
            prop['updated_at'] = datetime.fromisoformat(prop['updated_at'])
    
    return proposals

@api_router.get("/proposals/user/{user_id}", response_model=List[Proposal])
async def get_user_proposals(user_id: str, current_user: dict = Depends(get_current_user)):
    if current_user['id'] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view these proposals")
    
    proposals = await db.proposals.find({"freelancer_id": user_id}, {"_id": 0}).to_list(100)
    
    for prop in proposals:
        if isinstance(prop['created_at'], str):
            prop['created_at'] = datetime.fromisoformat(prop['created_at'])
        if isinstance(prop['updated_at'], str):
            prop['updated_at'] = datetime.fromisoformat(prop['updated_at'])
    
    return proposals

@api_router.put("/proposals/{proposal_id}/status")
async def update_proposal_status(
    proposal_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    proposal = await db.proposals.find_one({"id": proposal_id})
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    
    # Get project to verify client
    project = await db.projects.find_one({"id": proposal['project_id']})
    if not project or project['client_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized to update this proposal")
    
    await db.proposals.update_one(
        {"id": proposal_id},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Notify freelancer
    await create_notification(
        user_id=proposal['freelancer_id'],
        title="Proposal Status Update",
        message=f"Your proposal for {project['title']} has been {status}",
        type="proposal_update",
        link=f"/projects/{project['id']}"
    )
    
    return {"message": "Proposal status updated"}


# ============= NOTIFICATION ROUTES =============

@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: dict = Depends(get_current_user)):
    notifications = await db.notifications.find(
        {"user_id": current_user['id']},
        {"_id": 0}
    ).sort("created_at", -1).limit(50).to_list(50)
    
    for notif in notifications:
        if isinstance(notif['created_at'], str):
            notif['created_at'] = datetime.fromisoformat(notif['created_at'])
    
    return notifications

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    notification = await db.notifications.find_one({"id": notification_id})
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if notification['user_id'] != current_user['id']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.notifications.update_one(
        {"id": notification_id},
        {"$set": {"is_read": True}}
    )
    
    return {"message": "Notification marked as read"}

@api_router.put("/notifications/mark-all-read")
async def mark_all_notifications_read(current_user: dict = Depends(get_current_user)):
    await db.notifications.update_many(
        {"user_id": current_user['id'], "is_read": False},
        {"$set": {"is_read": True}}
    )
    
    return {"message": "All notifications marked as read"}


# ============= SEARCH & STATS ROUTES =============

@api_router.get("/search")
async def global_search(query: str):
    """Search across jobs, projects, and users"""
    jobs = await db.jobs.find(
        {"$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"company_name": {"$regex": query, "$options": "i"}},
            {"skills": {"$regex": query, "$options": "i"}}
        ]},
        {"_id": 0}
    ).limit(10).to_list(10)
    
    projects = await db.projects.find(
        {"$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}},
            {"skills": {"$regex": query, "$options": "i"}}
        ]},
        {"_id": 0}
    ).limit(10).to_list(10)
    
    return {
        "jobs": jobs,
        "projects": projects
    }

@api_router.get("/stats")
async def get_platform_stats():
    """Get platform statistics"""
    jobs_count = await db.jobs.count_documents({"status": "active"})
    projects_count = await db.projects.count_documents({"status": "open"})
    users_count = await db.users.count_documents({})
    
    return {
        "active_jobs": jobs_count,
        "open_projects": projects_count,
        "total_users": users_count
    }


# ============= MAIN ROUTES =============

@api_router.get("/")
async def root():
    return {"message": "Wallxy API - AEC Job Platform"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
