interface InputFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  large?: boolean;
  unchanged?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = '',
  value,
  type = 'text',
  large = false,
  unchanged = false,
  onChange
}) => {
  const inputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${large ? 'text-lg py-3 px-4' : 'text-base'}
    ${unchanged ? 'bg-gray-100 cursor-not-allowed' : 'bg-black'}
  `.trim();

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={unchanged}
        className={inputClasses}
      />
    </div>
  );
};

export default InputField;