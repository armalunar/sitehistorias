// Particle Animation System
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particles-container');
        this.particles = [];
        this.particleTypes = {
            leaves: {
                shapes: ['🍃', '🍂'],
                colors: ['#7fbc69', '#4a7c59', '#2d5016'],
                size: [15, 25],
                speed: [0.5, 1.5],
                rotation: true,
                sway: true
            },
            sparkles: {
                shapes: ['✨', '⭐', '💫'],
                colors: ['#d4af37', '#ffd700', '#fff'],
                size: [10, 20],
                speed: [0.3, 1],
                twinkle: true,
                glow: true
            },
            stars: {
                shapes: ['⭐', '✦', '✧'],
                colors: ['#64b5f6', '#42a5f5', '#fff'],
                size: [8, 18],
                speed: [0.2, 0.8],
                twinkle: true,
                trail: true
            },
            dust: {
                shapes: ['•', '·', '◦'],
                colors: ['#cd853f', '#deb887', '#f5deb3'],
                size: [3, 8],
                speed: [0.1, 0.5],
                float: true,
                fade: true
            },
            snow: {
                shapes: ['❄', '❅', '❆'],
                colors: ['#fff', '#e8f3ff', '#b3d9ff'],
                size: [10, 20],
                speed: [0.5, 1.2],
                drift: true,
                accumulate: false
            },
            petals: {
                shapes: ['🌸', '🌺', '🌷'],
                colors: ['#ffb6c1', '#ff69b4', '#dda0dd'],
                size: [12, 22],
                speed: [0.4, 1],
                spiral: true,
                gentle: true
            }
        };
        
        this.currentType = 'leaves';
        this.isActive = true;
        this.reducedMotion = false;
        this.maxParticles = 50;
        this.particlePool = [];
        
        this.init();
    }
    
    init() {
        this.createParticlePool();
        this.bindEvents();
        this.start();
    }
    
    createParticlePool() {
        // Pre-create particles for performance
        for (let i = 0; i < this.maxParticles; i++) {
            const particle = this.createParticleElement();
            particle.style.display = 'none';
            this.container.appendChild(particle);
            this.particlePool.push(particle);
        }
    }
    
    createParticleElement() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.pointerEvents = 'none';
        particle.style.userSelect = 'none';
        particle.style.zIndex = '1';
        return particle;
    }
    
    getParticleFromPool() {
        return this.particlePool.find(p => p.style.display === 'none');
    }
    
    returnParticleToPool(particle) {
        particle.style.display = 'none';
        particle.style.transform = '';
        particle.classList.remove('active', 'twinkling', 'glowing');
        this.particles = this.particles.filter(p => p.element !== particle);
    }
    
    bindEvents() {
        // Pause particles when window is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    start() {
        if (!this.isActive || this.reducedMotion) return;
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
        this.spawnInterval = setInterval(() => this.spawnParticle(), 300);
    }
    
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        
        this.clearAllParticles();
    }
    
    pause() {
        this.isActive = false;
        this.stop();
    }
    
    resume() {
        this.isActive = true;
        this.start();
    }
    
    setParticleType(type) {
        if (this.particleTypes[type]) {
            this.currentType = type;
            this.clearAllParticles();
        }
    }
    
    setStoryEffect(storyTheme) {
        if (storyTheme.particles && this.particleTypes[storyTheme.particles]) {
            this.setParticleType(storyTheme.particles);
            this.applyStoryEffect(storyTheme.effect);
        }
    }
    
    applyStoryEffect(effect) {
        const effects = {
            winter: () => {
                this.maxParticles = 70;
                this.setParticleType('snow');
            },
            romantic: () => {
                this.maxParticles = 40;
                this.setParticleType('petals');
            },
            magical: () => {
                this.maxParticles = 60;
                this.setParticleType('sparkles');
            },
            dreamy: () => {
                this.maxParticles = 30;
                this.setParticleType('dust');
            }
        };
        
        if (effects[effect]) {
            effects[effect]();
        }
    }
    
    spawnParticle() {
        if (!this.isActive || this.reducedMotion) return;
        if (this.particles.length >= this.maxParticles) return;
        
        const particle = this.getParticleFromPool();
        if (!particle) return;
        
        const type = this.particleTypes[this.currentType];
        const particleData = this.initializeParticle(particle, type);
        
        this.particles.push(particleData);
        particle.style.display = 'block';
    }
    
    initializeParticle(element, type) {
        const shapes = type.shapes;
        const colors = type.colors;
        const size = this.randomBetween(type.size[0], type.size[1]);
        const speed = this.randomBetween(type.speed[0], type.speed[1]);
        
        const particleData = {
            element,
            x: Math.random() * window.innerWidth,
            y: -50,
            size,
            speed,
            rotation: 0,
            rotationSpeed: type.rotation ? this.randomBetween(-2, 2) : 0,
            opacity: Math.random() * 0.8 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            type: this.currentType,
            life: 1.0,
            decay: 0.001 + Math.random() * 0.002,
            swayOffset: Math.random() * Math.PI * 2,
            swayAmplitude: type.sway ? this.randomBetween(10, 30) : 0,
            twinkleOffset: Math.random() * Math.PI * 2,
            spiralRadius: type.spiral ? this.randomBetween(5, 15) : 0,
            spiralSpeed: type.spiral ? this.randomBetween(0.05, 0.1) : 0
        };
        
        this.updateParticleAppearance(particleData);
        return particleData;
    }
    
    updateParticleAppearance(particle) {
        const { element, x, y, size, rotation, opacity, color, shape } = particle;
        
        element.textContent = shape;
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.fontSize = size + 'px';
        element.style.color = color;
        element.style.opacity = opacity;
        element.style.transform = `rotate(${rotation}deg)`;
        
        // Apply special effects
        this.applyParticleEffects(particle);
    }
    
    applyParticleEffects(particle) {
        const type = this.particleTypes[particle.type];
        const element = particle.element;
        
        // Glow effect
        if (type.glow) {
            element.style.textShadow = `0 0 10px ${particle.color}, 0 0 20px ${particle.color}`;
        }
        
        // Twinkle effect
        if (type.twinkle) {
            const twinkleIntensity = (Math.sin(Date.now() * 0.005 + particle.twinkleOffset) + 1) / 2;
            element.style.opacity = particle.opacity * twinkleIntensity;
        }
        
        // Trail effect
        if (type.trail) {
            element.style.boxShadow = `0 -5px 10px ${particle.color}40`;
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.particles = this.particles.filter(particle => {
            this.updateParticle(particle);
            return particle.life > 0 && particle.y < window.innerHeight + 100;
        });
        
        // Clean up off-screen particles
        this.particles.forEach(particle => {
            if (particle.life <= 0 || particle.y > window.innerHeight + 100) {
                this.returnParticleToPool(particle.element);
            }
        });
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    updateParticle(particle) {
        const type = this.particleTypes[particle.type];
        
        // Update position
        particle.y += particle.speed;
        
        // Apply movement patterns
        if (type.sway) {
            particle.x += Math.sin((particle.y * 0.01) + particle.swayOffset) * particle.swayAmplitude * 0.1;
        }
        
        if (type.drift) {
            particle.x += (Math.random() - 0.5) * 0.5;
        }
        
        if (type.spiral) {
            const spiralX = Math.sin(particle.y * particle.spiralSpeed) * particle.spiralRadius;
            particle.x += spiralX * 0.1;
        }
        
        if (type.float) {
            particle.y += Math.sin(particle.y * 0.01) * 0.2;
        }
        
        // Update rotation
        if (particle.rotationSpeed) {
            particle.rotation += particle.rotationSpeed;
        }
        
        // Update life and opacity
        particle.life -= particle.decay;
        if (type.fade) {
            particle.opacity = particle.life;
        }
        
        // Boundary check
        if (particle.x < -50) particle.x = window.innerWidth + 50;
        if (particle.x > window.innerWidth + 50) particle.x = -50;
        
        this.updateParticleAppearance(particle);
    }
    
    updateForStory(storyId) {
        // Story-specific particle configurations
        const storyConfigs = {
            'snow-white': { type: 'snow', intensity: 1.5 },
            'beauty-beast': { type: 'petals', intensity: 1.2 },
            'sleeping-beauty': { type: 'leaves', intensity: 0.8 },
            'cinderella': { type: 'sparkles', intensity: 1.3 },
            'rapunzel': { type: 'sparkles', intensity: 1.0 },
            'red-riding-hood': { type: 'leaves', intensity: 1.1 },
            'princess-frog': { type: 'sparkles', intensity: 0.9 }
        };
        
        const config = storyConfigs[storyId];
        if (config) {
            this.setParticleType(config.type);
            this.maxParticles = Math.floor(50 * config.intensity);
        }
    }
    
    setReducedMotion(enabled) {
        this.reducedMotion = enabled;
        if (enabled) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    handleResize() {
        // Update particle positions on window resize
        this.particles.forEach(particle => {
            if (particle.x > window.innerWidth) {
                particle.x = window.innerWidth - 50;
            }
        });
    }
    
    clearAllParticles() {
        this.particles.forEach(particle => {
            this.returnParticleToPool(particle.element);
        });
        this.particles = [];
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    createSpecialEffect(effectName, duration = 3000) {
        const effects = {
            burst: () => this.createBurstEffect(),
            spiral: () => this.createSpiralEffect(),
            cascade: () => this.createCascadeEffect(),
            bloom: () => this.createBloomEffect()
        };
        
        if (effects[effectName]) {
            effects[effectName]();
            setTimeout(() => {
                this.setParticleType(this.currentType);
            }, duration);
        }
    }
    
    createBurstEffect() {
        const center = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = this.getParticleFromPool();
                if (particle) {
                    const angle = (i / 20) * Math.PI * 2;
                    const particleData = this.initializeParticle(particle, this.particleTypes.sparkles);
                    particleData.x = center.x;
                    particleData.y = center.y;
                    particleData.velocityX = Math.cos(angle) * 3;
                    particleData.velocityY = Math.sin(angle) * 3;
                    
                    this.particles.push(particleData);
                    particle.style.display = 'block';
                }
            }, i * 50);
        }
    }
    
    createCascadeEffect() {
        const positions = [];
        for (let i = 0; i < window.innerWidth; i += 50) {
            positions.push(i);
        }
        
        positions.forEach((x, index) => {
            setTimeout(() => {
                const particle = this.getParticleFromPool();
                if (particle) {
                    const particleData = this.initializeParticle(particle, this.particleTypes[this.currentType]);
                    particleData.x = x;
                    particleData.y = -50;
                    particleData.speed *= 2;
                    
                    this.particles.push(particleData);
                    particle.style.display = 'block';
                }
            }, index * 100);
        });
    }
    
    getPerformanceMetrics() {
        return {
            particleCount: this.particles.length,
            maxParticles: this.maxParticles,
            isActive: this.isActive,
            currentType: this.currentType,
            reducedMotion: this.reducedMotion
        };
    }
}

// CSS for particle animations
const particleStyles = `
    .particle {
        transition: none;
        will-change: transform, opacity;
    }
    
    .particle.twinkling {
        animation: twinkle 2s ease-in-out infinite;
    }
    
    .particle.glowing {
        filter: drop-shadow(0 0 5px currentColor);
    }
    
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes spiral {
        0% { transform: rotate(0deg) translateX(10px) rotate(0deg); }
        100% { transform: rotate(360deg) translateX(10px) rotate(-360deg); }
    }
    
    /* Performance optimizations */
    #particles-container {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .particle {
            animation: none !important;
            transition: none !important;
        }
        
        #particles-container {
            display: none !important;
        }
    }
    
    /* GPU acceleration hints */
    .particle {
        transform: translate3d(0, 0, 0);
    }
`;

// Inject particle styles
const particleStyleSheet = document.createElement('style');
particleStyleSheet.textContent = particleStyles;
document.head.appendChild(particleStyleSheet);

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.particleSystem = new ParticleSystem();
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            window.particleSystem.setReducedMotion(true);
        }
    }, 500);
});
