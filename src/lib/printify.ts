const PRINTIFY_BASE_URL = 'https://api.printify.com/v1'

export interface PrintifyAddress {
  first_name: string
  last_name: string
  email: string
  phone?: string
  country: string
  region: string
  address1: string
  address2?: string
  city: string
  zip: string
}

export async function getPrintifyShopStatus() {
  const token = process.env.PRINTIFY_API_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID || '29416532'

  if (!token) {
    return { configured: false, shopId }
  }

  const res = await fetch(`${PRINTIFY_BASE_URL}/shops.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Printify API returned ${res.status}`)
  }

  const shops = await res.json()
  return {
    configured: true,
    shopId,
    shops,
  }
}
