const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data', 'gifts.json');

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function computeStats(gift) {
  if (gift.sellPrice != null && gift.purchasePrice != null) {
    const pnl = gift.sellPrice - gift.purchasePrice;
    const pnlPercent = (pnl / gift.purchasePrice) * 100;
    gift.pnl = pnl;
    gift.pnlPercent = pnlPercent;
  }
}

app.get('/api/gifts', (req, res) => {
  const data = loadData();
  res.json(data);
});

app.post('/api/gifts', (req, res) => {
  const { link, purchasePrice, purchaseCurrency } = req.body;
  if (!link || purchasePrice == null) {
    return res.status(400).json({ error: 'link and purchasePrice required' });
  }
  const data = loadData();
  const newGift = {
    id: Date.now().toString(),
    link,
    purchasePrice: parseFloat(purchasePrice),
    purchaseCurrency: purchaseCurrency || 'TON',
    sellPrice: null,
    sellCurrency: null,
    pnl: null,
    pnlPercent: null,
  };
  data.push(newGift);
  saveData(data);
  res.json(newGift);
});

app.patch('/api/gifts/:id', (req, res) => {
  const { id } = req.params;
  const { sellPrice, sellCurrency } = req.body;
  const data = loadData();
  const gift = data.find((g) => g.id === id);
  if (!gift) return res.status(404).json({ error: 'not found' });
  if (sellPrice != null) gift.sellPrice = parseFloat(sellPrice);
  if (sellCurrency != null) gift.sellCurrency = sellCurrency;
  computeStats(gift);
  saveData(data);
  res.json(gift);
});

app.get('/api/stats', (req, res) => {
  const data = loadData();
  let totalProfit = 0;
  let totalPurchase = 0;
  data.forEach((gift) => {
    if (gift.sellPrice != null) {
      totalProfit += gift.pnl;
      totalPurchase += gift.purchasePrice;
    }
  });
  const overallPnlPercent = totalPurchase ? (totalProfit / totalPurchase) * 100 : 0;
  res.json({ totalProfit, overallPnlPercent, sold: data.filter(g => g.sellPrice != null).length, total: data.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
