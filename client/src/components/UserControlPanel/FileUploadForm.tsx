import { ChangeEvent,  FormEvent,  useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { validateFileInput } from "../../utils/inputValidators";
import { createConditionalButtonText } from "../../library/factories";
import { uploadFile } from "../../api";


export default function FileUploadForm() {
  
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState("");
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = validateFileInput(e);
    files && setFile(files[0]);
    files && setFileName(files[0].name)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      const response = uploadFile(formData);
      console.log("Uploading the CSV was successful: ", response)
    } catch {
      console.error("Uploading the CSV failed failed.")
    } finally {
      setUploading(false);
    }
  }

  const uploadButtonText = createConditionalButtonText(
    uploading,
    "Uploading...",
    "Upload"
  );

  return (
    <form
      onSubmit={handleSubmit}
    >
      <Stack
        spacing={2}
      >
        <Button component="label">
          {fileName
            ? fileName + " 📑"
            : "Select File"
          }
          <input
            hidden
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </Button>
        <Button
          type="submit"
          disabled={!file || uploading}
        >
          { uploadButtonText }
        </Button>
      </Stack>
    </ form>
  )
}