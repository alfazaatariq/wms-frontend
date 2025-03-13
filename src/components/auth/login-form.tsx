"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

async function loginUser({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const response = await fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  return response.json();
}

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ username, password });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-2 relative">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
