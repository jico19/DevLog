from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from . import models
from . import serializer
import requests

class UserViewSets(viewsets.ModelViewSet):
    queryset = models.User.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializer.UserListSerializer
        return serializer.UserDetailSerializer
    
    @action(detail=False, methods=['post'])
    def github_login(self, request):
        code = request.data.get('code')

        if not code:
            return Response(
                {'error': 'Code is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 1 — exchange code for access token
        token_response = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'client_id': settings.GITHUB_CLIENT_ID,
                'client_secret': settings.GITHUB_CLIENT_SECRET,
                'code': code,
            },
            headers={'Accept': 'application/json'}
        )
        token_data = token_response.json()
        access_token = token_data.get('access_token')


        if not access_token:
            return Response(
                {'error': 'Failed to get access token from GitHub'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 2 — fetch user profile from GitHub
        user_response = requests.get(
            'https://api.github.com/user',
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            }
        )
        github_user = user_response.json()

        if 'id' not in github_user:
            return Response(
                {'error': 'Failed to fetch GitHub profile'},
                status=status.HTTP_400_BAD_REQUEST
            )   

        github_id = str(github_user.get('id'))
        github_username = github_user.get('login')
        print(github_username)
        avatar_url = github_user.get('avatar_url', '')
        email = github_user.get('email', '')

        # Step 3 — get or create the user
        github_profile = models.GithubProfile.objects.filter(github_id=github_id).first()

        if github_profile:
            user = github_profile.user
        else:
            # create a new Django user
            username = github_username
            print(username)
            # handle duplicate usernames
            if models.User.objects.filter(username=username).exists():
                username = f"{github_username}_{github_id}"

            user = models.User.objects.create_user(
                username=username,
                email=email,
            )

            models.GithubProfile.objects.create(
                user=user,
                github_id=github_id,
                github_username=github_username,
                avatar_url=avatar_url,
            )

        # Step 4 — generate JWT and return to React
        refresh = RefreshToken.for_user(user)

        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'avatar_url': avatar_url,
                'github_username': github_username,
            }
        })