import clsx from "clsx";

const variants = {
  primary: "bg-brand text-white hover:bg-blue-700",
  secondary: "bg-white text-ink border border-border hover:bg-gray-50",
  ghost: "bg-transparent text-ink hover:bg-gray-100",
};

export default function Button({ children, variant = "primary", size = "md", className, ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
