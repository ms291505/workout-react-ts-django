from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
  Workout_Hist,
  Ex_Set, 
  Exercise_Hist,
  Exercise,
  Tmpl_Workout_Hist,
  Tmpl_Exercise_Hist,
  Tmpl_Ex_Set
  )
from django.db.models import Q
from datetime import timedelta
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(
    required=True
  )
  first_name = serializers.CharField(
    required = False,
    max_length = 30
  )
  last_name = serializers.CharField(
    required = False,
    max_length = 30
  )

  class Meta:
    model = User
    fields = [
      "id",
      "username",
      "password",
      "email",
      "first_name",
      "last_name"
    ]
    extra_kwargs = {"password": {"write_only": True}}

  def create(self, validated_data):
    user = User.objects.create_user(**validated_data)
    return user
  

class ExerciseSerializer(serializers.ModelSerializer):

  recent_count = serializers.IntegerField(read_only=True)

  class Meta:
    model = Exercise
    fields = [
      "id",
      "name",
      "user_added_flag",
      "created",
      "user",
      "recent_count",
    ]
    extra_kwargs = {
      "created": {"read_only": True},
      "id": {"read_only": True}
    }

  def validate_name(self, value):
    user = self.context["request"].user

    if Exercise.objects.filter(
      name__iexact=value,
    ).filter(Q(user=user) | Q(user__isnull=True)).exists():
      raise serializers.ValidationError("You already have an exercise with this name.")
    
    return value
  

class ExSetSerializer(serializers.ModelSerializer):
  """
  Serializer for one set of an exercise.
  """
  class Meta:
    model = Ex_Set
    fields = [
      "id",
      "order",
      "weight_lbs",
      "reps",
      "target_reps",
      "type",
    ]
    read_only_fields = ("id",)


class ExerciseHistSerializer(serializers.ModelSerializer):
  exercise_id = serializers.PrimaryKeyRelatedField(
      source="exercise",                
      queryset=Exercise.objects.all(),
  )
  name = serializers.CharField(
      source="exercise.name",
      read_only=True
  )
  ex_sets = ExSetSerializer(many=True)

  class Meta:
      model = Exercise_Hist
      fields = [
          "id",
          "exercise_id",   
          "name",          
          "notes",
          "ex_sets",
      ]
      read_only_fields = ("id",)


class WorkoutHistSerializer(serializers.ModelSerializer):
  exercises = ExerciseHistSerializer(many=True)
  user = serializers.HiddenField(default=serializers.CurrentUserDefault())

  class Meta:
    model = Workout_Hist
    fields = "__all__"
    extra_kwargs = {"user": {"read_only": True}}

  def create(self, validated_data):
    exercises_data = validated_data.pop("exercises")
    workout_hist = Workout_Hist.objects.create(**validated_data)

    for ex_data in exercises_data:
      sets_data = ex_data.pop("ex_sets")
      exercise_hist = Exercise_Hist.objects.create(
        workout_hist=workout_hist,
        **ex_data
      )

      for set_data in sets_data:
        Ex_Set.objects.create(exercise_hist=exercise_hist, **set_data)
    return workout_hist
  
  def update(self, instance, validated_data):
    exercises_data = validated_data.pop("exercises", None)

    for attr in ("name", "date", "notes"):
      setattr(instance, attr, validated_data.get(attr, getattr(instance, attr)))
    instance.save()

    if exercises_data is not None:
      instance.exercises.all().delete()

      for ex_data in exercises_data:
        sets_data = ex_data.pop("ex_sets")
        exercise_hist = Exercise_Hist.objects.create(
          workout_hist=instance,
          **ex_data
        )

        for set_data in sets_data:
          Ex_Set.objects.create(exercise_hist=exercise_hist, **set_data)
    return instance
  
  
class TemplExSetSerializer(serializers.ModelSerializer):
  """
  Serializer for a set in a workout template.
  """
  class Meta:
    model = Tmpl_Ex_Set
    fields = [
      "id",
      "order",
      "weight_lbs",
      "reps",
      "target_reps",
      "type",
    ]
    read_only_fields = ("id",)


class TmplExerciseHistSerializer(serializers.ModelSerializer):
  """
  Serializer for an exercise performanced in a workout template.
  """
  exercise_id = serializers.PrimaryKeyRelatedField(
      source="exercise",                
      queryset=Exercise.objects.all(),
  )
  name = serializers.CharField(
      source="exercise.name",
      read_only=True
  )
  tmpl_ex_sets = TemplExSetSerializer(many=True)
  
  class Meta:
      model = Exercise_Hist
      fields = [
          "id",
          "exercise_id",   
          "name",          
          "notes",
          "tmpl_ex_sets",
      ]
      read_only_fields = ("id",)


class TmplWorkoutHistSerializer(serializers.ModelSerializer):
  tmpl_exercises = TmplExerciseHistSerializer(many=True)
  user = serializers.HiddenField(default=serializers.CurrentUserDefault())

  class Meta:
    model = Tmpl_Workout_Hist
    fields = "__all__"
    extra_kwargs = {"user": {"read_only": True}}

  def create(self, validated_data):
    tmpl_exercises_data = validated_data.pop("tmpl_exercises")
    tmpl_workout_hist = Tmpl_Workout_Hist.objects.create(**validated_data)

    for e in tmpl_exercises_data:
      tmpl_sets_data = e.pop("tmpl_ex_sets")
      tmpl_exercise_hist = Tmpl_Exercise_Hist.objects.create(
        tmpl_workout_hist=tmpl_workout_hist,
        **e
      )

      for s in tmpl_sets_data:
        Tmpl_Ex_Set.objects.create(tmpl_exercise_hist=tmpl_exercise_hist, **s)
    
    return tmpl_workout_hist
  
  def update(self, instance, validated_data):
    tmpl_exercises_data = validated_data.pop("tmpl_exercises", None)

    for attr in ("name", "notes"):
      setattr(instance, attr, validated_data.get(attr, getattr(instance, attr)))
    instance.save()

    if tmpl_exercises_data is not None:
      instance.tmpl_exercises.all().delete()

      for e in tmpl_exercises_data:
        tmpl_sets_data = e.pop("tmpl_ex_sets")
        tmpl_exercise_hist = Tmpl_Exercise_Hist.objects.create(
          tmpl_workout_hist=instance,
          **e
        )

        for s in tmpl_sets_data:
          Tmpl_Ex_Set.objects.create(tmpl_exercise_hist=tmpl_exercise_hist, **s)
    
    return instance
