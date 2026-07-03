// ===============================================
// NETLIFY SERVERLESS FUNCTION FOR ADMIN AUTH
// ===============================================

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse request body
        const { adminKey } = JSON.parse(event.body);

        if (!adminKey) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Admin key required' })
            };
        }

        // Get admin key from environment variables
        const ADMIN_KEY = process.env.ADMIN_KEY;

        if (!ADMIN_KEY) {
            console.error('ADMIN_KEY environment variable not set');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Validate admin key
        const isValid = adminKey === ADMIN_KEY;

        // Log authentication attempt (without exposing keys)
        console.log('Admin authentication attempt:', {
            timestamp: new Date().toISOString(),
            valid: isValid,
            ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown'
        });

        if (isValid) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    valid: true,
                    message: 'Authentication successful',
                    timestamp: new Date().toISOString()
                })
            };
        } else {
            // Add delay to prevent brute force attacks
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    valid: false,
                    message: 'Invalid admin key'
                })
            };
        }

    } catch (error) {
        console.error('Admin auth error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};