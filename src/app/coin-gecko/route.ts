export const revalidate = 60 * 60 * 24; // 24 hours

const API_KEY = process.env.COIN_GECKO_API_KEY;

async function getSimplePrice(currency: string, vs_currency: string) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${currency}&vs_currencies=${vs_currency}&x_cg_demo_api_key=${API_KEY}`;

  return fetch(url);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') || 'bitcoin';
  const vs_currency = searchParams.get('vs_currency') || 'usd';

  const res = await getSimplePrice(currency, vs_currency);
  const data = await res.json();

  return Response.json(data);
}
