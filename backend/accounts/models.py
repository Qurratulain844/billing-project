from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_owner = models.BooleanField(default=True)



class Company(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    logo = models.ImageField(upload_to="company_logo/", null=True, blank=True)

    def __str__(self):
        return self.name