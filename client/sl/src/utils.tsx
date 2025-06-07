import { ChangeEvent, ChangeEventHandler, Dispatch, SetStateAction } from "react";

type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;
/**
 * Handles a button click by printing form data to the console log.
 * e.g., onClick={handleSubmitToLog}
 */
export const handleSubmitToLog: FormSubmitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataObject = Object.fromEntries(formData.entries());
    
    console.log(JSON.stringify(dataObject, null, 2));
  }

export const handleKeyDownPD = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter") e.preventDefault();
};


export const isIntId = (x: string | null | undefined) => {
  if (x && /^\d+$/.test(x)) return true;
}

export const parseToDate = (x: string) => {
  const localDate = new Date(x).toLocaleDateString("en-CA");

  return localDate;
}

export function toDateTimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const YYYY = d.getFullYear();
  const MM   = pad(d.getMonth() + 1);
  const DD   = pad(d.getDate());
  const hh   = pad(d.getHours());
  const mm   = pad(d.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;  // e.g. "2025-05-10T09:29"
}

export function getLocalDateTimeString() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
       + `T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function createDefaultWorkoutName() {
  const d = new Date();
  const hour = d.getHours();

  if (0 <= hour && hour < 6) {
    return "Early morning workout";
  } else if (6 <= hour && hour < 11) {
    return "Morning workout";
  } else if (11 <= hour && hour < 14) {
    return "Lunch workout";
  } else if (14 <= hour && hour < 18) {
    return "Afternoon workout";
  } else {
    return "Evening workout";
  }
}

/**
 * Event handler for controlling an object with a form.
 * @param event Changes on an input.
 * @param setter State setter to be used.
 */
export const handleControlledChange = (
  event: ChangeEvent<HTMLInputElement>,
  setter: Dispatch<SetStateAction<any>>
) => {
  const { name, value } = event.target;
  setter((previous: any) => ({ ...previous, [name]: value }));
}

/**
 * Creates an onChange handler for any object-shaped state.
 * @param setState The React setState function for your object T
 * @returns An input change handler.
 */
export function makeChangeHandler<T extends Record<string, any>>(
  setState: Dispatch<SetStateAction<T>>
): ChangeEventHandler<HTMLInputElement> {
  return (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value
    } as T));
  };
}