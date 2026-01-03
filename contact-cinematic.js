// ===================================
// CINEMATIC CONTACT PAGE INTERACTIONS
// ===================================

import { gsap } from 'gsap';
import { initHolographicBackground } from './holographic-background.js';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Holographic Background
    initHolographicBackground();

    // 2. GSAP Reveal Sequence
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial State Check for elements
    const title = document.querySelector('.transmission-title');
    const label = document.querySelector('.transmission-label');
    const text = document.querySelector('.transmission-text');
    const methods = document.querySelectorAll('.method-item');

    if (title && label && text) {
        // Scramble Text Effect Function
        const scrambleText = (element, duration = 1) => {
            const originalText = element.innerText;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';

            let obj = { p: 0 };
            gsap.to(obj, {
                p: 1,
                duration: duration,
                ease: "none",
                onUpdate: () => {
                    let result = '';
                    for (let i = 0; i < originalText.length; i++) {
                        if (i < originalText.length * obj.p) {
                            result += originalText[i];
                        } else {
                            if (originalText[i] === ' ' || originalText[i] === '\n') {
                                result += originalText[i];
                            } else {
                                result += chars[Math.floor(Math.random() * chars.length)];
                            }
                        }
                    }
                    element.innerText = result;
                },
                onComplete: () => {
                    element.innerText = originalText; // Ensure clean finish
                }
            });
        };

        // Run Sequence
        tl.from(label, { x: -50, duration: 1 })
            .from(title, { scale: 0.9, duration: 1, onStart: () => scrambleText(title, 1.5) }, "-=0.5")
            .from(text, { y: 20, duration: 0.8 }, "-=0.5");

        if (methods.length) {
            tl.from(methods, {
                x: 30,
                stagger: 0.2,
                duration: 0.8
            }, "-=0.5");
        }
    }

    // 3. Magnetic & Glitch Hover Effects on Methods
    const buttons = document.querySelectorAll('.method-item');

    buttons.forEach(btn => {
        // Magnetic Pull
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });

            // Icon Glitch
            const icon = btn.querySelector('.method-icon');
            if (icon) {
                gsap.to(icon, {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.5) * 5,
                    duration: 0.1,
                    repeat: 1,
                    yoyo: true
                });
            }
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });

    // 4. Form Handling with Cinematic States
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Loading State
            submitBtn.classList.add('btn-loading');
            submitBtn.innerText = 'TRANSMITTING...';

            // Simulate Network Request
            setTimeout(() => {
                // 2. Success State
                submitBtn.classList.remove('btn-loading');
                submitBtn.classList.add('btn-success');
                submitBtn.innerText = 'TRANSMISSION COMPLETE';

                // Optional: Glitch effect on success
                gsap.to(submitBtn, {
                    x: 5,
                    duration: 0.1,
                    repeat: 5,
                    yoyo: true,
                    onComplete: () => {
                        gsap.to(submitBtn, { x: 0 });
                    }
                });

                // 3. Reset
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.classList.remove('btn-success');
                    submitBtn.innerText = 'INITIATE PROTOCOL';
                }, 3000);

            }, 2000);
        });
    }

});
