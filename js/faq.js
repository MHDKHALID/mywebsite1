// FAQ Page JavaScript
(function() {
    'use strict';

    // FAQ State
    let currentCategory = 'all';
    let searchQuery = '';
    let faqItems = [];

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Get all FAQ items
        faqItems = Array.from(document.querySelectorAll('.faq-item'));
        
        // Setup event listeners
        setupFAQToggles();
        setupCategoryFilters();
        setupSearch();
        
        // Update counts
        updateCategoryCounts();
        
        // Open first FAQ item (optional)
        // if (faqItems.length > 0) {
        //     faqItems[0].classList.add('active');
        // }
    }

    // Setup FAQ Item Toggles
    function setupFAQToggles() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', function() {
                    toggleFAQItem(item);
                });
            }
        });
    }

    // Toggle FAQ Item
    function toggleFAQItem(item) {
        const isActive = item.classList.contains('active');
        
        // Optional: Close all other items (accordion behavior)
        // faqItems.forEach(otherItem => {
        //     if (otherItem !== item) {
        //         otherItem.classList.remove('active');
        //     }
        // });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    }

    // Setup Category Filters
    function setupCategoryFilters() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update current category
                currentCategory = category;
                
                // Filter FAQ items
                filterFAQItems();
            });
        });
    }

    // Setup Search
    function setupSearch() {
        const searchInput = document.getElementById('faqSearchInput');
        const clearButton = document.getElementById('clearSearch');
        
        if (!searchInput) return;
        
        // Search input event
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.trim().toLowerCase();
            
            // Show/hide clear button
            if (clearButton) {
                clearButton.style.display = searchQuery ? 'flex' : 'none';
            }
            
            // Filter FAQ items
            filterFAQItems();
        });
        
        // Clear button event
        if (clearButton) {
            clearButton.addEventListener('click', function() {
                searchInput.value = '';
                searchQuery = '';
                this.style.display = 'none';
                searchInput.focus();
                filterFAQItems();
            });
        }
        
        // Enter key to expand first result
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const visibleItems = faqItems.filter(item => !item.classList.contains('hidden'));
                if (visibleItems.length > 0) {
                    visibleItems[0].classList.add('active');
                    visibleItems[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // Filter FAQ Items
    function filterFAQItems() {
        let visibleCount = 0;
        
        faqItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const question = item.querySelector('.faq-question h3');
            const answer = item.querySelector('.faq-answer');
            
            if (!question) return;
            
            // Get text content
            const questionText = question.textContent.toLowerCase();
            const answerText = answer ? answer.textContent.toLowerCase() : '';
            const fullText = questionText + ' ' + answerText;
            
            // Check category filter
            const categoryMatch = currentCategory === 'all' || category === currentCategory;
            
            // Check search query
            const searchMatch = !searchQuery || fullText.includes(searchQuery);
            
            // Show or hide item
            if (categoryMatch && searchMatch) {
                item.classList.remove('hidden');
                visibleCount++;
                
                // Highlight search terms (optional)
                if (searchQuery) {
                    highlightSearchTerm(item, searchQuery);
                } else {
                    removeHighlights(item);
                }
            } else {
                item.classList.add('hidden');
                item.classList.remove('active');
            }
        });
        
        // Show/hide no results message
        showNoResults(visibleCount === 0);
        
        // Update category counts
        updateCategoryCounts();
    }

    // Highlight Search Term
    function highlightSearchTerm(item, term) {
        // Simple implementation - can be enhanced
        // This is a basic version without modifying HTML structure
    }

    // Remove Highlights
    function removeHighlights(item) {
        // Remove any highlighting
    }

    // Show No Results Message
    function showNoResults(show) {
        const noResults = document.getElementById('noResults');
        if (noResults) {
            noResults.style.display = show ? 'block' : 'none';
        }
        
        const faqContainer = document.getElementById('faqContainer');
        if (faqContainer) {
            faqContainer.style.display = show ? 'none' : 'block';
        }
    }

    // Update Category Counts
    function updateCategoryCounts() {
        const categories = ['all', 'general', 'services', 'pricing', 'technical', 'support', 'security'];
        
        categories.forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (!countElement) return;
            
            let count = 0;
            
            if (category === 'all') {
                // Count all items matching search
                faqItems.forEach(item => {
                    if (!item.classList.contains('hidden')) {
                        count++;
                    }
                });
            } else {
                // Count items in specific category matching search
                faqItems.forEach(item => {
                    if (item.getAttribute('data-category') === category && !item.classList.contains('hidden')) {
                        count++;
                    }
                });
            }
            
            countElement.textContent = count;
        });
    }

    // Expand All (utility function)
    window.expandAllFAQ = function() {
        faqItems.forEach(item => {
            if (!item.classList.contains('hidden')) {
                item.classList.add('active');
            }
        });
    };

    // Collapse All (utility function)
    window.collapseAllFAQ = function() {
        faqItems.forEach(item => {
            item.classList.remove('active');
        });
    };

    // Open FAQ by Index (utility function)
    window.openFAQByIndex = function(index) {
        if (faqItems[index]) {
            faqItems[index].classList.add('active');
            faqItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Search FAQ (utility function)
    window.searchFAQ = function(query) {
        const searchInput = document.getElementById('faqSearchInput');
        if (searchInput) {
            searchInput.value = query;
            searchInput.dispatchEvent(new Event('input'));
        }
    };

    // Filter by Category (utility function)
    window.filterFAQByCategory = function(category) {
        const button = document.querySelector(`.category-btn[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    };

    // Get FAQ Statistics
    window.getFAQStats = function() {
        const stats = {
            total: faqItems.length,
            visible: faqItems.filter(item => !item.classList.contains('hidden')).length,
            active: faqItems.filter(item => item.classList.contains('active')).length,
            byCategory: {}
        };
        
        // Count by category
        faqItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (!stats.byCategory[category]) {
                stats.byCategory[category] = 0;
            }
            stats.byCategory[category]++;
        });
        
        return stats;
    };

    // Scroll to top when changing category
    function scrollToTop() {
        window.scrollTo({
            top: document.querySelector('.faq-content').offsetTop - 100,
            behavior: 'smooth'
        });
    }

    // Deep link support (open FAQ from URL hash)
    function handleDeepLink() {
        const hash = window.location.hash;
        if (hash) {
            // Check if hash is a category
            const category = hash.replace('#', '');
            const categoryButton = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (categoryButton) {
                categoryButton.click();
                return;
            }
            
            // Check if hash is an FAQ index
            const index = parseInt(hash.replace('#faq-', ''));
            if (!isNaN(index) && faqItems[index]) {
                setTimeout(() => {
                    faqItems[index].classList.add('active');
                    faqItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }

    // Handle deep links on load
    handleDeepLink();

    // Handle deep links on hash change
    window.addEventListener('hashchange', handleDeepLink);

    // Analytics tracking (optional)
    function trackFAQInteraction(action, category, label) {
        // Example: Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Example: Custom analytics
        console.log('FAQ Interaction:', action, category, label);
    }

    // Track FAQ opens
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const questionText = item.querySelector('.faq-question h3').textContent.trim();
                trackFAQInteraction('faq_open', 'FAQ', questionText);
            });
        }
    });

    // Track category changes
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            trackFAQInteraction('category_filter', 'FAQ', category);
        });
    });

    // Track searches
    const searchInput = document.getElementById('faqSearchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.trim()) {
                    trackFAQInteraction('search', 'FAQ', e.target.value.trim());
                }
            }, 1000);
        });
    }

    // Export functions for external use
    window.FAQManager = {
        expandAll: window.expandAllFAQ,
        collapseAll: window.collapseAllFAQ,
        openByIndex: window.openFAQByIndex,
        search: window.searchFAQ,
        filterByCategory: window.filterFAQByCategory,
        getStats: window.getFAQStats
    };

    console.log('FAQ Manager initialized successfully');
    console.log('Available functions: FAQManager.expandAll(), FAQManager.collapseAll(), FAQManager.openByIndex(n), FAQManager.search(query), FAQManager.filterByCategory(category), FAQManager.getStats()');

})();
