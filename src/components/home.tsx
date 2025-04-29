import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PlaneTakeoff, User, Lock, LogIn } from "lucide-react";
import StudentDashboard from "./dashboard/StudentDashboard";
import InstructorPortal from "./dashboard/InstructorPortal";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<"student" | "instructor">("student");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (type: "student" | "instructor") => {
    // In a real app, this would validate credentials against a backend
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "" });
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlaneTakeoff className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Flight Training Manager</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <main className="container mx-auto py-6">
          {userType === "student" ? <StudentDashboard /> : <InstructorPortal />}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <PlaneTakeoff className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Flight Training Login</CardTitle>
          <CardDescription>
            Sign in to access your training dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="student-email"
                      name="email"
                      placeholder="student@example.com"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="student-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("student")}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Sign In as Student
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="instructor">
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor-email">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instructor-email"
                      name="email"
                      placeholder="instructor@example.com"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructor-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instructor-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleLogin("instructor")}
                >
                  <LogIn className="mr-2 h-4 w-4" /> Sign In as Instructor
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            <p>Demo credentials:</p>
            <p>Student: student@example.com / password</p>
            <p>Instructor: instructor@example.com / password</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
