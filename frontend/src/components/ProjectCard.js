import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, FileText } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const formatBudget = (min, max) => {
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
            <Link to={`/projects/${project.id}`}>
              <h3 className="text-xl font-semibold text-[#222831] hover:text-[#00ADB5] mb-2">
                {project.title}
              </h3>
            </Link>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                {project.category}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {project.duration}
              </span>
            </div>
          </div>
          <Badge className="bg-[#00ADB5]">{project.budget_type}</Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center text-[#00ADB5] font-semibold mb-2">
              <DollarSign className="w-4 h-4 mr-1" />
              {formatBudget(project.budget_min, project.budget_max)}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.skills?.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.skills?.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <Link to={`/projects/${project.id}`}>
            <Button className="bg-[#00ADB5] hover:bg-[#00ADB5]/90">
              View Details
            </Button>
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-gray-500">
          <span>{project.proposals_count} proposals</span>
          <span>{project.views} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
