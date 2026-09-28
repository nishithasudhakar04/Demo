import './App.css';
import { useMemo, useState } from 'react';

const products = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 79.99, description: 'Premium sound quality' },
  { id: 2, name: 'Coffee Maker', category: 'Appliances', price: 49.99, description: 'Brew your perfect cup' },
  { id: 3, name: 'Desk Lamp', category: 'Lighting', price: 34.99, description: 'Bright and adjustable' },
  { id: 4, name: 'Phone Stand', category: 'Accessories', price: 19.99, description: 'Sturdy and portable' },
  { id: 5, name: 'USB-C Cable', category: 'Cables', price: 12.99, description: 'Fast charging enabled' },
  { id: 6, name: 'Wireless Mouse', category: 'Electronics', price: 29.99, description: 'Precise tracking' },
];

const stores = [
  { id: 'gachibowli', name: 'ShopHub at Gachibowli', area: 'Gachibowli, Hyderabad', discount: 'Up to 15% off select electronics' },
  { id: 'banjara-hills', name: 'ShopHub at Banjara Hills', area: 'Banjara Hills, Hyderabad', discount: 'Up to 20% off select home essentials' },
  { id: 'hitex', name: 'ShopHub at HITEX', area: 'HITEX, Hyderabad', discount: 'Up to 10% off select accessories' },
];

const initialOrders = [
  { id: 101, date: 'Aug 18, 2026', items: [{ name: 'Wireless Headphones', qty: 1, price: 79.99 }], total: 79.99, status: 'Delivered' },
  { id: 102, date: 'Aug 10, 2026', items: [{ name: 'Coffee Maker', qty: 1, price: 49.99 }, { name: 'Desk Lamp', qty: 2, price: 34.99 }], total: 119.97, status: 'Delivered' },
];

