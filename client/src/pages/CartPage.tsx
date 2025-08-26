import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    alert('Compra simulada completada. ¡Gracias!');
    // Lógica para limpiar el carrito, etc.
  };

  return (
    <div className="cart-container">
      <h2>Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <h4>{item.name}</h4>
                <p>Cantidad: {item.qty}</p>
                <p>Precio: ${item.price}</p>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Subtotal: ${subtotal.toFixed(2)}</h3>
            <button onClick={handleCheckout}>Proceder al Pago</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;