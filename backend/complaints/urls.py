from django.urls import path
from .views import analyze_complaint, my_complaints, admin_complaints
from .auth_views import signup, user_login

urlpatterns = [
    path("analyze/", analyze_complaint),
    path("signup/", signup),
    path("login/", user_login),
    path("my-complaints/", my_complaints),
    path("admin-complaints/", admin_complaints),
]