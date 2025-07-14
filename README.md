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

### API Usage

Use the REST endpoints to manage your gifts:

```
POST   /api/gifts               # add a new gift
PATCH  /api/gift?id=<id>        # update sell price and currency
GET    /api/gifts               # list all gifts
GET    /api/stats               # overall statistics
```

When adding or updating a gift you can specify currencies with the `purchaseCurrency` and `sellCurrency` fields. Supported values are `TON` and `Stars`.

When a new gift link is added the server fetches the Telegram page and stores a static preview image along with the model, backdrop and symbol. The frontend shows these previews and has a slider to adjust their size.
