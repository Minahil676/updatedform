// Auto-resize function for input fields
function autoResizeInput(input) {
    const defaultFontSize = 18; // Updated to match your CSS
    const minFontSize = 10; // Minimum font size in pixels
    const stepSize = 0.05; // How much to decrease font size each iteration
    
    // Reset to default font size first - using !important to override CSS
    input.style.setProperty('font-size', defaultFontSize + 'px', 'important');
    
    // Create a temporary span to measure text width
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.fontFamily = window.getComputedStyle(input).fontFamily;
    tempSpan.style.fontWeight = window.getComputedStyle(input).fontWeight;
    tempSpan.style.letterSpacing = window.getComputedStyle(input).letterSpacing;
    document.body.appendChild(tempSpan);
    
    // Function to check if text fits
    function textFits(fontSize) {
        tempSpan.style.fontSize = fontSize + 'px';
        tempSpan.textContent = input.value;
        const textWidth = tempSpan.offsetWidth;
        const inputWidth = input.offsetWidth - 4; // Subtract padding
        return textWidth <= inputWidth;
    }
    
    // If text doesn't fit at default size, gradually reduce font size
    if (!textFits(defaultFontSize)) {
        let currentSize = defaultFontSize;
        
        // Gradually decrease font size until text fits or we hit minimum
        while (currentSize > minFontSize && !textFits(currentSize)) {
            currentSize -= stepSize;
        }
        
        // Make sure we don't go below minimum
        if (currentSize < minFontSize) {
            currentSize = minFontSize;
        }
        
        // Round to 1 decimal place for cleaner values
        currentSize = Math.round(currentSize * 10) / 10;
        
        // Use setProperty with important to override CSS !important
        input.style.setProperty('font-size', currentSize + 'px', 'important');
    }
    
    // Clean up
    document.body.removeChild(tempSpan);
}

// Function to optimize input widths based on label sizes
function optimizeInputWidths() {
    const labelCells = document.querySelectorAll('.label-cell');
    
    labelCells.forEach(cell => {
        const label = cell.querySelector('.inputfield-label');
        const inputCell = cell.querySelector('.input-cell');
        // UPDATED: Look for both .form-input AND .form-input-underlined
        const input = cell.querySelector('.form-input, .form-input-underlined');
        
        if (label && inputCell && input) {
            // Measure the actual label width
            const labelWidth = label.offsetWidth;
            
            // Add some padding for comfort
            const padding = 12;
            
            // Calculate optimal width for input cell
            const optimalWidth = `calc(100% - ${labelWidth + padding}px)`;
            
            // Apply the width to the input cell
            inputCell.style.width = optimalWidth;
            inputCell.style.display = 'inline-block';
        }
    });
}

// Apply auto-resize to all inputs with the class
function initializeAutoResize() {
    // First optimize widths
    optimizeInputWidths();
    
    const inputs = document.querySelectorAll('.auto-resize');
    
    console.log('Auto-resize initializing for', inputs.length, 'inputs'); // Debug log
    
    inputs.forEach(input => {
        // Initial resize
        autoResizeInput(input);
        
        // Resize on input change
        input.addEventListener('input', function() {
            autoResizeInput(this);
        });
        
        // Resize on window resize (for responsive behavior)
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                optimizeInputWidths();
                autoResizeInput(input);
            }, 100);
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoResize();
});

// Also initialize after a short delay to ensure styles are applied
setTimeout(function() {
    initializeAutoResize();
}, 100);

// Re-initialize if new elements are added dynamically
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
            const newInputs = document.querySelectorAll('.auto-resize:not([data-resize-initialized])');
            newInputs.forEach(input => {
                input.setAttribute('data-resize-initialized', 'true');
                autoResizeInput(input);
                
                input.addEventListener('input', function() {
                    autoResizeInput(this);
                });
            });
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

window.initializeAutoResize = initializeAutoResize;