const showPasswordCheckbox = document.getElementById('showPassword');
const passwordd = document.querySelectorAll('.password');

passwordd.forEach(element => {
    
    showPasswordCheckbox.addEventListener('change', function() {
        const passwordFieldType = this.checked ? 'text' : 'password';
        element.type = passwordFieldType;
    });
});