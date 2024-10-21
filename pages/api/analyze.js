// pages/api/analyze.js
import OpenAIApi from 'openai';
export const runtime = 'experimental-edge';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({message: 'Method Not Allowed'});
  }
  // Setup OpenAI API
  const configuration = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  // Extract contract code from the request body
  const {contractCode, contractAddress} = req.body;

  if (!contractCode) {
    return res.status(400).json({error: 'No contract code provided.'});
  }
  const MAX_TOKENS = 16385; // Maximum token limit
  // const MAX_TOKENS = 8100; // Maximum token limit

  async function sendCodeForAnalysis(contractCode) {
    console.log('Starting analysis of contract code');
    const tokenCount = estimateTokenCount(contractCode);
    console.log(`Estimated token count: ${tokenCount}`);

    if (tokenCount >= MAX_TOKENS) {
      console.log(
        'Contract code exceeds the maximum token count, unable to process.'
      );
      return 'Contract code exceeds the maximum token limit.';
    }

    return await analyzeSegment(contractCode);
  }

  // const MAX_CONTEXT_LENGTH = 16385;
  const MAX_CONTEXT_LENGTH = MAX_TOKENS; // Maximum context length for GPT-4

  async function analyzeSegment(segment) {
    // Prepare the messages array with system and user roles
    const messages = [
      {
        role: 'system',
        content:
          "Review the smart contract code to identify any features or mechanisms designed to scam users, including those intended to deceive or cause financial harm. Focus exclusively on scam risks, differentiating them from general security flaws or code quality issues. Highlight the most critical scam-related elements that could be exploited, aiming to assess the contract's integrity and protect users from potential scams. Provide a focused analysis on these scam risks.",
      },
      {
        role: 'user',
        content: segment,
      },
    ];

    // Convert messages to string to estimate its token count more accurately
    const inputString = JSON.stringify(messages);
    const inputTokenEstimate = estimateTokenCount(inputString);

    // Calculate available tokens for the completion, ensuring it doesn't exceed model limits
    const availableTokensForCompletion =
      MAX_CONTEXT_LENGTH - inputTokenEstimate;

    // Guard to prevent exceeding the maximum context length
    if (availableTokensForCompletion <= 0) {
      console.error('Input exceeds maximum context length. Please shorten it.');
      return 'Error: Input too long.';
    }
    let temp;
    if (contractAddress === '0xce3ee7435a5bEdBE73b92f39828b0CFD9D0FF568') {
      temp = 0;
      console.log('temp', temp);
    } else {
      temp = 0.7;
      console.log('temp', temp);
    }

    try {
      console.log('Sending request to OpenAI API');
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        //  model: 'gpt-4',
        messages: messages,
        max_tokens: Math.min(availableTokensForCompletion, 1000),
        temperature: temp,
      });

      // Process and return the API response
      if (response && response.choices && response.choices.length > 0) {
        const messageContent = response.choices[0].message.content.trim();
        console.log('API response:', messageContent);
        return messageContent;
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return 'Contract code to long for v1 scanner';
    }
  }

  function estimateTokenCount(text) {
    // This is a simplified estimation. Adjust based on actual tokenization if necessary.
    return Math.ceil(text.length / 4);
  }

  try {
    // Assume sendCodeForAnalysis is adapted to use within this scope
    const report = await sendCodeForAnalysis(contractCode);
    res.status(200).json({report});
  } catch (error) {
    console.error('Error performing analysis:', error);
    res.status(500).json({error: 'Contract code to long for v1 scanner.'});
  }
}

// You would adapt your existing `sendCodeForAnalysis` and `analyzeSegment` functions
// to work here, potentially passing the `openai` instance as an argument if necessary.
