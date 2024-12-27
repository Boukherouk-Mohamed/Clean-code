export const Input = ({ label, error, ...props }) => (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );