window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        emailjs.sendForm('service_onegvkv', 'template_49v7n0y', this)
            .then(() => {
                console.log('SUCCESS!');
                //hide contact-form and show contactSuccess
                document.getElementById('contact-form').style.display = 'none';
                document.getElementById('contactSuccess').style.display = 'block';
            }, (error) => {
                console.log('FAILED...', error);
                //hide contact-form and show contactError
                document.getElementById('contact-form').style.display = 'none';
                document.getElementById('contactError').style.display = 'block';
            });
    });
}