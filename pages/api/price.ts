import qs from 'qs';
import type {NextApiRequest, NextApiResponse} from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | {message: string}>
) {
  const query = qs.stringify(req.query);
  const url = `https://api.0x.org/swap/v1/price?${query}`;

  try {
    const response = await fetch(url, {
      headers: {
        '0x-api-key': 'd5b34d90-2ea4-4d89-8f69-97f59aa74192', // Use your actual API key
      },
    });

    if (!response.ok) {
      // Convert non-2xx HTTP responses into errors
      const errorData = await response.json();
      console.error('Error response from API:', errorData);
      return res.status(response.status).json(errorData);
    }

    // If the request was successful, return the data
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Fetch attempt failed:', error);
    // Return a generic error message
    return res.status(500).json({message: 'An unexpected error occurred'});
  }
}
