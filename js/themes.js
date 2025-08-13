// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = 'enchanted';
        this.themes = {
            enchanted: {
                name: 'Floresta Encantada',
                icon: '🌲',
                particles: 'leaves',
                audio: 'forest-ambient.mp3',
                background: 'forest1.jpg'
            },
            castle: {
                name: 'Castelo Real',
                icon: '🏰',
                particles: 'sparkles',
                audio: 'castle-ambient.mp3',
                background: 'castle1.jpg'
            },
            starry: {
                name: 'Noite Estrelada',
                icon: '🌌',
                particles: 'stars',
                audio: 'night-ambient.mp3',
                background: 'starry1.jpg'
            },
            parchment: {
                name: 'Papel Antigo',
                icon: '📜',
                particles: 'dust',
                audio: 'library-ambient.mp3',
                background: 'parchment1.jpg'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadSavedTheme();
        this.bindEvents();
        this.updateThemeButtons();
    }
    
    bindEvents() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.switchTheme(theme);
                this.playThemeTransition();
            });
        });
    }
    
    switchTheme(themeName) {
        if (!this.themes[themeName] || themeName === this.currentTheme) return;
        
        const oldTheme = this.currentTheme;
        this.currentTheme = themeName;
        
        // Apply theme transition
        this.applyThemeTransition(oldTheme, themeName);
        
        // Update UI
        this.updateThemeButtons();
        
        // Update particles
        this.updateParticleSystem();
        
        // Update ambient audio
        this.updateAmbientAudio();
        
        // Save theme preference
        this.saveTheme();
        
        // Announce theme change
        this.announceThemeChange(themeName);
    }
    
    applyThemeTransition(oldTheme, newTheme) {
        const body = document.body;
        
        // Add transition class
        body.classList.add('theme-transitioning');
        
        // Remove old theme class
        body.classList.remove(`theme-${oldTheme}`);
        
        // Add new theme class
        body.classList.add(`theme-${newTheme}`);
        
        // Update background image
        this.updateBackgroundImage(newTheme);
        
        // Remove transition class after animation
        setTimeout(() => {
            body.classList.remove('theme-transitioning');
        }, 500);
    }
    
    updateBackgroundImage(theme) {
        const themeData = this.themes[theme];
        const body = document.body;
        
        // Create new background element
        const newBg = document.createElement('div');
        newBg.className = 'theme-background theme-background-new';
        newBg.style.backgroundImage = `url('img/backgrounds/${themeData.background}')`;
        
        // Add to body
        body.appendChild(newBg);
        
        // Fade in new background
        setTimeout(() => {
            newBg.classList.add('active');
        }, 50);
        
        // Remove old background after transition
        setTimeout(() => {
            const oldBg = document.querySelector('.theme-background:not(.theme-background-new)');
            if (oldBg) {
                oldBg.remove();
            }
            newBg.classList.remove('theme-background-new');
        }, 600);
    }
    
    updateThemeButtons() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === this.currentTheme) {
                btn.classList.add('active');
            }
        });
    }
    
    updateParticleSystem() {
        if (window.particleSystem) {
            const particleType = this.themes[this.currentTheme].particles;
            window.particleSystem.setParticleType(particleType);
        }
    }
    
    updateAmbientAudio() {
        const audio = document.getElementById('ambient-audio');
        const themeAudio = this.themes[this.currentTheme].audio;
        
        if (audio.src !== `audio/${themeAudio}`) {
            const wasPlaying = !audio.paused;
            audio.src = `audio/${themeAudio}`;
            
            if (wasPlaying) {
                audio.play().catch(console.error);
            }
        }
    }
    
    playThemeTransition() {
        // Create magical transition effect
        this.createMagicalTransition();
    }
    
    createMagicalTransition() {
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'theme-transition-overlay';
        transitionOverlay.innerHTML = `
            <div class="transition-effect">
                <div class="magic-circle">
                    <div class="magic-sparkle"></div>
                    <div class="magic-sparkle"></div>
                    <div class="magic-sparkle"></div>
                    <div class="magic-sparkle"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(transitionOverlay);
        
        // Animate transition
        setTimeout(() => {
            transitionOverlay.classList.add('active');
        }, 50);
        
        // Remove after animation
        setTimeout(() => {
            transitionOverlay.remove();
        }, 1000);
    }
    
    announceThemeChange(theme) {
        const themeName = this.themes[theme].name;
        const announcement = document.createElement('div');
        announcement.className = 'theme-announcement';
        announcement.innerHTML = `
            <div class="announcement-content">
                <span class="theme-icon">${this.themes[theme].icon}</span>
                <span class="theme-name">${themeName}</span>
            </div>
        `;
        
        document.body.appendChild(announcement);
        
        // Show announcement
        setTimeout(() => {
            announcement.classList.add('show');
        }, 100);
        
        // Hide and remove announcement
        setTimeout(() => {
            announcement.classList.remove('show');
            setTimeout(() => {
                announcement.remove();
            }, 300);
        }, 2000);
    }
    
    getThemeColors(theme) {
        const colorMaps = {
            enchanted: {
                primary: '#2d5016',
                accent: '#7fbc69',
                particle: '#7fbc69'
            },
            castle: {
                primary: '#4a0e2b',
                accent: '#d4af37',
                particle: '#d4af37'
            },
            starry: {
                primary: '#0f1419',
                accent: '#64b5f6',
                particle: '#64b5f6'
            },
            parchment: {
                primary: '#5d4e37',
                accent: '#cd853f',
                particle: '#cd853f'
            }
        };
        
        return colorMaps[theme] || colorMaps.enchanted;
    }
    
    applyThemeToStory(storyId) {
        // Apply story-specific theme variations
        const storyThemeMap = {
            'snow-white': { 
                particles: 'snow',
                effect: 'winter'
            },
            'beauty-beast': { 
                particles: 'petals',
                effect: 'romantic'
            },
            'sleeping-beauty': { 
                particles: 'leaves',
                effect: 'dreamy'
            },
            'cinderella': { 
                particles: 'sparkles',
                effect: 'magical'
            },
            'rapunzel': { 
                particles: 'sparkles',
                effect: 'tower'
            },
            'red-riding-hood': { 
                particles: 'leaves',
                effect: 'forest'
            },
            'princess-frog': { 
                particles: 'sparkles',
                effect: 'pond'
            }
        };
        
        const storyTheme = storyThemeMap[storyId];
        if (storyTheme && window.particleSystem) {
            window.particleSystem.setStoryEffect(storyTheme);
        }
    }
    
    createCustomCursors() {
        const cursors = {
            feather: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#654321">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            `,
            wand: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD700">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4C9 4.55 8.55 5 8 5S7 4.55 7 4M11.5 1L10.79 2.44L9.35 3.15L10.79 3.86L11.5 5.29L12.21 3.86L13.65 3.15L12.21 2.44L11.5 1M20 12C20 16.42 16.42 20 12 20S4 16.42 4 12 7.58 4 12 4 20 7.58 20 12M16 12C16 9.79 14.21 8 12 8S8 9.79 8 12 9.79 16 12 16 16 14.21 16 12Z"/>
                </svg>
            `,
            flower: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF69B4">
                    <path d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12 6.5 22 12 22M15.5 8C16.3 8 17 8.7 17 9.5S16.3 11 15.5 11 14 10.3 14 9.5 14.7 8 15.5 8M8.5 8C9.3 8 10 8.7 10 9.5S9.3 11 8.5 11 7 10.3 7 9.5 7.7 8 8.5 8M12 17.5C10.1 17.5 8.5 15.9 8.5 14H15.5C15.5 15.9 13.9 17.5 12 17.5Z"/>
                </svg>
            `
        };
        
        return cursors;
    }
    
    enhanceAccessibility() {
        // Add theme-specific ARIA labels
        document.querySelectorAll('.theme-btn').forEach(btn => {
            const theme = btn.dataset.theme;
            const themeName = this.themes[theme].name;
            btn.setAttribute('aria-label', `Alterar para tema ${themeName}`);
        });
        
        // Announce theme changes to screen readers
        const announcer = document.createElement('div');
        announcer.id = 'theme-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);
    }
    
    announceToScreenReader(message) {
        const announcer = document.getElementById('theme-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    }
    
    handleReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // Disable theme transition animations
            document.documentElement.style.setProperty('--theme-transition-duration', '0.01s');
            
            // Disable particle effects
            if (window.particleSystem) {
                window.particleSystem.setReducedMotion(true);
            }
        }
    }
    
    loadSavedTheme() {
        try {
            const saved = localStorage.getItem('fairy-tale-theme');
            if (saved && this.themes[saved]) {
                this.currentTheme = saved;
                document.body.classList.add(`theme-${saved}`);
            } else {
                document.body.classList.add(`theme-${this.currentTheme}`);
            }
        } catch (error) {
            console.error('Error loading theme:', error);
            document.body.classList.add(`theme-${this.currentTheme}`);
        }
    }
    
    saveTheme() {
        try {
            localStorage.setItem('fairy-tale-theme', this.currentTheme);
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    }
    
    exportThemePreferences() {
        return {
            currentTheme: this.currentTheme,
            timestamp: Date.now()
        };
    }
    
    importThemePreferences(data) {
        if (data && data.currentTheme && this.themes[data.currentTheme]) {
            this.switchTheme(data.currentTheme);
        }
    }
}

