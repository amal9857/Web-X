document.addEventListener('DOMContentLoaded', async () => {

    // 1. Initialize Particles
    const particlesContainer = document.getElementById('tsparticles');
    if (particlesContainer && window.tsParticles) {
        await window.tsParticles.load("tsparticles", {
            fpsLimit: 60,
            background: { color: "transparent" },
            particles: {
                number: { value: 160 },
                color: { value: "#ffffff" },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1 }
                },
                size: {
                    value: 3,
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
            const service = document.getElementById('service').value;
            const requirements = document.getElementById('requirements').value;

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
});
