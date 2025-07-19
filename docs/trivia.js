// Programming Utilities JavaScript - Week 14 Assignment
// Shuta Wakamiya - July 2025

// Prevent infinite conversion loops
let isConvertingBase = false;
let isConvertingMemory = false;

// Base conversion functions
function convertFromDecimal() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('decimal-input');
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 0) {
        isConvertingBase = false;
        return;
    }
    
    document.getElementById('hex-input').value = value.toString(16).toUpperCase();
    document.getElementById('binary-input').value = value.toString(2);
    document.getElementById('octal-input').value = value.toString(8);
    
    isConvertingBase = false;
}

function convertFromHex() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('hex-input');
    let hexValue = input.value.trim().toUpperCase();
    
    // Clean input - only valid hex characters
    hexValue = hexValue.replace(/[^0-9A-F]/g, '');
    input.value = hexValue;
    
    if (hexValue === '') {
        isConvertingBase = false;
        return;
    }
    
    const decimal = parseInt(hexValue, 16);
    if (!isNaN(decimal)) {
        document.getElementById('decimal-input').value = decimal;
        document.getElementById('binary-input').value = decimal.toString(2);
        document.getElementById('octal-input').value = decimal.toString(8);
    }
    
    isConvertingBase = false;
}

function convertFromBinary() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('binary-input');
    let binaryValue = input.value.trim();
    
    // Only allow 0s and 1s
    binaryValue = binaryValue.replace(/[^01]/g, '');
    input.value = binaryValue;
    
    if (binaryValue === '') {
        isConvertingBase = false;
        return;
    }
    
    const decimal = parseInt(binaryValue, 2);
    if (!isNaN(decimal)) {
        document.getElementById('decimal-input').value = decimal;
        document.getElementById('hex-input').value = decimal.toString(16).toUpperCase();
        document.getElementById('octal-input').value = decimal.toString(8);
    }
    
    isConvertingBase = false;
}

function convertFromOctal() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('octal-input');
    let octalValue = input.value.trim();
    
    // Only allow 0-7 for octal
    octalValue = octalValue.replace(/[^0-7]/g, '');
    input.value = octalValue;
    
    if (octalValue === '') {
        isConvertingBase = false;
        return;
    }
    
    const decimal = parseInt(octalValue, 8);
    if (!isNaN(decimal)) {
        document.getElementById('decimal-input').value = decimal;
        document.getElementById('hex-input').value = decimal.toString(16).toUpperCase();
        document.getElementById('binary-input').value = decimal.toString(2);
    }
    
    isConvertingBase = false;
}

// Memory conversion functions - using 1024 base
function convertFromBytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const bytes = parseFloat(document.getElementById('bytes-input').value);
    
    if (isNaN(bytes) || bytes < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const kb = bytes / 1024;
    const mb = bytes / (1024 * 1024);
    const gb = bytes / (1024 * 1024 * 1024);
    const tb = bytes / (1024 * 1024 * 1024 * 1024);
    
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromKilobytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const kb = parseFloat(document.getElementById('kilobytes-input').value);
    
    if (isNaN(kb) || kb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = kb * 1024;
    const mb = kb / 1024;
    const gb = kb / (1024 * 1024);
    const tb = kb / (1024 * 1024 * 1024);
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromMegabytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const mb = parseFloat(document.getElementById('megabytes-input').value);
    
    if (isNaN(mb) || mb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = mb * 1024 * 1024;
    const kb = mb * 1024;
    const gb = mb / 1024;
    const tb = mb / (1024 * 1024);
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromGigabytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const gb = parseFloat(document.getElementById('gigabytes-input').value);
    
    if (isNaN(gb) || gb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = gb * 1024 * 1024 * 1024;
    const kb = gb * 1024 * 1024;
    const mb = gb * 1024;
    const tb = gb / 1024;
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromTerabytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const tb = parseFloat(document.getElementById('terabytes-input').value);
    
    if (isNaN(tb) || tb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = tb * 1024 * 1024 * 1024 * 1024;
    const kb = tb * 1024 * 1024 * 1024;
    const mb = tb * 1024 * 1024;
    const gb = tb * 1024;
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    
    isConvertingMemory = false;
}

// Format numbers for display
function formatNumber(num) {
    if (num === 0) return '0';
    if (num >= 1000000) return num.toExponential(3);
    if (num >= 1000) return Math.round(num).toString();
    if (num >= 1) return num.toFixed(3);
    if (num >= 0.001) return num.toFixed(6);
    return num.toExponential(3);
}

// Clear functions
function clearBaseConverter() {
    document.getElementById('decimal-input').value = '';
    document.getElementById('hex-input').value = '';
    document.getElementById('binary-input').value = '';
    document.getElementById('octal-input').value = '';
}

function clearMemoryConverter() {
    document.getElementById('bytes-input').value = '';
    document.getElementById('kilobytes-input').value = '';
    document.getElementById('megabytes-input').value = '';
    document.getElementById('gigabytes-input').value = '';
    document.getElementById('terabytes-input').value = '';
}

// Load example values
function loadExamples() {
    setTimeout(() => {
        document.getElementById('decimal-input').value = '255';
        convertFromDecimal();
    }, 1000);
    
    setTimeout(() => {
        document.getElementById('gigabytes-input').value = '1';
        convertFromGigabytes();
    }, 2000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Base converter event listeners
    document.getElementById('decimal-input').addEventListener('input', convertFromDecimal);
    document.getElementById('hex-input').addEventListener('input', convertFromHex);
    document.getElementById('binary-input').addEventListener('input', convertFromBinary);
    document.getElementById('octal-input').addEventListener('input', convertFromOctal);
    
    // Memory converter event listeners
    document.getElementById('bytes-input').addEventListener('input', convertFromBytes);
    document.getElementById('kilobytes-input').addEventListener('input', convertFromKilobytes);
    document.getElementById('megabytes-input').addEventListener('input', convertFromMegabytes);
    document.getElementById('gigabytes-input').addEventListener('input', convertFromGigabytes);
    document.getElementById('terabytes-input').addEventListener('input', convertFromTerabytes);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault();
            clearBaseConverter();
        }
        
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            clearMemoryConverter();
        }
    });
    
    // Load examples
    loadExamples();
    
    console.log('Programming utilities loaded');
});// Programming Utilities JavaScript - Week 14 Assignment
// Shuta Wakamiya - July 2025
// This converter has been incredibly useful for my microcontroller projects!

