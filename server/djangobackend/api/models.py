from datetime import datetime, timedelta
from django.db import models
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import User
from decimal import Decimal


# python3 manage.py makemigrations api
# python3 manage.py sqlmigrate api ####
# python3 manage.py migrate


class Workout_Hist(models.Model):
  """
  Basic information about a strength training workout.

  Attributes:
    name (CharField): workout name
    date (DateTimeField): workout date
    notes (TextField): workout notes
    created (DateTimeField): created date
    voided (CharField): void flag
    replaced_by (OneToOneField): ID for replacement
    user (ForeignKey): ID for the user

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
  user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="workouts",
    blank=True,
    null=True,
    default=None
  )

  class Meta:
    verbose_name = "Workout"
    verbose_name_plural = "Workouts"

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
    user (ForeignKey): user_id for user created exercises

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
  user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="created_exercises",
    null=True,
    blank=True,
    default=None
  )

  def __str__(self):
    """
    Returns:
      str: Exercise name.
    """
    return f"'{self.name}' ({'user-added' if self.user else 'defualt'})"
  
  def clean(self):
    if self.user_added_flag == "Y" and self.user is None:
      raise ValueError("User must be set if user_added_flag is 'Y'")


class Exercise_Hist(models.Model):
  """
  Contains the exercises done for each workout.

  Attributes:
    workout_hist (ForeignKey): foreign key for the workout
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


class Ex_Set(models.Model):
  """
  Contains the sets performed for each exercise.

  Attributes:
    exercise (ForeignKey): Foreign key for `EXERCISE_HIST` table.
    order (PositiveSmallIntegerField): the order the sets were performed for each exercise
    weight_lbs (DecimalField): the weight in pounds, up to two decimal places
    reps (PostiveSmallIntergerField): count of reps performed
    target_reps (PositiveSmallIntergerField): target reps for the athlete
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
    default=Decimal("0.0"),
    help_text="Enter weight in pounds, up to two decimal places."
  )
  reps = models.PositiveSmallIntegerField()
  target_reps = models.PositiveBigIntegerField(
    verbose_name="target reps",
    blank=True,
    null=True
  )
  type = models.CharField(
    verbose_name="set type",
    max_length=2,
    choices=ExSetType.choices,
    default=ExSetType.WORK,
    help_text="Select the set type (e.g., Warm-Up)."
  )
  created = models.DateTimeField(
    verbose_name="ceated date",
    auto_now_add=True
  )


class Teomplate_Workout_Hist(models.Model):
  """
  Basic information about a strength training workout.

  Attributes:
    name (CharField): workout name
    notes (TextField): workout notes
    created (DateTimeField): created date
    user (ForeignKey): ID for the user

  """
  name = models.CharField(
    verbose_name="workout name",
    max_length=200
  )
  notes = models.TextField(
    verbose_name="workout notes",
    blank=True,
    help_text="Notes for the workout for reference later."
  )
  created = models.DateTimeField(
    verbose_name="created date",
    auto_now_add=True
  )
  updated = models.DateTimeField(
    verbose_name="updated date",
    auto_now_add=True
  )
  user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="workout_templates",
    blank=True,
    null=True,
    default=None
  )

  class Meta:
    verbose_name = "Workout_Template"
    verbose_name_plural = "Workout_Templates"


class Template_Exercise_Hist(models.Model):
  """
  Contains the exercises done for each workout.

  Attributes:
    template_workout_hist (ForeignKey): foreign key for the workout template
    exercise (ForeignKey): foreign key for the exercise
    notes (TextField): exercise notes
    created (DateTimeField): created date
  """
  template_workout_hist = models.ForeignKey(
    Teomplate_Workout_Hist,
    on_delete=models.CASCADE,
    related_name="template_exercises"
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


class Template_Ex_Set(models.Model):
  """
  Contains the sets performed for each exercise.

  Attributes:
    exercise (ForeignKey): Foreign key for `EXERCISE_HIST` table.
    order (PositiveSmallIntegerField): the order the sets were performed for each exercise
    weight_lbs (DecimalField): the weight in pounds, up to two decimal places
    reps (PostiveSmallIntergerField): count of reps performed
    target_reps (PositiveSmallIntergerField): target reps for the athlete
    type (CharField): the set type (ExSetType)
    created (DateTimeField): created date
  """
  template_exercise_hist = models.ForeignKey(
    Template_Exercise_Hist,
    on_delete=models.CASCADE,
    related_name="template_ex_sets"
  )
  order = models.PositiveSmallIntegerField(
    verbose_name="set order",
    help_text="order the sets were performed for each exercise."  
  )
  weight_lbs = models.DecimalField(
    verbose_name="weight (lbs)",
    decimal_places=2,
    max_digits=6,
    default=Decimal("0.0"),
    help_text="Enter weight in pounds, up to two decimal places."
  )
  reps = models.PositiveSmallIntegerField()
  target_reps = models.PositiveBigIntegerField(
    verbose_name="target reps",
    blank=True,
    null=True
  )
  type = models.CharField(
    verbose_name="set type",
    max_length=2,
    choices=ExSetType.choices,
    default=ExSetType.WORK,
    help_text="Select the set type (e.g., Warm-Up)."
  )
  created = models.DateTimeField(
    verbose_name="ceated date",
    auto_now_add=True
  )


class Cardio_Type(models.TextChoices):
  """
  The allowable cardio types.
  """
  RUN = "RN", "Run"
  BIKE = "BK", "Bike"
  ROW = "RW", "Row"
  MIXED = "MX", "Mixed Cardio"
  RUCK = "RK", "Ruck"
  STAIR = "SR", "Stair Machine"
  ELLIPTICAL = "EL", "Elliptical Machine"
  OTHER = "OR", "Other"


class Cardio_Workout_Hist(models.Model):
  """
  Contains information about a cardio workout.

  Attributes:

  """
  name = models.CharField(
    verbose_name="workout name",
    max_length=200
  )
  cardio_type = models.CharField(
    verbose_name="cardio type",
    max_length=2,
    choices=Cardio_Type.choices,
    help_text="Select the type of cardio."
  )
  date = models.DateTimeField("workout date")
  notes = models.TextField(
    verbose_name="workout notes",
    blank=True,
    help_text="Notes for the workout for reference later."
  )
  distance_mi = models.DecimalField(
    verbose_name="distance (miles)",
    decimal_places=2,
    max_digits=6,
    default=Decimal("0.0"),
    help_text="Enter the distance in miles, up to two decimal places."
  )
  calories = models.IntegerField(
    verbose_name="calories burned",
    blank=True,
    null=True
  )
  duration = models.DurationField(
    verbose_name="duration",
    default=timedelta
  )
  elevation_ft = models.IntegerField(
    verbose_name="elevation (feet)",
    blank=True,
    null=True
  )
  avg_power_w = models.IntegerField(
    verbose_name="average power (W)",
    blank=True,
    null=True
  )
  avg_hr_bpm = models.IntegerField(
    verbose_name="average heart rate (BPM)",
    blank=True,
    null=True
  )
  cadance_per_min = models.IntegerField(
    verbose_name="cadence (per minute)",
    blank=True,
    null=True
  )
  outdoor = models.BooleanField(
    verbose_name="outdoor indicator",
    default=False,
    blank=True,
    null=True
  )
  created = models.DateTimeField(
    verbose_name="created date",
    auto_now_add=True)
  user = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="cardio_workouts",
    blank=True,
    null=True
  )
  
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
