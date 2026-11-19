import fs from 'fs';
import path from 'path';

const envPath = path.resolve('c:/Users/ryanb/OneDrive/Documents/Digital Dads/EvermarkPrints/.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const tokenMatch = env.match(/PRINTIFY_API_TOKEN=([^\r\n]+)/);
const token = tokenMatch ? tokenMatch[1].trim() : null;
const shopId = '29416532';

async function checkOrders() {
  const ids = [
    { name: 'Karen Anderson', id: '6afdcc236222f8adf70cea97' },
    { name: 'Test Order 1', id: '6afdce94ceead36f890387c1' },
    { name: 'Test Order 2', id: '6afdcea8bb8efb8ae90478e6' }
  ];

  for (const item of ids) {
    const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/orders/${item.id}.json`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log(`[${item.name}] ID: ${item.id} | Status: ${data.status} | Shipments: ${data.shipments?.length || 0}`);
    if (data.shipments && data.shipments.length > 0) {
      console.log('  Shipment details:', JSON.stringify(data.shipments, null, 2));
    }
  }
}

checkOrders().catch(console.error);
