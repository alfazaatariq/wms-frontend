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
import { MoreHorizontal, Plus } from "lucide-react";

// Mock data based on the order table schema
const orders = [
  {
    id: 1,
    product: { id: 1, name: "Product A" },
    user: { id: 1, username: "user1" },
    quantity: 2,
    createdAt: "2023-06-15T10:30:00Z",
  },
  {
    id: 2,
    product: { id: 2, name: "Product B" },
    user: { id: 2, username: "user2" },
    quantity: 1,
    createdAt: "2023-06-20T14:45:00Z",
  },
  {
    id: 3,
    product: { id: 3, name: "Product C" },
    user: { id: 1, username: "user1" },
    quantity: 3,
    createdAt: "2023-06-25T09:15:00Z",
  },
  {
    id: 4,
    product: { id: 4, name: "Product D" },
    user: { id: 3, username: "user3" },
    quantity: 2,
    createdAt: "2023-06-30T16:20:00Z",
  },
  {
    id: 5,
    product: { id: 5, name: "Product E" },
    user: { id: 2, username: "user2" },
    quantity: 1,
    createdAt: "2023-07-05T11:10:00Z",
  },
];

interface OrdersTableProps {
  limit?: number;
}

export function OrdersTable({ limit }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  let filteredOrders = orders.filter(
    (order) =>
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (limit) {
    filteredOrders = filteredOrders.slice(0, limit);
  }

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-[250px]"
            />
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>{order.user.username}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    {/* {new Date(order.createdAt).toLocaleDateString()} */}
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
