interface Props {
  /** Total logo height in pixels. Width auto-scales to match brand aspect ratio. */
  size?: number;
  className?: string;
}

const BRAND_GREY = '#374150';

/**
 * Airtel Secure logo — swirl mark + "Secure" wordmark in brand blue-grey.
 * The swirl is the same Airtel mark as the parent brand, just recoloured.
 */
export function AirtelSecureLogo({ size = 52, className }: Props) {
  return (
    <span
      className={`inline-flex items-center ${className ?? ''}`}
      style={{ height: size, gap: size * 0.18 }}
      aria-label="Airtel Secure"
    >
      <svg
        height={size * 0.92}
        viewBox="-4 -1 38 36"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M26.8579 18.1642C28.6391 13.6341 27.182 11.3886 23.9345 11.3694C18.7194 11.3386 13.4921 16.8976 8.82871 18.5241C4.57341 20.0083 1.14017 19.4118 0.183261 16.125C-2.52249 6.83122 25.5117 -8.99114 32.9162 6.52823C38.5187 18.5701 21.101 33.7804 10.4054 33.9983C1.88039 34.1719 7.20724 21.1513 13.2564 21.1715C14.6658 21.1762 16.0829 21.7293 16.1767 23.1336C16.2699 24.5265 14.5761 25.6947 13.2488 26.9529C10.9996 29.0848 10.3498 30.638 10.9553 31.377C11.5609 32.116 13.449 31.9728 16.6564 29.8147C21.808 26.3485 25.2272 22.3243 26.8579 18.1642Z"
          fill={BRAND_GREY}
        />
      </svg>
      <span
        style={{
          color: BRAND_GREY,
          fontFamily: '"Airtel Sans", sans-serif',
          fontSize: size * 0.62,
          fontWeight: 500,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        Secure
      </span>
    </span>
  );
}
