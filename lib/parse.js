const fetch = global.fetch || require('node-fetch');

async function parseGift(link) {
  const res = await fetch(link);
  if (!res.ok) throw new Error('Failed to fetch');
  const html = await res.text();
  const image = html.match(/property="og:image" content="([^"]+)"/i);
  const descMatch = html.match(/property="og:description" content="([^"]+)"/i);
  let model = null;
  let backdrop = null;
  let symbol = null;
  if (descMatch) {
    const desc = descMatch[1];
    const modelMatch = /Model:\s*([^\n]+)/i.exec(desc);
    const backdropMatch = /Backdrop:\s*([^\n]+)/i.exec(desc);
    const symbolMatch = /Symbol:\s*([^\n]+)/i.exec(desc);
    model = modelMatch ? modelMatch[1].trim() : null;
    backdrop = backdropMatch ? backdropMatch[1].trim() : null;
    symbol = symbolMatch ? symbolMatch[1].trim() : null;
  }
  return {
    preview: image ? image[1] : null,
    model,
    backdrop,
    symbol,
  };
}

module.exports = { parseGift };
