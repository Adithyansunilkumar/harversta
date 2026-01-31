/**
 * Quick Diagnostic Test Script
 * 
 * Run this in your browser console to diagnose the API error
 */

console.log('=== HARVESTA DIAGNOSTIC TEST ===\n');

// 1. Check Authentication
console.log('1. Checking Authentication...');
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (!token) {
    console.error('❌ NO TOKEN FOUND - You need to log in first!');
} else {
    console.log('✅ Token exists:', token.substring(0, 20) + '...');
}

if (user) {
    try {
        const userData = JSON.parse(user);
        console.log('✅ User data:', userData);
        if (userData.role === 'admin') {
            console.log('✅ User is an admin');
        } else {
            console.error('❌ User is NOT an admin - Role:', userData.role);
        }
    } catch (e) {
        console.error('❌ Invalid user data in localStorage');
    }
} else {
    console.error('❌ NO USER DATA FOUND');
}

// 2. Test API Connection
console.log('\n2. Testing API Endpoints...');

async function testEndpoint(url, name) {
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`✅ ${name}: SUCCESS`);
            console.log('   Response:', data);
        } else {
            console.error(`❌ ${name}: FAILED`);
            console.error('   Status:', response.status);
            console.error('   Error:', data);
        }

        return { success: response.ok, status: response.status, data };
    } catch (error) {
        console.error(`❌ ${name}: NETWORK ERROR`);
        console.error('   Error:', error.message);
        return { success: false, error: error.message };
    }
}

// Test endpoints
(async () => {
    console.log('\nTesting Health Endpoint...');
    await testEndpoint('http://localhost:5000/health', 'Health Check');

    console.log('\nTesting Admin Stats Endpoint...');
    await testEndpoint('http://localhost:5000/api/admin/stats', 'Admin Stats');

    console.log('\n=== DIAGNOSTIC COMPLETE ===');
})();
