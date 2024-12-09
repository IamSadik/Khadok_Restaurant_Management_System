async function loginConsumer(email, password) {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('session_id', result.session_id); // Store session ID
            alert('Login successful!');
            window.location.href = '/consumer/khadok.consumer.dashboard.html'; // Redirect to dashboard
        } else {
            alert(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred during login');
    }
}


document.getElementById('logoutButton')?.addEventListener('click', async () => {
    const session_id = localStorage.getItem('session_id');
   
        window.location.href = '/login.html';
        return;
    
    
});
