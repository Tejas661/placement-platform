from django.urls import path
from .views import signup, login, profile, create_profile, get_profile, update_profile, get_user_role
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    # path('profile/', profile),
    path('profile/create/', create_profile),
    path('profile/', get_profile),
    path('profile/update/', update_profile),
    path('role/', get_user_role),
]