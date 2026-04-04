from django.db import models
from apps.accounts.models import User


class Project(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return f"Project: #{self.pk} - {self.name.capitalize()} - {self.description[:30]}"

class Entry(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='entries')
    title = models.CharField(max_length=200)
    body = models.TextField()
    screenshot = models.ImageField(upload_to='screenshots/', blank=True)
    is_milestone = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Entry: #{self.pk} - {self.project.name} - {self.created_at}"

class Comment(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    commented_at = models. DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment: #{self.pk} - {self.user} - {self.body[:30]} - {self.commented_at}"

class Like(models.Model):
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('entry', 'user')  # one like per user per entry

    def __str__(self):
        return f"Likes: #{self.pk} - {self.user.username} - {self.entry.project.name} - {self.liked_at}"

class Streaks(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="streak")
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    streak_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Streak: #{self.pk} - {self.entry.project.name} - {self.streak_date}"
    
class Achievement(models.Model):
    CATEGORY_CHOICES = [
        ('streak', 'Streak'),
        ('entries', 'Entries'),
        ('social', 'Social'),
        ('milestone', 'Milestone'),
        ('special', 'Special'),
    ]

    key = models.CharField(max_length=100, unique=True)  # e.g. 'streak_7'
    name = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(max_length=100)  # lucide icon name or emoji
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    points = models.PositiveIntegerField(default=10)

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE, related_name="test")
    unlocked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')

    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"