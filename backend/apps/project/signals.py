from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

# (Import your models and achievement functions here)
from datetime import timedelta
from .models import Streaks, Entry
from .achievements import check_streak_achievements, check_entry_achievements, check_milestone_achievements

def update_streak(user):
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)

    # Get or create the streak record for this user
    streak, created = Streaks.objects.get_or_create(user=user)

    # SCENARIO 1: They already posted today. Do nothing.
    if streak.last_entry_date == today:
        return

    # SCENARIO 2: They posted yesterday. Maintain and increase the streak!
    elif streak.last_entry_date == yesterday:
        streak.current_streak += 1

    # SCENARIO 3: First time posting, or they missed a day. Reset to 1.
    else:
        streak.current_streak = 1

    # Update longest streak if they beat their high score
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    # Save today as the last time they posted
    streak.last_entry_date = today
    streak.save()

    # Trigger achievements
    check_streak_achievements(user, streak.current_streak)


@receiver(post_save, sender=Entry)
def on_entry_created(sender, instance, created, **kwargs):
    if not created:
        return # Only run this when a NEW entry is created, not edited.

    user = instance.project.user

    # Call our clean, modular functions
    update_streak(user)
    check_entry_achievements(user)
    check_milestone_achievements(user, instance)