const { loadData, saveData, computeStats } = require('../lib/data');

module.exports = (req, res) => {
  const method = req.method;
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'id required' });
  if (method === 'PATCH') {
    const { sellPrice, sellCurrency } = req.body;
    const data = loadData();
    const gift = data.find(g => g.id === id);
    if (!gift) return res.status(404).json({ error: 'not found' });
    if (sellPrice != null) gift.sellPrice = parseFloat(sellPrice);
    if (sellCurrency != null) gift.sellCurrency = sellCurrency;
    computeStats(gift);
    saveData(data);
    return res.status(200).json(gift);
  }
  res.status(405).json({ error: 'Method not allowed' });
};
