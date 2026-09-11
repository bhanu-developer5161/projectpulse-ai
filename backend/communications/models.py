from django.db import models


class Communication(models.Model):
    SOURCE_CHOICES = [
        ("whatsapp", "WhatsApp"),
        ("email", "Email"),
        ("site", "Site Update"),
        ("client", "Client"),
        ("supplier", "Supplier"),
    ]

    content = models.TextField()
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES
    )

    summary = models.TextField(blank=True)
    decisions = models.JSONField(default=list, blank=True)
    action_items = models.JSONField(default=list, blank=True)
    risks = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.source} - {self.created_at}"