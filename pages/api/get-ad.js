// /pages/api/get-ad.js
import {createClient} from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';

// Supabase connection
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create a rate limiter to prevent excessive requests by IP
const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 10, // limit each IP to 10 requests per minute
  keyGenerator: (req) => req.ip, // Rate limit by IP address
  handler: (req, res) => {
    return res.status(429).json({
      error: 'Too many requests from this IP. Please try again later.',
    });
  },
});

export default async function handler(req, res) {
  // Apply rate limiting
  await ipRateLimiter(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({error: 'Method not allowed'});
    }

    try {
      // Query Supabase for the active ad
      const {data, error} = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error) {
        return res.status(500).json({error: 'Error fetching ad'});
      }

      if (data) {
        // Check if the ad is within its active period
        const currentDate = new Date();
        const startDate = new Date(data.start_day);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + data.days_active);

        // Return ad data if within the active period
        if (currentDate >= startDate && currentDate <= endDate) {
          return res.status(200).json(data);
        } else {
          return res.status(404).json({message: 'No active ad found'});
        }
      } else {
        return res.status(404).json({message: 'No ad found'});
      }
    } catch (err) {
      return res.status(500).json({error: 'Server error'});
    }
  });
}
