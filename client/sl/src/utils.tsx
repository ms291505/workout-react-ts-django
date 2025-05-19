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