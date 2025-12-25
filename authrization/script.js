document.addEventListener('DOMContentLoaded', function() {
            const signUpButton = document.getElementById('signUpButton');
            const signInButton = document.getElementById('signInButton');
            const signUpForm = document.getElementById('signup');
            const signInForm = document.getElementById('signIn');
            const submitSignUp = document.getElementById('submitSignUp');
            const submitSignIn = document.getElementById('submitSignIn');
            const signUpMessage = document.getElementById('signUpMessage');
            const signInMessage = document.getElementById('signInMessage');

            // Toggle between forms
            signUpButton.addEventListener('click', function() {
                signInForm.style.display = 'none';
                signUpForm.style.display = 'block';
            });

            signInButton.addEventListener('click', function() {
                signUpForm.style.display = 'none';
                signInForm.style.display = 'block';
            });

            // Form validation
            submitSignUp.addEventListener('click', function(e) {
                e.preventDefault();
                
                const firstName = document.getElementById('fName').value;
                const lastName = document.getElementById('lName').value;
                const email = document.getElementById('rEmail').value;
                const password = document.getElementById('rPassword').value;
                
                if (!firstName || !lastName || !email || !password) {
                    showMessage(signUpMessage, 'Please fill in all fields', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showMessage(signUpMessage, 'Password must be at least 6 characters', 'error');
                    return;
                }
                
                // Simulate successful registration
                showMessage(signUpMessage, 'Account created successfully! Redirecting...', 'success');
                
                // In real app, this would redirect to main app
                setTimeout(() => {
                    alert('Registration successful! Welcome to Campus AI Assistant');
                    // window.location.href = 'dashboard.html'; // Redirect to main app
                }, 1500);
            });

            submitSignIn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (!email || !password) {
                    showMessage(signInMessage, 'Please fill in all fields', 'error');
                    return;
                }
                
                // Simulate successful login
                showMessage(signInMessage, 'Signing in...', 'success');
                
                // In real app, this would authenticate and redirect
                setTimeout(() => {
                    alert('Login successful! Welcome back to Campus AI Assistant');
                    // window.location.href = 'dashboard.html'; // Redirect to main app
                }, 1500);
            });

            // Social login buttons
            document.querySelectorAll('.social-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
                    alert(`In a real application, this would connect to ${platform} authentication.`);
                });
            });

            // Helper function to show messages
            function showMessage(element, text, type) {
                element.textContent = text;
                element.className = `messageDiv ${type}`;
                element.style.display = 'block';
                
                setTimeout(() => {
                    element.style.display = 'none';
                }, 5000);
            }

            // Add floating animation to features
            const features = document.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                feature.style.animationDelay = `${index * 0.2}s`;
            });
        });

   document.getElementById("guestLoginBtn")?.addEventListener("click", () => {
  sessionStorage.setItem("guest", "true");
  window.location.href = "../Landing/index.html";
});
