// pages/api/check-contract.js

import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {contractAddress} = req.body;

    try {
      // Validate input
      if (!contractAddress) {
        return res.status(400).json({message: 'Contract address is required.'});
      }

      // Check if contract address already exists
      const {data: existingListing, error} = await supabase
        .from('listings')
        .select('*')
        .eq('contract_address', contractAddress)
        .single();

      if (error && error.code !== 'PGRST116') {
        // Handle unexpected errors
        throw error;
      }

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
  } else {
    res.status(405).json({message: 'Method not allowed.'});
  }
}
