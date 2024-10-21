import {createClient} from '@supabase/supabase-js';
import authMiddleware from './middleware/auth'; // Import your auth middleware
export const runtime = 'experimental-edge';
// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Use your existing auth middleware for authentication
  authMiddleware(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({message: 'Method Not Allowed'});
    }

    const {contractAddress, name, ticker, imgUrl, trxHash} = req.body;

    // Basic input validation
    if (!contractAddress || !name || !ticker || !trxHash) {
      return res.status(400).json({message: 'Missing required fields.'});
    }

    try {
      // Add the new listing to the database
      const {data, error} = await supabase.from('listings').insert([
        {
          contract_address: contractAddress,
          name: name,
          ticker: ticker,
          img_url: imgUrl,
          trx_hash: trxHash,
          is_listed: true, // Set to true upon successful payment
        },
      ]);

      if (error) {
        throw error;
      }

      // Return a success response
      res.status(200).json({message: 'Listing added successfully.', data});
    } catch (error) {
      // Handle any errors
      console.error('Error adding listing:', error);
      res.status(500).json({
        message: 'An error occurred while adding the listing.',
        error: error.message,
      });
    }
  });
}
