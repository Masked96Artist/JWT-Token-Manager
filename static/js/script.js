document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Collapsible sections
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.toggle-icon');
            
            // Toggle the visibility of the content
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                content.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
    
    // Add claim button
    const addClaimButton = document.getElementById('add-claim');
    if (addClaimButton) {
        addClaimButton.addEventListener('click', function() {
            const claimsContainer = document.getElementById('claims-container');
            const newRow = document.createElement('div');
            newRow.className = 'claim-row';
            
            newRow.innerHTML = `
                <div class="claim-key">
                    <input type="text" name="claim_keys[]" placeholder="Claim Key">
                </div>
                <div class="claim-value">
                    <input type="text" name="claim_values[]" placeholder="Claim Value">
                </div>
                <button type="button" class="btn icon remove-claim">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            claimsContainer.appendChild(newRow);
            
            // Add event listener to the new remove button
            const removeButton = newRow.querySelector('.remove-claim');
            removeButton.addEventListener('click', removeClaim);
        });
    }
    
    // Remove claim buttons
    const removeClaimButtons = document.querySelectorAll('.remove-claim');
    removeClaimButtons.forEach(button => {
        button.addEventListener('click', removeClaim);
    });
    
    function removeClaim() {
        const row = this.closest('.claim-row');
        row.remove();
    }
    
    // Copy token button
    const copyTokenButton = document.getElementById('copy-token');
    if (copyTokenButton) {
        copyTokenButton.addEventListener('click', function() {
            const tokenOutput = document.getElementById('token-output');
            
            // Create a temporary textarea to copy the text
            const textarea = document.createElement('textarea');
            textarea.value = tokenOutput.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // Visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            this.classList.add('success');
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.classList.remove('success');
            }, 2000);
        });
    }
    
    // Generate random secret button
    const generateSecretButton = document.getElementById('generate-secret');
    if (generateSecretButton) {
        generateSecretButton.addEventListener('click', function() {
            const secretInput = document.getElementById('secret');
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
            let result = '';
            
            // Generate a 32-character random string
            for (let i = 0; i < 32; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            secretInput.value = result;
        });
    }
    
    // Show active tab based on Flask flash messages
    const hasDecodedToken = document.querySelector('#decode-result .decoded-content');
    const hasEncodedToken = document.querySelector('#encode-result .token-result');
    const hasDecodeError = document.querySelector('#decode-result .alert.error');
    const hasEncodeError = document.querySelector('#encode-result .alert.error');
    
    if (hasDecodedToken || hasDecodeError) {
        // Activate decode tab
        tabButtons[0].click();
    } else if (hasEncodedToken || hasEncodeError) {
        // Activate encode tab
        tabButtons[1].click();
    }
    
    // Form validation
    const decodeForm = document.getElementById('decode-form');
    if (decodeForm) {
        decodeForm.addEventListener('submit', function(e) {
            const jwtInput = document.getElementById('jwt-input');
            if (!jwtInput.value.trim()) {
                e.preventDefault();
                
                // Create alert message
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert error';
                alertDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please enter a JWT token.';
                
                // Check if alert already exists
                const existingAlert = decodeForm.nextElementSibling.querySelector('.alert');
                if (existingAlert) {
                    existingAlert.remove();
                }
                
                // Insert alert after form
                decodeForm.parentNode.insertBefore(alertDiv, decodeForm.nextSibling);
                
                // Remove alert after 3 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 3000);
            }
        });
    }
    
    const encodeForm = document.getElementById('encode-form');
    if (encodeForm) {
        encodeForm.addEventListener('submit', function(e) {
            const alg = document.getElementById('alg').value;
            const secret = document.getElementById('secret').value;
            
            if (alg !== 'none' && !secret.trim()) {
                e.preventDefault();
                
                // Create alert message
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert error';
                alertDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Secret key is required for the selected algorithm.';
                
                // Check if alert already exists
                const existingAlert = encodeForm.nextElementSibling.querySelector('.alert');
                if (existingAlert) {
                    existingAlert.remove();
                }
                
                // Insert alert after form
                encodeForm.parentNode.insertBefore(alertDiv, encodeForm.nextSibling);
                
                // Remove alert after 3 seconds
                setTimeout(() => {
                    alertDiv.remove();
                }, 3000);
            }
        });
    }
    
    // Initialize collapsible sections as open
    collapsibleHeaders.forEach(header => {
        const content = header.nextElementSibling;
        content.style.display = 'block';
        const icon = header.querySelector('.toggle-icon');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    });
});
