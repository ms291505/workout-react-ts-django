from django.urls import reverse
from django.utils.html import format_html
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Exercise, Workout_Hist

workout_fields = (
  "date","name","user","created","voided","replaced_by"
)

class WorkoutInLine(admin.TabularInline):
  model = Workout_Hist
  fields = workout_fields
  extra = 0
  readonly_fields = workout_fields

class ExerciseInLine(admin.TabularInline):
  model = Exercise
  fields = ("name", "created")
  extra = 0
  readonly_fields = fields

admin.site.unregister(User)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
  """
  Uses the defualt User admin as a base, adds the following:
  - list of workouts inline
  """
  inlines = tuple(UserAdmin.inlines) + (
    WorkoutInLine,
    ExerciseInLine
    )

  readonly_fields = tuple(UserAdmin.readonly_fields) + (
    "view_workouts_link",
    )

  fieldsets = [
    *UserAdmin.fieldsets,
    ("Workout Tools", {"fields": ("view_workouts_link",),
                       }),
  ]

  @admin.display(description="Workouts")
  def view_workouts_link(self, obj):
    if not obj.pk:
      return ""
    url = (
      reverse("admin:api_workout_hist_changelist")
      + f"?user__id__exact={obj.pk}"
    )
    return format_html(
      '<a class="button" href="{}">View Workouts</a>', url
    )


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
  """
  Admin configuration for Exercise data.
  """
  list_display = ("name", "user", "user_added_flag", "created")
  list_filter = ("user_added_flag", "user", "created")
  search_fields = ("name", "user__username")
  ordering = ("name", "user_added_flag")

@admin.register(Workout_Hist)
class WorkoutHistAdmin(admin.ModelAdmin):
  """
  
  """
  list_display = workout_fields
  list_filter = ("user", "date", "voided")
  search_fields = ("name", "user__username")
  ordering = ("-date",)