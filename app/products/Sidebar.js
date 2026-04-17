export default function Sidebar({ categoryTree, category }) {
  var activeParent = null
  for (var i = 0; i < categoryTree.length; i++) {
    var item = categoryTree[i]
    if (item.parent === category) { activeParent = item; break }
    if (item.children && item.children.indexOf(category) !== -1) { activeParent = item; break }
  }

  return (
    <aside style={{ width: '220px', flexShrink: 0 }}>
      <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#2C2416' }}>קטגוריות</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '8px' }}>
          <a href="/products" style={{ color: category ? '#6B5C3E' : '#8B6914', textDecoration: 'none', fontSize: '14px', fontWeight: category ? '400' : '700' }}>
            כל הספרים
          </a>
        </li>
        {categoryTree.map(function(item) {
          var isActive = activeParent !== null && activeParent.parent === item.parent
          var linkColor = category === item.parent ? '#8B6914' : '#2C2416'
          return (
            <li key={item.parent} style={{ marginBottom: '4px' }}>
              <a href={'/products?category=' + encodeURIComponent(item.parent)}
                style={{ display: 'block', color: linkColor, textDecoration: 'none', fontSize: '14px', fontWeight: '700', padding: '6px 0', borderBottom: '1px solid #EDE6D9' }}>
                {item.parent}
              </a>
              {isActive && item.children && item.children.length > 0 && renderChildren(item.children, category)}
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

function renderChildren(children, category) {
  return (
    <ul style={{ listStyle: 'none', padding: '4px 0 4px 12px', margin: 0 }}>
      {children.map(function(child) {
        var childColor = category === child ? '#8B6914' : '#6B5C3E'
        var childWeight = category === child ? '700' : '400'
        return (
          <li key={child} style={{ marginBottom: '4px' }}>
            <a href={'/products?category=' + encodeURIComponent(child)}
              style={{ color: childColor, textDecoration: 'none', fontSize: '13px', fontWeight: childWeight }}>
              {child}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
