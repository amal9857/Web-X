from django.db import models

class Contact(models.Model):
    SERVICE_CHOICES = [
        ('Website Development', 'Website Development'),
        ('Software Development', 'Software Development'),
    ]

    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, default='')
    service = models.CharField(max_length=50, choices=SERVICE_CHOICES)
    requirements = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
