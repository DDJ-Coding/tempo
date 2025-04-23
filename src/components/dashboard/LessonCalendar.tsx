import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlaneTakeoffIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Lesson {
  id: string;
  date: string;
  time: string;
  instructor: string;
  aircraft: string;
  lessonType: string;
}

interface LessonCalendarProps {
  lessons: Lesson[];
}

const LessonCalendar: React.FC<LessonCalendarProps> = ({ lessons = [] }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeView, setActiveView] = useState<"daily" | "weekly" | "monthly">(
    "monthly",
  );
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Function to get lessons for a specific date
  const getLessonsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return lessons.filter((lesson) => lesson.date === dateString);
  };

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Function to highlight dates with lessons
  const isDayWithLesson = (day: Date) => {
    const dateString = day.toISOString().split("T")[0];
    return lessons.some((lesson) => lesson.date === dateString);
  };

  // Get lessons for the selected date
  const selectedDateLessons = date ? getLessonsForDate(date) : [];

  // Get all dates in the current month with lessons
  const getDatesWithLessonsInMonth = () => {
    const result: { [date: string]: Lesson[] } = {};

    lessons.forEach((lesson) => {
      const lessonDate = new Date(lesson.date);
      if (
        lessonDate.getMonth() === currentMonth &&
        lessonDate.getFullYear() === currentYear
      ) {
        const dateStr = lesson.date;
        if (!result[dateStr]) {
          result[dateStr] = [];
        }
        result[dateStr].push(lesson);
      }
    });

    return result;
  };

  const datesWithLessons = getDatesWithLessonsInMonth();

  // Get all dates in the current week with lessons
  const getDatesWithLessonsInWeek = () => {
    if (!date) return {};

    const result: { [date: string]: Lesson[] } = {};
    const currentDate = new Date(date);
    const firstDayOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    firstDayOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(firstDayOfWeek);
      weekDate.setDate(firstDayOfWeek.getDate() + i);
      const dateStr = weekDate.toISOString().split("T")[0];

      const lessonsOnDate = lessons.filter((lesson) => lesson.date === dateStr);
      if (lessonsOnDate.length > 0) {
        result[dateStr] = lessonsOnDate;
      }
    }

    return result;
  };

  const weekLessons = getDatesWithLessonsInWeek();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Lesson Calendar
          </CardTitle>
          <Tabs
            value={activeView}
            onValueChange={(value) =>
              setActiveView(value as "daily" | "weekly" | "monthly")
            }
          >
            <TabsList>
              <TabsTrigger value="daily">Day</TabsTrigger>
              <TabsTrigger value="weekly">Week</TabsTrigger>
              <TabsTrigger value="monthly">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <CardDescription>
          View and manage your scheduled flight lessons
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeView}>
          <TabsContent value="monthly" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <h3 className="text-lg font-medium">
                {new Date(currentYear, currentMonth).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    year: "numeric",
                  },
                )}
              </h3>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              modifiers={{
                withLesson: (day) => isDayWithLesson(day),
              }}
              modifiersStyles={{
                withLesson: {
                  fontWeight: "bold",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "0",
                },
              }}
            />
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(date || new Date());
                  newDate.setDate(newDate.getDate() - 7);
                  setDate(newDate);
                }}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous Week
              </Button>
              <h3 className="text-lg font-medium">
                Week of{" "}
                {date?.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(date || new Date());
                  newDate.setDate(newDate.getDate() + 7);
                  setDate(newDate);
                }}
              >
                Next Week
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => {
                const currentDate = new Date(date || new Date());
                const firstDayOfWeek = new Date(currentDate);
                const day = currentDate.getDay();
                const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
                firstDayOfWeek.setDate(diff);

                const weekDate = new Date(firstDayOfWeek);
                weekDate.setDate(firstDayOfWeek.getDate() + i);
                const dateStr = weekDate.toISOString().split("T")[0];
                const lessonsOnDate = weekLessons[dateStr] || [];

                return (
                  <div
                    key={i}
                    className={`border rounded-md p-2 ${dateStr === date?.toISOString().split("T")[0] ? "bg-accent" : ""}`}
                    onClick={() => setDate(weekDate)}
                  >
                    <div className="text-sm font-medium">
                      {weekDate.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="text-xs">
                      {weekDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-2">
                      {lessonsOnDate.length > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {lessonsOnDate.length} lesson
                          {lessonsOnDate.length !== 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <div className="h-5"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(date || new Date());
                  newDate.setDate(newDate.getDate() - 1);
                  setDate(newDate);
                }}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous Day
              </Button>
              <h3 className="text-lg font-medium">
                {date?.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(date || new Date());
                  newDate.setDate(newDate.getDate() + 1);
                  setDate(newDate);
                }}
              >
                Next Day
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Display lessons for the selected date */}
        {date && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">
              Lessons for{" "}
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            {selectedDateLessons.length > 0 ? (
              <div className="space-y-3">
                {selectedDateLessons.map((lesson, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-md bg-card flex items-start justify-between"
                  >
                    <div>
                      <div className="flex items-center">
                        <PlaneTakeoffIcon className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium">{lesson.time}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <span className="font-medium">{lesson.lessonType}</span>{" "}
                        with {lesson.instructor}
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Aircraft: {lesson.aircraft}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No lessons scheduled for this date.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LessonCalendar;
