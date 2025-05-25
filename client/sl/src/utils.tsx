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
