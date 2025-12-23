from .models import Exercise

def transform_to_ex_set(row, source = "strong"):
  ex_set: None | dict = None

  if source == "strong":
    ex_set = {
      "id": "",
      "reps": row["Reps"],
      "weight_lbs": row["Weight"],
      "order": row["Set Order"]
    }

  if ex_set: return ex_set

def update_if_changed(workout: dict, key: str, value):
  if workout.get(key) != value:
    workout[key] = value
    return True
  return False