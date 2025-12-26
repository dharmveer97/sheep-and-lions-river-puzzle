export default function BoatIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Boat hull */}
      <path
        d="M 20 50 L 10 60 Q 10 65 15 65 L 105 65 Q 110 65 110 60 L 100 50 Z"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="2"
      />
      {/* Boat interior */}
      <path d="M 20 50 L 25 55 L 95 55 L 100 50 Z" fill="#A0522D" />
      {/* Boat rim */}
      <rect x="18" y="48" width="84" height="4" rx="2" fill="#654321" />
      {/* Side planks */}
      <line
        x1="30"
        y1="55"
        x2="25"
        y2="65"
        stroke="#654321"
        strokeWidth="1.5"
      />
      <line
        x1="50"
        y1="55"
        x2="45"
        y2="65"
        stroke="#654321"
        strokeWidth="1.5"
      />
      <line
        x1="70"
        y1="55"
        x2="65"
        y2="65"
        stroke="#654321"
        strokeWidth="1.5"
      />
      <line
        x1="90"
        y1="55"
        x2="85"
        y2="65"
        stroke="#654321"
        strokeWidth="1.5"
      />
    </svg>
  );
}
