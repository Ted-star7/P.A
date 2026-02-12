"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Users,
  Calendar,
  Home,
  DollarSign,
  CheckCircle2,
  Clock,
  Tent,
  Luggage,
  Sparkles,
  BadgeCheck,
  Receipt,
  QrCode,
  Printer,
  MapPin,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { postRequest } from "@/services/api";
import { toast } from "sonner";

interface WalkInBookingForm {
  guestName: string;
  email: string;
  phoneNumber: string;
  accomodationType: string;
  numberOfGuests: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | "COMPLETED";
}

const ACCOMMODATION_TYPES = [
  "Pergola Africa Shared Tent",
  "Own Tent Camping Spot",
  "Pergola Africa Premium Tent",
  "Group Camping Package",
];

// Base prices in KES
const ACCOMMODATION_PRICES: Record<string, number> = {
  "Pergola Africa Shared Tent": 4500,
  "Own Tent Camping Spot": 2500,
  "Pergola Africa Premium Tent": 8500,
  "Group Camping Package": 15000,
};

const STATUS_OPTIONS = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "CHECKED_IN",
    label: "Checked In",
    color: "bg-blue-100 text-blue-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
  },
];

export default function WalkInBookings() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<any>(null);

  const [formData, setFormData] = useState<WalkInBookingForm>({
    guestName: "",
    email: "",
    phoneNumber: "",
    accomodationType: "",
    numberOfGuests: 2,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    totalAmount: 0,
    status: "CONFIRMED",
  });

  const calculateNights = () => {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    return Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)),
    );
  };

  const calculateTotal = () => {
    if (!formData.accomodationType) return 0;
    const basePrice = ACCOMMODATION_PRICES[formData.accomodationType] || 0;
    return basePrice * calculateNights();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        totalAmount: calculateTotal(),
      };

      const response = await postRequest("/open/booking/new", submissionData);

      setCompletedBooking({
        ...submissionData,
        bookingId: Math.floor(Math.random() * 10000),
        checkInTime: new Date().toLocaleTimeString("en-KE"),
        ...response.data,
      });

      setBookingComplete(true);

      toast.success("Check-in successful! Welcome to Pergola Africa", {
        icon: <Sparkles className="h-4 w-4" />,
        duration: 5000,
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setBookingComplete(false);
    setCompletedBooking(null);
    setFormData({
      guestName: "",
      email: "",
      phoneNumber: "",
      accomodationType: "",
      numberOfGuests: 2,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      totalAmount: 0,
      status: "CONFIRMED",
    });
  };

  const formatKenyanPhone = (phone: string) => {
    if (phone.startsWith("0")) {
      return "+254" + phone.slice(1);
    }
    if (phone.startsWith("7")) {
      return "+254" + phone;
    }
    return phone;
  };

  const nights = calculateNights();
  const totalAmount = calculateTotal();

  if (bookingComplete && completedBooking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/50 backdrop-blur-sm">
            {/* Header */}
            <div className="bg-linear-to-r from-amber-700 via-orange-600 to-red-600 px-8 py-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative">
                <div className="inline-flex p-4 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
                  <BadgeCheck className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Check-In Successful!
                </h2>
                <p className="text-amber-50 text-lg">
                  Welcome to Pergola Africa
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-8 space-y-8">
              {/* Guest Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-600 rounded-xl">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-amber-700 uppercase tracking-wider">
                      Guest
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedBooking.guestName}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {completedBooking.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatKenyanPhone(completedBooking.phoneNumber)}
                  </p>
                </div>

                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-600 rounded-xl">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-700 uppercase tracking-wider">
                      Booking ID
                    </span>
                  </div>
                  <p className="text-3xl font-mono font-bold text-gray-900">
                    #{completedBooking.bookingId}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Checked in: {completedBooking.checkInTime}
                  </p>
                </div>
              </div>

              {/* Accommodation Card */}
              <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-linear-to-br from-amber-600 to-orange-600 rounded-2xl">
                      <Tent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                        Accommodation
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {completedBooking.accomodationType}
                      </h3>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(
                              completedBooking.startDate,
                            ).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(
                              completedBooking.endDate,
                            ).toLocaleDateString("en-KE", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {completedBooking.numberOfGuests} Guests
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                      Total
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      KES {completedBooking.totalAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      KES{" "}
                      {ACCOMMODATION_PRICES[
                        completedBooking.accomodationType
                      ]?.toLocaleString()}{" "}
                      x {nights} nights
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleNewBooking}
                  className="flex-1 px-6 py-4 bg-linear-to-r from-amber-600 to-orange-600 text-white text-lg font-semibold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <Luggage className="h-5 w-5" />
                  New Booking
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Printer className="h-5 w-5" />
                  Print Receipt
                </button>
              </div>

              {/* QR Code Placeholder */}
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <QrCode className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  Scan QR code for digital key
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="bg-linear-to-br from-amber-600 to-orange-600 p-2 rounded-xl shadow-lg">
              <Luggage className="h-5 w-5 text-white" />
            </span>
            Walk-In Booking
          </h1>
          <p className="text-sm text-gray-600 mt-1 ml-12">
            Check-in guests instantly at Pergola Africa
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
          <Clock size={14} className="text-amber-600" />
          <span className="text-xs font-medium text-amber-700">
            Instant Check-in
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-linear-to-r from-gray-50 to-white px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-amber-500 to-orange-600 rounded-lg shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Guest Check-In Form
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter guest details to complete the booking
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-linear-to-b from-amber-500 to-orange-600 rounded-full"></span>
              Guest Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <User size={12} className="text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestName: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <Mail size={12} className="text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="guest@example.com"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <Phone size={12} className="text-gray-400" />
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-600">
                    +254
                  </span>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber.replace("+254", "")}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phoneNumber: `+254${value}` });
                    }}
                    placeholder="712 345 678"
                    className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-r-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <Users size={12} className="text-gray-400" />
                  Number of Guests
                </label>
                <select
                  required
                  value={formData.numberOfGuests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfGuests: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-linear-to-b from-amber-500 to-orange-600 rounded-full"></span>
              Stay Details
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <Tent size={12} className="text-gray-400" />
                  Accommodation Type
                </label>
                <select
                  required
                  value={formData.accomodationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accomodationType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                >
                  <option value="">Select accommodation</option>
                  {ACCOMMODATION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type} - KES {ACCOMMODATION_PRICES[type].toLocaleString()}
                      /night
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-400" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    min={formData.startDate}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          {formData.accomodationType && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-700 uppercase tracking-wider font-medium">
                    Total Amount
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    KES {totalAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    KES{" "}
                    {ACCOMMODATION_PRICES[
                      formData.accomodationType
                    ]?.toLocaleString()}{" "}
                    x {nights} {nights === 1 ? "night" : "nights"}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </div>
          )}

          {/* Status (Hidden but included) */}
          <input type="hidden" name="status" value={formData.status} />

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  guestName: "",
                  email: "",
                  phoneNumber: "",
                  accomodationType: "",
                  numberOfGuests: 2,
                  startDate: new Date().toISOString().split("T")[0],
                  endDate: new Date(Date.now() + 86400000 * 2)
                    .toISOString()
                    .split("T")[0],
                  totalAmount: 0,
                  status: "CONFIRMED",
                })
              }
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.accomodationType}
              className={cn(
                "px-6 py-2.5 bg-linear-to-r from-amber-600 to-orange-600 text-white text-sm font-medium rounded-lg",
                "hover:from-amber-700 hover:to-orange-700 transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center gap-2 shadow-lg shadow-amber-600/25",
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Confirm Check-In
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Today's Walk-ins
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
          <p className="text-xs text-green-600 mt-1">↑ +3 from yesterday</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Available Spots
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
          <p className="text-xs text-gray-500 mt-1">out of 24 total</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Checked In
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
          <p className="text-xs text-gray-500 mt-1">so far today</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Revenue
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">KES 45,500</p>
          <p className="text-xs text-gray-500 mt-1">from walk-ins</p>
        </div>
      </div>
    </div>
  );
}
