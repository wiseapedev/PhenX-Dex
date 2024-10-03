// pages/api/pay-listing.js

import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {contractAddress, name, ticker, imgUrl, trxHash} = req.body;

    try {
      // Basic input validation
      if (!contractAddress || !name || !ticker || !trxHash) {
        return res.status(400).json({message: 'Missing required fields.'});
      }

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

      res.status(200).json({message: 'Listing added successfully.', data});
    } catch (error) {
      console.error('Error adding listing:', error);
      res.status(500).json({
        message: 'An error occurred while adding the listing.',
        error: error.message,
      });
    }
  } else {
    res.status(405).json({message: 'Method not allowed.'});
  }
}
