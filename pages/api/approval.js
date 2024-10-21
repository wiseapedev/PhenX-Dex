// pages/api/swap.js
import cryptoJS from 'crypto-js';
export const runtime = 'edge';
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {query} = req;

    const apiBaseUrl = 'https://www.okx.com/api/v5/dex/aggregator';
    const apiKey = '9720ad89-c92c-41ac-9b29-3564f28050f5';
    const secretKey = 'FA6D08859DDC83BA6DD3DFBEE121DC1D';
    const passphrase = 'Paper-123';
    const projectId = '853e69e01a9a62a3ee1dd0bb8df46878';

    const requestPath = '/approve-transaction';
    const timestamp = new Date().toISOString();

    const queryString = new URLSearchParams(query).toString();
    const apiRequestUrl = `${apiBaseUrl}${requestPath}?${queryString}`;
    const apiRequestUrlNoBase = `/api/v5/dex/aggregator${requestPath}?${queryString}`;

    try {
      const signature = cryptoJS.enc.Base64.stringify(
        cryptoJS.HmacSHA256(timestamp + 'GET' + apiRequestUrlNoBase, secretKey)
      );

      const response = await fetch(apiRequestUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'OK-ACCESS-KEY': apiKey,
          'OK-ACCESS-SIGN': signature,
          'OK-ACCESS-TIMESTAMP': timestamp,
          'OK-ACCESS-PASSPHRASE': passphrase,
          'OK-ACCESS-PROJECT': projectId,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //  console.log('Fetched swap data:', data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Failed to fetch swap data:', error);
      res
        .status(500)
        .json({message: 'Failed to fetch swap data', error: error.message});
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
