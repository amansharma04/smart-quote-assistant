import clsx from "clsx";

export default function Card({ children, className, padded = true, ...props }) {
  return (
    <div className={clsx("bg-white border border-border rounded-2xl shadow-card", padded && "p-5", className)} {...props}>
      {children}
    </div>
  );
}
