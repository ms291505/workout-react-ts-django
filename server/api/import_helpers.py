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

def exercise_exists(name: str, user_id: None | int = None):
  exercise = None
  if user_id:
    exercise = Exercise.objects.filter(name=name, user=user_id).first()
    if exercise: return exercise

  exercise = Exercise.objects.filter(name=name, user_added_flag="N").first()
  return exercise
