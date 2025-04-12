import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleToggleForm = () => {
    setActiveTab(activeTab === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>{activeTab === "login" ? "Login" : "Sign Up"} | VideoAI</title>
      </Helmet>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">VideoAI</h1>
          <p className="text-gray-600">
            AI-Powered Video Resizing & Format Conversion
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onToggleForm={handleToggleForm} />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm onToggleForm={handleToggleForm} />
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} VideoAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthPage;
