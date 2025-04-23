import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Award, Clock, AlertCircle } from "lucide-react";

interface ProgressTrackerProps {
  flightHours?: {
    total: number;
    required: number;
    categories: {
      name: string;
      hours: number;
      required: number;
    }[];
  };
  certifications?:
    | {
        name: string;
        status: "completed" | "in-progress" | "upcoming";
        progress: number;
      }[]
    | Array<{
        name: string;
        completed: boolean;
        progress: number;
      }>;
  milestones?: {
    name: string;
    date: string;
    completed: boolean;
  }[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  flightHours = {
    total: 45,
    required: 120,
    categories: [
      { name: "Solo", hours: 15, required: 20 },
      { name: "Cross-Country", hours: 10, required: 30 },
      { name: "Night", hours: 5, required: 10 },
      { name: "Instrument", hours: 15, required: 40 },
      { name: "Dual", hours: 20, required: 20 },
    ],
  },
  certifications = [
    { name: "Private Pilot License", status: "in-progress", progress: 65 },
    { name: "Instrument Rating", status: "upcoming", progress: 0 },
    { name: "Commercial Pilot License", status: "upcoming", progress: 0 },
    { name: "Ground School", status: "completed", progress: 100 },
  ],
  milestones = [
    { name: "First Solo Flight", date: "2023-05-15", completed: true },
    { name: "First Cross-Country", date: "2023-06-22", completed: true },
    { name: "Night Flying Endorsement", date: "2023-08-10", completed: false },
    { name: "Written Exam", date: "2023-09-30", completed: false },
  ],
}) => {
  const totalProgressPercentage = Math.round(
    (flightHours.total / flightHours.required) * 100,
  );

  return (
    <div className="w-full bg-background p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Training Progress</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Total Flight Hours</h3>
          <span className="text-lg font-bold">
            {flightHours.total} / {flightHours.required} hours
          </span>
        </div>
        <Progress value={totalProgressPercentage} className="h-3" />
        <div className="flex justify-between mt-1 text-sm text-muted-foreground">
          <span>Current: {totalProgressPercentage}%</span>
          <span>Required: 100%</span>
        </div>
      </div>

      <Tabs defaultValue="hours" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hours">Flight Hours</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="hours" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flight Hours Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flightHours.categories.map((category, index) => {
                  const categoryPercentage = Math.round(
                    (category.hours / category.required) * 100,
                  );
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.name}</span>
                        <span>
                          {category.hours} / {category.required} hrs
                        </span>
                      </div>
                      <Progress value={categoryPercentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Certification Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert, index) => {
                  // Handle both certification data formats
                  const status =
                    "status" in cert
                      ? cert.status
                      : cert.completed
                        ? "completed"
                        : "in-progress";
                  const badgeText =
                    "status" in cert
                      ? cert.status === "completed"
                        ? "Completed"
                        : cert.status === "in-progress"
                          ? "In Progress"
                          : "Upcoming"
                      : cert.completed
                        ? "Completed"
                        : "In Progress";
                  const badgeVariant =
                    "status" in cert
                      ? cert.status === "completed"
                        ? "default"
                        : cert.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      : cert.completed
                        ? "default"
                        : "secondary";

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{cert.name}</span>
                          <Badge variant={badgeVariant}>{badgeText}</Badge>
                        </div>
                        <span>{cert.progress}%</span>
                      </div>
                      <Progress value={cert.progress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {milestone.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{milestone.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {milestone.date}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {milestone.completed ? "Completed" : "Scheduled"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Achievement Highlights</h3>
        </div>
        <Separator className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Perfect Landing Score</h4>
                <p className="text-sm text-muted-foreground">
                  Achieved 3 consecutive perfect landings
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Next Goal</h4>
                <p className="text-sm text-muted-foreground">
                  Complete night flying requirements (5 more hours)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
