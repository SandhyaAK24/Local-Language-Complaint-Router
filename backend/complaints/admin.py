# from django.contrib import admin
# from .models import Complaint

# admin.site.register(Complaint)
from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "phone",
        "location",
        "language",
        "department",
        "priority",
        "status",
        "created_at",
    )

    search_fields = ("name", "phone", "location")
    list_filter = ("department", "priority", "status", "language")