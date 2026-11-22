import { redirect } from 'next/navigation'

// Historic array indexes cannot reliably identify a product after catalog reordering.
export default function LegacyProductPage() {
  redirect('/products')
}
