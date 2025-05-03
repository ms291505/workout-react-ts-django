from datetime import datetime, timedelta
from django.db import models
from django.utils import timezone
from django.conf import settings


# python3 manage.py makemigrations api
# python3 manage.py sqlmigrate api ####
# python3 manage.py migrate


class Workout_Hist(models.Model):
  """
  Basic information about a user's workout.

  Attributes:
    name (CharField): workout name
    date (DateTimeField): workout date
    notes (TextField): workout notes
    created (DateTimeField): created date

  Methods:
    formatted_date: Reutrns the workout date as a human-readable string.
    __str__: Returns a summary string for admin displays.
  """
  name = models.CharField(
    verbose_name="workout name",
    max_length=200
  )
  date = models.DateTimeField("workout date")
  notes = models.TextField(
    verbose_name="workout notes",
    blank=True,
    help_text="Notes for the workout for reference later."
  )
  created = models.DateTimeField(
    verbose_name="created date",
    auto_now_add=True)
  voided = models.CharField(
    max_length=1,
    default="N"
  )
  replaced_by = models.OneToOneField(
    "self",
    null=True,
    blank=True,
    on_delete=models.SET_NULL
  )

  def was_in_last_30_days(self):
    """
    Returns:
      bool: True if the workout happened in the last 30 days.
    """
    return self.date >= timezone.now() - timedelta(days=30)

  @property
  def long_workout_date_str(self) -> str:
    """
    Returns:
      str: The workout date in 'May 3, 2025 at 19:53' format.
    """
    if not self.date:
      return "No date"
    try:
      return self.date.strftime("%B %-d, %Y at %H:%M")
    except ValueError:
      return self.date.strftime("%B %#d, %Y at %H:%M")

  def __str__(self) -> str:
    """
    Returns:
      str: The workout name and date.
    """
    if self.date:
      return f"'{self.name}' on {self.long_workout_date_str}"
    else:
      return self.name


class Exercise(models.Model):
  """
  Basic information about an exercise.

  Attributes:
    name (CharField): exercise name
    user_added_flag (CharField): flag indicating user created exercise
    created (DateTimeField): created date

  Methods:
    __str__: Returns a summary string for admin displays.
  """
  name = models.CharField(
    max_length=200
  )
  user_added_flag = models.CharField(
    max_length=1,
    default="N"
  )
  created = models.DateTimeField(
    verbose_name="created date",
    auto_now_add=True)

  def __str__(self):
    """
    Returns:
      str: Exercise name.
    """
    return self.name


class Exercise_Hist(models.Model):
  """
  Contains the exercises done for each workout.

  Attributes:
    workout (ForeignKey): foreign key for the workout
    exercise (ForeignKey): foreign key for the exercise
    notes (TextField): exercise notes
    created (DateTimeField): created date
  """
  workout_hist = models.ForeignKey(
    Workout_Hist,
    on_delete=models.CASCADE,
    related_name="exercises"
  )
  exercise = models.ForeignKey(
    Exercise,
    on_delete=models.CASCADE
  )
  notes = models.TextField(
    verbose_name="exercise notes",
    blank=True,
    help_text="Notes for an exercise for reference later."
  )
  created = models.DateTimeField(
    verbose_name="created date",
    auto_now_add=True)

  def __str__(self):
    return f"'{self.exercise.name}' performed on {self.workout_hist.long_workout_date_str}"


class ExSetType(models.TextChoices):
  """
  The allowable set types.
  """
  WARM_UP = "WU", "Warm-Up"
  WORK = "WK", "Working"
  MAX = "MX", "Max"
  MYOREP = "MY", "MyoRep"
  DROP = "DP", "Drop"


class ExSet(models.Model):
  """
  Contains the sets performed for each exercise.

  Attributes:
    exercise (ForeignKey)
    order (PositiveSmallIntegerField): the order the sets were performed for each exercise
    weight_lbs (DecimalField): the weight in pounds, up to two decimal places
    reps (PostiveSmallIntergerField)
    type (CharField): the set type (ExSetType)
    created (DateTimeField): created date
  """
  exercise_hist = models.ForeignKey(
    Exercise_Hist,
    on_delete=models.CASCADE,
    related_name="ex_sets"
  )
  order = models.PositiveSmallIntegerField(
    verbose_name="set order",
    help_text="order the sets were performed for each exercise."  
  )
  weight_lbs = models.DecimalField(
    verbose_name="weight (lbs)",
    decimal_places=2,
    max_digits=6,
    default=0,
    help_text="Enter weight in pounds, up to two decimal places."
  )
  reps = models.PositiveSmallIntegerField()
  type = models.CharField(
    verbose_name="set type",
    max_length=2,
    choices=ExSetType.choices,
    default=ExSetType.WORK,
    help_text="Select the set type (e.g., Warm-Up)."
  )
  created = models.DateTimeField(
    verbose_name="ceated date",
    auto_now_add=True)
