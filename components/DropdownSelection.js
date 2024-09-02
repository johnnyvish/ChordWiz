export default function DropdownSelection({
  options,
  value,
  onChange,
  className = "flex flex-col justify-center items-center w-full",
  title = "Select an option",
}) {
  return (
    <div className={className}>
      <h1 className="mb-4 font-semibold">{title}</h1>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
