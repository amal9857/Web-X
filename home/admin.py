from django.contrib import admin
from .models import Contact

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'service', 'timestamp')
    search_fields = ('name', 'service')
    list_filter = ('service', 'timestamp')
