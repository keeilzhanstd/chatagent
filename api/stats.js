const { loadData, getOverallStats } = require('../lib/data');

module.exports = (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const data = loadData();
  const stats = getOverallStats(data);
  res.status(200).json(stats);
};
