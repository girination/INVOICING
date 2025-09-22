import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  MapPin,
  Search,
  User,
  Building2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  totalInvoices: number;
  totalAmount: number;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Acme Corporation",
      email: "contact@acme.com",
      address: "123 Business St, New York, NY 10001",
      totalInvoices: 5,
      totalAmount: 7500,
    },
    {
      id: "2",
      name: "Tech Solutions Ltd",
      email: "info@techsolutions.com",
      address: "456 Tech Ave, San Francisco, CA 94105",
      totalInvoices: 3,
      totalAmount: 4200,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Client name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Client name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", address: "" });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      address: client.address,
    });
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingClient) {
        // Update existing client
        setClients((prev) =>
          prev.map((client) =>
            client.id === editingClient.id ? { ...client, ...formData } : client
          )
        );
        toast({
          title: "Client Updated",
          description: "Client information has been updated successfully.",
        });
      } else {
        // Add new client
        const newClient: Client = {
          id: Date.now().toString(),
          ...formData,
          totalInvoices: 0,
          totalAmount: 0,
        };
        setClients((prev) => [...prev, newClient]);
        toast({
          title: "Client Added",
          description: "New client has been added successfully.",
        });
      }

      setIsDialogOpen(false);
      setFormData({ name: "", email: "", address: "" });
      setFormErrors({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => prev.filter((client) => client.id !== clientId));
    toast({
      title: "Client Deleted",
      description: "Client has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-2">
            Manage your client information and contact details.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddClient}
              className="bg-primary-gradient hover:opacity-90 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {editingClient ? (
                    <Edit className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">
                    {editingClient ? "Edit Client" : "Add New Client"}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {editingClient
                      ? "Update client information"
                      : "Enter client details to get started"}
                  </p>
                </div>
              </div>
            </DialogHeader>

            <Separator className="my-4" />

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm text-foreground">
                    Client Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Client Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter client or company name"
                    className={
                      formErrors.name
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>{formErrors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="client@company.com"
                    className={
                      formErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Contact Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-sm text-foreground">
                    Address Information
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter full address including city, state, and postal code"
                    className="min-h-[80px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                  className="min-w-[80px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary-gradient hover:opacity-90 min-w-[120px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingClient ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>{editingClient ? "Update Client" : "Add Client"}</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Client List ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Invoices</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchTerm
                        ? "No clients found matching your search."
                        : "No clients added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {client.address
                              ? client.address.split(",")[0]
                              : "No address"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                          {client.email}
                        </div>
                      </TableCell>
                      <TableCell>{client.totalInvoices}</TableCell>
                      <TableCell>
                        ${client.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
