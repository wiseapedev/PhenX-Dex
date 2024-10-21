import {createClient} from '@supabase/supabase-js';
import authMiddleware from './middleware/auth'; // Import your auth middleware
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

    const {contractAddress} = req.body;

    // Validate input
    if (!contractAddress) {
      return res.status(400).json({message: 'Contract address is required.'});
    }

    try {
      // Check if contract address already exists in the database
      const {data: existingListing, error} = await supabase
        .from('listings')
        .select('*')
        .eq('contract_address', contractAddress)
        .single();

      // Handle errors that are not "not found"
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Return the result based on whether the contract exists
      if (existingListing) {
        return res.status(200).json({exists: true, listing: existingListing});
      } else {
        return res.status(200).json({exists: false});
      }
    } catch (error) {
      console.error('Error checking contract address:', error);
      res.status(500).json({
        message: 'An error occurred while checking the contract address.',
        error: error.message,
      });
    }
  });
}
