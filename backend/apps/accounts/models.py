from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    followers = models.PositiveSmallIntegerField(default=0)
    tag_name = models.CharField(max_length=50,blank=True, default="", unique=True)


    def __str__(self):
        return f"{self.username} | {self.followers}"
    
    def save(self, *args, **kwargs):
        if not self.tag_name:
            self.tag_name = f"@{self.username}"

        super().save(*args, **kwargs)
