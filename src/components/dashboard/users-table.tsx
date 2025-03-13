"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus } from "lucide-react";

// Mock data based on the user table schema
const users = [
  {
    id: 1,
    username: "admin",
    role: "1", // Admin
    createdAt: "2023-01-10T08:30:00Z",
    updatedAt: "2023-01-10T08:30:00Z",
  },
  {
    id: 2,
    username: "user1",
    role: "2", // Regular user
    createdAt: "2023-02-15T10:45:00Z",
    updatedAt: "2023-02-15T10:45:00Z",
  },
  {
    id: 3,
    username: "user2",
    role: "2", // Regular user
    createdAt: "2023-03-20T14:20:00Z",
    updatedAt: "2023-03-20T14:20:00Z",
  },
  {
    id: 4,
    username: "manager1",
    role: "1", // Admin
    createdAt: "2023-04-05T09:10:00Z",
    updatedAt: "2023-04-05T09:10:00Z",
  },
  {
    id: 5,
    username: "user3",
    role: "2", // Regular user
    createdAt: "2023-05-12T16:30:00Z",
    updatedAt: "2023-05-12T16:30:00Z",
  },
];

interface UsersTableProps {
  limit?: number;
}

export function UsersTable({ limit }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  let filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (limit) {
    filteredUsers = filteredUsers.slice(0, limit);
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[250px]"
            />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {user.role === "1" ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Admin
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 hover:bg-gray-50 hover:text-gray-700"
                      >
                        User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Change Password</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
