'use client';

export default function AllBookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        All Bookings
      </h1>

      <div className="rounded-xl border p-6 bg-card">
        <p className="text-muted-foreground">
          Displays all bookings (Direct + Walk-In).
        </p>
      </div>
    </div>
  );
}
