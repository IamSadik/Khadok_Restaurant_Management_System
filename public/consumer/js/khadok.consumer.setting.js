// Form submission handlers with simple alerts
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Perform AJAX or other validation if necessary
    alert('Profile changes saved!');
});

document.getElementById('passwordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Validate new passwords match
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
    } else {
        alert('Password changed successfully!');
    }
});

document.getElementById('privacyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Privacy settings updated!');
});

document.getElementById('otherSettingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Other settings saved!');
});
