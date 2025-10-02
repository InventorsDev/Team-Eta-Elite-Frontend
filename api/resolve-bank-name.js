export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { accountNumber, bankCode } = req.body;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({ 
      message: 'Account number and bank code are required' 
    });
  }

  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    const url = `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`;
    
    const paystackRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await paystackRes.json();

    if (!paystackRes.ok || !data.data) {
      throw new Error(data.message || 'Could not resolve account');
    }

    return res.status(200).json({
      accountName: data.data.account_name,
      bankCode: bankCode
    });

  } catch (error) {
    return res.status(500).json({ 
      message: error.message || 'Failed to resolve account'
    });
  }
}