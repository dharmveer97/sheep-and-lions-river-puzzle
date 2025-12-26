export default function SheepIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sheep body */}
      <ellipse cx="32" cy="36" rx="20" ry="16" fill="#F0F0F0" />
      {/* Sheep head */}
      <circle cx="32" cy="24" r="12" fill="#E8E8E8" />
      {/* Left ear */}
      <ellipse
        cx="24"
        cy="20"
        rx="4"
        ry="6"
        fill="#E0E0E0"
        transform="rotate(-20 24 20)"
      />
      {/* Right ear */}
      <ellipse
        cx="40"
        cy="20"
        rx="4"
        ry="6"
        fill="#E0E0E0"
        transform="rotate(20 40 20)"
      />
      {/* Face */}
      <ellipse cx="32" cy="26" rx="8" ry="7" fill="#FAFAFA" />
      {/* Left eye */}
      <circle cx="28" cy="24" r="2" fill="#333" />
      {/* Right eye */}
      <circle cx="36" cy="24" r="2" fill="#333" />
      {/* Nose */}
      <ellipse cx="32" cy="28" rx="2" ry="1.5" fill="#FFB6C1" />
      {/* Wool details */}
      <circle cx="24" cy="30" r="6" fill="#F8F8F8" opacity="0.8" />
      <circle cx="40" cy="30" r="6" fill="#F8F8F8" opacity="0.8" />
      <circle cx="32" cy="40" r="6" fill="#F8F8F8" opacity="0.8" />
      {/* Legs */}
      <rect x="22" y="48" width="4" height="10" rx="2" fill="#333" />
      <rect x="38" y="48" width="4" height="10" rx="2" fill="#333" />
    </svg>
  );
}
