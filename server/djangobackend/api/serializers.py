from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Workout_Hist, ExSet, Exercise_Hist, Exercise


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

  count_180_days = serializers.IntegerField(read_only=True)

  class Meta:
    model = Exercise
    fields = [
      "id",
      "name",
      "user_added_flag",
      "created",
      "user",
      "count_180_days",
    ]
    extra_kwargs = {
      "created": {"read_only": True},
      "id": {"read_only": True}
    }

  

class ExSetSerializer(serializers.ModelSerializer):
  """
  Serializer for one set of an exercise.
  """
  class Meta:
    model = ExSet
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
    # ← write-only field called "exercise_id" on the wire
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
    workout = Workout_Hist.objects.create(**validated_data)

    for ex_data in exercises_data:
      sets_data = ex_data.pop("ex_sets")
      exercise_hist = Exercise_Hist.objects.create(
        workout_hist=workout,
        **ex_data
      )
      for set_data in sets_data:
        ExSet.objects.create(exercise_hist=exercise_hist, **set_data)
    return workout
  
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
          ExSet.objects.create(exercise_hist=exercise_hist, **set_data)
    return instance