document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if(contactForm && formResponse) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };

            try {
                const res = await fetch('/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if(res.ok) {
                    contactForm.reset();
                    formResponse.style.color = 'green';
                    formResponse.textContent = '✅ Message sent successfully!';
                } else {
                    formResponse.style.color = 'red';
                    formResponse.textContent = (await res.json()).error || '❌ Failed to send message.';
                }
            } catch(err) {
                formResponse.style.color = 'red';
                formResponse.textContent = '❌ Error sending message.';
            }
        });
    }
});
