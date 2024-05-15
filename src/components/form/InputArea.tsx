import React, { useState, ChangeEvent } from "react";
import debounce from "lodash.debounce";
import Label from "./Label";

interface InputAreaProps {
  name: string;
  label: string;
  type: string;
  Icon?: React.ElementType;
  register: any; // Adjust the type according to your form library
  defaultValue?: string;
  autocomplete?: string;
  placeholder?: string;
  value?: string;
}

const InputArea: React.FC<InputAreaProps> = ({
  name,
  label,
  type,
  Icon,
  register,
  defaultValue = "",
  autocomplete,
  placeholder,
  value,
}) => {
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTouched(true);
    if (type === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(event.target.value)) {
        setError("Please enter a valid email address");
      } else {
        setError("");
      }
    } else if (type === "text") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(event.target.value)) {
        setError("Email addresses are not allowed");
      } else {
        setError("");
      }
    }
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 300);

  const validationRules = defaultValue !== "" ? {} : { required: `${label} is required!` };
  let inputValue = defaultValue || "";
  if (touched && register[name]) {
    inputValue = register[name].value || "";
  }

  return (
    <>
      <Label label={label} />
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-800 focus-within:text-gray-900 sm:text-base">
              <Icon />
            </span>
          </div>
        )}
        <input
          {...register(`${name}`, validationRules)}
          type={type}
          name={name}
          defaultValue={inputValue}
          placeholder={placeholder}
          autoComplete={autocomplete}
          value={value}
          className={
            Icon
              ? "py-2 pl-10 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
              : "py-2 px-4 md:px-5 w-full appearance-none border text-sm opacity-75 text-input rounded-md placeholder-body min-h-12 transition duration-200 focus:ring-0 ease-in-out bg-white border-gray-200 focus:outline-none focus:border-emerald-500 h-11 md:h-12"
          }
          onChange={debouncedHandleInputChange}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </>
  );
};

export default InputArea;
