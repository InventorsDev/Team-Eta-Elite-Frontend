export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();  
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { amount, accountNumber, accountName, bankCode, reason } = req.body;

    // Validate required fields
    if (!amount || !accountNumber || !accountName || !bankCode || !reason) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['amount', 'accountNumber', 'accountName', 'bankCode', 'reason']
        });
    }

    // Paystack requires registered business licensce for transfers - so its in test mode.
    const IS_DEVELOPMENT = process.env.NODE_ENV === 'development' || true;

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ 
            error: 'Paystack configuration error. Please set PAYSTACK_SECRET_KEY in environment variables.' 
        });
    }

    try {
        // Create a transfer recipient
        const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'nuban',
                name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: 'NGN'
            })
        });

        const recipientData = await recipientResponse.json();

        if (!recipientData.status) {
            return res.status(400).json({ 
                error: 'Failed to create recipient',
                details: recipientData.message 
            });
        }

        const recipientCode = recipientData.data.recipient_code;

        if (IS_DEVELOPMENT) {
            return res.status(200).json({
                success: true,
                data: {
                reference: 'mock_' + Date.now(),
                recipient: recipientCode,
                amount: amount * 100,
                status: 'success'
                }
            });
        }

        // Initiate the transfer
        const transferResponse = await fetch('https://api.paystack.co/transfer', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: 'balance',
                amount: parseInt(amount),
                recipient: recipientCode,
                reason: `SAFELINK: ${reason}`
            })
        });

        const transferData = await transferResponse.json();

        if (!transferData.status) {
            return res.status(400).json({ 
                error: 'Transfer failed',
                details: transferData.message 
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Transfer made successfully',
            data: {
                reference: transferData.data.reference,
                status: transferData.data.status,
                amount: transferData.data.amount,
                recipient: transferData.data.recipient,
                transfer_code: transferData.data.transfer_code
            }
        });
    } catch (error) {
        console.error('Paystack transfer error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
}