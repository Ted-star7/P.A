"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
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
  PhoneCall,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getRequest, postRequest, deleteRequest } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Booking, CreateBookingRequest } from "@/types/booking";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-800 border border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  COMPLETED: "bg-blue-100 text-blue-800 border border-blue-200",
  CHECKED_IN: "bg-purple-100 text-purple-800 border border-purple-200",
  CHECKED_OUT: "bg-gray-100 text-gray-800 border border-gray-200",
};

const statusIcons: Record<string, string> = {
  PENDING: "⏳",
  CONFIRMED: "✅",
  CANCELLED: "❌",
  COMPLETED: "🏁",
  CHECKED_IN: "🏕️",
  CHECKED_OUT: "🚪",
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
    accomodationType: "", // Changed to match API
    numberOfGuests: 1,
    startDate: "",
    endDate: "",
    totalAmount: 0,
    status: "PENDING", // Uppercase to match API
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
      console.log("Fetching bookings from /admin/booking/all");
      const response = await getRequest("/admin/booking/all");

      console.log("Bookings API response:", response);

      if (response.data && Array.isArray(response.data)) {
        // Map API data to our Booking type
        const bookingsData = response.data.map(
          (booking: any): Booking => ({
            id: booking.id,
            guestName: booking.guestName,
            email: booking.email,
            phoneNumber: booking.phoneNumber,
            accomodationType: booking.accomodationType,
            numberOfGuests: booking.numberOfGuests,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalAmount: booking.totalAmount,
            status: booking.status,
            bookingType: booking.bookingType || "online", // Default value
            specialRequests: booking.specialRequests || "",
          }),
        );

        setBookings(bookingsData);
        setTotalBookings(bookingsData.length);
        console.log(`Loaded ${bookingsData.length} bookings`);
      } else {
        console.warn("No bookings data found in response:", response);
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

    const pricePerNightValue = newBooking.accomodationType
      ? pricePerNight[newBooking.accomodationType] || 2500
      : 2500;

    const calculatedAmount =
      nights * pricePerNightValue * newBooking.numberOfGuests;

    const bookingData: CreateBookingRequest = {
      guestName: newBooking.guestName.trim(),
      email: newBooking.email.trim().toLowerCase(),
      phoneNumber: newBooking.phoneNumber.trim(),
      accomodationType: newBooking.accomodationType,
      numberOfGuests: newBooking.numberOfGuests,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      totalAmount:
        newBooking.totalAmount > 0 ? newBooking.totalAmount : calculatedAmount,
      status: newBooking.status,
    };

    setCreatingBooking(true);
    setError(null);

    try {
      console.log("Creating booking with data:", bookingData);

      // IMPORTANT: API expects bookingRequest as a QUERY PARAMETER
      // We need to send it as a query string, not request body
      const response = await postRequest("/open/booking/new", {
        bookingRequest: bookingData,
      });

      console.log("Create booking response:", response);

      if (response.message && response.data) {
        // Success - close modals and refresh
        setShowNewBookingModal(false);
        setShowWalkInModal(false);
        resetNewBookingForm();
        await fetchBookings();

        // Show success message
        setError(null);
      } else {
        throw new Error(response.message || "Failed to create booking");
      }
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError(
        err.message ||
          err.response?.data?.message ||
          "Failed to create booking. Please check the data and try again.",
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
      console.log(`Deleting booking ${bookingId}`);
      const response = await deleteRequest(
        `/admin/booking/delete/${bookingId}`,
      );

      console.log("Delete booking response:", response);

      if (response.message) {
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

  // Note: There's no update status API in your provided endpoints
  // Remove or comment out the updateBookingStatus function

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
      accomodationType: "", // Changed
      numberOfGuests: 1,
      startDate: "",
      endDate: "",
      totalAmount: 0,
      status: "PENDING", // Uppercase
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

  // Format status for display
  const formatStatus = (status: string) => {
    return status
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header - Simplified */}
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
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setNewBooking((prev) => ({ ...prev, status: "PENDING" }));
              setShowNewBookingModal(true);
            }}
          >
            <Plus size={20} className="mr-2" />
            New Booking
          </Button>
        </div>
      </div>

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

      {/* Search and Filter */}
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
              {["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"].map(
                (status) => (
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
                    <span>{statusIcons[status] || "📋"}</span>
                    {formatStatus(status)}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </Card>

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
              {searchTerm || statusFilter
                ? "Try adjusting your search or filter"
                : "Get started by creating your first booking"}
            </p>
            {!searchTerm && !statusFilter && (
              <div className="mt-6">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setNewBooking((prev) => ({ ...prev, status: "PENDING" }));
                    setShowNewBookingModal(true);
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Create New Booking
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
                        className="hover:bg-gray-50 transition-colors"
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
                          <p className="text-sm text-gray-900">
                            {booking.accomodationType}
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
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[booking.status] ||
                              "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            <span className="mr-1.5">
                              {statusIcons[booking.status] || "📋"}
                            </span>
                            {formatStatus(booking.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye size={16} className="text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBooking(booking.id)}
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

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Booking
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Enter guest and booking details
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowNewBookingModal(false);
                    resetNewBookingForm();
                  }}
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
                          setNewBooking({
                            ...newBooking,
                            email: e.target.value,
                          })
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
                            updatedBooking.accomodationType &&
                            updatedBooking.startDate &&
                            updatedBooking.endDate
                          ) {
                            const nights = calculateNights(
                              updatedBooking.startDate,
                              updatedBooking.endDate,
                            );
                            const price =
                              nights *
                              (pricePerNight[updatedBooking.accomodationType] ||
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
                        value={newBooking.accomodationType}
                        onChange={(e) => {
                          const accommodation = e.target.value;
                          const updatedBooking = {
                            ...newBooking,
                            accomodationType: accommodation,
                          };
                          // Auto-calculate price if dates are selected
                          if (
                            updatedBooking.startDate &&
                            updatedBooking.endDate
                          ) {
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
                            {type} -{" "}
                            {formatCurrency(pricePerNight[type] || 2500)}
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
                            status: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="COMPLETED">Completed</option>
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
                            updatedBooking.accomodationType &&
                            updatedBooking.endDate
                          ) {
                            const nights = calculateNights(
                              startDate,
                              updatedBooking.endDate,
                            );
                            const price =
                              nights *
                              (pricePerNight[updatedBooking.accomodationType] ||
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
                            updatedBooking.accomodationType &&
                            updatedBooking.startDate
                          ) {
                            const nights = calculateNights(
                              updatedBooking.startDate,
                              endDate,
                            );
                            const price =
                              nights *
                              (pricePerNight[updatedBooking.accomodationType] ||
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

                  {/* Price Preview */}
                  {newBooking.startDate &&
                    newBooking.endDate &&
                    newBooking.accomodationType && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-900">
                              Price Calculation
                            </p>
                            <p className="text-xs text-blue-700">
                              {calculateNights(
                                newBooking.startDate,
                                newBooking.endDate,
                              )}{" "}
                              nights ×{" "}
                              {formatCurrency(
                                pricePerNight[newBooking.accomodationType] ||
                                  2500,
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
                  onClick={() => {
                    setShowNewBookingModal(false);
                    resetNewBookingForm();
                  }}
                  disabled={creatingBooking}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => createBooking("online")}
                  disabled={
                    creatingBooking ||
                    !newBooking.guestName ||
                    !newBooking.email ||
                    !newBooking.phoneNumber ||
                    !newBooking.accomodationType ||
                    !newBooking.startDate ||
                    !newBooking.endDate
                  }
                  className="px-6 bg-blue-600 hover:bg-blue-700"
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
                    {selectedBooking.id.toString().padStart(3, "0")}
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
                          {selectedBooking.accomodationType}
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
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              statusColors[selectedBooking.status] ||
                              "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            <span className="mr-1.5">
                              {statusIcons[selectedBooking.status] || "📋"}
                            </span>
                            {formatStatus(selectedBooking.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
