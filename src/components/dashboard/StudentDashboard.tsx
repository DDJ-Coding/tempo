import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  BookOpenIcon,
  ClockIcon,
  PlaneTakeoffIcon,
  AwardIcon,
  BellIcon,
  CalendarDaysIcon,
  MessageSquare,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import BookingCalendar from "@/components/booking/BookingCalendar";
import ProgressTracker from "./ProgressTracker";
import MessageDisplay, { Message } from "@/components/common/MessageDisplay";
import MessageInput from "@/components/common/MessageInput";
import { useToast } from "@/components/ui/use-toast";

interface StudentDashboardProps {
  studentName?: string;
  studentAvatar?: string;
  totalHours?: number;
  targetHours?: number;
  certifications?: Array<{
    name: string;
    completed: boolean;
    progress: number;
  }>;
  upcomingLessons?: Array<{
    date: string;
    time: string;
    instructor: string;
    aircraft: string;
    lessonType: string;
  }>;
  notifications?: Array<{
    id: string;
    type: string;
    message: string;
    date: string;
    read: boolean;
  }>;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName = "Alex Johnson",
  studentAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  totalHours = 42,
  targetHours = 100,
  certifications = [
    { name: "Private Pilot License", completed: false, progress: 65 },
    { name: "Solo Flight", completed: true, progress: 100 },
    { name: "Cross-Country", completed: true, progress: 100 },
    { name: "Night Flying", completed: false, progress: 30 },
    { name: "Instrument Rating", completed: false, progress: 15 },
    { name: "Commercial Pilot License", completed: false, progress: 0 },
  ],
  upcomingLessons: initialUpcomingLessons = [
    {
      date: "2023-06-15",
      time: "10:00 AM",
      instructor: "Sarah Williams",
      aircraft: "Cessna 172",
      lessonType: "Navigation",
    },
    {
      date: "2023-06-18",
      time: "2:30 PM",
      instructor: "Mike Chen",
      aircraft: "Piper PA-28",
      lessonType: "Maneuvers",
    },
    {
      date: "2023-06-22",
      time: "9:00 AM",
      instructor: "Sarah Williams",
      aircraft: "Cessna 172",
      lessonType: "Instrument",
    },
  ],
  notifications = [
    {
      id: "1",
      type: "reminder",
      message: "Upcoming lesson tomorrow at 10:00 AM",
      date: "2023-06-14",
      read: false,
    },
    {
      id: "2",
      type: "weather",
      message: "Weather alert: Strong winds expected on June 18",
      date: "2023-06-13",
      read: true,
    },
    {
      id: "3",
      type: "milestone",
      message: "Congratulations! You've completed 40+ flight hours",
      date: "2023-06-10",
      read: true,
    },
  ],
}) => {
  const { toast } = useToast();
  const [upcomingLessons, setUpcomingLessons] = useState(
    initialUpcomingLessons,
  );
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [lessonToCancel, setLessonToCancel] = useState<number | null>(null);

  const progressPercentage = Math.round((totalHours / targetHours) * 100);
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // Mock messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: "instructor-1",
      senderName: "Sarah Williams",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      recipientId: "student-1",
      recipientName: studentName,
      content:
        "Hi Alex, please review the landing procedures before our next lesson.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: "2",
      senderId: "student-1",
      senderName: studentName,
      senderAvatar: studentAvatar,
      recipientId: "instructor-1",
      recipientName: "Sarah Williams",
      content: "Will do! I've been practicing the checklist as well.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: true,
    },
    {
      id: "3",
      senderId: "instructor-1",
      senderName: "Sarah Williams",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      recipientId: "student-1",
      recipientName: studentName,
      content: "Don't forget to bring your logbook to our next session.",
      timestamp: new Date(Date.now() - 900000).toISOString(),
      read: false,
    },
    {
      id: "4",
      senderId: "instructor-2",
      senderName: "Mike Chen",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      recipientId: "student-1",
      recipientName: studentName,
      content:
        "Looking forward to our maneuvers practice session. We'll focus on steep turns.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
    },
    {
      id: "5",
      senderId: "student-1",
      senderName: studentName,
      senderAvatar: studentAvatar,
      recipientId: "instructor-2",
      recipientName: "Mike Chen",
      content:
        "I've been studying the steep turn technique. Any specific tips?",
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      read: true,
    },
    {
      id: "6",
      senderId: "instructor-2",
      senderName: "Mike Chen",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      recipientId: "student-1",
      recipientName: studentName,
      content:
        "Remember to maintain your altitude and keep a consistent bank angle. We'll go over it in detail.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ]);

  const unreadMessages = messages.filter(
    (message) => !message.read && message.recipientId === "student-1",
  ).length;

  // State for selected instructor in messages tab
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(
    null,
  );

  // Get unique instructors from messages
  const instructors = Array.from(
    new Set(
      messages
        .filter((message) => message.senderId !== "student-1")
        .map((message) => message.senderId),
    ),
  ).map((instructorId) => {
    const instructorMessage = messages.find(
      (message) => message.senderId === instructorId,
    );
    return {
      id: instructorId,
      name: instructorMessage?.senderName || "",
      avatar: instructorMessage?.senderAvatar || "",
    };
  });

  // Filter messages by selected instructor
  const filteredMessages = selectedInstructor
    ? messages.filter(
        (message) =>
          (message.senderId === selectedInstructor &&
            message.recipientId === "student-1") ||
          (message.recipientId === selectedInstructor &&
            message.senderId === "student-1"),
      )
    : [];

  // Handle lesson cancellation
  const handleCancelLesson = (index: number) => {
    setLessonToCancel(index);
    setCancelConfirmOpen(true);
  };

  // Confirm lesson cancellation
  const confirmCancelLesson = () => {
    if (lessonToCancel !== null) {
      setUpcomingLessons((prev) => prev.filter((_, i) => i !== lessonToCancel));
      toast({
        title: "Lesson Cancelled",
        description: "Your flight lesson has been successfully cancelled.",
        variant: "default",
      });
      setCancelConfirmOpen(false);
      setLessonToCancel(null);
    }
  };

  // Handle booking completion
  const handleBookingComplete = (bookingDetails: any) => {
    // Create a new lesson from the booking details
    const newLesson = {
      date: bookingDetails.date.toISOString().split("T")[0],
      time: bookingDetails.timeSlot.split(" - ")[0],
      instructor: bookingDetails.instructor,
      aircraft: "Cessna 172", // Default aircraft
      lessonType: "General Training", // Default lesson type
    };

    // Add the new lesson to the upcoming lessons
    setUpcomingLessons((prev) => {
      // Sort lessons by date and time
      const updatedLessons = [...prev, newLesson].sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
      return updatedLessons;
    });

    // Show success message
    setBookingSuccess(true);
    setBookingDialogOpen(false);

    toast({
      title: "Booking Confirmed",
      description: `Your lesson has been booked for ${bookingDetails.date.toLocaleDateString()} at ${bookingDetails.timeSlot.split(" - ")[0]} with ${bookingDetails.instructor}`,
      variant: "default",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="h-12 w-12">
            <AvatarImage src={studentAvatar} alt={studentName} />
            <AvatarFallback>
              {studentName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{studentName}</h2>
            <p className="text-sm text-muted-foreground">Student Pilot</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <div className="flex items-center space-x-2 px-2 py-1 rounded-md bg-accent">
              <PlaneTakeoffIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              setBookingDialogOpen(true);
              setBookingSuccess(false);
            }}
          >
            <div className="flex items-center space-x-2 px-2 py-1">
              <CalendarIcon className="h-4 w-4" />
              <span>Booking</span>
            </div>
          </Button>
        </nav>

        <div className="mt-auto pt-4 border-t space-y-2">
          <Button variant="outline" className="w-full">
            <BellIcon className="h-4 w-4 mr-2" />
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
          <Button variant="ghost" className="w-full">
            <AwardIcon className="h-4 w-4 mr-2" />
            Training Log
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <Button
            onClick={() => {
              setBookingDialogOpen(true);
              setBookingSuccess(false);
            }}
          >
            <CalendarDaysIcon className="h-4 w-4 mr-2" />
            Book New Lesson
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Flight Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{totalHours} hrs</div>
                <ClockIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {progressPercentage}% of target ({targetHours} hrs)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{cert.name}</span>
                      <Badge variant={cert.completed ? "default" : "outline"}>
                        {cert.completed ? "Completed" : `${cert.progress}%`}
                      </Badge>
                    </div>
                    {!cert.completed && (
                      <Progress value={cert.progress} className="h-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Next Lesson</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingLessons && upcomingLessons.length > 0 ? (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(upcomingLessons[0].date).toLocaleDateString(
                        "en-US",
                        { weekday: "short", month: "short", day: "numeric" },
                      )}
                    </span>
                    <span className="text-sm">{upcomingLessons[0].time}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {upcomingLessons[0].lessonType}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {upcomingLessons[0].instructor} •{" "}
                    {upcomingLessons[0].aircraft}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming lessons
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Payment Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">$500.00</div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Next payment due: June 15, 2023
                </p>
                <Button
                  className="w-full"
                  variant="default"
                  onClick={() => {
                    // Navigate to payment storyboard
                    window.location.href =
                      "/tempobook/storyboards/9d49fec9-63c5-4296-b917-abe2afc9e2fa";
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="progress" className="mb-6">
          <TabsList>
            <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Lessons</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Training Progress</CardTitle>
                <CardDescription>
                  Track your flight training progress and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressTracker certifications={certifications} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Lessons</CardTitle>
                <CardDescription>
                  Your scheduled flight training sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingLessons.map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between border-b pb-4 last:border-0"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {new Date(lesson.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          <span>{lesson.time}</span>
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="font-medium">
                            {lesson.lessonType}
                          </span>{" "}
                          with {lesson.instructor}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Aircraft: {lesson.aircraft}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => handleCancelLesson(index)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Updates and alerts about your training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.read ? "" : "bg-accent"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">
                            {notification.type === "reminder" && (
                              <span className="text-blue-500">Reminder</span>
                            )}
                            {notification.type === "weather" && (
                              <span className="text-amber-500">
                                Weather Alert
                              </span>
                            )}
                            {notification.type === "milestone" && (
                              <span className="text-green-500">
                                Achievement
                              </span>
                            )}
                          </div>
                          <p className="mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge variant="outline" className="ml-2">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Instructor Messages</CardTitle>
                <CardDescription>
                  Communication with your flight instructors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Instructors List */}
                  <div className="md:col-span-1 border rounded-lg p-4 bg-card">
                    <h3 className="text-lg font-medium mb-4">
                      Your Instructors
                    </h3>
                    <div className="space-y-3">
                      {instructors.map((instructor) => {
                        const unreadCount = messages.filter(
                          (m) =>
                            m.senderId === instructor.id &&
                            !m.read &&
                            m.recipientId === "student-1",
                        ).length;

                        return (
                          <div
                            key={instructor.id}
                            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${selectedInstructor === instructor.id ? "bg-accent" : "hover:bg-muted"}`}
                            onClick={() => setSelectedInstructor(instructor.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={instructor.avatar}
                                  alt={instructor.name}
                                />
                                <AvatarFallback>
                                  {instructor.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{instructor.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {instructor.id === "instructor-1"
                                    ? "Navigation Instructor"
                                    : "Maneuvers Instructor"}
                                </p>
                              </div>
                            </div>
                            {unreadCount > 0 && (
                              <Badge variant="default">{unreadCount}</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conversation Area */}
                  <div className="md:col-span-2 border rounded-lg p-4 bg-card">
                    {selectedInstructor ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium">
                            Conversation with{" "}
                            {
                              instructors.find(
                                (i) => i.id === selectedInstructor,
                              )?.name
                            }
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <MessageDisplay
                            messages={filteredMessages}
                            currentUserId="student-1"
                            maxHeight="300px"
                            emptyMessage="No messages yet. Start a conversation!"
                          />

                          <MessageInput
                            recipients={[
                              {
                                id: selectedInstructor,
                                name:
                                  instructors.find(
                                    (i) => i.id === selectedInstructor,
                                  )?.name || "Instructor",
                              },
                            ]}
                            onSendMessage={(recipientId, content) => {
                              const recipientName =
                                instructors.find((i) => i.id === recipientId)
                                  ?.name || "Instructor";
                              const newMessage: Message = {
                                id: Date.now().toString(),
                                senderId: "student-1",
                                senderName: studentName,
                                senderAvatar: studentAvatar,
                                recipientId,
                                recipientName,
                                content,
                                timestamp: new Date().toISOString(),
                                read: false,
                              };
                              setMessages((prev) => [...prev, newMessage]);

                              // Show a toast notification
                              toast({
                                title: "Message Sent",
                                description: `Your message to ${recipientName} has been sent.`,
                                variant: "default",
                              });
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          Select an instructor to view messages
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          Choose an instructor from the list to view your
                          conversation history and send messages.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-medium mb-2">
                    Communication Guidelines
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>
                      Messages are for training-related communication only
                    </li>
                    <li>Instructors typically respond within 24 hours</li>
                    <li>
                      For urgent matters, please call the flight school directly
                    </li>
                    <li>All communication is logged for training purposes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Book New Flight Lesson</DialogTitle>
            <DialogDescription>
              Select a date, time slot, and instructor for your next flight
              lesson.
            </DialogDescription>
          </DialogHeader>
          {bookingSuccess ? (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-6">
                Your flight lesson has been successfully booked.
              </p>
              <Button onClick={() => setBookingSuccess(false)}>
                Book Another Lesson
              </Button>
            </div>
          ) : (
            <div className="h-[600px] overflow-auto">
              <BookingCalendar onBookingComplete={handleBookingComplete} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Flight Lesson</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this flight lesson? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCancelConfirmOpen(false)}
            >
              Keep Lesson
            </Button>
            <Button variant="destructive" onClick={confirmCancelLesson}>
              Cancel Lesson
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
