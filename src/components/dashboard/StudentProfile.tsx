import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Award,
  Clock,
  CreditCard,
  FileText,
  Plane,
  DollarSign,
  CalendarClock,
} from "lucide-react";
import PaymentModal, { PaymentDetails } from "./PaymentModal";

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

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onLessonStatusChange?: (
    studentId: string,
    lessonId: string,
    status: "completed" | "upcoming",
  ) => void;
  onAddNote?: (studentId: string, note: Omit<Note, "id" | "date">) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onBack,
  onLessonStatusChange,
  onAddNote,
}) => {
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLessonChargeModalOpen, setIsLessonChargeModalOpen] = useState(false);
  const [lessonChargeAmount, setLessonChargeAmount] = useState(150);
  const [lessonDescription, setLessonDescription] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([
    {
      date: "May 15, 2023",
      number: 5,
      status: "Paid",
      amount: 500,
      type: "Monthly Installment",
    },
    {
      date: "April 15, 2023",
      number: 4,
      status: "Paid",
      amount: 500,
      type: "Monthly Installment",
    },
    {
      date: "March 15, 2023",
      number: 3,
      status: "Paid",
      amount: 500,
      type: "Monthly Installment",
    },
  ]);

  const [outstandingBalance, setOutstandingBalance] = useState(0);

  const handleAddNote = () => {
    if (newNoteTitle.trim() && newNoteContent.trim() && onAddNote) {
      try {
        onAddNote(student.id, {
          title: newNoteTitle,
          content: newNoteContent,
        });
        // Clear the form fields after successful submission
        setNewNoteTitle("");
        setNewNoteContent("");
      } catch (error) {
        console.error("Error saving note:", error);
        alert("Failed to save note. Please try again.");
      }
    } else if (onAddNote) {
      alert("Please enter both a title and content for the note.");
    }
  };

  const handleProcessPayment = (paymentDetails: PaymentDetails) => {
    // In a real application, this would send the payment details to a payment processor
    console.log("Processing payment:", paymentDetails);

    // Add the new payment to the payment history
    const today = new Date();
    const formattedDate = `${today.toLocaleString("default", { month: "long" })} ${today.getDate()}, ${today.getFullYear()}`;

    const newPayment = {
      date: formattedDate,
      number: paymentHistory.length + 1,
      status: "Paid",
      amount: paymentDetails.amount,
      type: "Monthly Installment",
    };

    setPaymentHistory([newPayment, ...paymentHistory]);
  };

  const handleProcessLessonCharge = () => {
    // Add the charge amount to the student's outstanding balance
    setOutstandingBalance((prevBalance) => prevBalance + lessonChargeAmount);

    // Add the new charge to the payment history
    const today = new Date();
    const formattedDate = `${today.toLocaleString("default", { month: "long" })} ${today.getDate()}, ${today.getFullYear()}`;

    const newCharge = {
      date: formattedDate,
      number: paymentHistory.length + 1,
      status: "Unpaid",
      amount: lessonChargeAmount,
      type: `Lesson Fee${lessonDescription ? ` - ${lessonDescription}` : ""}`,
    };

    setPaymentHistory([newCharge, ...paymentHistory]);
    setLessonDescription("");
    setLessonChargeAmount(150);
  };

  return (
    <div className="space-y-6 bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-2xl font-bold">Student Profile</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Student Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
              <div className="w-full pt-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Total Hours:</strong> {student.totalHours} hrs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Next Lesson:</strong> {student.nextLesson}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              Detailed information about {student.name}'s training progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="lessons">Lessons</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="payment">Payment Plan</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Training Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {student.progress}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Overall completion of training program
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Flight Hours
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {student.totalHours} hrs
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total logged flight time
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Next Scheduled Lesson
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-md font-medium">
                      {student.nextLesson}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {student.nextLessonDescription ||
                        "Prepare for next lesson"}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="lessons" className="space-y-4 pt-4">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {student.lessons && student.lessons.length > 0 ? (
                      student.lessons.map((lesson) => (
                        <div key={lesson.id} className="rounded-lg border p-4">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {lesson.status === "completed"
                                  ? `Completed on ${lesson.date}`
                                  : `Scheduled for ${lesson.date}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  lesson.status === "completed"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {lesson.status === "completed"
                                  ? "Completed"
                                  : "Upcoming"}
                              </Badge>
                              {onLessonStatusChange && (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant={
                                      lesson.status === "completed"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="h-7 px-2"
                                    onClick={() =>
                                      onLessonStatusChange(
                                        student.id,
                                        lesson.id,
                                        "completed",
                                      )
                                    }
                                    disabled={lesson.status === "completed"}
                                  >
                                    Mark Completed
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant={
                                      lesson.status === "upcoming"
                                        ? "default"
                                        : "outline"
                                    }
                                    className="h-7 px-2"
                                    onClick={() =>
                                      onLessonStatusChange(
                                        student.id,
                                        lesson.id,
                                        "upcoming",
                                      )
                                    }
                                    disabled={lesson.status === "upcoming"}
                                  >
                                    Mark Upcoming
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{lesson.description}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        No lessons recorded
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="certifications" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {student.certifications &&
                  student.certifications.length > 0 ? (
                    student.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center gap-4 rounded-lg border p-4"
                      >
                        <Award
                          className={`h-8 w-8 ${cert.status === "completed" ? "text-primary" : "text-muted"}`}
                        />
                        <div>
                          <h4 className="font-medium">{cert.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {cert.status === "completed"
                              ? `Completed on ${cert.date}`
                              : `In progress - ${cert.progress}% complete`}
                          </p>
                        </div>
                        {cert.status === "completed" ? (
                          <Badge className="ml-auto">Completed</Badge>
                        ) : (
                          <div className="ml-auto w-[100px]">
                            <div className="h-2 w-full rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${cert.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                      No certifications recorded
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4 pt-4">
                <div className="space-y-4">
                  {onAddNote && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Add New Note
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Input
                              placeholder="Note Title"
                              value={newNoteTitle}
                              onChange={(e) => setNewNoteTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Textarea
                              placeholder="Note Content"
                              value={newNoteContent}
                              onChange={(e) =>
                                setNewNoteContent(e.target.value)
                              }
                              className="min-h-[100px]"
                            />
                          </div>
                          <Button
                            onClick={handleAddNote}
                            disabled={
                              !newNoteTitle.trim() || !newNoteContent.trim()
                            }
                          >
                            Add Note
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {student.notes && student.notes.length > 0 ? (
                        student.notes.map((note) => (
                          <div key={note.id} className="rounded-lg border p-4">
                            <div className="flex items-start gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div className="w-full">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{note.title}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {note.date}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm">{note.content}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                          No instructor notes recorded
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
              <TabsContent value="payment" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Processing Plan</CardTitle>
                    <CardDescription>
                      Manage student payment information and installment plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-2">
                          Current Plan
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Plan Type
                            </p>
                            <p className="text-md">Monthly Installments</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Total Amount
                            </p>
                            <p className="text-md">$5,000.00</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Monthly Payment
                            </p>
                            <p className="text-md">$500.00</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Next Payment
                            </p>
                            <p className="text-md">June 15, 2023</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4 bg-amber-50">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <DollarSign className="mr-2 h-5 w-5 text-amber-600" />
                          Outstanding Balance
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            Current unpaid charges
                          </p>
                          <p className="text-xl font-bold text-amber-600">
                            ${outstandingBalance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-2">
                          Payment History
                        </h3>
                        <div className="space-y-2">
                          {paymentHistory.map((payment, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b"
                            >
                              <div>
                                <p className="font-medium">{payment.date}</p>
                                <p className="text-sm text-muted-foreground">
                                  {payment.type} -{" "}
                                  {payment.status === "Paid"
                                    ? "Payment"
                                    : "Charge"}{" "}
                                  #{payment.number}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  payment.status === "Paid"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }
                              >
                                {payment.status}
                              </Badge>
                              <p className="font-medium">
                                ${payment.amount.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-2">
                          Charge for Lesson
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                Lesson Amount ($)
                              </p>
                              <Input
                                type="number"
                                value={lessonChargeAmount}
                                onChange={(e) =>
                                  setLessonChargeAmount(Number(e.target.value))
                                }
                                min="1"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground mb-1">
                                Lesson Description (optional)
                              </p>
                              <Input
                                type="text"
                                value={lessonDescription}
                                onChange={(e) =>
                                  setLessonDescription(e.target.value)
                                }
                                placeholder="e.g., Cross-country flight"
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="default"
                              onClick={handleProcessLessonCharge}
                              disabled={lessonChargeAmount <= 0}
                            >
                              <CalendarClock className="mr-2 h-4 w-4" />
                              Add Charge to Balance
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Payment Modal */}
                      <PaymentModal
                        open={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        onProcessPayment={handleProcessPayment}
                        amount={500}
                      />

                      {/* We no longer need the Lesson Charge Modal as we're directly adding to balance */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
