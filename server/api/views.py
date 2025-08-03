from datetime import timedelta
from django.utils import timezone
from django.shortcuts import render
from django.http import HttpResponse, request
from django.contrib.auth.models import User
from django.db.models import Q, Count

from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import (
  TemplateFolderSerializer,
  TemplateHistSerializer,
  UserSerializer,
  WorkoutHistSerializer,
  ExerciseSerializer,
  TmplWorkoutHistSerializer
)
from .models import (
  Template_Folder,
  Template_Hist,
  Workout_Hist,
  Exercise,
  ExSetType,
  Tmpl_Workout_Hist
)
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from .auth_helpers import CookieTokenMixin

from .debug_utils import d_log


def index(request):
  return HttpResponse("Hello, world. You're at the api index.")


class CookieTokenObtainPairView(CookieTokenMixin, TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if hasattr(response, "data") and isinstance(response.data, dict):
            self.set_jwt_cookies(response, response.data)
            response.data.pop("access", None)
            response.data.pop("refresh", None)

        return response


class CookieTokenRefreshView(CookieTokenMixin, TokenRefreshView):
  serializer_class = TokenRefreshSerializer

  def post(self, request, *args, **kwargs):

    raw = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

    d_log(f"CookieTokenRefreshView: {raw}")

    if not raw:
      return Response(
        {"detail": "Refresh token not provided."},
        status=status.HTTP_400_BAD_REQUEST
      )

    serializer = self.get_serializer(data={"refresh": raw})
    serializer.is_valid(raise_exception=True)
    validated_data = serializer.validated_data

    d_log(f"{validated_data}")

    response = Response(validated_data, status=status.HTTP_200_OK)

    self.set_jwt_cookies(response, validated_data)


    if isinstance(response.data, dict):
      response.data.pop("access", None)
      response.data.pop("refresh", None)

    return response


class DeleteCookiesView(APIView):
  """
  Log out the current user by deleting the JWT cookies.
  """
  permission_classes = [IsAuthenticated]

  def post(self, request, *args, **kwargs):
    resp = Response(status=status.HTTP_204_NO_CONTENT)

    resp.delete_cookie(
      settings.SIMPLE_JWT["AUTH_COOKIE"],
      path=settings.SIMPLE_JWT["AUTH_COOKIE_PATH"],
    )

    resp.delete_cookie(
      settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
      path=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH_PATH"],
    )

    return resp
  

class WhoAmIView(APIView):
  """
  Provides the username for the logged in user.
  """
  permission_classes = [IsAuthenticated]

  def get(self, request):
    serializer = UserSerializer(request.user)

    d_log(f"WhoAmIView: {Response(serializer.data)}")

    return Response(serializer.data)


class WorkoutListCreate(generics.ListCreateAPIView):
  """
  List existing workouts or create a new one for an authenticated user.

  GET:
    Returns a lit of all workouts belonging to the user.

  POST:
    Creates a new workout for the user.

  Attributes:
    serializer_class (Serializer): Serializer clss for validating and serializing Workout_Hist instances.
    permission_classes (list): List of permission classes that determine access; only authenticated users.
  """
  serializer_class = WorkoutHistSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Workout_Hist.objects.filter(user=self.request.user)
  
  def perform_create(self, serializer):
    serializer.save(user=self.request.user)


class WorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
  """
  /api/workouts/{pk}
  """
  serializer_class = WorkoutHistSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    user = self.request.user
    return Workout_Hist.objects.filter(user=user)
  

class TmplWorkoutListCreate(generics.ListCreateAPIView):
    serializer_class = TmplWorkoutHistSerializer
    permission_classes = [IsAuthenticated]
    queryset = Tmpl_Workout_Hist.objects.all()

    def filter_queryset(self, queryset):
      queryset = super().filter_queryset(queryset)
      user = self.request.user

      try:
        workout_hist_id = int(self.request.query_params.get("workout_id", 0))
        print("workout_id is: ", workout_hist_id)
      except(ValueError, TypeError):
        workout_hist_id: int = 0

      if workout_hist_id:
        queryset = queryset.filter(
          workouts_used__workout_hist_id=workout_hist_id
        ).distinct()
      
      return queryset.filter(
          Q(user=user) | Q(user_added_flag="N")
      )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            user_added_flag="Y"
        )

class TmplWorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
  """
  /api/workouts/{pk}
  """
  serializer_class = TmplWorkoutHistSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    user = self.request.user
    return Tmpl_Workout_Hist.objects.filter(user=user)


class TemplateHistListCreate(generics.ListCreateAPIView):
  serializer_class = TemplateHistSerializer
  permission_classes = [IsAuthenticated]

  queryset = Template_Hist.objects.all()

  def filter_queryset(self, queryset):
    user = self.request.user
    queryset = queryset.filter(workout_hist__user=user)


    return queryset.order_by("created")

  def perform_create(self, serializer):
    serializer.save()


class TemplateFolderListCreate(generics.ListCreateAPIView):
  serializer_class = TemplateFolderSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Template_Folder.objects.filter(
        Q(user=self.request.user) | Q(user_added_flag="N")
    )
  
  def perform_create(self, serializer):
    serializer.save(
      user=self.request.user,
      user_added_flag="Y"
    )


class ExerciseListCreate(generics.ListCreateAPIView):
  """
  List existing workouts or create a new one for an authenticated user.

  GET:
    Returns a list of all public exercises and those belonging to the user.

  POST:
    Creates a new exercise for the user.
  """
  serializer_class = ExerciseSerializer
  permission_classes = [IsAuthenticated]
  queryset = Exercise.objects.all()
  filter_backends = [filters.SearchFilter]
  search_fields = ["name"]

  def filter_queryset(self, queryset):
    queryset = super().filter_queryset(queryset)
    user = self.request.user

    try:
      days = int(self.request.query_params.get("days", 180))
    except (ValueError, TypeError):
      days = 180

    days = max(1, min(days, 365))

    cutoff = timezone.now() - timedelta(days=days)

    return queryset.filter(
      Q(user=user) | Q(user_added_flag="N")
    ).annotate(
      recent_count=Count(
        "exercise_hist",
        filter=Q(
          exercise_hist__workout_hist__user=user,
          exercise_hist__workout_hist__date__gte=cutoff,
        ),
      )
    )
  
  def perform_create(self, serializer):
    serializer.save(
      user=self.request.user,
      user_added_flag="Y"
    )


class WorkoutDelete(generics.DestroyAPIView):
  """
  Delete a workout for an authenticated user.

  DELETE:
    Removes the specific Workout_Hist instance if it is owned by the current user.

  Attributes:
    serializer_class (Serializer): Serializer clss for validating and serializing Workout_Hist instances.
    permission_classes (list): List of permission classes that determine access; only authenticated users.
  """

  serializer_class = WorkoutHistSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    """
    Return only the workouts owned by the requestion user.

    Returns:
      QuerySet[Workout_Hist]: All workouts filtered by the current user.
    """
    return Workout_Hist.objects.filter(user=self.request.user)


class TemplateFolderDelete(generics.DestroyAPIView):
  serializer_class = TemplateFolderSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Template_Folder.objects.filter(user=self.request.user)


class TmplWorkoutHistDelete(generics.DestroyAPIView):
  serializer_class = TmplWorkoutHistSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Tmpl_Workout_Hist.objects.filter(user=self.request.user)


class ExSetTypeList(APIView):
  permission_classes = [AllowAny]

  def get(self, request):
    choices = [
      {"value": choice.value, "label": choice.label}
      for choice in ExSetType
    ]
    return Response(choices)


class CreateUserView(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [AllowAny]
