import { MouseEventHandler, ReactNode } from "react";
import styles from "./AddExerciseButton.module.css";

interface AddExerciseButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export default function AddExerciseButton({
  onClick,
  children
}: AddExerciseButtonProps) {
  return (
    <button
    type="button"
    className={ styles.AddExerciseButton }
    onClick={onClick}
    aria-label="Add Exercise"
    >
      { children }
    </button>
  )
}