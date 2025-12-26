export default function LionIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mane */}
      <circle cx="32" cy="28" r="18" fill="#D4A574" />
      {/* Mane details */}
      <circle cx="20" cy="18" r="6" fill="#C8996A" />
      <circle cx="44" cy="18" r="6" fill="#C8996A" />
      <circle cx="16" cy="28" r="6" fill="#C8996A" />
      <circle cx="48" cy="28" r="6" fill="#C8996A" />
      <circle cx="20" cy="38" r="6" fill="#C8996A" />
      <circle cx="44" cy="38" r="6" fill="#C8996A" />
      {/* Head */}
      <circle cx="32" cy="28" r="14" fill="#E8B87E" />
      {/* Left ear */}
      <ellipse
        cx="22"
        cy="18"
        rx="4"
        ry="5"
        fill="#D4A574"
        transform="rotate(-20 22 18)"
      />
      {/* Right ear */}
      <ellipse
        cx="42"
        cy="18"
        rx="4"
        ry="5"
        fill="#D4A574"
        transform="rotate(20 42 18)"
      />
      {/* Snout */}
      <ellipse cx="32" cy="32" rx="8" ry="6" fill="#F0C898" />
      {/* Left eye */}
      <circle cx="26" cy="26" r="2.5" fill="#333" />
      {/* Right eye */}
      <circle cx="38" cy="26" r="2.5" fill="#333" />
      {/* Nose */}
      <ellipse cx="32" cy="32" rx="3" ry="2" fill="#8B6F47" />
      {/* Mouth */}
      <path
        d="M 32 33 Q 28 36 26 34"
        stroke="#8B6F47"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 32 33 Q 36 36 38 34"
        stroke="#8B6F47"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Body */}
      <ellipse cx="32" cy="48" rx="14" ry="10" fill="#E8B87E" />
      {/* Legs */}
      <rect x="22" y="54" width="5" height="8" rx="2.5" fill="#D4A574" />
      <rect x="37" y="54" width="5" height="8" rx="2.5" fill="#D4A574" />
      {/* Tail */}
      <path
        d="M 46 48 Q 52 46 54 50"
        stroke="#D4A574"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="54" cy="50" r="3" fill="#C8996A" />
    </svg>
  );
}
