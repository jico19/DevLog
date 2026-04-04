from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    total_points = models.PositiveSmallIntegerField(default=0)
    tag_name = models.CharField(max_length=50,blank=True, default="", unique=True)


    def __str__(self):
        return f"{self.username} | {self.followers}"
    
    def save(self, *args, **kwargs):
        if not self.tag_name:
            self.tag_name = f"@{self.username}"

        super().save(*args, **kwargs)


class GithubProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='github_profile')
    github_id = models.CharField(max_length=100, unique=True)
    avatar_url = models.URLField(blank=True)
    github_username = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.github_username}"