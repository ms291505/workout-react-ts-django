from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer, WorkoutSerializer
from .models import Workout_Hist
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

  def finalize_response(self, request, response, *args, **kwargs):

    d_log("something called CookieTokenObtainPairView.")

    resp = super().finalize_response(request, response, *args, **kwargs)

    self.set_jwt_cookies(resp, resp.data)

    resp.data.pop("access", None)
    resp.data.pop("refresh", None)

    return resp


class CookieTokenRefreshView(CookieTokenMixin, TokenRefreshView):
  serializer_class = TokenRefreshSerializer

  def post(self, request, *args, **kwargs):

    raw = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

    d_log(f"{raw}")

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

    response.data.pop("access", None)
    response.data.pop("refresh", None)

    return response

  def finalize_response(self, request, response, *args, **kwargs):

    resp = super().finalize_response(request, response, *args, **kwargs)

    self.set_jwt_cookies(resp, resp.data)

    resp.data.pop("access", None)
    resp.data.pop("refresh", None)

    return resp


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
  serializer_class = WorkoutSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    user = self.request.user
    return Workout_Hist.objects.filter(user=user)
  
  def perform_create(self, serializer):
    serializer.save(user=self.request.user)


class WorkoutDelete(generics.DestroyAPIView):
  """
  Delete a workout for an authenticated user.

  DELETE:
    Removes the specific Workout_Hist instance if it is owned by the current user.

  Attributes:
    serializer_class (Serializer): Serializer clss for validating and serializing Workout_Hist instances.
    permission_classes (list): List of permission classes that determine access; only authenticated users.
  """

  serializer_class = WorkoutSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    """
    Return only the workouts owned by the requestion user.

    Returns:
      QuerySet[Workout_Hist]: All workouts filtered by the current user.
    """
    return Workout_Hist.objects.filter(user=self.request.user)


class CreateUserView(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [AllowAny]