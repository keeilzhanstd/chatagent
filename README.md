# Telegram Gift Tracker

This is a simple Node.js portal to track Telegram NFT gifts. You can add gifts by link, record the purchase price, update the sell price later, and view profit and loss statistics. The frontend is built with Vue.js.


## Setup

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the server
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

Data is stored in `data/gifts.json` when running locally. On Vercel, data is saved to `/tmp` and will reset whenever the instance is restarted.

### Deploying to Vercel

The repository includes serverless functions under the `api/` directory so it can be deployed directly to Vercel:

```bash
vercel --prod
```

After deployment open the provided URL.

