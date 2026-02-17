import { useState } from "react";

export default function SwitchButton({ label, condition, setter, isEdit }) {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className={` gap-3 ${isEdit ? "hidden" : "flex items-center"}`}>
      <h1>{label}</h1>
      <button
        onClick={() => {
          setEnabled(!enabled);
          condition.toLowerCase() === "event"
            ? setter("Announcement")
            : setter("Event");
        }}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none
        ${enabled ? "bg-blue-800" : "bg-gray-300"}`}
      >
        {/* Toggle Circle */}
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition-transform duration-300
          ${enabled ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}
