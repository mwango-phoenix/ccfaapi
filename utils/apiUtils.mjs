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

export async function getTokenLogin(authorizationCode) {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
        client_id: CLIENT_ID,
        redirect_uri: 'https://theccfa.net/Volunteer-Opportunities/',
        scope: 'contacts_me', 
    }).toString();

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
        method: 'GET',
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
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Attempt to parse the response body for error details
            const errorDetails = await response.text();
            console.error(`Failed to post to ${url}. Status: ${response.status}, Status Text: ${response.statusText}, Error Details: ${errorDetails}`);
            throw new Error(`Failed to post to ${url}. Status: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error during post request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function putRequest(url, accessToken, data) {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Attempt to parse the response body for error details
            throw new Error(`Failed to update to ${url}. Status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error during post request:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

export async function deleteRequest(url, accessToken) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        // Check if the response is not OK (status codes 4xx or 5xx)
        if (!response.ok) {
            const errorMessage = await response.text(); // Capture the error message from the response body
            throw new Error(`Failed to delete from ${url}. Status: ${response.status} - ${errorMessage}`);
        }

        // Attempt to parse JSON response if available
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        // Return empty object if no JSON response
        return {};
    } catch (error) {
        console.error(`Error in deleteRequest: ${error.message}`);
        throw error;
    }
}
