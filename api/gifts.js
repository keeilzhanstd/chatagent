const { loadData, saveData, computeStats } = require('../lib/data');

module.exports = (req, res) => {
  const method = req.method;
  if (method === 'GET') {
    const data = loadData();
    return res.status(200).json(data);
  }
  if (method === 'POST') {
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
    return res.status(200).json(newGift);
  }
  res.status(405).json({ error: 'Method not allowed' });
};
