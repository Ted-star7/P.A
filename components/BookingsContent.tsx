"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  Calendar,
  Users,
  Phone,
  Mail,
  DollarSign,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  PhoneCall,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getRequest, postRequest, deleteRequest } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Booking, CreateBookingRequest } from "@/types/booking";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border border-green-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
  completed: "bg-blue-100 text-blue-800 border border-blue-200",
  checked_in: "bg-purple-100 text-purple-800 border border-purple-200",
  checked_out: "bg-gray-100 text-gray-800 border border-gray-200",
};

const statusIcons = {
  pending: "⏳",
  confirmed: "✅",
  cancelled: "❌",
  completed: "🏁",
  checked_in: "🏕️",
  checked_out: "🚪",
};

const accommodationTypes = [
  "Pergola Africa Shared Tent",
  "Own Tent Camping Spot",
  "Pergola Africa Premium Tent",
  "Group Camping Package",
];

const pricePerNight: Record<string, number> = {
  "Pergola Africa Shared Tent": 2500,
  "Own Tent Camping Spot": 1600,
  "Pergola Africa Premium Tent": 3500,
  "Group Camping Package": 2000,
};

export function BookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [bookingTypeFilter, setBookingTypeFilter] = useState<
    "all" | "walkin" | "online"
  >("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalBookings, setTotalBookings] = useState(0);

  // Modals
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [newBooking, setNewBooking] = useState<CreateBookingRequest>({
    guestName: "",
    email: "",
    phoneNumber: "",
    accommodationType: "",
    numberOfGuests: 1,
    startDate: "",
    endDate: "",
    totalAmount: 0,
    status: "pending",
    bookingType: "online",
    specialRequests: "",
  });
  const [creatingBooking, setCreatingBooking] = useState(false);

  // View booking modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Calculate total pages
  const totalPages = Math.ceil(totalBookings / itemsPerPage);

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRequest("/admin/booking/all");

      if (response.data && Array.isArray(response.data)) {
        const bookingsWithDefaults = response.data.map(
          (booking: any): Booking => ({
            ...booking,
            bookingType: booking.bookingType || "online",
            specialRequests: booking.specialRequests || "",
            status: booking.status as
              | "pending"
              | "confirmed"
              | "cancelled"
              | "completed"
              | "checked_in"
              | "checked_out",
          }),
        );
        setBookings(bookingsWithDefaults);
        setTotalBookings(bookingsWithDefaults.length);
      } else {
        setBookings([]);
        setTotalBookings(0);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const createBooking = async (type: "online" | "walkin" = "online") => {
    // Calculate total amount if not provided
    const nights =
      newBooking.startDate && newBooking.endDate
        ? calculateNights(newBooking.startDate, newBooking.endDate)
        : 0;

    const pricePerNightValue = newBooking.accommodationType
      ? pricePerNight[newBooking.accommodationType] || 2500
      : 2500;

    const calculatedAmount =
      nights * pricePerNightValue * newBooking.numberOfGuests;

    const bookingData: CreateBookingRequest = {
      ...newBooking,
      bookingType: type,
      totalAmount:
        newBooking.totalAmount > 0 ? newBooking.totalAmount : calculatedAmount,
    };

    setCreatingBooking(true);
    try {
      const response = await postRequest("/open/booking/new", bookingData);

      if (
        response.message &&
        (response.message.toLowerCase().includes("success") ||
          response.status === 200)
      ) {
        setShowNewBookingModal(false);
        setShowWalkInModal(false);
        resetNewBookingForm();
        await fetchBookings();
      } else {
        throw new Error(response.message || "Failed to create booking");
      }
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to create booking",
      );
    } finally {
      setCreatingBooking(false);
    }
  };

  const deleteBooking = async (bookingId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this booking? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await deleteRequest(
        `/admin/booking/delete/${bookingId}`,
      );

      if (
        response.message &&
        response.message.toLowerCase().includes("success")
      ) {
        // Remove the booking from local state
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        setTotalBookings((prev) => prev - 1);

        // Close the details modal if it's open for this booking
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(null);
        }

        // Show success message
        setError(null);
      } else {
        throw new Error(response.message || "Failed to delete booking");
      }
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      setError(err.message || "Failed to delete booking");
    }
  };

  const updateBookingStatus = async (
    bookingId: number,
    status: Booking["status"],
  ) => {
    try {
      const response = await postRequest(
        `/admin/booking/update-status/${bookingId}`,
        { status },
      );

      if (
        response.message &&
        response.message.toLowerCase().includes("success")
      ) {
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking,
          ),
        );

        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status });
        }
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      setError(err.message || "Failed to update status");
    }
  };

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const resetNewBookingForm = () => {
    setNewBooking({
      guestName: "",
      email: "",
      phoneNumber: "",
      accommodationType: "",
      numberOfGuests: 1,
      startDate: "",
      endDate: "",
      totalAmount: 0,
      status: "pending",
      bookingType: "online",
      specialRequests: "",
    });
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phoneNumber.includes(searchTerm);
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesType =
      bookingTypeFilter === "all" ||
      (bookingTypeFilter === "walkin" && booking.bookingType === "walkin") ||
      (bookingTypeFilter === "online" && booking.bookingType === "online");
    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginate bookings
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            📋 Bookings Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage guest reservations for Pergola Africa Camping Site
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={fetchBookings}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => {
                setNewBooking((prev) => ({ ...prev, status: "confirmed" }));
                setShowWalkInModal(true);
              }}
            >
              <PhoneCall size={16} className="mr-2" />
              Walk-in/Call
            </Button>
            <Button
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
              onClick={() => {
                setNewBooking((prev) => ({ ...prev, status: "pending" }));
                setShowNewBookingModal(true);
              }}
            >
              <Plus size={20} className="mr-2" />
              Online Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {totalBookings}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Confirmed</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {bookings.filter((b) => b.status === "confirmed").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Pending</p>
              <p className="text-2xl font-bold text-amber-900 mt-1">
                {bookings.filter((b) => b.status === "pending").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-amber-200 rounded-lg flex items-center justify-center">
              <Filter className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">
                Walk-in/Call
              </p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {bookings.filter((b) => b.bookingType === "walkin").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <PhoneCall className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-6 border shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by guest name, email, or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Booking Type Filters */}
            <div className="flex gap-2 mr-4">
              <button
                onClick={() => {
                  setBookingTypeFilter("all");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-medium text-sm transition-all",
                  bookingTypeFilter === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                All Types
              </button>
              <button
                onClick={() => {
                  setBookingTypeFilter("walkin");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2",
                  bookingTypeFilter === "walkin"
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                <PhoneCall size={14} />
                Walk-in/Call
              </button>
              <button
                onClick={() => {
                  setBookingTypeFilter("online");
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2",
                  bookingTypeFilter === "online"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                <Calendar size={14} />
                Online
              </button>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setStatusFilter(null);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2.5 rounded-xl font-medium text-sm transition-all",
                  !statusFilter
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                All Status
              </button>
              {[
                "pending",
                "confirmed",
                "checked_in",
                "checked_out",
                "cancelled",
              ].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(statusFilter === status ? null : status);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-4 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2",
                    statusFilter === status
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                  )}
                >
                  <span>{statusIcons[status as keyof typeof statusIcons]}</span>
                  {status
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <div className="h-5 w-5 text-red-400">⚠️</div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-3 text-sm font-medium text-red-600 hover:text-red-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <Card className="border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="text-gray-600 mt-2">
              {searchTerm || statusFilter || bookingTypeFilter !== "all"
                ? "Try adjusting your search or filter"
                : "Get started by creating your first booking"}
            </p>
            {!searchTerm && !statusFilter && bookingTypeFilter === "all" && (
              <div className="flex gap-3 justify-center mt-6">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => {
                    setNewBooking((prev) => ({ ...prev, status: "confirmed" }));
                    setShowWalkInModal(true);
                  }}
                >
                  <PhoneCall size={16} className="mr-2" />
                  Create Walk-in Booking
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setNewBooking((prev) => ({ ...prev, status: "pending" }));
                    setShowNewBookingModal(true);
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Create Online Booking
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Accommodation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Guests
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBookings.map((booking) => {
                    const nights = calculateNights(
                      booking.startDate,
                      booking.endDate,
                    );

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {booking.guestName}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail size={12} className="text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {booking.email}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone size={12} className="text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {booking.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              booking.bookingType === "walkin"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {booking.bookingType === "walkin" ? (
                              <>
                                <PhoneCall size={12} className="mr-1" />
                                Walk-in/Call
                              </>
                            ) : (
                              <>
                                <Calendar size={12} className="mr-1" />
                                Online
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {booking.accommodationType}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-900">
                                {formatDate(booking.startDate)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {nights} nights
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {booking.numberOfGuests}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(booking.totalAmount)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}
                          >
                            <span className="mr-1.5">
                              {
                                statusIcons[
                                  booking.status as keyof typeof statusIcons
                                ]
                              }
                            </span>
                            {booking.status
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBooking(booking.id);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredBookings.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">
                      {filteredBookings.length}
                    </span>{" "}
                    results
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="h-9 w-9 p-0"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => paginate(pageNumber)}
                          className="h-9 w-9 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="h-9 w-9 p-0"
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* New Online Booking Modal */}
      {showNewBookingModal && (
        <BookingModal
          title="Create Online Booking"
          description="Create a booking for guests who booked online"
          onClose={() => {
            setShowNewBookingModal(false);
            resetNewBookingForm();
          }}
          newBooking={newBooking}
          setNewBooking={setNewBooking}
          onSubmit={() => createBooking("online")}
          creatingBooking={creatingBooking}
          pricePerNight={pricePerNight}
          calculateNights={calculateNights}
          formatCurrency={formatCurrency}
          defaultStatus="pending"
        />
      )}

      {/* Walk-in/Call Booking Modal */}
      {showWalkInModal && (
        <BookingModal
          title="Create Walk-in/Call Booking"
          description="Create a booking for walk-in guests or phone reservations"
          onClose={() => {
            setShowWalkInModal(false);
            resetNewBookingForm();
          }}
          newBooking={newBooking}
          setNewBooking={setNewBooking}
          onSubmit={() => createBooking("walkin")}
          creatingBooking={creatingBooking}
          pricePerNight={pricePerNight}
          calculateNights={calculateNights}
          formatCurrency={formatCurrency}
          showSpecialRequests={true}
          defaultStatus="confirmed"
        />
      )}

      {/* View Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Booking Details
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Booking ID: BK
                    {selectedBooking.id.toString().padStart(3, "0")} •
                    <span
                      className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.bookingType === "walkin"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {selectedBooking.bookingType === "walkin"
                        ? "Walk-in/Call"
                        : "Online"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Guest Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Guest Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Full Name
                        </p>
                        <p className="text-gray-900">
                          {selectedBooking.guestName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-900">{selectedBooking.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-gray-900">
                          {selectedBooking.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Number of Guests
                        </p>
                        <p className="text-gray-900">
                          {selectedBooking.numberOfGuests}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Booking Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Accommodation
                        </p>
                        <p className="text-gray-900">
                          {selectedBooking.accommodationType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Dates
                        </p>
                        <p className="text-gray-900">
                          {formatDate(selectedBooking.startDate)} to{" "}
                          {formatDate(selectedBooking.endDate)}
                          <span className="text-gray-500 text-sm ml-2">
                            (
                            {calculateNights(
                              selectedBooking.startDate,
                              selectedBooking.endDate,
                            )}{" "}
                            nights)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Amount
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(selectedBooking.totalAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Status
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedBooking.status]}`}
                          >
                            <span className="mr-1.5">
                              {
                                statusIcons[
                                  selectedBooking.status as keyof typeof statusIcons
                                ]
                              }
                            </span>
                            {selectedBooking.status
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join(" ")}
                          </span>
                          {(user?.role === "ADMIN" ||
                            user?.role === "SUPER_ADMIN") && (
                            <select
                              value={selectedBooking.status}
                              onChange={(e) =>
                                updateBookingStatus(
                                  selectedBooking.id,
                                  e.target.value as Booking["status"],
                                )
                              }
                              className="text-sm border rounded-lg px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="checked_in">Checked In</option>
                              <option value="checked_out">Checked Out</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </div>
                      {selectedBooking.specialRequests && (
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Special Requests
                          </p>
                          <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg mt-1">
                            {selectedBooking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Created/Updated Info */}
                {(selectedBooking.createdAt || selectedBooking.updatedAt) && (
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      {selectedBooking.createdAt &&
                        `Created: ${formatDate(selectedBooking.createdAt)}`}
                      {selectedBooking.updatedAt &&
                        selectedBooking.updatedAt !==
                          selectedBooking.createdAt &&
                        ` • Updated: ${formatDate(selectedBooking.updatedAt)}`}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this booking?")
                    ) {
                      deleteBooking(selectedBooking.id);
                      setSelectedBooking(null);
                    }
                  }}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Booking
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Booking Modal Component (unchanged)
interface BookingModalProps {
  title: string;
  description: string;
  onClose: () => void;
  newBooking: CreateBookingRequest;
  setNewBooking: (booking: CreateBookingRequest) => void;
  onSubmit: () => void;
  creatingBooking: boolean;
  pricePerNight: Record<string, number>;
  calculateNights: (start: string, end: string) => number;
  formatCurrency: (amount: number) => string;
  showSpecialRequests?: boolean;
  defaultStatus?: Booking["status"];
}

function BookingModal({
  title,
  description,
  onClose,
  newBooking,
  setNewBooking,
  onSubmit,
  creatingBooking,
  pricePerNight,
  calculateNights,
  formatCurrency,
  showSpecialRequests = false,
  defaultStatus = "pending",
}: BookingModalProps) {
  const nights =
    newBooking.startDate && newBooking.endDate
      ? calculateNights(newBooking.startDate, newBooking.endDate)
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                Guest Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newBooking.guestName}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        guestName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newBooking.email}
                    onChange={(e) =>
                      setNewBooking({ ...newBooking, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newBooking.phoneNumber}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+254 712 345 678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newBooking.numberOfGuests}
                    onChange={(e) => {
                      const numGuests = parseInt(e.target.value) || 1;
                      const updatedBooking = {
                        ...newBooking,
                        numberOfGuests: numGuests,
                      };
                      // Recalculate price
                      if (
                        updatedBooking.accommodationType &&
                        updatedBooking.startDate &&
                        updatedBooking.endDate
                      ) {
                        const nights = calculateNights(
                          updatedBooking.startDate,
                          updatedBooking.endDate,
                        );
                        const price =
                          nights *
                          (pricePerNight[updatedBooking.accommodationType] ||
                            2500) *
                          numGuests;
                        updatedBooking.totalAmount = price;
                      }
                      setNewBooking(updatedBooking);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                Booking Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accommodation Type *
                  </label>
                  <select
                    value={newBooking.accommodationType}
                    onChange={(e) => {
                      const accommodation = e.target.value;
                      const updatedBooking = {
                        ...newBooking,
                        accommodationType: accommodation,
                      };
                      // Auto-calculate price if dates are selected
                      if (updatedBooking.startDate && updatedBooking.endDate) {
                        const nights = calculateNights(
                          updatedBooking.startDate,
                          updatedBooking.endDate,
                        );
                        const price =
                          nights *
                          (pricePerNight[accommodation] || 2500) *
                          updatedBooking.numberOfGuests;
                        updatedBooking.totalAmount = price;
                      }
                      setNewBooking(updatedBooking);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select accommodation</option>
                    {accommodationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} - {formatCurrency(pricePerNight[type] || 2500)}
                        /night
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={newBooking.status}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        status: e.target.value as Booking["status"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked In</option>
                    <option value="checked_out">Checked Out</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date *
                  </label>
                  <input
                    type="date"
                    value={newBooking.startDate}
                    onChange={(e) => {
                      const startDate = e.target.value;
                      const updatedBooking = { ...newBooking, startDate };
                      // Auto-calculate price if accommodation is selected
                      if (
                        updatedBooking.accommodationType &&
                        updatedBooking.endDate
                      ) {
                        const nights = calculateNights(
                          startDate,
                          updatedBooking.endDate,
                        );
                        const price =
                          nights *
                          (pricePerNight[updatedBooking.accommodationType] ||
                            2500) *
                          updatedBooking.numberOfGuests;
                        updatedBooking.totalAmount = price;
                      }
                      setNewBooking(updatedBooking);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date *
                  </label>
                  <input
                    type="date"
                    value={newBooking.endDate}
                    onChange={(e) => {
                      const endDate = e.target.value;
                      const updatedBooking = { ...newBooking, endDate };
                      // Auto-calculate price if accommodation is selected
                      if (
                        updatedBooking.accommodationType &&
                        updatedBooking.startDate
                      ) {
                        const nights = calculateNights(
                          updatedBooking.startDate,
                          endDate,
                        );
                        const price =
                          nights *
                          (pricePerNight[updatedBooking.accommodationType] ||
                            2500) *
                          updatedBooking.numberOfGuests;
                        updatedBooking.totalAmount = price;
                      }
                      setNewBooking(updatedBooking);
                    }}
                    min={newBooking.startDate || undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {showSpecialRequests && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={newBooking.specialRequests || ""}
                    onChange={(e) =>
                      setNewBooking({
                        ...newBooking,
                        specialRequests: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special requests or notes..."
                    rows={3}
                  />
                </div>
              )}

              {/* Price Preview */}
              {newBooking.startDate &&
                newBooking.endDate &&
                newBooking.accommodationType && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Price Calculation
                        </p>
                        <p className="text-xs text-blue-700">
                          {nights} nights ×{" "}
                          {formatCurrency(
                            pricePerNight[newBooking.accommodationType] || 2500,
                          )}{" "}
                          × {newBooking.numberOfGuests} guests
                        </p>
                      </div>
                      <p className="text-xl font-bold text-blue-900">
                        {formatCurrency(newBooking.totalAmount)}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={creatingBooking}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={
                creatingBooking ||
                !newBooking.guestName ||
                !newBooking.email ||
                !newBooking.phoneNumber ||
                !newBooking.accommodationType
              }
              className="px-6 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {creatingBooking ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Booking"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
