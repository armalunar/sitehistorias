// Main Application Logic
class FairyTaleApp {
    constructor() {
        this.currentStory = null;
        this.bookmarks = this.loadBookmarks();
        this.settings = this.loadSettings();
        this.searchResults = [];
        this.readingProgress = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.applySettings();
        this.updateBookmarkIndicators();
        this.hideLoadingScreen();
        this.initializeAudio();
    }
    
    bindEvents() {
        // Navigation events
        document.querySelectorAll('.story-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const storyId = card.dataset.story;
                this.openStory(storyId);
                this.playPageTurnSound();
            });
        });
        
        // Back to home button
        document.getElementById('back-to-home').addEventListener('click', () => {
            this.goHome();
            this.playPageTurnSound();
        });
        
        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => {
            this.openModal('search-modal');
        });
        
        document.getElementById('search-execute').addEventListener('click', () => {
            this.performSearch();
        });
        
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
        
        // Settings
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openModal('settings-modal');
        });
        
        // Settings controls
        document.getElementById('font-size-slider').addEventListener('input', (e) => {
            this.updateFontSize(e.target.value);
        });
        
        document.getElementById('font-family-select').addEventListener('change', (e) => {
            this.updateFontFamily(e.target.value);
        });
        
        document.getElementById('cursor-select').addEventListener('change', (e) => {
            this.updateCursor(e.target.value);
        });
        
        document.getElementById('particles-toggle').addEventListener('change', (e) => {
            this.toggleParticles(e.target.checked);
        });
        
        document.getElementById('reset-settings').addEventListener('click', () => {
            this.resetSettings();
        });
        
        // Audio toggle
        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.toggleAmbientAudio();
        });
        
        // Dark mode toggle
        document.getElementById('dark-mode-toggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Bookmark functionality
        document.getElementById('bookmark-btn').addEventListener('click', () => {
            this.toggleBookmark();
        });
        
        // Modal close events
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal').id);
            });
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
        
        // Reading progress tracking
        window.addEventListener('scroll', () => {
            this.updateReadingProgress();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    openStory(storyId) {
        if (!window.stories || !window.stories[storyId]) {
            console.error('Story not found:', storyId);
            return;
        }
        
        this.currentStory = storyId;
        const story = window.stories[storyId];
        
        // Update story content
        document.getElementById('story-title').textContent = story.title;
        document.getElementById('story-author').textContent = story.author;
        document.getElementById('story-text').innerHTML = story.content;
        
        // Switch to story page
        this.switchPage('story-page');
        
        // Update bookmark button state
        this.updateBookmarkButton();
        
        // Restore reading progress
        this.restoreReadingProgress();
        
        // Change theme effects for story
        this.applyStoryEffects(storyId);
        
        // Highlight famous quotes
        this.highlightFamousQuotes();
        
        // Lazy load story images
        this.lazyLoadImages();
    }
    
    goHome() {
        this.currentStory = null;
        this.switchPage('home-page');
        this.saveReadingProgress();
    }
    
    switchPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus first input if exists
        const firstInput = document.querySelector(`#${modalId} input`);
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    }
    
    performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query || query.length < 2) return;
        
        this.searchResults = [];
        const stories = window.stories;
        
        Object.keys(stories).forEach(storyId => {
            const story = stories[storyId];
            const content = story.content.toLowerCase();
            const queryLower = query.toLowerCase();
            
            if (content.includes(queryLower)) {
                // Find all matches with context
                const matches = this.findMatches(story.content, query);
                matches.forEach(match => {
                    this.searchResults.push({
                        storyId,
                        title: story.title,
                        context: match.context,
                        position: match.position
                    });
                });
            }
        });
        
        this.displaySearchResults();
    }
    
    findMatches(content, query) {
        const matches = [];
        const queryLower = query.toLowerCase();
        const contentLower = content.toLowerCase();
        let index = 0;
        
        while ((index = contentLower.indexOf(queryLower, index)) !== -1) {
            const start = Math.max(0, index - 50);
            const end = Math.min(content.length, index + query.length + 50);
            const context = content.substring(start, end);
            
            matches.push({
                context: context,
                position: index
            });
            
            index += query.length;
        }
        
        return matches;
    }
    
    displaySearchResults() {
        const resultsContainer = document.getElementById('search-results');
        
        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            return;
        }
        
        const resultsHTML = this.searchResults.map(result => {
            const highlightedContext = this.highlightSearchTerm(
                result.context, 
                document.getElementById('search-input').value
            );
            
            return `
                <div class="search-result" data-story="${result.storyId}" data-position="${result.position}">
                    <h4>${result.title}</h4>
                    <p>${highlightedContext}</p>
                </div>
            `;
        }).join('');
        
        resultsContainer.innerHTML = resultsHTML;
        
        // Bind click events to results
        document.querySelectorAll('.search-result').forEach(result => {
            result.addEventListener('click', () => {
                const storyId = result.dataset.story;
                const position = parseInt(result.dataset.position);
                
                this.closeModal('search-modal');
                this.openStory(storyId);
                
                // Scroll to search result
                setTimeout(() => {
                    this.scrollToPosition(position);
                }, 500);
            });
        });
    }
    
    highlightSearchTerm(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    scrollToPosition(position) {
        const storyContent = document.getElementById('story-text');
        const text = storyContent.textContent;
        
        if (position < text.length) {
            // Create a temporary element to find scroll position
            const range = document.createRange();
            const textNode = this.findTextNode(storyContent, position);
            if (textNode) {
                range.setStart(textNode.node, textNode.offset);
                const rect = range.getBoundingClientRect();
                window.scrollTo({
                    top: window.scrollY + rect.top - 100,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    findTextNode(element, position) {
        let currentPos = 0;
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            const nodeLength = node.textContent.length;
            if (currentPos + nodeLength >= position) {
                return {
                    node: node,
                    offset: position - currentPos
                };
            }
            currentPos += nodeLength;
        }
        
        return null;
    }
    
    updateFontSize(size) {
        document.documentElement.style.setProperty('--reader-font-size', size + 'px');
        document.getElementById('font-size-value').textContent = size + 'px';
        
        this.settings.fontSize = size;
        this.saveSettings();
    }
    
    updateFontFamily(family) {
        document.documentElement.style.setProperty('--reader-font-family', family);
        
        this.settings.fontFamily = family;
        this.saveSettings();
    }
    
    updateCursor(cursor) {
        document.body.className = document.body.className.replace(/cursor-\w+/g, '');
        if (cursor !== 'default') {
            document.body.classList.add(`cursor-${cursor}`);
        }
        
        this.settings.cursor = cursor;
        this.saveSettings();
    }
    
    toggleParticles(enabled) {
        if (window.particleSystem) {
            if (enabled) {
                window.particleSystem.start();
            } else {
                window.particleSystem.stop();
            }
        }
        
        this.settings.particlesEnabled = enabled;
        this.saveSettings();
    }
    
    toggleAmbientAudio() {
        const audio = document.getElementById('ambient-audio');
        const button = document.getElementById('audio-toggle');
        const icon = button.querySelector('i');
        
        if (audio.paused) {
            audio.play().catch(console.error);
            icon.className = 'fas fa-volume-up';
            button.title = 'Desligar Som';
        } else {
            audio.pause();
            icon.className = 'fas fa-volume-mute';
            button.title = 'Ligar Som';
        }
    }
    
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const button = document.getElementById('dark-mode-toggle');
        const icon = button.querySelector('i');
        
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun';
            button.title = 'Modo Claro';
            this.settings.darkMode = true;
        } else {
            icon.className = 'fas fa-moon';
            button.title = 'Modo Escuro';
            this.settings.darkMode = false;
        }
        
        this.saveSettings();
    }
    
    toggleBookmark() {
        if (!this.currentStory) return;
        
        if (this.bookmarks.includes(this.currentStory)) {
            this.bookmarks = this.bookmarks.filter(id => id !== this.currentStory);
        } else {
            this.bookmarks.push(this.currentStory);
        }
        
        this.saveBookmarks();
        this.updateBookmarkButton();
        this.updateBookmarkIndicators();
    }
    
    updateBookmarkButton() {
        const button = document.getElementById('bookmark-btn');
        const icon = button.querySelector('i');
        
        if (this.bookmarks.includes(this.currentStory)) {
            icon.className = 'fas fa-bookmark';
            button.classList.add('active');
        } else {
            icon.className = 'far fa-bookmark';
            button.classList.remove('active');
        }
    }
    
    updateBookmarkIndicators() {
        document.querySelectorAll('.bookmark-indicator').forEach(indicator => {
            const storyId = indicator.dataset.story;
            if (this.bookmarks.includes(storyId)) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    updateReadingProgress() {
        if (!this.currentStory) return;
        
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        
        // Update progress bar
        document.querySelector('.progress-fill').style.width = progress + '%';
        
        // Save progress
        this.readingProgress[this.currentStory] = {
            progress: progress,
            scrollPosition: scrollTop,
            timestamp: Date.now()
        };
        
        localStorage.setItem('fairy-tale-progress', JSON.stringify(this.readingProgress));
    }
    
    saveReadingProgress() {
        if (this.currentStory) {
            this.readingProgress[this.currentStory] = {
                ...this.readingProgress[this.currentStory],
                scrollPosition: window.scrollY,
                timestamp: Date.now()
            };
            localStorage.setItem('fairy-tale-progress', JSON.stringify(this.readingProgress));
        }
    }
    
    restoreReadingProgress() {
        if (this.currentStory && this.readingProgress[this.currentStory]) {
            const progress = this.readingProgress[this.currentStory];
            setTimeout(() => {
                window.scrollTo(0, progress.scrollPosition);
            }, 100);
        }
    }
    
    applyStoryEffects(storyId) {
        // Remove existing story-specific classes
        document.body.className = document.body.className.replace(/story-\w+/g, '');
        
        // Add story-specific class for particles and effects
        document.body.classList.add(`story-${storyId}`);
        
        // Update particles based on story
        if (window.particleSystem) {
            window.particleSystem.updateForStory(storyId);
        }
    }
    
    highlightFamousQuotes() {
        const famousQuotes = [
            'Bibbidi-Bobbidi-Boo',
            'Espelho, espelho meu',
            'Era uma vez',
            'E viveram felizes para sempre',
            'Rapunzel, Rapunzel, jogue suas tranças',
            'Vovozinha, que olhos grandes você tem',
            'A Bela e a Fera'
        ];
        
        const storyContent = document.getElementById('story-text');
        let html = storyContent.innerHTML;
        
        famousQuotes.forEach(quote => {
            const regex = new RegExp(`(${quote})`, 'gi');
            html = html.replace(regex, '<span class="famous-quote">$1</span>');
        });
        
        storyContent.innerHTML = html;
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    handleKeyboardShortcuts(e) {
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                this.closeModal(modal.id);
            });
        }
        
        // Ctrl/Cmd + F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            this.openModal('search-modal');
        }
        
        // Ctrl/Cmd + B for bookmark
        if ((e.ctrlKey || e.metaKey) && e.key === 'b' && this.currentStory) {
            e.preventDefault();
            this.toggleBookmark();
        }
        
        // Arrow keys for navigation
        if (e.key === 'ArrowLeft' && this.currentStory) {
            this.goHome();
        }
    }
    
    initializeAudio() {
        // Preload audio files
        const ambientAudio = document.getElementById('ambient-audio');
        const pageTurnAudio = document.getElementById('page-turn-audio');
        
        // Set initial volume
        ambientAudio.volume = 0.3;
        pageTurnAudio.volume = 0.5;
        
        // Handle audio loading errors gracefully
        ambientAudio.addEventListener('error', () => {
            console.warn('Ambient audio failed to load');
        });
        
        pageTurnAudio.addEventListener('error', () => {
            console.warn('Page turn audio failed to load');
        });
    }
    
    playPageTurnSound() {
        const audio = document.getElementById('page-turn-audio');
        audio.currentTime = 0;
        audio.play().catch(console.error);
    }
    
    resetSettings() {
        this.settings = {
            fontSize: 16,
            fontFamily: "'Cormorant Garamond', serif",
            cursor: 'default',
            particlesEnabled: true,
            darkMode: false
        };
        
        this.saveSettings();
        this.applySettings();
        
        // Update UI controls
        document.getElementById('font-size-slider').value = 16;
        document.getElementById('font-size-value').textContent = '16px';
        document.getElementById('font-family-select').value = "'Cormorant Garamond', serif";
        document.getElementById('cursor-select').value = 'default';
        document.getElementById('particles-toggle').checked = true;
        
        // Remove dark mode
        document.body.classList.remove('dark-mode');
        document.getElementById('dark-mode-toggle').querySelector('i').className = 'fas fa-moon';
        document.getElementById('dark-mode-toggle').title = 'Modo Escuro';
    }
    
    applySettings() {
        // Apply font settings
        this.updateFontSize(this.settings.fontSize);
        this.updateFontFamily(this.settings.fontFamily);
        this.updateCursor(this.settings.cursor);
        this.toggleParticles(this.settings.particlesEnabled);
        
        // Apply dark mode
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('dark-mode-toggle').querySelector('i').className = 'fas fa-sun';
            document.getElementById('dark-mode-toggle').title = 'Modo Claro';
        }
        
        // Update UI controls
        document.getElementById('font-size-slider').value = this.settings.fontSize;
        document.getElementById('font-size-value').textContent = this.settings.fontSize + 'px';
        document.getElementById('font-family-select').value = this.settings.fontFamily;
        document.getElementById('cursor-select').value = this.settings.cursor;
        document.getElementById('particles-toggle').checked = this.settings.particlesEnabled;
    }
    
    loadSettings() {
        const defaultSettings = {
            fontSize: 16,
            fontFamily: "'Cormorant Garamond', serif",
            cursor: 'default',
            particlesEnabled: true,
            darkMode: false
        };
        
        try {
            const saved = localStorage.getItem('fairy-tale-settings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.error('Error loading settings:', error);
            return defaultSettings;
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('fairy-tale-settings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    loadBookmarks() {
        try {
            const saved = localStorage.getItem('fairy-tale-bookmarks');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading bookmarks:', error);
            return [];
        }
    }
    
    saveBookmarks() {
        try {
            localStorage.setItem('fairy-tale-bookmarks', JSON.stringify(this.bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 1500);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fairyTaleApp = new FairyTaleApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.fairyTaleApp) {
        window.fairyTaleApp.saveReadingProgress();
    }
});

// Handle before unload to save progress
window.addEventListener('beforeunload', () => {
    if (window.fairyTaleApp) {
        window.fairyTaleApp.saveReadingProgress();
    }
});
