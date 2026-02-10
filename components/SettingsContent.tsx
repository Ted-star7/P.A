"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Save,
  Users,
  DollarSign,
  Globe,
  Shield,
  UserPlus,
  AlertCircle,
  Loader2,
  Info,
  ToggleLeft,
  ToggleRight,
  Edit,
  X,
  Power,
  PowerOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { postRequest, getRequest } from "@/services/api";

// User type based on your API - Updated to match backend response
interface SystemUser {
  id: number;
  firstname: string;
  secondname: string;
  email: string;
  role: "ADMIN" | "SUPERADMIN"; // Changed from SUPER_ADMIN to SUPERADMIN
  enabled: boolean;
  createdAt?: string;
}

export function SettingsContent() {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"general" | "users" | "payments">(
    "general",
  );

  // User management state
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: "",
    secondName: "",
    email: "",
    role: "ADMIN" as "ADMIN" | "SUPERADMIN", // Changed to match API
  });
  const [addingUser, setAddingUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<string | null>(null);

  // Fetch all admins on component mount
  useEffect(() => {
    fetchAllAdmins();
  }, []);

  // Fetch all admins from API
  const fetchAllAdmins = async () => {
    try {
      setLoadingUsers(true);
      const response = await getRequest("/admins/all");

      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUserError("Failed to fetch users. Invalid response format.");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setUserError(error.message || "Failed to fetch users. Please try again.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Add new admin
  const handleAddUser = async () => {
    setUserError(null);
    setUserSuccess(null);

    // Basic validation
    if (
      !newUser.firstName.trim() ||
      !newUser.secondName.trim() ||
      !newUser.email.trim()
    ) {
      setUserError("All fields are required");
      return;
    }

    if (!newUser.email.includes("@")) {
      setUserError("Please enter a valid email address");
      return;
    }

    setAddingUser(true);

    try {
      console.log("Registering new admin:", newUser);

      // Debug: Log the exact payload
      const payload = {
        firstName: newUser.firstName.trim(),
        secondName: newUser.secondName.trim(),
        email: newUser.email.trim().toLowerCase(),
        role: newUser.role,
      };
      console.log("Sending payload:", payload);

      const response = await postRequest("/admins/register", payload);

      console.log("Full API Response:", response);

      // Check if response exists and has data
      if (response) {
        if (
          response.message &&
          (response.message.toLowerCase().includes("success") ||
            response.message.toLowerCase().includes("created"))
        ) {
          // Refresh the users list
          await fetchAllAdmins();

          const successMessage =
            response.message ||
            `User ${newUser.firstName} ${newUser.secondName} added successfully! Login credentials have been sent to ${newUser.email}`;

          setUserSuccess(successMessage);

          // Clear form and close modal
          setTimeout(() => {
            setShowAddUserModal(false);
            setNewUser({
              firstName: "",
              secondName: "",
              email: "",
              role: "ADMIN",
            });
            setUserSuccess(null);
          }, 3000);
        } else {
          // Try to extract error from response
          const errorMsg =
            response.message || response.error || "Failed to add user";
          throw new Error(errorMsg);
        }
      } else {
        throw new Error("No response received from server");
      }
    } catch (error: any) {
      console.error("Error adding user:", error);

      // Check for specific error types
      if (error.message?.includes("SyntaxError")) {
        setUserError("Server returned invalid response. Please try again.");
      } else if (
        error.message?.includes("409") ||
        error.message?.toLowerCase().includes("exists")
      ) {
        setUserError("A user with this email already exists.");
      } else if (
        error.message?.includes("403") ||
        error.message?.toLowerCase().includes("forbidden")
      ) {
        setUserError("Access forbidden. Only Super Admins can add users.");
      } else if (error.message?.includes("401")) {
        setUserError("Session expired. Please log in again.");
      } else {
        setUserError(error.message || "Failed to add user. Please try again.");
      }
    } finally {
      setAddingUser(false);
    }
  };

  // Toggle user status (enabled/disabled)
  const handleToggleStatus = async (user: SystemUser) => {
    try {
      const response = await postRequest(
        `/admins/update/status/${user.id}`,
        {},
      );

      if (response.data) {
        // Update local state
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, enabled: response.data.enabled } : u,
          ),
        );

        setUserSuccess(
          `User ${user.firstname} ${user.secondname} is now ${response.data.enabled ? "active" : "inactive"}`,
        );
        setTimeout(() => setUserSuccess(null), 3000);
      } else if (response.message) {
        // Handle if response doesn't have data but has message
        const newEnabled = !user.enabled;
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, enabled: newEnabled } : u,
          ),
        );
        setUserSuccess(
          `User ${user.firstname} ${user.secondname} is now ${newEnabled ? "active" : "inactive"}`,
        );
        setTimeout(() => setUserSuccess(null), 3000);
      }
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      setUserError(error.message || "Failed to update user status");
      setTimeout(() => setUserError(null), 3000);
    }
  };

  // Update user role
  const handleUpdateRole = async (
    user: SystemUser,
    newRole: "ADMIN" | "SUPERADMIN",
  ) => {
    try {
      const response = await postRequest(`/admins/update/role/${user.id}`, {
        role: newRole,
      });

      if (response.data) {
        // Update local state
        setUsers(
          users.map((u) =>
            u.id === user.id ? { ...u, role: response.data.role } : u,
          ),
        );

        setUserSuccess(
          `User ${user.firstname} ${user.secondname} role updated to ${newRole === "SUPERADMIN" ? "Super Admin" : "Admin"}`,
        );
        setEditingUser(null);
        setTimeout(() => setUserSuccess(null), 3000);
      } else if (response.message) {
        // Handle if response doesn't have data but has message
        setUsers(
          users.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
        );
        setUserSuccess(
          `User ${user.firstname} ${user.secondname} role updated to ${newRole === "SUPERADMIN" ? "Super Admin" : "Admin"}`,
        );
        setEditingUser(null);
        setTimeout(() => setUserSuccess(null), 3000);
      }
    } catch (error: any) {
      console.error("Error updating user role:", error);
      setUserError(error.message || "Failed to update user role");
      setTimeout(() => setUserError(null), 3000);
    }
  };

  // Start editing user role
  const handleEditRole = (user: SystemUser) => {
    setEditingUser(user);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Helper to compare current user ID
  const isCurrentUser = (userId: number) => {
    // Check if currentUser exists and compare by email (since your users use email as ID)
    return (
      currentUser?.email &&
      users.find((u) => u.id === userId)?.email === currentUser.email
    );
  };

  // Check if current user is Super Admin (handle both SUPERADMIN and SUPER_ADMIN)
  const isSuperAdmin =
    currentUser?.role === "SUPERADMIN" || currentUser?.role === "SUPER_ADMIN";

  // Format role for display (convert SUPERADMIN to Super Admin)
  const formatRole = (role: string) => {
    return role === "SUPERADMIN" ? "Super Admin" : "Admin";
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
          {!isSuperAdmin && (
            <span className="text-amber-600 font-medium ml-2">
              (You need Super Admin privileges to manage users)
            </span>
          )}
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

      {/* About Pergola Africa */}
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

      {/* Users & Permissions */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Admin Users
                </h2>
                <p className="text-muted-foreground mt-1">
                  {isSuperAdmin
                    ? "Manage admin users. Passwords are auto-generated and sent via email."
                    : "View admin users. Only Super Admins can manage users."}
                </p>
              </div>
              {isSuperAdmin && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <UserPlus size={18} className="mr-2" />
                  Add User
                </Button>
              )}
            </div>

            {/* Users Table */}
            {loadingUsers ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading users...
                </span>
              </div>
            ) : (
              <>
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
                        {isSuperAdmin && (
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => {
                        const isUserCurrentUser = isCurrentUser(user.id);
                        return (
                          <tr
                            key={user.id}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div>
                                <p className="font-medium text-foreground">
                                  {user.firstname} {user.secondname}
                                </p>
                                {isUserCurrentUser && (
                                  <span className="text-xs text-blue-600">
                                    (You)
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {user.email}
                            </td>
                            <td className="px-4 py-3">
                              {editingUser?.id === user.id ? (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={user.role}
                                    onChange={(e) =>
                                      handleUpdateRole(
                                        user,
                                        e.target.value as
                                          | "ADMIN"
                                          | "SUPERADMIN",
                                      )
                                    }
                                    className="px-2 py-1 border rounded text-sm"
                                    disabled={updatingUser}
                                  >
                                    <option value="ADMIN">Admin</option>
                                    <option value="SUPERADMIN">
                                      Super Admin
                                    </option>
                                  </select>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-1 hover:bg-gray-100 rounded"
                                    disabled={updatingUser}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Shield
                                    size={14}
                                    className={
                                      user.role === "SUPERADMIN"
                                        ? "text-purple-500"
                                        : "text-blue-500"
                                    }
                                  />
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                      user.role === "SUPERADMIN"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {formatRole(user.role)}
                                  </span>
                                  {isSuperAdmin && !isUserCurrentUser && (
                                    <button
                                      onClick={() => handleEditRole(user)}
                                      className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
                                      title="Edit role"
                                    >
                                      <Edit size={12} />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {user.enabled ? (
                                  <Power className="h-4 w-4 text-green-500" />
                                ) : (
                                  <PowerOff className="h-4 w-4 text-gray-400" />
                                )}
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                    user.enabled
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {user.enabled ? "Active" : "Inactive"}
                                </span>
                              </div>
                            </td>
                            {isSuperAdmin && (
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {!isUserCurrentUser && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleStatus(user)}
                                        className="h-8 px-3 text-xs"
                                      >
                                        {user.enabled
                                          ? "Deactivate"
                                          : "Activate"}
                                      </Button>
                                      <button
                                        onClick={() => handleEditRole(user)}
                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 border border-gray-200"
                                        title="Edit role"
                                      >
                                        <Edit size={14} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {users.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No users found. Add your first admin user!
                      </p>
                    </div>
                  )}
                </div>

                {/* User Count */}
                <div className="mt-4 text-sm text-muted-foreground">
                  Total users: {users.length} • Active:{" "}
                  {users.filter((u) => u.enabled).length} • Super Admins:{" "}
                  {users.filter((u) => u.role === "SUPERADMIN").length}
                </div>
              </>
            )}

            {/* API Information */}
            {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 text-blue-500 mt-0.5">🔧</div>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    User Management APIs
                  </p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        GET /admins/all
                      </code>
                      <span className="text-xs text-blue-700">
                        - Fetch all admins
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        POST /admins/register
                      </code>
                      <span className="text-xs text-blue-700">
                        - Add new admin
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        POST /admins/update/status/{"{userId}"}
                      </code>
                      <span className="text-xs text-blue-700">
                        - Toggle active/inactive
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        POST /admins/update/role/{"{userId}"}
                      </code>
                      <span className="text-xs text-blue-700">
                        - Change role
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </Card>
        </div>
      )}

      {/* Payments Settings */}
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

      {/* Add User Modal */}
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
                    User will receive auto-generated login details via email
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setNewUser({
                      firstName: "",
                      secondName: "",
                      email: "",
                      role: "ADMIN",
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John"
                      required
                      disabled={addingUser}
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Doe"
                      required
                      disabled={addingUser}
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@pergolaafrica.com"
                    required
                    disabled={addingUser}
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
                        role: e.target.value as "ADMIN" | "SUPERADMIN",
                      })
                    }
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={addingUser}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super Admin</option>
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
                    !newUser.firstName.trim() ||
                    !newUser.secondName.trim() ||
                    !newUser.email.trim()
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
