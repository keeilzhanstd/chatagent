const express = require('express');
const bodyParser = require('body-parser');
const { loadData, saveData, computeStats, getOverallStats } = require('./lib/data');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


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

app.patch('/api/gift', (req, res) => {
  const { id } = req.query;
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
  const stats = getOverallStats(data);
  res.json(stats);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
