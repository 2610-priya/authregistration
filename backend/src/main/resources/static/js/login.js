/**
 * Login Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard page: if already logged in, go to dashboard
  session.guardAuthPages();

  // DOM Elements
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberInput = document.getElementById('remember-me');

  // Validation Messages
  const emailVal = document.getElementById('email-validation');
  const passwordVal = document.getElementById('password-validation');

  // Eye Toggle
  const togglePassBtn = document.getElementById('password-toggle-btn');
  const passEyeIcon = document.getElementById('password-eye-icon');

  // Submit states
  const btnSubmit = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const formAlert = document.getElementById('form-alert');
  const alertMessage = document.getElementById('alert-message');
  const forgotPasswordLink = document.getElementById('forgot-password-link');

  /* ==========================================
     CHECK REGISTERED QUERY REDIRECT
     ========================================== */
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('registered') === 'true') {
    formAlert.className = 'form-alert form-alert-success';
    alertMessage.textContent = 'Account created successfully! Please sign in.';
    formAlert.querySelector('i').className = 'fa-solid fa-circle-check';
  }

  /* ==========================================
     PASSWORD VISIBILITY TOGGLE
     ========================================== */
  togglePassBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passEyeIcon.className = 'fa-regular fa-eye-slash';
    } else {
      passwordInput.type = 'password';
      passEyeIcon.className = 'fa-regular fa-eye';
    }
  });

  /* ==========================================
     REAL-TIME FIELD VALIDATIONS
     ========================================== */
  
  // 1. Email Validation
  function validateEmail() {
    const email = emailInput.value.trim();
    if (email === '') {
      emailVal.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Please enter your email.';
      emailVal.classList.add('active');
      emailInput.style.borderColor = 'hsl(var(--danger))';
      return false;
    } else if (!validateEmailFormat(email)) {
      emailVal.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Please enter a valid email address.';
      emailVal.classList.add('active');
      emailInput.style.borderColor = 'hsl(var(--danger))';
      return false;
    }
    emailVal.classList.remove('active');
    emailInput.style.borderColor = '';
    return true;
  }
  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', () => {
    if (validateEmailFormat(emailInput.value.trim())) validateEmail();
  });

  // 2. Password Validation
  function validatePassword() {
    const pass = passwordInput.value;
    if (pass === '') {
      passwordVal.classList.add('active');
      passwordInput.style.borderColor = 'hsl(var(--danger))';
      return false;
    }
    passwordVal.classList.remove('active');
    passwordInput.style.borderColor = '';
    return true;
  }
  passwordInput.addEventListener('blur', validatePassword);
  passwordInput.addEventListener('input', () => {
    if (passwordInput.value !== '') validatePassword();
  });

  /* ==========================================
     FORGOT PASSWORD MOCK ACTION
     ========================================== */
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    formAlert.className = 'form-alert form-alert-success';
    alertMessage.textContent = 'Demo Alert: A password reset link has been dispatched to your email!';
    formAlert.querySelector('i').className = 'fa-solid fa-envelope';
    
    // Auto fade alert after 5 seconds
    setTimeout(() => {
      formAlert.className = 'form-alert hide';
    }, 5000);
  });

  /* ==========================================
     FORM SUBMIT HANDLER
     ========================================== */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Trigger validations
    const isEmailValid = validateEmail();
    const isPassValid = validatePassword();

    if (!isEmailValid || !isPassValid) {
      if (!isEmailValid) emailInput.focus();
      else if (!isPassValid) passwordInput.focus();
      return;
    }

    // Submit state animation
    formAlert.className = 'form-alert hide';
    btnSubmit.disabled = true;
    btnText.textContent = 'Signing In...';
    btnSpinner.classList.remove('hide');

    const email = emailInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberInput.checked;

    // Validate against Spring Boot API
    const result = await db.validateUser(email, password);

    if (result && !result.error) {
      // Start session
      session.start(result, rememberMe);

      // Success Alert
      formAlert.className = 'form-alert form-alert-success';
      alertMessage.textContent = 'Login successful! Entering dashboard...';
      formAlert.querySelector('i').className = 'fa-solid fa-circle-check';

      form.reset();

      // Redirect to protected dashboard page
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1200);
    } else {
      // Show credentials error alert
      formAlert.className = 'form-alert form-alert-danger';
      alertMessage.textContent = result ? result.error : 'Incorrect email or password. Please try again.';
      formAlert.querySelector('i').className = 'fa-solid fa-triangle-exclamation';

      // Reset submit button state
      btnSubmit.disabled = false;
      btnText.textContent = 'Sign In';
      btnSpinner.classList.add('hide');
    }
  });
});
