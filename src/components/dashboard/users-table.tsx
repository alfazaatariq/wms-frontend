"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal, Plus } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

const fetchUsers = async (searchTerm: string) => {
  const url = new URL("http://localhost:3000/api/v1/user");
  if (searchTerm) {
    url.searchParams.append("search", searchTerm);
  }

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch users");

  const { data } = await response.json();
  return data;
};

interface UsersTableProps {
  limit?: number;
}

export function UsersTable({ limit }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [newPassword, setNewPassword] = useState("");

  const { data: users = [] } = useQuery({
    queryKey: ["users", debouncedSearch],
    queryFn: async () => {
      const fetchedUsers = await fetchUsers(debouncedSearch);
      return fetchedUsers.sort((a: any, b: any) => a.id - b.id);
    },
  });

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (user: any) => {
      const response = await fetch("http://localhost:3000/api/v1/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDialogOpen(false);
      setNewUser({ username: "", password: "", role: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (user: any) => {
      const response = await fetch(
        `http://localhost:3000/api/v1/user/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditMode(false);
      setIsEditPassword(false);
      setCurrentUser({ username: "", password: "", role: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`http://localhost:3000/api/v1/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex-col lg:flex-row items-center justify-between space-y-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full mr-2"
          />
          <div className="w-full flex justify-end">
            <Button
              className="cursor-pointer w-full lg:w-fit "
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
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
            {users.length > 0 ? (
              users.map((user: any) => (
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
                        Staff
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
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setIsEditMode(true);
                            setCurrentUser(user);
                          }}
                        >
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setIsEditPassword(true);
                            setCurrentUser(user);
                          }}
                        >
                          Change Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(user.id)}
                          className="text-red-600 cursor-pointer"
                        >
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
            />
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
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
            <select
              className="w-full border rounded px-3 py-2 cursor-pointer"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="1">Admin</option>
              <option value="2">Staff</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => addMutation.mutate(newUser)}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={currentUser.username}
              onChange={(e) => {
                setCurrentUser({ ...currentUser, username: e.target.value });
              }}
            />

            <select
              className="w-full border rounded px-3 py-2"
              value={currentUser.role}
              onChange={(e) => {
                setCurrentUser({ ...currentUser, role: e.target.value });
              }}
            >
              <option value="">Select Role</option>
              <option value="1">Admin</option>
              <option value="2">Staff</option>
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setIsEditMode(false);
                setCurrentUser({ username: "", password: "", role: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => updateMutation.mutate(currentUser)}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditPassword} onOpenChange={setIsEditPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Input
              placeholder="Enter new password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setCurrentUser({ ...currentUser, password: e.target.value });
              }}
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
          {/* <div className="space-y-4">
            <Input
              placeholder="Password"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setCurrentUser({ ...currentUser, password: e.target.value });
              }}
            />
          </div> */}
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setIsEditPassword(false);
                setNewPassword("");
                setCurrentUser({ username: "", password: "", role: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => updateMutation.mutate(currentUser)}
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
