import fetch from 'node-fetch';
import { Buffer } from 'buffer';

export async function getAccessToken() {
    const API_KEY = process.env.API_KEY;
    const authHeader = Buffer.from(`APIKEY:${API_KEY}`).toString('base64');

    const response = await fetch('https://oauth.wildapricot.org/auth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials&scope=auto',
    });

    if (!response.ok) {
        console.log('no access token')
        throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
}

// Function to make a GET request
export async function getRequest(url, accessToken) {
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}. Status: ${response.status}`);
    }

    return response.json();
}

// Function to make a POST request
export async function postRequest(url, accessToken, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Failed to post to ${url}. Status: ${response.status}`);
    }

    return response.json();
}