function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(initialOrders);
  const [confirmed, setConfirmed] = useState(false);

  const cartItems = cart.length;
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  }, [cart]);

  const changePage = (nextPage) => {
    setConfirmed(false);
    setPage(nextPage);
  };

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...currentCart, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === productId ? { ...item, qty } : item
        )
      );
    }
  };

  const placeOrder = () => {
    const order = {
      id: Math.floor(Math.random() * 10000) + 100,
      date: 'Aug 25, 2026',
      items: cart.map((item) => ({ name: item.name, qty: item.qty, price: item.price })),
      total: cartTotal,
      status: 'Processing',
    };
    setOrders((currentOrders) => [order, ...currentOrders]);
    setCart([]);
    setConfirmed(true);
  };

  return (
    <div className="App">
      <header className="site-header">
        <button className="brand" onClick={() => changePage('home')} aria-label="Go to home">
          <span className="brand-mark">🛍</span>
          <span>ShopHub</span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={page === 'home' ? 'active' : ''} onClick={() => changePage('home')}>Shop</button>
          <button className={page === 'stores' ? 'active' : ''} onClick={() => changePage('stores')}>Stores</button>
          <button className={page === 'cart' ? 'active' : ''} onClick={() => changePage('cart')}>Cart {cartItems > 0 && <span className="badge">{cartItems}</span>}</button>
          <button className={page === 'orders' ? 'active' : ''} onClick={() => changePage('orders')}>Orders</button>
        </nav>
        <div className="header-profile"><span className="avatar">JS</span><span>John Smith</span><span className="chevron">v</span></div>
      </header>

      <main>
        {page === 'home' && (
          <section className="home-page page-shell">
            <div className="hero-copy">
              <p className="eyebrow">SHOP WITH CONFIDENCE</p>
              <h1>Premium<br /><em>Products.</em></h1>
              <p className="hero-intro">Discover quality electronics, appliances, and accessories for your everyday needs.</p>
            </div>

            <div className="products-panel">
              <div className="panel-heading"><div><span className="section-kicker">FEATURED PRODUCTS</span><h2>Browse our collection</h2></div><span className="step-count">{cart.length} in cart</span></div>
              <div className="products-grid">
                {products.map((product) => {
                  const cartItem = cart.find((item) => item.id === product.id);
                  return (
                    <div key={product.id} className="product-card">
                    <div className="product-header">
                      <strong>{product.name}</strong>
                      <small>{product.category}</small>
                    </div>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      {cartItem ? (
                        <div className="product-quantity">
                          <span className="added-label">Added</span>
                          <button aria-label={`Remove one ${product.name}`} onClick={() => updateQuantity(product.id, cartItem.qty - 1)}>−</button>
                          <span aria-label={`${cartItem.qty} in cart`}>{cartItem.qty}</span>
                          <button aria-label={`Add one ${product.name}`} onClick={() => addToCart(product)}>+</button>
                        </div>
                      ) : (
                        <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                      )}
                    </div>
                    </div>
                  );
                })}
              </div>
              <div className="home-footnote"><span>FREE SHIPPING</span><span>on orders over $50</span><span>Easy returns</span></div>
            </div>
          </section>
        )}

        {page === 'stores' && (
          <section className="page-shell stores-page">
            <div className="page-title">
              <div>
                <p className="eyebrow">SHOPHUB IN HYDERABAD</p>
                <h1>Visit us<br /><em>in person.</em></h1>
                <p>Find your nearest branch and explore in-store offers.</p>
              </div>
              <span className="store-count">{stores.length} offline stores</span>
            </div>
            <div className="store-grid">
              {stores.map((store, index) => (
                <article className="store-card" key={store.id}>
                  <span className="store-number">0{index + 1} / HYDERABAD</span>
                  <h2>{store.name}</h2>
                  <p className="store-area">{store.area}</p>
                  <div className="store-offer">
                    <span>IN-STORE OFFER</span>
                    <strong>{store.discount}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {page === 'cart' && (
          <section className="page-shell cart-page">
            <div className="page-title"><div><p className="eyebrow">YOUR SHOPPING</p><h1>Shopping Cart</h1><p>{cart.length === 0 ? 'Your cart is empty' : `You have ${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}</p></div><button className="primary-button compact" onClick={() => changePage('home')}>Continue Shopping <span>+</span></button></div>
            {cart.length === 0 ? (
              <div className="empty-cart"><p>No items in your cart yet. Start shopping!</p></div>
            ) : (
              <div className="cart-container">
                <div className="cart-items">
                  <div className="cart-header"><span>PRODUCT</span><span>QTY</span><span>PRICE</span><span>TOTAL</span><span></span></div>
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="item-name">
                        <strong>{item.name}</strong>
                        <small>{item.category}</small>
                      </div>
                      <div className="item-qty">
                        <button onClick={() => updateQuantity(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                      </div>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <span className="item-total">${(item.price * item.qty).toFixed(2)}</span>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="summary-row"><span>Subtotal</span><strong>${cartTotal.toFixed(2)}</strong></div>
                  <div className="summary-row"><span>Shipping</span><strong>FREE</strong></div>
                  <div className="summary-row total"><span>Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
                  <button className="primary-button full-width" onClick={() => changePage('checkout')}>Proceed to Checkout <span>→</span></button>
                </div>
              </div>
            )}
          </section>
        )}

        {page === 'checkout' && (
          <section className="page-shell confirmation-page">
            <div className="confirmation-intro">
              <p className="eyebrow">ALMOST DONE</p>
              <h1>Review your<br /><em>order.</em></h1>
              <p>Make sure everything looks correct before placing your order.</p>
            </div>
            <div className="confirmation-card">
              <div className="card-top"><span className="section-kicker">ORDER SUMMARY</span><span className="status-label">READY TO ORDER</span></div>
              <div className="order-items">
                {cart.map((item) => (
                  <div className="order-item" key={item.id}>
                    <div><strong>{item.name}</strong><small>Qty: {item.qty}</small></div>
                    <strong>${(item.price * item.qty).toFixed(2)}</strong>
                  </div>
                ))}
              </div>
              <div className="detail-grid">
                <div><small>ITEMS</small><strong>{cart.length}</strong></div>
                <div><small>SUBTOTAL</small><strong>${cartTotal.toFixed(2)}</strong></div>
                <div><small>SHIPPING</small><strong>FREE</strong></div>
                <div><small>TOTAL</small><strong>${cartTotal.toFixed(2)}</strong></div>
              </div>
              <div className="total-row"><span>Order Total</span><strong>${cartTotal.toFixed(2)}</strong></div>
              <button className="primary-button" onClick={placeOrder}>{confirmed ? 'Order placed' : 'Place Order'} <span>{confirmed ? '✓' : '→'}</span></button>
              {confirmed && <p className="confirmation-success">Your order has been placed successfully! Check your orders page for details.</p>}
            </div>
            <button className="back-link" onClick={() => changePage('cart')}>← Back to cart</button>
          </section>
        )}

        {page === 'orders' && (
          <section className="page-shell travel-page">
            <div className="page-title"><div><p className="eyebrow">YOUR ORDERS</p><h1>Order History</h1><p>Track all your previous purchases</p></div><button className="primary-button compact" onClick={() => changePage('home')}>Continue Shopping <span>+</span></button></div>
            <div className="travel-summary">
              <div><span className="summary-number">{orders.length}</span><span>total orders</span></div>
              <div><span className="summary-number">${orders.reduce((total, order) => total + order.total, 0).toFixed(2)}</span><span>total spent</span></div>
              <div><span className="summary-number">{orders.filter((o) => o.status === 'Delivered').length}</span><span>delivered</span></div>
            </div>
            <div className="history-list">
              <div className="list-header"><span>ORDER HISTORY</span><span>{orders.length} orders</span></div>
              {orders.map((order, index) => (
                <article className="history-item" key={order.id}>
                  <div className="trip-index">#{order.id}</div>
                  <div className="trip-route">
                    <strong>{order.items.map((item) => item.name).join(', ')}</strong>
                    <small>{order.date} <i /> {order.items.length} item{order.items.length !== 1 ? 's' : ''}</small>
                  </div>
                  <div className="trip-mode"><span className={`mode-chip ${order.status.toLowerCase()}`}>{order.status}</span></div>
                  <strong className="trip-price">${order.total.toFixed(2)}</strong>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      <footer><span>SHOPHUB / 2026</span><span>Quality products, delivered to your door.</span></footer>
    </div>
  );
}

export default App;
