'use client';
import React, { useState } from 'react';
import TimeBookingForm from '@/app/components/TimeBookingForm';
import TimeSlotList from '@/app/components/TimeSlotList';

export default function BookingsPage() {
  const [timeSlots, setTimeSlots] = useState([]);

  const handleAddSlot = (slot) => {
    setTimeSlots([...timeSlots, slot]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-semibold mb-6 text-blue-600">Daily Time Booking</h1>
      <TimeBookingForm onAddSlot={handleAddSlot} />
      <TimeSlotList slots={timeSlots} />
    </div>
  );
}
