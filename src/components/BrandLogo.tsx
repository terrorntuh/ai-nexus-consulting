type BrandLogoProps = {
  className?: string;
  compact?: boolean;
  showRule?: boolean;
};

export function BrandLogo({ className = '', compact = false, showRule = true }: BrandLogoProps) {
  if (compact) {
    return (
      <span className={`brand-mark ${className}`} aria-label="AI Nexus Consulting">
        <span>N</span>
        <span className="brand-logo-x">X</span>
      </span>
    );
  }

  return (
    <span className={`brand-logo ${className}`} aria-label="AI Nexus Consulting">
      <span className="brand-logo-main" aria-hidden="true">
        <span>AI NE</span>
        <span className="brand-logo-x">X</span>
        <span>US</span>
      </span>
      <span className="brand-logo-sub" aria-hidden="true">
        CONSULTING
      </span>
      {showRule && (
        <span className="brand-logo-rule" aria-hidden="true">
          <span />
          <span />
        </span>
      )}
    </span>
  );
}
