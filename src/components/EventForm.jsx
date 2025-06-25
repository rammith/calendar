// EventForm.jsx
import { useState } from 'react';

const COLORS = ['red', 'green', 'blue', 'yellow', 'purple'];

function EventForm({ selectedDate, onAddEvent }) {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('blue');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAddEvent({
      title,
      date: selectedDate,
      color,
    });
    setTitle('');
  };

  return (
    <div className="p-4 border-t dark:border-gray-600">
      <h3 className="font-semibold mb-2">
        Add Event for {selectedDate.format('DD MMM YYYY')}
      </h3>
      <input
        type="text"
        className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-500 dark:text-white"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex gap-2 mb-2">
        {COLORS.map((c) => (
          <button
            key={c}
            className={`w-6 h-6 rounded-full bg-${c}-500 ${color === c ? 'ring-2 ring-black' : ''}`}
            onClick={() => setColor(c)}
            type="button"
          ></button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Event
      </button>
    </div>
  );
}

export default EventForm;
