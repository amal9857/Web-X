from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from .models import Contact

@ensure_csrf_cookie
def index(request):
    return render(request, 'home/index.html')

@ensure_csrf_cookie
def contact(request):
    return render(request, 'home/contact.html')

def submit_contact(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            service = data.get('service')
            requirements = data.get('requirements')

            if name and service and requirements:
                Contact.objects.create(name=name, service=service, requirements=requirements)
                return JsonResponse({'status': 'success', 'message': 'Inquiry submitted successfully!'})
            else:
                return JsonResponse({'status': 'error', 'message': 'All fields are required.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
