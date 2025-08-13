from django.urls import path
from django.conf import settings
from . import views
from api.views import (
  CreateUserView,
  CookieTokenObtainPairView, 
  CookieTokenRefreshView,
  DeleteCookiesView,
  TemplateFolderListCreate,
  TemplateHistListCreate,
  TmplWorkoutHistDelete,
  WorkoutListCreate,
  WorkoutDelete,
  ExerciseListCreate,
  WorkoutDetailView,
  ExSetTypeList,
  TmplWorkoutListCreate,
  TmplWorkoutDetailView,
  TemplateFolderDelete,
  TemplateFolderDetailView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
  path("", views.index, name="index"),
  path("workouts/", WorkoutListCreate.as_view(), name="workout-list"),
  path("user/register/", CreateUserView.as_view(), name="register"),
  path("workouts/delete/<int:pk>/", WorkoutDelete.as_view(), name="delete-workout"),
  path("workouts/<int:pk>/", WorkoutDetailView.as_view(), name="workout-detail"),
  path("token/", CookieTokenObtainPairView.as_view(), name="token_obtain"),
  path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
  path("logout/", DeleteCookiesView.as_view(), name="logout"),
  path("whoami/", views.WhoAmIView.as_view(), name="who-am-i"),
  path("exercises/", ExerciseListCreate.as_view(), name="exercise-list-create"),
  path("exset-types/", ExSetTypeList.as_view(), name="exset-types"),
  path("tmpl-workouts/", TmplWorkoutListCreate.as_view(), name="tmpl-workout-list"),
  path("tmpl-workouts/<int:pk>/", TmplWorkoutDetailView.as_view(), name="tmpl-workout-detail"),
  path("tmpl-hist/", TemplateHistListCreate.as_view(), name="template-hist-list"),
  path("tmpl-folders/", TemplateFolderListCreate.as_view(), name="template-folders"),
  path("tmpl-folders/delete/<int:pk>/", TemplateFolderDelete.as_view(), name="template-folders-delete"),
  path("tmpl-folders/<int:pk>/", TemplateFolderDetailView.as_view(), name="template-folders-detail"),
  path("tmpl-workouts/delete/<int:pk>/", TmplWorkoutHistDelete.as_view(),name="tmpl-wkt-delete")
]
