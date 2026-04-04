# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import Entry, Streaks
from .achievements import check_streak_achievements, check_entry_achievements, check_milestone_achievements


@receiver(post_save, sender=Entry)
def update_streak(sender, instance, created, **kwargs):
    if not created:
        return

    user = instance.project.user
    today = timezone.now().date()

    streak, _ = Streaks.objects.get_or_create(user=user)

    # already posted today, do nothing
    if streak.last_entry_date == today:
        return

    # posted yesterday, continue streak
    if streak.last_entry_date == today - timedelta(days=1):
        streak.current_streak += 1
    else:
        # missed a day or first ever entry, reset
        streak.current_streak = 1

    # update longest streak if beaten
    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_entry_date = today
    streak.save()

    # check achievements after every streak update
    check_streak_achievements(user, streak.current_streak)


@receiver(post_save, sender=Entry)
def on_entry_created(sender, instance, created, **kwargs):
    if not created:
        return

    user = instance.project.user

    update_streak(user)
    check_entry_achievements(user)
    check_milestone_achievements(user, instance)