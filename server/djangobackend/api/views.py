from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, WorkoutSerializer
from .models import Workout_Hist
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from .auth_helpers import CookieTokenMixin


def index(request):
  return HttpResponse("Hello, world. You're at the api index.")


class CookieTokenObtainPairView(CookieTokenMixin, TokenObtainPairView):
  serializer_class = TokenObtainPairSerializer

  def finalize_response(self, request, response, *args, **kwargs):

    resp = super().finalize_response(request, response, *args, **kwargs)

    self.set_jwt_cookies(resp, resp.data)

    resp.data.pop("access", None)
    resp.data.pop("refresh", None)

    return resp
  
class CookieTokenRefreshView(CookieTokenMixin, TokenRefreshView):
  serializer_class = TokenRefreshSerializer

  def finalize_response(self, request, response, *args, **kwargs):

    resp = super().finalize_response(request, response, *args, **kwargs)

    self.set_jwt_cookies(resp, resp.data)

    resp.data.pop("access", None)
    resp.data.pop("refresh", None)

    return resp


class WorkoutListCreate(generics.ListCreateAPIView):
  serializer_class = WorkoutSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    user = self.request.user
    return Workout_Hist.objects.filter(user=user)
  
  def perform_create(self, serializer):
    if serializer.is_valid():
      serializer.save(user=self.request.user)
    else:
      print(serializer.errors)


class WorkoutDelete(generics.DestroyAPIView):
  serializer_class = WorkoutSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    user = self.request.user
    return Workout_Hist.objects.filter(user=user)


class CreateUserView(generics.CreateAPIView):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = [AllowAny]