// CSS for theme transitions and effects
const themeStyles = `
    .theme-transitioning * {
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }
    
    .theme-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        opacity: 0;
        z-index: -1;
        transition: opacity 0.5s ease;
    }
    
    .theme-background.active {
        opacity: 0.3;
    }
    
    .theme-transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, transparent 20%, rgba(255, 255, 255, 0.1) 80%);
        z-index: 9999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    
    .theme-transition-overlay.active {
        opacity: 1;
    }
    
    .transition-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .magic-circle {
        width: 100px;
        height: 100px;
        border: 2px solid currentColor;
        border-radius: 50%;
        position: relative;
        animation: rotate 2s linear infinite;
    }
    
    .magic-sparkle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: currentColor;
        border-radius: 50%;
        animation: sparkle 1s ease-in-out infinite;
    }
    
    .magic-sparkle:nth-child(1) {
        top: -3px;
        left: 50%;
        transform: translateX(-50%);
        animation-delay: 0s;
    }
    
    .magic-sparkle:nth-child(2) {
        right: -3px;
        top: 50%;
        transform: translateY(-50%);
        animation-delay: 0.25s;
    }
    
    .magic-sparkle:nth-child(3) {
        bottom: -3px;
        left: 50%;
        transform: translateX(-50%);
        animation-delay: 0.5s;
    }
    
    .magic-sparkle:nth-child(4) {
        left: -3px;
        top: 50%;
        transform: translateY(-50%);
        animation-delay: 0.75s;
    }
    
    .theme-announcement {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .theme-announcement.show {
        transform: translateX(0);
    }
    
    .announcement-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .theme-icon {
        font-size: 1.2rem;
    }
    
    .theme-name {
        font-family: var(--title-font);
        font-weight: 600;
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes sparkle {
        0%, 100% {
            opacity: 0;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .theme-transitioning *,
        .theme-background,
        .theme-transition-overlay,
        .theme-announcement {
            transition: none !important;
            animation: none !important;
        }
        
        .magic-circle {
            animation: none !important;
        }
    }
`;

// Inject theme styles
const styleSheet = document.createElement('style');
styleSheet.textContent = themeStyles;
document.head.appendChild(styleSheet);

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // Enhance accessibility
    window.themeManager.enhanceAccessibility();
    window.themeManager.handleReducedMotion();
    
    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(() => {
        window.themeManager.handleReducedMotion();
    });
});
