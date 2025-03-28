import { useEffect, useState } from "react";
import { getProducts } from "../services/apiProducts";
import { IProduct } from "../types/IProduct";
import { useNavigate } from "react-router";
import "../styles/Home.css";
import { useCart } from "../hooks/useCart";
import { CartActionType } from "../reducers/CartReducer";
import { FaShoppingCart } from "react-icons/fa";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError("Kunde inte hämta produkter");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: IProduct) => {
    dispatch({
      type: CartActionType.ADD_ITEM,
      payload: { product, quantity: 1 },
    });
  };


  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <p>Laddar produkter...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="home-container">
      
      <div className="header-container">
        <button className="admin-button" onClick={() => navigate("/admin/products")}>
          Admin
        </button>
        <div className="cart-button" onClick={() => navigate("/cart")}>
          <FaShoppingCart size={30} />
          {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
        </div>
      </div>

      <div className="home-header">
        <h1 className="title">ColourFlow</h1>
      </div>

      <div className="product-area">
        <div className="product-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-item" 
              onClick={() => navigate(`/product/${product.id}`)}
              style={{ cursor: "pointer" }} 
            >
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price} kr</p>
              <div className="button-container">
                <button 
                  className="btn add-btn" 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    addToCart(product);
                  }}
                >Lägg till
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
