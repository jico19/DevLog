# achievements.py
from .models import Achievement, UserAchievement, Entry
from django.utils import timezone

def unlock(user, key):
    try:
        achievement = Achievement.objects.get(key=key)
        obj, created = UserAchievement.objects.get_or_create(
            user=user,
            achievement=achievement
        )
        if created:
            # created = newly unlocked
            # you can fire a notification here later
            print(f"{user.username} unlocked: {achievement.name}")
        return created
    except Achievement.DoesNotExist:
        return False


def check_streak_achievements(user, current_streak):
    if current_streak >= 3:
        unlock(user, 'streak_3')
    if current_streak >= 7:
        unlock(user, 'streak_7')
    if current_streak >= 30:
        unlock(user, 'streak_30')
    if current_streak >= 100:
        unlock(user, 'streak_100')


def check_entry_achievements(user):
    count = Entry.objects.filter(project__user=user).count()
    if count >= 1:
        unlock(user, 'entries_1')
    if count >= 10:
        unlock(user, 'entries_10')
    if count >= 50:
        unlock(user, 'entries_50')
    if count >= 100:
        unlock(user, 'entries_100')

    # night owl / early bird
    hour = timezone.now().hour
    if hour >= 0 and hour < 4:
        unlock(user, 'night_owl')
    if hour < 6:
        unlock(user, 'early_bird')

    # screenshot checker
    screenshot_count = Entry.objects.filter(
        project__user=user
    ).exclude(screenshot='').count()
    if screenshot_count >= 10:
        unlock(user, 'screenshot_poster')


def check_milestone_achievements(user, entry):
    if entry.is_milestone:
        unlock(user, 'first_milestone')


def check_social_achievements(user):
    from .models import Follow
    follower_count = Follow.objects.filter(following=user).count()
    if follower_count >= 1:
        unlock(user, 'first_follower')
    if follower_count >= 10:
        unlock(user, 'followers_10')