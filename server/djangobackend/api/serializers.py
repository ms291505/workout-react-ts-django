from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(
    required=True
  )
  first_name = serializers.CharField(
    required = True,
    max_length = 30
  )
  last_name = serializers.CharField(
    required = True,
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