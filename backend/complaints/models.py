from django.db import models
from django.contrib.auth.models import User


class Complaint(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("In Progress", "In Progress"),
        ("Resolved", "Resolved"),
    ]

    # User who submitted the complaint
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="complaints",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    location = models.CharField(max_length=200)

    complaint_text = models.TextField()

    language = models.CharField(max_length=50)
    translation = models.TextField()

    department = models.CharField(max_length=100)

    priority = models.CharField(max_length=20)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name