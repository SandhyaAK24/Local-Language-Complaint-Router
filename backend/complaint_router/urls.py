# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('complaints.urls')),
# ]

# from django.urls import path, include

# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("api/", include("complaints.urls")),
# ]
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("complaints.urls")),
]