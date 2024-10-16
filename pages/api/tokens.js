import {createClient} from '@supabase/supabase-js';
import authMiddleware from './middleware/auth'; // Import your auth middleware

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side only
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Use your authentication middleware
  authMiddleware(req, res, async () => {
    try {
      const {data, error} = await supabaseAdmin
        .from('tokens') // Replace with your table name
        .select('*');

      if (error) {
        console.error('Error fetching data from Supabase:', error);
        return res
          .status(500)
          .json({error: 'Failed to fetch data from Supabase'});
      }

      // Convert the data array into an object keyed by `id`
      const ETH_TOKENS = data.reduce((acc, token) => {
        acc[token.id] = token;
        return acc;
      }, {});

      // Respond with the token data
      res.status(200).json(ETH_TOKENS);
    } catch (err) {
      console.error('Unexpected error:', err);
      return res.status(500).json({error: 'Unexpected error occurred'});
    }
  });
}
