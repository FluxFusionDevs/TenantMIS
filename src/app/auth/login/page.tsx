"use client";
import LoginForm from "@/components/login-form";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg"
        style={{
          backgroundImage:
            'url("https://firebasestorage.googleapis.com/v0/b/project-chat-d6cb6.appspot.com/o/times%20plaza%20pictures%202025.jpg?alt=media&token=cc2db962-cd01-4d1d-b26b-0ea457e1b330")',
        }}
      ></div>

      <div className="w-full max-w-md z-20 bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.jpg"
            width={200}
            height={200}
            alt="Logo"
          />
        </div>
        <LoginForm />
        <div className="mt-4 text-left text-xs">
          <a href="/forgot-password" className="underline">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;