import fetch from 'node-fetch';

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
