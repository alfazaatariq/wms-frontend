import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Register | WMS",
  description: "Create a new WMS account",
};

export default function RegisterPage() {
  return (
    <div className="p-8 min-h-screen flex justify-center items-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center items-center flex-col">
            <Package size={65} />
            <p className="font-bold">WMS</p>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
