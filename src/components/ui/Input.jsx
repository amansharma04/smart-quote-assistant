import clsx from "clsx";

export function Input({ label, className, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>}
      <input
        className={clsx(
          "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand",
          className
        )}
        {...props}
      />
    </label>
  );
}

export function Select({ label, options = [], className, ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>}
      <select
        className={clsx(
          "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand bg-white",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}
