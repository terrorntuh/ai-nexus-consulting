type BrandLogoProps = {
  className?: string;
  compact?: boolean;
};

function NexusMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`brand-symbol ${className}`} viewBox="0 0 168 128" aria-hidden="true" focusable="false">
      <path
        d="M28 100V28l56 72"
        fill="none"
        stroke="#102437"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="15"
      />
      <path
        d="M92 28l30 36-30 36"
        fill="none"
        stroke="#f2b705"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M141 28l-25 32m25 40-25-32"
        fill="none"
        stroke="#13a76b"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}

export function BrandLogo({ className = '', compact = false }: BrandLogoProps) {
  if (compact) {
    return (
      <span className={`brand-mark ${className}`} aria-label="AI Nexus Consulting">
        <NexusMark />
      </span>
    );
  }

  return (
    <span className={`brand-logo ${className}`} aria-label="AI Nexus Consulting">
      <NexusMark />
      <span className="brand-logo-copy" aria-hidden="true">
        <span className="brand-logo-main">AI NEXUS</span>
        <span className="brand-logo-sub">CONSULTING</span>
      </span>
    </span>
  );
}
