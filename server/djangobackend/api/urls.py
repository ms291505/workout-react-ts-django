from django.urls import path
from django.conf import settings
from . import views
from api.views import CreateUserView, CookieTokenObtainPairView, CookieTokenRefreshView, DeleteCookiesView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
  path("", views.index, name="index"),
  path("workouts/", views.WorkoutListCreate.as_view(), name="workout-list"),
  path("user/register/", CreateUserView.as_view(), name="register"),
  path("workouts/delete/<int:pk>/", views.WorkoutDelete.as_view(), name="delete-workout"),
  path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain"),
  path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
  path("logout/", DeleteCookiesView.as_view(), name="logout"),
  path("whoami/", views.WhoAmIView.as_view(), name="who-am-i"),
]