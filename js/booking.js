// NextAgent.tech - Booking JavaScript
// ====================================

(function() {
    'use strict';
    
    let currentLang = 'ar';
    let currentStep = 1;

    // ============ Initialize Booking ============
    document.addEventListener('DOMContentLoaded', () => {
        // Check saved language
        const savedLang = localStorage.getItem('language') || 'ar';
        currentLang = savedLang;

    // Set minimum date to today
    const dateInput = document.querySelector('input[name="preferred_date"]');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

        // Setup step navigation
        setupStepNavigation();

        // Setup form submission
        setupBookingForm();
    });

    // ============ Setup Step Navigation ============
    function setupStepNavigation() {
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    goToStep(currentStep + 1);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToStep(currentStep - 1);
            });
        }
    }

    // ============ Go to Step ============
    function goToStep(step) {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(s => s.classList.remove('active'));

        // Show target step
        const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) {
            targetStep.classList.add('active');
            currentStep = step;

            // Update progress
            updateProgress(step);

            // Scroll to top of form
            document.querySelector('.booking-form-wrapper').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // ============ Update Progress ============
    function updateProgress(step) {
        const progressSteps = document.querySelectorAll('.progress-step');
        
        progressSteps.forEach((ps, index) => {
            if (index < step) {
                ps.classList.add('active');
            } else {
                ps.classList.remove('active');
            }
        });
    }

    // ============ Validate Step ============
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentStepElement) return false;
        
        const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value ? input.value.trim() : '';
            if (!value) {
                isValid = false;
                input.style.borderColor = '#e63946';
                
                // Reset border color on input
                input.addEventListener('input', function() {
                    this.style.borderColor = '#e9ecef';
                }, { once: true });
            }
        });

        if (!isValid) {
            const message = currentLang === 'ar' 
                ? 'يرجى ملء جميع الحقول المطلوبة' 
                : 'Please fill all required fields';
            showMessage(message, 'error');
        }

        return isValid;
    }

    // ============ Setup Booking Form ============
    function setupBookingForm() {
        const form = document.getElementById('bookingForm');
        
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (!validateStep(2)) {
                    return;
                }

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                
                // Disable button and show loading
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>${currentLang === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</span>`;

                const formData = new FormData(form);
                const data = {
                    full_name: formData.get('full_name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    company_name: formData.get('company_name'),
                    service_type: formData.get('service_type'),
                    preferred_date: formData.get('preferred_date'),
                    preferred_time: formData.get('preferred_time'),
                    notes: formData.get('notes') || '',
                    status: 'pending'
                };

                try {
                    const response = await fetch('tables/bookings', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        // Show success message
                        showSuccessModal(data);
                        
                        // Reset form
                        form.reset();
                        goToStep(1);
                    } else {
                        throw new Error('Booking failed');
                    }
                } catch (error) {
                    console.error('Error submitting booking:', error);
                    showMessage(
                        currentLang === 'ar'
                            ? 'حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى.'
                            : 'Error submitting booking. Please try again.',
                        'error'
                    );
                } finally {
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        }
    }

    // ============ Show Message ============
    function showMessage(message, type) {
        const messageDiv = document.getElementById('bookingMessage');
        
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `form-message ${type}`;
            messageDiv.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // ============ Show Success Modal ============
    function showSuccessModal(bookingData) {
        const modal = document.createElement('div');
        modal.className = 'success-modal active';
        
        const serviceNames = {
        'ai-agents': currentLang === 'ar' ? 'وكلاء الذكاء الاصطناعي' : 'AI Agents',
        'automation': currentLang === 'ar' ? 'أتمتة العمليات' : 'Process Automation',
        'chatbot': currentLang === 'ar' ? 'شات بوت ذكي' : 'Smart Chatbot',
        'data-analytics': currentLang === 'ar' ? 'تحليل البيانات' : 'Data Analytics',
        'appointment': currentLang === 'ar' ? 'إدارة المواعيد' : 'Appointment Management',
        'marketing': currentLang === 'ar' ? 'أتمتة التسويق' : 'Marketing Automation',
        'custom': currentLang === 'ar' ? 'حل مخصص' : 'Custom Solution'
        };
        
        const serviceName = serviceNames[bookingData.service_type] || bookingData.service_type;
        const formattedDate = new Date(bookingData.preferred_date).toLocaleDateString(
        currentLang === 'ar' ? 'ar-EG' : 'en-US',
        { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        );
        
        modal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h2>${currentLang === 'ar' ? 'تم الحجز بنجاح!' : 'Booking Confirmed!'}</h2>
            <p>${currentLang === 'ar' 
                ? 'شكراً لك! تم تأكيد حجزك. سنرسل لك رسالة تأكيد على بريدك الإلكتروني قريباً.' 
                : 'Thank you! Your booking has been confirmed. We will send you a confirmation email soon.'}</p>
            
            <div class="success-details">
                <p><strong>${currentLang === 'ar' ? 'الخدمة:' : 'Service:'}</strong> ${serviceName}</p>
                <p><strong>${currentLang === 'ar' ? 'التاريخ:' : 'Date:'}</strong> ${formattedDate}</p>
                <p><strong>${currentLang === 'ar' ? 'الوقت:' : 'Time:'}</strong> ${bookingData.preferred_time}</p>
                <p><strong>${currentLang === 'ar' ? 'البريد:' : 'Email:'}</strong> ${bookingData.email}</p>
            </div>
            
            <button class="btn btn-primary" onclick="closeSuccessModal()">
                ${currentLang === 'ar' ? 'حسناً، شكراً' : 'OK, Thanks'}
            </button>
        </div>
        `;
        
        document.body.appendChild(modal);
    }

    // ============ Close Success Modal ============
    window.closeSuccessModal = function() {
        const modal = document.querySelector('.success-modal');
        if (modal) {
            modal.remove();
        }
    };

})();