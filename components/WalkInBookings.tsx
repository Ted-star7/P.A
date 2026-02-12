'use client';

export default function WalkInBookings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Walk-In Bookings
      </h1>

      <div className="rounded-xl border p-6 bg-card">
        <p className="text-muted-foreground">
          Guests who booked physically at the premises.
        </p>
      </div>
    </div>
  );
}
