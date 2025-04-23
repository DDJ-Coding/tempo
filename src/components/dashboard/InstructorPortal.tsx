import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import MessageDisplay, { Message } from "@/components/common/MessageDisplay";
import MessageInput from "@/components/common/MessageInput";
import StudentProfile from "./StudentProfile";

interface Lesson {
  id: string;
  title: string;
  date: string;
  description: string;
  status: "completed" | "upcoming";
}

interface Certification {
  id: string;
  title: string;
  date?: string;
  progress: number;
  status: "completed" | "in-progress";
}

interface Note {
  id: string;
  title: string;
  date: string;
  content: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  totalHours: number;
  nextLesson: string;
  avatar: string;
  lessons?: Lesson[];
  certifications?: Certification[];
  notes?: Note[];
  nextLessonDescription?: string;
}

interface Booking {
  id: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  time: string;
  duration: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

interface Notification {
  id: string;
  type: "booking" | "schedule" | "weather";
  message: string;
  time: string;
  read: boolean;
}

interface MessageData extends Message {
  // Extended from MessageDisplay.Message
}

const InstructorPortal = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewingStudentProfile, setViewingStudentProfile] =
    useState<Student | null>(null);

  // Mock messages data
  const [messages, setMessages] = useState<MessageData[]>([
    {
      id: "1",
      senderId: "instructor-1",
      senderName: "John Instructor",
      senderAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor",
      recipientId: "1", // Alex Johnson
      recipientName: "Alex Johnson",
      content:
        "Hi Alex, how is your training going? Are you ready for tomorrow's lesson?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
    },
    {
      id: "2",
      senderId: "1", // Alex Johnson
      senderName: "Alex Johnson",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      recipientId: "instructor-1",
      recipientName: "John Instructor",
      content:
        "Yes, I've been practicing the maneuvers we discussed. I'll be ready for tomorrow.",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      read: true,
    },
    {
      id: "3",
      senderId: "instructor-1",
      senderName: "John Instructor",
      senderAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor",
      recipientId: "2", // Sarah Williams
      recipientName: "Sarah Williams",
      content:
        "Sarah, I noticed you've made great progress. Let's focus on crosswind landings in our next session.",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
    {
      id: "4",
      senderId: "2", // Sarah Williams
      senderName: "Sarah Williams",
      senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      recipientId: "instructor-1",
      recipientName: "John Instructor",
      content:
        "That sounds great. I've been wanting to improve my crosswind technique.",
      timestamp: new Date(Date.now() - 82800000).toISOString(),
      read: true,
    },
  ]);

  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.j@example.com",
      progress: 65,
      totalHours: 42,
      nextLesson: "Tomorrow, 10:00 AM",
      nextLessonDescription: "Prepare for crosswind landing practice",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      lessons: [
        {
          id: "l1",
          title: "Basic Maneuvers",
          date: "May 15, 2023",
          description:
            "Practiced straight and level flight, turns, climbs, and descents.",
          status: "completed",
        },
        {
          id: "l2",
          title: "Takeoffs and Landings",
          date: "May 22, 2023",
          description:
            "Practiced normal takeoffs and landings with instructor guidance.",
          status: "completed",
        },
        {
          id: "l3",
          title: "Navigation",
          date: "Next week",
          description: "Will practice VFR navigation and flight planning.",
          status: "upcoming",
        },
      ],
      certifications: [
        {
          id: "c1",
          title: "Private Pilot Ground School",
          date: "April 10, 2023",
          progress: 100,
          status: "completed",
        },
        {
          id: "c2",
          title: "Private Pilot License",
          progress: 65,
          status: "in-progress",
        },
      ],
      notes: [
        {
          id: "n1",
          title: "Instructor Note",
          date: "May 22, 2023",
          content:
            "Student is showing good progress with basic maneuvers. Needs more practice with crosswind landings.",
        },
        {
          id: "n2",
          title: "Instructor Note",
          date: "May 15, 2023",
          content:
            "Excellent communication skills. Student is proactive in asking questions and seeking clarification.",
        },
      ],
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      progress: 78,
      totalHours: 56,
      nextLesson: "Today, 2:00 PM",
      nextLessonDescription: "Advanced navigation techniques",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      lessons: [
        {
          id: "l1",
          title: "Advanced Maneuvers",
          date: "June 5, 2023",
          description: "Practiced steep turns, stalls, and slow flight.",
          status: "completed",
        },
        {
          id: "l2",
          title: "Cross-Country Planning",
          date: "June 12, 2023",
          description:
            "Completed a cross-country flight plan and executed it successfully.",
          status: "completed",
        },
        {
          id: "l3",
          title: "Advanced Navigation",
          date: "Today",
          description:
            "Will practice advanced navigation techniques and emergency procedures.",
          status: "upcoming",
        },
      ],
      certifications: [
        {
          id: "c1",
          title: "Private Pilot Ground School",
          date: "March 15, 2023",
          progress: 100,
          status: "completed",
        },
        {
          id: "c2",
          title: "Private Pilot License",
          progress: 78,
          status: "in-progress",
        },
      ],
      notes: [
        {
          id: "n1",
          title: "Instructor Note",
          date: "June 12, 2023",
          content:
            "Sarah has excellent situational awareness and is making great progress toward her PPL.",
        },
        {
          id: "n2",
          title: "Instructor Note",
          date: "June 5, 2023",
          content:
            "Performed well in advanced maneuvers. Ready to move on to more complex navigation exercises.",
        },
      ],
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.c@example.com",
      progress: 32,
      totalHours: 18,
      nextLesson: "Friday, 9:00 AM",
      nextLessonDescription: "Basic navigation exercises",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      lessons: [
        {
          id: "l1",
          title: "Introduction to Flight",
          date: "July 1, 2023",
          description:
            "First flight lesson covering basic aircraft controls and straight and level flight.",
          status: "completed",
        },
        {
          id: "l2",
          title: "Basic Maneuvers",
          date: "July 8, 2023",
          description:
            "Introduction to basic flight maneuvers including turns, climbs, and descents.",
          status: "completed",
        },
      ],
      certifications: [
        {
          id: "c1",
          title: "Private Pilot Ground School",
          progress: 45,
          status: "in-progress",
        },
      ],
      notes: [
        {
          id: "n1",
          title: "Instructor Note",
          date: "July 8, 2023",
          content:
            "Michael is making steady progress but needs more practice with radio communications.",
        },
      ],
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily.r@example.com",
      progress: 92,
      totalHours: 68,
      nextLesson: "Thursday, 11:00 AM",
      nextLessonDescription: "Checkride preparation",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      lessons: [
        {
          id: "l1",
          title: "Checkride Preparation",
          date: "Next Thursday",
          description: "Final preparation for private pilot checkride.",
          status: "upcoming",
        },
      ],
      certifications: [
        {
          id: "c1",
          title: "Private Pilot Ground School",
          date: "February 20, 2023",
          progress: 100,
          status: "completed",
        },
        {
          id: "c2",
          title: "Private Pilot License",
          progress: 92,
          status: "in-progress",
        },
      ],
      notes: [
        {
          id: "n1",
          title: "Instructor Note",
          date: "July 15, 2023",
          content:
            "Emily is ready for her checkride. Just needs to review emergency procedures.",
        },
      ],
    },
    {
      id: "5",
      name: "David Kim",
      email: "david.k@example.com",
      progress: 45,
      totalHours: 28,
      nextLesson: "Next Monday, 1:00 PM",
      nextLessonDescription: "Radio communication practice",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      lessons: [
        {
          id: "l1",
          title: "Radio Communications",
          date: "Next Monday",
          description:
            "Practice with ATC communications in various airspace types.",
          status: "upcoming",
        },
      ],
      certifications: [
        {
          id: "c1",
          title: "Private Pilot Ground School",
          progress: 75,
          status: "in-progress",
        },
      ],
      notes: [
        {
          id: "n1",
          title: "Instructor Note",
          date: "July 10, 2023",
          content:
            "David is making good progress but needs to work on his radio communication skills.",
        },
      ],
    },
  ]);

  const handleAddNote = (
    studentId: string,
    note: Omit<Note, "id" | "date">,
  ) => {
    try {
      setStudents((prevStudents) => {
        return prevStudents.map((student) => {
          if (student.id === studentId) {
            const newNote: Note = {
              id: `note-${Date.now()}`,
              title: `Instructor Note`,
              date: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              content: note.content,
            };

            // Create a new array with the new note at the beginning to show newest first
            const updatedNotes = [newNote, ...(student.notes || [])];

            return {
              ...student,
              notes: updatedNotes,
            };
          }
          return student;
        });
      });

      // Show confirmation toast or alert
      alert("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  const handleSendMessage = (recipientId: string, message: string) => {
    const recipient = students.find((student) => student.id === recipientId);
    if (!recipient) return;

    const newMessage: MessageData = {
      id: `msg-${Date.now()}`,
      senderId: "instructor-1",
      senderName: "John Instructor",
      senderAvatar:
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor",
      recipientId: recipientId,
      recipientName: recipient.name,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Mock bookings data
  // This first bookings array is not used and causing a duplicate declaration error
  // Removing it and keeping only the second bookings array below

  // Using the correct Booking interface
  const bookings: Booking[] = [
    {
      id: "1",
      studentName: "Sarah Williams",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      date: "Today",
      time: "2:00 PM",
      duration: "2 hours",
      status: "confirmed",
    },
    {
      id: "2",
      studentName: "Alex Johnson",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "3 hours",
      status: "confirmed",
    },
    {
      id: "3",
      studentName: "Michael Chen",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      date: "Friday",
      time: "9:00 AM",
      duration: "2 hours",
      status: "pending",
    },
    {
      id: "4",
      studentName: "Emily Rodriguez",
      studentAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      date: "Thursday",
      time: "11:00 AM",
      duration: "1.5 hours",
      status: "pending",
    },
  ];

  const notifications: Notification[] = [
    {
      id: "1",
      type: "booking",
      message: "New booking request from Michael Chen",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "weather",
      message: "Weather alert: Strong winds expected tomorrow",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "schedule",
      message: "Sarah Williams rescheduled lesson to Thursday",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "booking",
      message: "Emily Rodriguez confirmed her lesson",
      time: "Yesterday",
      read: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Instructor Portal</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor"
                alt="Instructor"
              />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10 py-6">
        {/* Sidebar */}
        <aside className="fixed top-20 z-30 -ml-2 hidden h-[calc(100vh-80px)] w-full shrink-0 md:sticky md:block">
          <nav className="flex flex-col gap-2 p-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "students" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("students")}
            >
              <Users className="mr-2 h-4 w-4" />
              Students
            </Button>
            <Button
              variant={activeTab === "schedule" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("schedule")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Schedule
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("messages")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex w-full flex-col gap-6">
          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Student Profile Tab */}
            <TabsContent value="student-profile" className="space-y-6">
              {viewingStudentProfile && (
                <StudentProfile
                  student={viewingStudentProfile}
                  onBack={() => {
                    setViewingStudentProfile(null);
                    setActiveTab("students");
                  }}
                  onAddNote={handleAddNote}
                />
              )}
            </TabsContent>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Today's Lessons</CardTitle>
                    <CardDescription>
                      You have 2 lessons scheduled today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings
                        .filter((booking) => booking.date === "Today")
                        .map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4"
                          >
                            <Avatar>
                              <AvatarImage
                                src={booking.studentAvatar}
                                alt={booking.studentName}
                              />
                              <AvatarFallback>
                                {booking.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                {booking.studentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.time} ({booking.duration})
                              </p>
                            </div>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Pending Requests</CardTitle>
                    <CardDescription>
                      You have{" "}
                      {bookings.filter((b) => b.status === "pending").length}{" "}
                      pending booking requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings
                        .filter((booking) => booking.status === "pending")
                        .map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center gap-4"
                          >
                            <Avatar>
                              <AvatarImage
                                src={booking.studentAvatar}
                                alt={booking.studentName}
                              />
                              <AvatarFallback>
                                {booking.studentName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                {booking.studentName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.date}, {booking.time}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      You have {notifications.filter((n) => !n.read).length}{" "}
                      unread notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[220px]">
                      <div className="space-y-4">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-start gap-4"
                          >
                            <div
                              className={`mt-0.5 h-2 w-2 rounded-full ${notification.read ? "bg-muted" : "bg-primary"}`}
                            />
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Schedule</CardTitle>
                  <CardDescription>
                    View and manage your upcoming lessons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={booking.studentAvatar}
                                  alt={booking.studentName}
                                />
                                <AvatarFallback>
                                  {booking.studentName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {booking.studentName}
                            </div>
                          </TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>{booking.duration}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Roster</CardTitle>
                  <CardDescription>
                    Manage your students and their progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Next Lesson</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={student.avatar}
                                  alt={student.name}
                                />
                                <AvatarFallback>
                                  {student.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {student.name}
                            </div>
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${student.progress}%` }}
                                />
                              </div>
                              <span className="text-xs">
                                {student.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{student.totalHours} hrs</TableCell>
                          <TableCell>{student.nextLesson}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setViewingStudentProfile(student);
                                setActiveTab("student-profile");
                              }}
                            >
                              View Profile
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                      View and manage your schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border mx-auto"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {date
                        ? date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })
                        : "Select a date"}
                    </CardTitle>
                    <CardDescription>Lessons for selected date</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {date && date.getDate() === new Date().getDate() ? (
                        bookings
                          .filter((booking) => booking.date === "Today")
                          .map((booking) => (
                            <div
                              key={booking.id}
                              className="flex items-center gap-4"
                            >
                              <div className="flex-none text-sm font-medium">
                                {booking.time}
                              </div>
                              <div className="flex-1 rounded-md border p-2">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={booking.studentAvatar}
                                      alt={booking.studentName}
                                    />
                                    <AvatarFallback>
                                      {booking.studentName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {booking.studentName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {booking.duration}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                          No lessons scheduled
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>
                      Select a student to message
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-4">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className={`flex items-center gap-4 p-2 rounded-md cursor-pointer ${selectedStudent?.id === student.id ? "bg-muted" : "hover:bg-muted/50"}`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <Avatar>
                              <AvatarImage
                                src={student.avatar}
                                alt={student.name}
                              />
                              <AvatarFallback>
                                {student.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {student.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {student.email}
                              </p>
                            </div>
                            {messages.some(
                              (m) =>
                                (m.senderId === student.id ||
                                  m.recipientId === student.id) &&
                                !m.read &&
                                m.recipientId === "instructor-1",
                            ) && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {selectedStudent
                        ? `Conversation with ${selectedStudent.name}`
                        : "Select a student"}
                    </CardTitle>
                    <CardDescription>
                      {selectedStudent
                        ? `Next lesson: ${selectedStudent.nextLesson}`
                        : "Choose a student from the list to view your conversation"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent ? (
                      <div className="space-y-4">
                        <MessageDisplay
                          messages={messages.filter(
                            (msg) =>
                              (msg.senderId === selectedStudent.id &&
                                msg.recipientId === "instructor-1") ||
                              (msg.recipientId === selectedStudent.id &&
                                msg.senderId === "instructor-1"),
                          )}
                          currentUserId="instructor-1"
                          maxHeight="300px"
                          emptyMessage="No messages yet. Start the conversation!"
                        />
                        <MessageInput
                          onSendMessage={handleSendMessage}
                          placeholder="Type your message to the student..."
                          recipients={[
                            {
                              id: selectedStudent.id,
                              name: selectedStudent.name,
                            },
                          ]}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                        Select a student to start messaging
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default InstructorPortal;
