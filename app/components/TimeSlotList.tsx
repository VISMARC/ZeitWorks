import React from 'react';

export default function TimeSlotList({ slots }) {

  if (slots.length === 0) {
    return <p className="text-gray-500">No bookings yet for today.</p>;
  }

  return (
    <div className="w-80 bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Today's Bookings</h2>
      <ul className="divide-y divide-gray-200">
        {slots.map((slot) => (
          <li key={slot.id} className="py-2">
            <div className="flex justify-between">
              <span>{slot.startTime} - {slot.endTime}</span>
              <span className="text-sm text-gray-600">{slot.duration} hrs</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
