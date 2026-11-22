export function sourceIdentity(product) {
  return String(product.source_product_id || product.product_id || product.sourceProductId || '').trim()
}

export function productHref(product) {
  const id = sourceIdentity(product)
  return id ? `/products/source/${encodeURIComponent(id)}` : `/products?search=${encodeURIComponent(product.name || '')}`
}

export function findSourceProduct(products, id) {
  const index = products.findIndex(product => sourceIdentity(product) === String(id))
  return index < 0 ? null : { ...products[index], index }
}
