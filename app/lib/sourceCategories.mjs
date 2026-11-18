export function categoryHref(node) {
  return '/products?category=' + encodeURIComponent(node.id ? 'source:' + node.id : node.name || node.parent);
}

export function categoryNodes(tree) {
  return (tree || []).map(item => ({
    ...item, name: item.name || item.parent,
    children: item.nodes || (item.children || []).map(name => ({ name, children: [] })),
  }));
}

export function flattenCategories(nodes, depth = 0) {
  return nodes.flatMap(node => [{ ...node, depth }, ...flattenCategories(node.children || [], depth + 1)]);
}

export function findSourceCategory(tree, query) {
  return flattenCategories(categoryNodes(tree)).find(node =>
    query === 'source:' + node.id || query === node.name);
}

export function matchesSourceCategory(product, node) {
  const descendants = flattenCategories([node]);
  if (Array.isArray(product.source_category_ids)) {
    const ids = new Set(descendants.map(item => item.id));
    return product.source_category_ids.some(id => ids.has(id));
  }
  const names = new Set(descendants.map(item => item.name));
  return (product.categories || []).some(name => names.has(name));
}
