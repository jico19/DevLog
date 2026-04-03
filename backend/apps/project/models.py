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
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE, related_name="streak")
    streak_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Streak: #{self.pk} - {self.entry.project.name} - {self.streak_date}"