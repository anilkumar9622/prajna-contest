const IconLevelSteps = ({ size = 20, stroke = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 17h4v-4H3v4z" />
    <path d="M9 17h4v-7H9v7z" />
    <path d="M15 17h4V6h-4v11z" />
  </svg>
);
export default IconLevelSteps;
