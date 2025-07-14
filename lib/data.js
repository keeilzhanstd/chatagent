const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_DIR || (process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'data'));
const DATA_FILE = path.join(dataDir, 'gifts.json');

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

function getOverallStats(data) {
  let totalProfit = 0;
  let totalPurchase = 0;
  data.forEach((gift) => {
    if (gift.sellPrice != null) {
      totalProfit += gift.pnl;
      totalPurchase += gift.purchasePrice;
    }
  });
  const overallPnlPercent = totalPurchase ? (totalProfit / totalPurchase) * 100 : 0;
  return { totalProfit, overallPnlPercent, sold: data.filter(g => g.sellPrice != null).length, total: data.length };
}

module.exports = {
  DATA_FILE,
  loadData,
  saveData,
  computeStats,
  getOverallStats
};
