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

from django.utils import timezone
from datetime import timedelta

def submit_contact(request):
    if request.method == 'POST':
        try:
            # Rate Limiting Logic (Session-based)
            last_submission = request.session.get('last_submission_time')
            if last_submission:
                last_time = timezone.datetime.fromisoformat(last_submission)
                if timezone.now() - last_time < timedelta(hours=24):
                    return JsonResponse({
                        'status': 'error', 
                        'message': 'You have already submitted an inquiry recently. Please try again later.'
                    }, status=429)

            data = json.loads(request.body)
            name = data.get('name')
            phone = data.get('phone')
            service = data.get('service')
            requirements = data.get('requirements')

            if name and phone and service and requirements:
                if not phone.isdigit() or len(phone) != 10:
                     return JsonResponse({'status': 'error', 'message': 'Phone number must be exactly 10 digits.'}, status=400)

                Contact.objects.create(name=name, phone=phone, service=service, requirements=requirements)
                
                # Set session timestamp
                request.session['last_submission_time'] = timezone.now().isoformat()
                request.session.set_expiry(86400) # Expire session in 24 hours if idle

                return JsonResponse({'status': 'success', 'message': 'Inquiry submitted successfully!'})
            else:
                return JsonResponse({'status': 'error', 'message': 'All fields are required.'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method.'}, status=405)
