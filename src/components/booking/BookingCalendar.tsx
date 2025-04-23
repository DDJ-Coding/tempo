import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CloudSun,
  Users,
  Calendar as CalendarIcon,
  Info,
} from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface Instructor {
  id: string;
  name: string;
  specialization: string;
  available: boolean;
}

interface WeatherInfo {
  date: Date;
  condition: "sunny" | "cloudy" | "rainy" | "windy";
  temperature: number;
  windSpeed: number;
}

interface BookingCalendarProps {
  onBookingComplete?: (bookingDetails: {
    date: Date;
    timeSlot: string;
    instructor: string;
    notes?: string;
  }) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onBookingComplete = () => {},
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(
    null,
  );
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");

  // Mock data for time slots
  const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00 AM - 10:00 AM", available: true },
    { id: "2", time: "10:30 AM - 12:30 PM", available: true },
    { id: "3", time: "01:00 PM - 03:00 PM", available: false },
    { id: "4", time: "03:30 PM - 05:30 PM", available: true },
    { id: "5", time: "06:00 PM - 08:00 PM", available: true },
  ];

  // Mock data for instructors
  const instructors: Instructor[] = [
    {
      id: "1",
      name: "John Smith",
      specialization: "Private Pilot License",
      available: true,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      specialization: "Instrument Rating",
      available: true,
    },
    {
      id: "3",
      name: "Michael Brown",
      specialization: "Commercial License",
      available: false,
    },
    {
      id: "4",
      name: "Emily Davis",
      specialization: "Multi-Engine Rating",
      available: true,
    },
  ];

  // Mock weather data
  const weatherInfo: WeatherInfo = {
    date: date || new Date(),
    condition: "sunny",
    temperature: 72,
    windSpeed: 8,
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedTimeSlot(null);
    setSelectedInstructor(null);
  };

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };

  const handleInstructorSelect = (instructorId: string) => {
    setSelectedInstructor(instructorId);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Get the selected time slot and instructor details
    const selectedTime =
      timeSlots.find((slot) => slot.id === selectedTimeSlot)?.time || "";
    const selectedInstructorName =
      instructors.find((inst) => inst.id === selectedInstructor)?.name || "";

    // Call the onBookingComplete callback with the booking details
    if (date && selectedTimeSlot && selectedInstructor) {
      onBookingComplete({
        date: date,
        timeSlot: selectedTime,
        instructor: selectedInstructorName,
        notes: (e.target as HTMLFormElement).notes?.value || "",
      });
    }

    // Close the dialog
    setBookingDialogOpen(false);
    // Reset selections
    setSelectedTimeSlot(null);
    setSelectedInstructor(null);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <CloudSun className="h-6 w-6 text-yellow-500" />;
      case "cloudy":
        return <CloudSun className="h-6 w-6 text-gray-500" />;
      case "rainy":
        return <CloudSun className="h-6 w-6 text-blue-500" />;
      case "windy":
        return <CloudSun className="h-6 w-6 text-teal-500" />;
      default:
        return <CloudSun className="h-6 w-6" />;
    }
  };

  // Check if both time slot and instructor are selected to enable booking
  const isBookingEnabled =
    selectedTimeSlot !== null && selectedInstructor !== null;

  return (
    <div className="bg-background w-full p-6">
      <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-6">
        {/* Left Column - Calendar */}
        <div className="lg:w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5" />
                Select Date
              </CardTitle>
              <CardDescription>
                Choose a date for your flight lesson
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border"
              />
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {getWeatherIcon(weatherInfo.condition)}
                <span>
                  {weatherInfo.temperature}°F, Wind: {weatherInfo.windSpeed} mph
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Time Slots & Instructors */}
        <div className="lg:w-2/3">
          <Card className="h-full">
            <CardHeader>
              <Tabs
                defaultValue="daily"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <div className="flex justify-between items-center">
                  <CardTitle>Available Slots</CardTitle>
                  <TabsList>
                    <TabsTrigger value="daily">Daily View</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly View</TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab}>
                <TabsContent value="daily" className="space-y-6">
                  {/* Time Slots Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Time Slots for {date?.toLocaleDateString()}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={
                            selectedTimeSlot === slot.id ? "default" : "outline"
                          }
                          className="justify-start h-auto py-3"
                          disabled={!slot.available}
                          onClick={() => handleTimeSlotSelect(slot.id)}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{slot.time}</span>
                            {slot.available ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Available
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-700 border-red-200"
                              >
                                Booked
                              </Badge>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Instructors Section */}
                  <div>
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      Available Instructors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {instructors.map((instructor) => (
                        <Button
                          key={instructor.id}
                          variant={
                            selectedInstructor === instructor.id
                              ? "default"
                              : "outline"
                          }
                          className="justify-start h-auto py-3"
                          disabled={!instructor.available}
                          onClick={() => handleInstructorSelect(instructor.id)}
                        >
                          <div className="flex flex-col items-start w-full">
                            <div className="flex justify-between items-center w-full">
                              <span className="font-medium">
                                {instructor.name}
                              </span>
                              {instructor.available ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200"
                                >
                                  Available
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200"
                                >
                                  Unavailable
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {instructor.specialization}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="weekly">
                  <div className="p-4 border rounded-md bg-muted/20">
                    <div className="flex items-center justify-center space-x-2">
                      <Info className="h-5 w-5 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Weekly view shows a 7-day availability calendar. Switch
                        to daily view to book a specific time slot.
                      </p>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const day = new Date();
                        day.setDate(day.getDate() + i);
                        return (
                          <div
                            key={i}
                            className="border rounded-md p-2 text-center"
                          >
                            <div className="text-sm font-medium">
                              {day.toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </div>
                            <div className="text-xs">
                              {day.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="mt-2 text-xs">
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 text-xs"
                              >
                                {3 + i} slots
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!isBookingEnabled}
                onClick={() => {
                  if (date && selectedTimeSlot && selectedInstructor) {
                    // Get the selected time slot and instructor details
                    const selectedTime =
                      timeSlots.find((slot) => slot.id === selectedTimeSlot)
                        ?.time || "";
                    const selectedInstructorName =
                      instructors.find((inst) => inst.id === selectedInstructor)
                        ?.name || "";

                    console.log("Booking with:", {
                      date,
                      timeSlot: selectedTime,
                      instructor: selectedInstructorName,
                    });

                    // Call the onBookingComplete callback with the booking details
                    onBookingComplete({
                      date: date,
                      timeSlot: selectedTime,
                      instructor: selectedInstructorName,
                      notes: "",
                    });

                    // Reset selections
                    setSelectedTimeSlot(null);
                    setSelectedInstructor(null);
                  }
                }}
              >
                Book Flight Lesson
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
