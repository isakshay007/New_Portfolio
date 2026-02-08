// ===================================
// Particle Constellation Background
// ===================================

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) {
            console.warn('Particles canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationFrameId = null;

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        // Ensure canvas is properly positioned as background
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        this.resize();
        this.createParticles();
    }

    resize() {
        // Use device pixel ratio for sharper rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        
        // Store actual dimensions
        this.width = rect.width;
        this.height = rect.height;
    }

    createParticles() {
        const area = this.width * this.height;
        const numberOfParticles = Math.floor(area / 9000);
        const particleCount = Math.max(30, Math.min(numberOfParticles, 150)); // Cap between 30-150
        
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }
    }

    addEventListeners() {
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });

        // Mouse move handler
        window.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        // Mouse leave handler
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Visibility change - pause animation when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.animate();
            }
        });
    }

    handleMouseMove(e) {
        // Check if mouse is over an interactive element
        const element = document.elementFromPoint(e.clientX, e.clientY);
        const interactiveSelectors = [
            '.navbar',
            '.about-card',
            '.skill-category',
            '.project-card',
            '.timeline-content',
            '.education-card',
            '.contact-wrapper',
            '.social-link',
            '.btn',
            '.skill-pill',
            '.skill-tag',
            '.project-tag',
            '.job-tag',
            '.theme-toggle',
            'button',
            'a'
        ];

        const isOverInteractive = element && interactiveSelectors.some(selector =>
            element.closest(selector)
        );

        if (isOverInteractive) {
            this.mouse.x = null;
            this.mouse.y = null;
        } else {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse, this.width, this.height);
            particle.draw(this.ctx);
        });

        // Draw connections
        this.connectParticles();

        // Continue animation
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    connectParticles() {
        const maxDistance = 120;
        const particleCount = this.particles.length;

        // Connect particles to each other
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - (distance / maxDistance)) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(128, 0, 255, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        // Connect particles to mouse
        if (this.mouse.x !== null && this.mouse.y !== null) {
            this.particles.forEach(particle => {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const opacity = (1 - (distance / this.mouse.radius)) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(107, 197, 248, ${opacity})`;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            });
        }
    }

    // Cleanup method
    destroy() {
        this.stopAnimation();
        window.removeEventListener('resize', this.resize);
        window.removeEventListener('mousemove', this.handleMouseMove);
        this.particles = [];
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 1.5 + 1; // Smaller particles (1-2.5px)
        this.baseSize = this.size;
        this.speedX = (Math.random() - 0.5) * 1.2; // Slower movement
        this.speedY = (Math.random() - 0.5) * 1.2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(128, 0, 255, 0.8)',   // Purple
            'rgba(207, 89, 230, 0.8)',  // Light purple
            'rgba(107, 197, 248, 0.8)', // Light blue
            'rgba(176, 243, 241, 0.6)'  // Teal
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse, canvasWidth, canvasHeight) {
        // Move particle
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges with dampening
        if (this.x <= 0 || this.x >= canvasWidth) {
            this.speedX *= -1;
            this.x = Math.max(0, Math.min(canvasWidth, this.x));
        }
        if (this.y <= 0 || this.y >= canvasHeight) {
            this.speedY *= -1;
            this.y = Math.max(0, Math.min(canvasHeight, this.y));
        }

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                // Push particles away from mouse
                const force = (mouse.radius - distance) / mouse.radius;
                const angle = Math.atan2(dy, dx);
                const pushX = Math.cos(angle) * force * 3;
                const pushY = Math.sin(angle) * force * 3;
                
                this.x -= pushX;
                this.y -= pushY;

                // Grow particle near mouse
                this.size = this.baseSize + force * 2;
            } else {
                // Gradually return to base size
                this.size += (this.baseSize - this.size) * 0.1;
            }
        } else {
            // Return to base size when mouse is not present
            this.size += (this.baseSize - this.size) * 0.1;
        }
    }

    draw(ctx) {
        // Save context state
        ctx.save();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill(); // Draw again with glow
        
        // Restore context state
        ctx.restore();
    }
}

// Initialize particle network when DOM is loaded
let particleNetwork = null;

document.addEventListener('DOMContentLoaded', () => {
    particleNetwork = new ParticleNetwork();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (particleNetwork) {
        particleNetwork.destroy();
    }
});