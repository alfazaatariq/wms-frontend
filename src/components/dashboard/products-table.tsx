"use client";

import { useEffect, useState } from "react";
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
import { MoreHorizontal, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductsTableProps {
  limit?: number;
  lowStockOnly?: boolean;
}

const fetchProducts = async (searchTerm: string) => {
  const url = new URL("http://localhost:3000/api/v1/product");
  if (searchTerm) {
    url.searchParams.append("search", searchTerm);
  }

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch products");

  const { data } = await response.json();
  return data;
};

export function ProductsTable({ limit }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    stock: "",
    price: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdateStock, setIsUpdateStock] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    id: 0,
    name: "",
    stock: "",
    price: "",
  });
  const queryClient = useQueryClient();

  const { data: products = [] } = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => fetchProducts(debouncedSearch),
  });

  const addMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await fetch("http://localhost:3000/api/v1/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
      setNewProduct({ name: "", stock: "", price: "" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (product: any) => {
      const response = await fetch(
        `http://localhost:3000/api/v1/product/${product.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsEditMode(false);
      setIsUpdateStock(false);
      setCurrentProduct({ id: 0, name: "", stock: "", price: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `http://localhost:3000/api/v1/product/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return (
    <div className="space-y-4">
      {!limit && (
        <div className="flex-col lg:flex-row items-center justify-between space-y-2">
          <Input
            placeholder="Search products..."
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
              Add Product
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              {!limit && <TableHead>Created</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  {product.stock > 10 ? (
                    <Badge className="bg-green-50 text-green-700">
                      In Stock
                    </Badge>
                  ) : product.stock > 0 ? (
                    <Badge className="bg-yellow-50 text-yellow-700">
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700">
                      Out of Stock
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setIsEditMode(true);
                          setCurrentProduct(product);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => {
                          setIsUpdateStock(true);
                          setCurrentProduct(product);
                        }}
                      >
                        Update Stock
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(product.id)}
                        className="text-red-600 cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => addMutation.mutate(newProduct)}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Product Name"
              value={currentProduct.name}
              onChange={(e) => {
                setCurrentProduct({ ...currentProduct, name: e.target.value });
              }}
            />
            <Input
              placeholder="Price"
              type="number"
              value={currentProduct.price}
              onChange={(e) => {
                setCurrentProduct({ ...currentProduct, price: e.target.value });
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setIsEditMode(false);
                setCurrentProduct({ id: 0, name: "", price: "", stock: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => updateMutation.mutate(currentProduct)}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateStock} onOpenChange={setIsUpdateStock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Stock"
              type="number"
              value={currentProduct.stock}
              onChange={(e) => {
                setCurrentProduct({ ...currentProduct, stock: e.target.value });
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setIsUpdateStock(false);
                setCurrentProduct({ id: 0, name: "", price: "", stock: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              onClick={() => updateMutation.mutate(currentProduct)}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
