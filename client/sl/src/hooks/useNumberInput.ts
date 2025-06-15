import { useState } from "react";

interface NumberInputOptions {
  allowDecimal?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  onValidChange?: (value: string | number) => void;
}

export function useNumberInput(
  initialValue: string,
  options: NumberInputOptions = {}
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;

    if (newValue === "") {
      if (options.required) {
        setError("This field is required.");
      } else {
        setError(null);
        setValue(newValue);
        options.onValidChange?.(newValue);
      }
      return;
    }

    const validPattern = options.allowDecimal
      ? /^(\d+(\.\d*)?|\.\d+)$/
      : /^\d+$/;

    if (!validPattern.test(newValue)) {
      setError("Enter a valid number.");
      return;
    }

    const parsed = options.allowDecimal
      ? parseFloat(newValue)
      : parseInt(newValue, 10);

    if (options.min !== undefined && parsed < options.min) {
      setError(`Must be at least ${options.min}.`);
      return;
    }

    if (options.max !== undefined && parsed > options.max) {
      setError(`Must be at most ${options.max}.`);
      return;
    }

    setError(null);
    setValue(newValue);
    options.onValidChange?.(parsed);
  }

  return {
    value,
    setValue,
    error,
    handleChange,
  };
}
