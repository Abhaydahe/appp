import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Clock, DollarSign, Bookmark } from 'lucide-react';

const JobCard = ({ job, onSave, isSaved }) => {
  const formatSalary = (min, max) => {
    const formatNum = (num) => {
      if (num >= 100000) {
        return `₹${(num / 100000).toFixed(1)}L`;
      }
      return `₹${(num / 1000).toFixed(0)}k`;
    };
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Link to={`/jobs/${job.id}`}>
              <h3 className="text-xl font-semibold text-[#222831] hover:text-[#00ADB5] mb-2">
                {job.title}
              </h3>
            </Link>
            <p className="text-gray-600 font-medium mb-2">{job.company_name}</p>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </span>
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {job.job_type}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {job.experience_level}
              </span>
            </div>
          </div>
          {onSave && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSave(job.id)}
              className="ml-4"
            >
              <Bookmark 
                className={`w-5 h-5 ${isSaved ? 'fill-[#00ADB5] text-[#00ADB5]' : 'text-gray-400'}`}
              />
            </Button>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center text-[#00ADB5] font-semibold mb-2">
              <DollarSign className="w-4 h-4 mr-1" />
              {formatSalary(job.salary_min, job.salary_max)}
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills?.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills?.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <Link to={`/jobs/${job.id}`}>
            <Button className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">
              View Details
            </Button>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
          <span>{job.applicants_count} applicants</span>
          <span>{job.views} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
