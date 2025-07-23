import { Choice } from "../library/types";
import { fetchSetTypeChoice } from "../api";
import { useEffect, useState } from "react";

/**
 * @deprecated
 */
export function useSetTypeChoices(): {
  choices: Choice[];
  loading: boolean;
  error: Error | null;
} {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchSetTypeChoice()
      .then((data) => setChoices(data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);
  return { choices, loading, error };
}