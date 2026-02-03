document.addEventListener('DOMContentLoaded', async () => {

    // 1. Initialize Particles
    const particlesContainer = document.getElementById('tsparticles');
    if (particlesContainer && window.tsParticles) {
        await window.tsParticles.load("tsparticles", {
            fpsLimit: 60,
            background: { color: "transparent" },
            particles: {
                number: { value: 250 },
                color: { value: "#ffffff" },
                shape: {
                    type: ["circle", "char"],
                    character: {
                        value: "X",
                        font: "Verdana",
                        style: "",
                        weight: "bold",
                        fill: true
                    }
                },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1 }
                },
                size: {
                    value: 6,
                    random: true,
                    anim: { enable: false, speed: 40, size_min: 0.1 }
                },
                move: {
                    enable: true,
                    speed: 0.5,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out"
                },
                links: { enable: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "bubble" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    bubble: { distance: 200, size: 4, duration: 2, opacity: 0.8 },
                    push: { particles_nb: 4 }
                }
            },
            detectRetina: true
        });
    }

    // 2. Handle Contact Form with Django Backend
    const contactForm = document.getElementById('contact-form');
    const popup = document.getElementById('success-popup');
    const closePopupBtn = document.getElementById('close-popup-btn');

    if (closePopupBtn && popup) {
        closePopupBtn.addEventListener('click', () => {
            popup.classList.remove('active');
        });
    }

    // Function to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            btn.disabled = true;

            // Get Values
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const requirements = document.getElementById('requirements').value;

            // Simple 10-digit validation
            if (!/^\d{10}$/.test(phone)) {
                alert("Please enter a valid 10-digit phone number.");
                btn.innerText = originalText;
                btn.disabled = false;
                return;
            }

            try {
                // Send data to Django backend
                const response = await fetch('/submit-contact/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: phone,
                        service: service,
                        requirements: requirements
                    })
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    // Show Success Popup
                    if (popup) {
                        popup.classList.add('active');
                    } else {
                        alert("Thank you! Your inquiry has been submitted successfully.");
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.message || "Failed to submit.");
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong: " + error.message);
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });


    }

    // 4. Slide to Call Logic
    const sliderContainer = document.querySelector('.call-slider-container');
    const sliderHandle = document.getElementById('call-slider-handle');

    if (sliderContainer && sliderHandle) {
        let isDragging = false;
        let startX = 0;

        const startDrag = (e) => {
            isDragging = true;
            startX = (e.touches ? e.touches[0].clientX : e.clientX);
            sliderHandle.style.transition = 'none';
        };

        const moveDrag = (e) => {
            if (!isDragging) return;

            // Prevent page scrolling while sliding on mobile
            if (e.cancelable && e.type === 'touchmove') {
                e.preventDefault();
            }

            const currentX = (e.touches ? e.touches[0].clientX : e.clientX);
            let diff = currentX - startX;
            // Calculate max travel distance: Container Width - Handle Width - Padding (5px each side = 10px)
            let maxTranslate = sliderContainer.offsetWidth - sliderHandle.offsetWidth - 10;

            if (diff < 0) diff = 0;
            if (diff > maxTranslate) diff = maxTranslate;

            sliderHandle.style.transform = `translateX(${diff}px)`;

            // Fade out the text as you slide
            const opacity = 1 - (diff / maxTranslate);
            const text = sliderContainer.querySelector('.call-slider-text');
            if (text) text.style.opacity = opacity;
        };

        const endDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;

            let maxTranslate = sliderContainer.offsetWidth - sliderHandle.offsetWidth - 10;

            // Get current translation
            const currentTransform = sliderHandle.style.transform;
            const match = currentTransform.match(/translateX\((.*?)px\)/);
            const currentDiff = match ? parseFloat(match[1]) : 0;

            // Threshold: if dragged more than 90%
            if (currentDiff >= maxTranslate * 0.9) {
                // Trigger Call
                window.open('tel:9778185755', '_self');

                // Reset styling after a moment
                setTimeout(() => {
                    sliderHandle.style.transition = 'transform 0.5s ease';
                    sliderHandle.style.transform = 'translateX(0px)';
                    const text = sliderContainer.querySelector('.call-slider-text');
                    if (text) text.style.opacity = 0.8;
                }, 1500);
            } else {
                // Snap back
                sliderHandle.style.transition = 'transform 0.3s ease';
                sliderHandle.style.transform = 'translateX(0px)';
                const text = sliderContainer.querySelector('.call-slider-text');
                if (text) text.style.opacity = 0.8;
            }
        };

        sliderHandle.addEventListener('mousedown', startDrag);
        sliderHandle.addEventListener('touchstart', startDrag, { passive: false });

        document.addEventListener('mousemove', moveDrag);
        document.addEventListener('touchmove', moveDrag, { passive: false });

        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }
});
