"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Save,
  Users,
  DollarSign,
  Globe,
  Trash2,
  Shield,
  UserPlus,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { postRequest } from "@/services/api";

// User type based on your API
interface SystemUser {
  id: string;
  firstName: string;
  secondName: string;
  email: string;
  role: "admin" | "superAdmin";
  createdAt?: string;
  isActive?: boolean;
}

export function SettingsContent() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"general" | "users" | "payments">(
    "general",
  );

  // User management state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    secondName: "",
    email: "",
    role: "admin" as "admin" | "superAdmin",
  });
  const [addingUser, setAddingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<string | null>(null);

  // Mock users data - you'll replace this with your API call
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: "1",
      firstName: "Super",
      secondName: "Admin",
      email: "superadmin@pergolaafrica.com",
      role: "superAdmin",
      isActive: true,
      createdAt: "2024-01-01",
    },
  ]);

  // Add new user function - ONLY API CALL
  const handleAddUser = async () => {
    setUserError(null);
    setUserSuccess(null);

    // Basic validation
    if (!newUser.firstName || !newUser.secondName || !newUser.email) {
      setUserError("All fields are required");
      return;
    }

    if (!newUser.email.includes("@")) {
      setUserError("Please enter a valid email address");
      return;
    }

    setAddingUser(true);

    try {
      console.log("API Call: Adding new user:", newUser);

      // IMPORTANT: Use your actual API endpoint here
      const response = await postRequest("/admin/auth/register", {
        firstName: newUser.firstName,
        secondName: newUser.secondName,
        email: newUser.email,
        role: newUser.role,
        // NO PASSWORD - backend should auto-generate
      });

      console.log("API Response:", response);

      // Handle different response formats
      if (
        response.success ||
        response.message?.includes("success") ||
        response.message?.includes("created")
      ) {
        // Extract user data from response
        const addedUser: SystemUser = {
          id: response.data?.id || Date.now().toString(), // Use ID from response if available
          firstName: newUser.firstName,
          secondName: newUser.secondName,
          email: newUser.email,
          role: newUser.role,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        // Add to local state
        setUsers([...users, addedUser]);

        const successMessage =
          response.message ||
          `User ${newUser.firstName} ${newUser.secondName} added successfully!`;
        setUserSuccess(successMessage);

        // Clear form and close modal
        setTimeout(() => {
          setShowAddUserModal(false);
          setNewUser({
            firstName: "",
            secondName: "",
            email: "",
            role: "admin",
          });
          setUserSuccess(null);
        }, 3000);
      } else {
        // Handle API error messages
        let errorMsg = "Failed to add user";

        if (response.message) {
          errorMsg = response.message;
        } else if (response.error) {
          errorMsg = response.error;
        }

        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error("API Error:", error);

      // Show user-friendly error message
      const errorMessage =
        error.message ||
        "Failed to add user. Please check your connection and try again.";
      setUserError(errorMessage);
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName}?`)) return;

    // For now, just remove from local state
    setUsers(users.filter((user) => user.id !== userId));
    setUserSuccess(`User ${userName} removed successfully!`);
    setTimeout(() => setUserSuccess(null), 3000);
  };

  // About Pergola Africa information
  const aboutPergola = {
    location: "📍 865V+XC, Sagana, Kirinyaga County, Kenya",
    contact: "📞 +254 707 157 416 (WhatsApp for bookings)",
    description:
      "Pergola Africa is an outdoor camping & social getaway venue in Sagana, Kenya — perfect for weekend escapes, camping with friends, riverside bonfires, and social events.",
    tagline: "You bring the bottle, we bring the heat.",
    offerings: [
      "Outdoor camping tents by Sagana River",
      "Weekend getaway packages",
      "Social events with music & DJ setups",
      "Bonfires, BBQs, and group activities",
      "Perfect for friends, families, and team outings",
    ],
    idealFor: [
      "Weekend escapes from Nairobi (≈100 km away)",
      "Camping experiences with social vibes",
      "Group gatherings and celebrations",
      "Nature lovers seeking riverside relaxation",
    ],
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage system settings and user permissions.
        </p>
      </div>

      {/* Success/Error Messages */}
      {userSuccess && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-700">
          <div className="h-4 w-4">✓</div>
          {userSuccess}
        </div>
      )}

      {userError && (
        <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {userError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: "general", label: "About", icon: Globe },
          { id: "users", label: "Users & Permissions", icon: Users },
          { id: "payments", label: "Payments", icon: DollarSign },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <TabIcon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* About Pergola Africa - SIMPLE INFO ONLY */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                About Pergola Africa
              </h2>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="font-medium text-foreground">Location</p>
                    <p className="text-muted-foreground">
                      {aboutPergola.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">📞</span>
                  <div>
                    <p className="font-medium text-foreground">
                      Contact & Bookings
                    </p>
                    <p className="text-muted-foreground">
                      {aboutPergola.contact}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">🏕️</span>
                  <div>
                    <p className="font-medium text-foreground">Description</p>
                    <p className="text-muted-foreground">
                      {aboutPergola.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <p className="text-center font-medium text-amber-800 italic">
                  "{aboutPergola.tagline}"
                </p>
              </div>

              {/* Offerings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="text-green-600">✓</span> What We Offer
                  </h3>
                  <ul className="space-y-2">
                    {aboutPergola.offerings.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="text-blue-600">🎯</span> Ideal For
                  </h3>
                  <ul className="space-y-2">
                    {aboutPergola.idealFor.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-800">100km</p>
                  <p className="text-sm text-slate-600">From Nairobi</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-800">Riverside</p>
                  <p className="text-sm text-slate-600">Location</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-800">Camping</p>
                  <p className="text-sm text-slate-600">Focus</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-800">Social</p>
                  <p className="text-sm text-slate-600">Vibes</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Users & Permissions - SIMPLIFIED */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Admin Users
                </h2>
                <p className="text-muted-foreground mt-1">
                  Add and manage admin users. Passwords are auto-generated and
                  sent via email.
                </p>
              </div>
              <Button
                className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => setShowAddUserModal(true)}
              >
                <UserPlus size={18} className="mr-2" />
                Add User
              </Button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Added
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">
                          {user.firstName} {user.secondName}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === "superAdmin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role === "superAdmin"
                            ? "Super Admin"
                            : "Admin"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteUser(
                              user.id,
                              `${user.firstName} ${user.secondName}`,
                            )
                          }
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No users yet. Add your first admin user!
                  </p>
                </div>
              )}
            </div>

            {/* API Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-blue-500 mt-0.5">🔧</div>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    API Information
                  </p>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        POST /admin/auth/register
                      </code>
                      <span className="text-xs text-blue-700">
                        - Add new users
                      </span>
                    </div>
                    <p className="text-xs text-blue-600">
                      Passwords are auto-generated by backend and sent to user's
                      email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Payments Settings - SIMPLIFIED */}
      {activeTab === "payments" && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">
            Payment Configuration
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Primary Payment Method
              </label>
              <select className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option>M-Pesa (Kenya)</option>
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-medium text-amber-800">Note</p>
              <p className="text-sm text-amber-700 mt-1">
                Payment settings are currently being configured. For now, all
                bookings use M-Pesa via WhatsApp.
              </p>
            </div>

            <div className="flex justify-end pt-6">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save size={18} className="mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add User Modal - MINIMAL VERSION */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Add New Admin
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    User will receive login details via email
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUser({
                      firstName: "",
                      secondName: "",
                      email: "",
                      role: "admin",
                    });
                    setUserError(null);
                    setUserSuccess(null);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, firstName: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={newUser.secondName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, secondName: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@pergolaafrica.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value as "admin" | "superAdmin",
                      })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAddUserModal(false)}
                  disabled={addingUser}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddUser}
                  disabled={
                    addingUser ||
                    !newUser.firstName ||
                    !newUser.secondName ||
                    !newUser.email
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {addingUser ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