// Global flags to prevent conversion loops (learned this the hard way...)
let isConvertingBase = false;
let isConvertingMemory = false;

// Base conversion functions
// I use these all the time when working with Arduino and microcontrollers

function convertFromDecimal() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('decimal-input');
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 0) {
        isConvertingBase = false;
        return;
    }
    
    // Convert to other bases
    document.getElementById('hex-input').value = value.toString(16).toUpperCase();
    document.getElementById('binary-input').value = value.toString(2);
    document.getElementById('octal-input').value = value.toString(8);
    
    isConvertingBase = false;
}

function convertFromHex() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('hex-input');
    let hexValue = input.value.trim().toUpperCase();
    
    // Clean up input - only allow valid hex characters
    hexValue = hexValue.replace(/[^0-9A-F]/g, '');
    input.value = hexValue;
    
    if (hexValue === '') {
        isConvertingBase = false;
        return;
    }
    
    const decimal = parseInt(hexValue, 16);
    if (!isNaN(decimal)) {
        document.getElementById('decimal-input').value = decimal;
        document.getElementById('binary-input').value = decimal.toString(2);
        document.getElementById('octal-input').value = decimal.toString(8);
    }
    
    isConvertingBase = false;
}

function convertFromBinary() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('binary-input');
    let binaryValue = input.value.trim();
    
    // Only allow 0s and 1s
    binaryValue = binaryValue.replace(/[^01]/g, '');
    input.value = binaryValue;
    
    if (binaryValue === '') {
        isConvertingBase = false;
        return;
    }
    
    const decimal = parseInt(binaryValue, 2);
    if (!isNaN(decimal)) {
        document.getElementById('decimal-input').value = decimal;
        document.getElementById('hex-input').value = decimal.toString(16).toUpperCase();
        document.getElementById('octal-input').value = decimal.toString(8);
    }
    
    isConvertingBase = false;
}

function convertFromOctal() {
    if (isConvertingBase) return;
    isConvertingBase = true;
    
    const input = document.getElementById('octal-input');
    let octalValue = input.value.trim();
    
    // Only allow 0-7 for octal
    octalValue = octalValue.replace(/[^0-7]/g, '');
    input.value = octalValue;
    
    if (octalValue === '') {
        isConvertingBase = false;
        return;
    }
    
    const decimal = parseInt(octalValue, 8);
    if (!isNaN(decimal)) {
        document.getElementById('decimal-input').value = decimal;
        document.getElementById('hex-input').value = decimal.toString(16).toUpperCase();
        document.getElementById('binary-input').value = decimal.toString(2);
    }
    
    isConvertingBase = false;
}

// Memory conversion functions
// Really important for embedded systems - 1024 vs 1000 matters!

function convertFromBytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const bytes = parseFloat(document.getElementById('bytes-input').value);
    
    if (isNaN(bytes) || bytes < 0) {
        isConvertingMemory = false;
        return;
    }
    
    // Binary conversions (powers of 1024)
    const kb = bytes / 1024;
    const mb = bytes / (1024 * 1024);
    const gb = bytes / (1024 * 1024 * 1024);
    const tb = bytes / (1024 * 1024 * 1024 * 1024);
    
    // Smart formatting - don't show unnecessary decimal places
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromKilobytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const kb = parseFloat(document.getElementById('kilobytes-input').value);
    
    if (isNaN(kb) || kb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = kb * 1024;
    const mb = kb / 1024;
    const gb = kb / (1024 * 1024);
    const tb = kb / (1024 * 1024 * 1024);
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromMegabytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const mb = parseFloat(document.getElementById('megabytes-input').value);
    
    if (isNaN(mb) || mb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = mb * 1024 * 1024;
    const kb = mb * 1024;
    const gb = mb / 1024;
    const tb = mb / (1024 * 1024);
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromGigabytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const gb = parseFloat(document.getElementById('gigabytes-input').value);
    
    if (isNaN(gb) || gb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = gb * 1024 * 1024 * 1024;
    const kb = gb * 1024 * 1024;
    const mb = gb * 1024;
    const tb = gb / 1024;
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('terabytes-input').value = formatNumber(tb);
    
    isConvertingMemory = false;
}

function convertFromTerabytes() {
    if (isConvertingMemory) return;
    isConvertingMemory = true;
    
    const tb = parseFloat(document.getElementById('terabytes-input').value);
    
    if (isNaN(tb) || tb < 0) {
        isConvertingMemory = false;
        return;
    }
    
    const bytes = tb * 1024 * 1024 * 1024 * 1024;
    const kb = tb * 1024 * 1024 * 1024;
    const mb = tb * 1024 * 1024;
    const gb = tb * 1024;
    
    document.getElementById('bytes-input').value = Math.round(bytes);
    document.getElementById('kilobytes-input').value = formatNumber(kb);
    document.getElementById('megabytes-input').value = formatNumber(mb);
    document.getElementById('gigabytes-input').value = formatNumber(gb);
    
    isConvertingMemory = false;
}

// Helper function to format numbers nicely
function formatNumber(num) {
    if (num === 0) return '0';
    if (num >= 1000000) return num.toExponential(3);
    if (num >= 1000) return Math.round(num).toString();
    if (num >= 1) return num.toFixed(3);
    if (num >= 0.001) return num.toFixed(6);
    return num.toExponential(3);
}

// Clear functions for when you want to start over
function clearBaseConverter() {
    document.getElementById('decimal-input').value = '';
    document.getElementById('hex-input').value = '';
    document.getElementById('binary-input').value = '';
    document.getElementById('octal-input').value = '';
}

function clearMemoryConverter() {
    document.getElementById('bytes-input').value = '';
    document.getElementById('kilobytes-input').value = '';
    document.getElementById('megabytes-input').value = '';
    document.getElementById('gigabytes-input').value = '';
    document.getElementById('terabytes-input').value = '';
}

// Load some example values to demonstrate the converter
function loadExamples() {
    // After 1 second, load the classic 255 example
    setTimeout(() => {
        document.getElementById('decimal-input').value = '255';
        convertFromDecimal();
    }, 1000);
    
    // After 2 seconds, load 1GB example
    setTimeout(() => {
        document.getElementById('gigabytes-input').value = '1';
        convertFromGigabytes();
    }, 2000);
}

// Set up all the event listeners when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Base converter listeners - using 'input' event for real-time conversion
    document.getElementById('decimal-input').addEventListener('input', convertFromDecimal);
    document.getElementById('hex-input').addEventListener('input', convertFromHex);
    document.getElementById('binary-input').addEventListener('input', convertFromBinary);
    document.getElementById('octal-input').addEventListener('input', convertFromOctal);
    
    // Memory converter listeners
    document.getElementById('bytes-input').addEventListener('input', convertFromBytes);
    document.getElementById('kilobytes-input').addEventListener('input', convertFromKilobytes);
    document.getElementById('megabytes-input').addEventListener('input', convertFromMegabytes);
    document.getElementById('gigabytes-input').addEventListener('input', convertFromGigabytes);
    document.getElementById('terabytes-input').addEventListener('input', convertFromTerabytes);
    
    // Add some keyboard shortcuts for convenience
    document.addEventListener('keydown', function(event) {
        // Ctrl + B to clear base converter
        if (event.ctrlKey && event.key === 'b') {
            event.preventDefault();
            clearBaseConverter();
        }
        
        // Ctrl + M to clear memory converter  
        if (event.ctrlKey && event.key === 'm') {
            event.preventDefault();
            clearMemoryConverter();
        }
    });
    
    // Load examples after everything is set up
    loadExamples();
    
    // Show a welcome message in console for debugging
    console.log('Programming Utilities loaded successfully!');
    console.log('Shortcuts: Ctrl+B (clear base), Ctrl+M (clear memory)');
});