export class OrderValidationError extends Error {}

function invalid(message) { throw new OrderValidationError(message); }
function integer(value, max = 10000) {
  return Number.isInteger(value) && value >= 1 && value <= max;
}
function money(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) invalid('מחיר המוצר אינו זמין כרגע.');
  return Math.round(number * 100) / 100;
}

export function engravingPrice(engraving, quantity) {
  if (!engraving || engraving.type === 'none') return 0;
  if (engraving.type === 'single') {
    if (!integer(engraving.qty, 13) || engraving.qty > quantity || !String(engraving.text || '').trim()) {
      invalid('יש לבדוק את הטקסט וכמות הספרים להטבעה.');
    }
    return engraving.qty * 15;
  }
  if (engraving.type === 'bulk') {
    if (engraving.bulkType === 'up100' && quantity <= 100) return 170;
    if (engraving.bulkType === 'over100' && integer(engraving.extraQty) && engraving.extraQty >= Math.max(1, quantity - 100)) {
      return 170 + engraving.extraQty;
    }
  }
  invalid('אפשרויות ההטבעה אינן תקינות. יש לבחור אותן מחדש.');
}

export function priceOrderItems(items, catalog) {
  if (!Array.isArray(items) || !items.length || items.length > 100) invalid('הסל אינו תקין.');
  if (!Array.isArray(catalog) || !catalog.length) throw new Error('Catalog unavailable');
  const priced = items.map(item => {
    if (!item || !integer(item.quantity)) invalid('כמות המוצר אינה תקינה.');
    const suppliedId = String(item.sourceProductId || '');
    let index = Number.isInteger(item.sourceProductIndex) ? item.sourceProductIndex : -1;
    let product = catalog[index];
    const matchesId = p => p && [p.product_id, p.source_product_id, p.url].filter(Boolean).some(id => String(id) === suppliedId);
    if (suppliedId && !matchesId(product)) {
      index = catalog.findIndex(matchesId);
      product = catalog[index];
    }
    if (!product) invalid('מוצר בסל אינו קיים עוד. יש לעדכן את הסל.');
    if (product.in_stock !== true || product.needs_revalidation || product.source_catalog_missing) {
      invalid('המוצר ' + product.name + ' אינו זמין להזמנה כרגע.');
    }
    const variations = Array.isArray(product.variations) ? product.variations : [];
    const variation = item.variationId == null ? null : variations.find(v => String(v.variation_id) === String(item.variationId));
    if ((variations.length && !variation) || (item.variationId != null && !variation)) invalid('יש לבחור מחדש את אפשרויות המוצר ' + product.name + '.');
    if (variation && variation.in_stock !== true) invalid('אפשרות המוצר שנבחרה אינה במלאי.');
    const basePrice = money((variation || product).price);
    if (basePrice <= 0) invalid('מחיר המוצר אינו זמין כרגע.');
    const extra = engravingPrice(item.engraving, item.quantity);
    const lineTotal = money(basePrice * item.quantity + extra);
    const submitted = Number(item.price) * item.quantity;
    if (!Number.isFinite(submitted) || Math.abs(submitted - lineTotal) > 0.011) {
      invalid('המחיר של ' + product.name + ' השתנה. יש להסיר את המוצר מהסל ולהוסיף אותו מחדש.');
    }
    const cost = money((variation || product).original_price);
    return {
      sourceProductId: product.product_id || product.source_product_id || product.url,
      sourceProductIndex: index,
      variationId: variation?.variation_id || null,
      name: product.name, image: product.image || '', sku: variation?.sku || product.sku || '',
      selectedAttributes: variation?.attributes || item.selectedAttributes || {},
      quantity: item.quantity, price: lineTotal / item.quantity, cost,
      basePrice, lineTotal,
      engraving: item.engraving ? { ...item.engraving, extraCost: extra } : null,
      sketchFile: item.sketchFile || item.engraving?.sketchFile || null,
    };
  });
  return {
    items: priced,
    subtotal: Math.ceil(priced.reduce((total, item) => total + item.lineTotal, 0)),
    cost: money(priced.reduce((total, item) => total + item.cost * item.quantity, 0)),
  };
}
