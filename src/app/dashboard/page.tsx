"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Users } from "lucide-react";
import { ProductsTable } from "@/components/dashboard/products-table";
import { UsersTable } from "@/components/dashboard/users-table";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async () => {
  const res = await fetch("http://localhost:3000/api/v1/user", {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

const fetchProducts = async () => {
  const res = await fetch("http://localhost:3000/api/v1/product", {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

const fetchUserProfile = async () => {
  const res = await fetch("http://localhost:3000/api/v1/auth/profile", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch profile");
  const { data } = await res.json();
  return data;
};

export default function DashboardPage() {
  const {
    data: users,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  const {
    data: products,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  const {
    data: profile,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2"></div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="products">
            Products
          </TabsTrigger>
          {profile?.role === "1" && (
            <TabsTrigger className="cursor-pointer" value="users">
              Users
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {products?.data?.length}
                </div>
              </CardContent>
            </Card>
            {profile?.role === "1" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users?.data?.length}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"></div>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage system users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
