import React, { useState } from 'react';

export default function TimeBookingForm({ onAddSlot }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      setError('Please fill in both start and end times.');
      return;
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    if (end <= start) {
      setError('End time must be after start time.');
      return;
    }

    const duration = (end - start) / (1000 * 60 * 60); // in hours

    const slot = {
      id: Date.now(),
      startTime,
      endTime,
      duration: duration.toFixed(2),
    };

    onAddSlot(slot);
    setError('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow-md rounded-lg w-80 mb-8"
    >
      <label className="block mb-2 font-medium text-gray-700">Start Time</label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      />

      <label className="block mb-2 font-medium text-gray-700">End Time</label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="border rounded w-full p-2 mb-4"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
      >
        Save Time Slot
      </button>
    </form>
  );
}
