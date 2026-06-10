/**
 * Registration Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Guard page: if already logged in, go to dashboard
  session.guardAuthPages();

  // DOM Elements
  const form = document.getElementById('register-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirm-password');
  const termsInput = document.getElementById('terms');
  
  // Validation Messages
  const nameVal = document.getElementById('name-validation');
  const emailVal = document.getElementById('email-validation');
  const passwordVal = document.getElementById('password-validation');
  const confirmVal = document.getElementById('confirm-validation');
  const termsVal = document.getElementById('terms-validation');

  // Interactive Widgets
  const togglePassBtn = document.getElementById('password-toggle-btn');
  const toggleConfirmBtn = document.getElementById('confirm-password-toggle-btn');
  const passEyeIcon = document.getElementById('password-eye-icon');
  const confirmEyeIcon = document.getElementById('confirm-password-eye-icon');

  const strengthText = document.getElementById('strength-text');
  const strengthMeterBar = document.getElementById('strength-meter-bar');

  // Requirements checklist
  const reqLength = document.getElementById('req-length');
  const reqUpper = document.getElementById('req-upper');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');

  // Submit states
  const btnSubmit = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-text');
  const btnSpinner = document.getElementById('btn-spinner');
  const formAlert = document.getElementById('form-alert');
  const alertMessage = document.getElementById('alert-message');

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

  toggleConfirmBtn.addEventListener('click', () => {
    if (confirmInput.type === 'password') {
      confirmInput.type = 'text';
      confirmEyeIcon.className = 'fa-regular fa-eye-slash';
    } else {
      confirmInput.type = 'password';
      confirmEyeIcon.className = 'fa-regular fa-eye';
    }
  });

  /* ==========================================
     REAL-TIME FIELD VALIDATIONS
     ========================================== */
  
  // 1. Name Validation
  function validateName() {
    const val = nameInput.value.trim();
    if (val === '') {
      nameVal.classList.add('active');
      nameInput.style.borderColor = 'hsl(var(--danger))';
      return false;
    }
    nameVal.classList.remove('active');
    nameInput.style.borderColor = '';
    return true;
  }
  nameInput.addEventListener('blur', validateName);
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') validateName();
  });

  // 2. Email Validation
  function validateEmail() {
    const email = emailInput.value.trim();
    if (email === '') {
      emailVal.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Please enter an email address.';
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

  // 3. Password Validation (and live strength assessment)
  function evaluatePassword() {
    const pass = passwordInput.value;
    const strength = checkPasswordStrength(pass);

    // Update Strength Meter styling
    strengthMeterBar.className = 'strength-meter ' + (pass ? strength.colorClass : '');
    strengthText.textContent = pass ? strength.label : 'Very Weak';

    // Update checklist item icons and colors
    updateChecklistItem(reqLength, strength.checks.length);
    updateChecklistItem(reqUpper, strength.checks.hasUpper && strength.checks.hasLower);
    updateChecklistItem(reqNumber, strength.checks.hasNumber);
    updateChecklistItem(reqSpecial, strength.checks.hasSpecial);

    // Check overall strength criteria
    const isPassValid = strength.score >= 3 && strength.checks.length;
    if (isPassValid) {
      passwordVal.classList.remove('active');
      passwordInput.style.borderColor = '';
    }
    return isPassValid;
  }

  function updateChecklistItem(element, isValid) {
    const icon = element.querySelector('i');
    if (isValid) {
      element.classList.add('valid');
      icon.className = 'fa-solid fa-circle-check';
    } else {
      element.classList.remove('valid');
      icon.className = 'fa-regular fa-circle';
    }
  }

  passwordInput.addEventListener('input', evaluatePassword);
  passwordInput.addEventListener('blur', () => {
    const pass = passwordInput.value;
    if (pass === '') {
      passwordVal.classList.add('active');
      passwordInput.style.borderColor = 'hsl(var(--danger))';
    } else if (!evaluatePassword()) {
      passwordVal.classList.add('active');
      passwordInput.style.borderColor = 'hsl(var(--danger))';
    }
  });

  // 4. Confirm Password Validation
  function validateConfirmPassword() {
    const pass = passwordInput.value;
    const confirm = confirmInput.value;

    if (confirm === '') {
      confirmVal.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Please confirm your password.';
      confirmVal.classList.add('active');
      confirmInput.style.borderColor = 'hsl(var(--danger))';
      return false;
    } else if (pass !== confirm) {
      confirmVal.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Passwords do not match.';
      confirmVal.classList.add('active');
      confirmInput.style.borderColor = 'hsl(var(--danger))';
      return false;
    }
    confirmVal.classList.remove('active');
    confirmInput.style.borderColor = '';
    return true;
  }
  confirmInput.addEventListener('blur', validateConfirmPassword);
  confirmInput.addEventListener('input', () => {
    if (passwordInput.value === confirmInput.value) validateConfirmPassword();
  });

  // 5. Terms Agreement Check
  function validateTerms() {
    if (!termsInput.checked) {
      termsVal.classList.add('active');
      return false;
    }
    termsVal.classList.remove('active');
    return true;
  }
  termsInput.addEventListener('change', validateTerms);

  /* ==========================================
     FORM SUBMIT HANDLER
     ========================================== */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Trigger all validations
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPassValid = evaluatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    if (!isNameValid || !isEmailValid || !isPassValid || !isConfirmValid || !isTermsValid) {
      // Focus the first invalid element
      if (!isNameValid) nameInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else if (!isPassValid) passwordInput.focus();
      else if (!isConfirmValid) confirmInput.focus();
      return;
    }

    // Submit animation / state
    formAlert.className = 'form-alert hide';
    btnSubmit.disabled = true;
    btnText.textContent = 'Creating Account...';
    btnSpinner.classList.remove('hide');

    const payload = {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    };

    // Await async API call
    const result = await db.registerUser(payload);

    if (result.success) {
      // Show success alert
      formAlert.className = 'form-alert form-alert-success';
      alertMessage.textContent = 'Account created successfully! Redirecting...';
      formAlert.querySelector('i').className = 'fa-solid fa-circle-check';
      
      // Clear inputs
      form.reset();
      
      // Redirect to Login Page
      setTimeout(() => {
        window.location.href = 'login.html?registered=true';
      }, 1800);
    } else {
      // Show error alert from server response
      formAlert.className = 'form-alert form-alert-danger';
      alertMessage.textContent = result.message;
      formAlert.querySelector('i').className = 'fa-solid fa-triangle-exclamation';
      
      // Reset submit button state
      btnSubmit.disabled = false;
      btnText.textContent = 'Create Account';
      btnSpinner.classList.add('hide');
    }
  });
});
