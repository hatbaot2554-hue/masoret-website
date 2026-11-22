import { notFound } from 'next/navigation'
import ProductPageClient from '../../[id]/ProductPageClient'
import { findSourceProduct } from '../../../lib/productIdentity.mjs'

export default async function SourceProductPage({ params }) {
  const response = await fetch(
    'https://raw.githubusercontent.com/hatbaot2554-hue/masoret-automation/refs/heads/main/products.json',
    { cache: 'no-store', signal: AbortSignal.timeout(15000) }
  )
  if (!response.ok) throw new Error('Catalog unavailable')
  const product = findSourceProduct(await response.json(), params.id)
  if (!product) notFound()
  return <ProductPageClient product={product} />
}
