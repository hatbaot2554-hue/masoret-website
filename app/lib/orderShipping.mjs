export class ShippingValidationError extends Error {}

export async function validateOrderShipping(body, items, address, getQuote) {
  const method = body.shippingMethod;
  if (!['home', 'pickup', 'self'].includes(method)) {
    throw new ShippingValidationError('יש לבחור שיטת משלוח תקינה.');
  }
  let amount = 0;
  if (method !== 'self') {
    const rates = await getQuote(items.map(item => ({
      productId: item.variationId || item.sourceProductId,
      quantity: item.quantity,
    })), address.city);
    amount = rates[method === 'home' ? 'home_delivery' : 'pickup_point'];
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
      throw new ShippingValidationError('לא התקבל מחיר מאומת לשיטת המשלוח שנבחרה.');
    }
  }
  if (typeof body.shippingPrice !== 'number' || !Number.isFinite(body.shippingPrice) ||
      Math.round(body.shippingPrice * 100) !== Math.round(amount * 100)) {
    throw new ShippingValidationError('מחיר המשלוח השתנה. יש לרענן את הסל ולאשר את המחיר המעודכן.');
  }
  return { method, amount };
}
