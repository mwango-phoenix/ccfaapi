import fetch from 'node-fetch';
import { Buffer } from 'buffer';

export async function getAccessToken() {
    const API_KEY = process.env.API_KEY;
    const authHeader = Buffer.from(`APIKEY:${API_KEY}`).toString('base64');
    console.log(authHeader)

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

export async function getTokenLogin(authorizationCode) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const redirect_uri = 'https://theccfa.net/Volunteer-Opportunities/';
    console.log(authHeader)


    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: CLIENT_ID,
        redirect_uri: redirect_uri,
        scope: 'contacts_me', 
    }).toString();

    console.log(body)

    const response = await fetch('https://oauth.wildapricot.org/auth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
    });

    if (!response.ok) {
        console.error('Failed to get access token with authorization code:', await response.text());
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
