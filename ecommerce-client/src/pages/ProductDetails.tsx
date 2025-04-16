import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProductById } from "../services/apiProducts"; 
import { IProduct } from "../types/IProduct";
import { useCart } from "../hooks/useCart";
import { CartActionType } from "../reducers/CartReducer";
import '../styles/ProductDetails.css'
import { FaShoppingCart } from "react-icons/fa";


const ProductDetails = () => {
  const { id } = useParams<{ id: string }>(); 
  const [product, setProduct] = useState<IProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { cart, dispatch } = useCart();  

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        setError("Kunde inte hämta produktinformation.");
      }
    };
    fetchProductDetails();
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    console.log("Lägger till produkt i kundvagn:", product);
    dispatch({
      type: CartActionType.ADD_ITEM,
      payload: { product, quantity: 1 },
    });
  };

  const navigate = useNavigate();

  const goBackHome = () => {
    navigate("/"); 
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0); 
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Laddar produkt...</p>;

  return (
    <div className="wrapper">
      <div className="btn-details">
        <button onClick={goBackHome} className="pink-btn">Tillbaka</button>
        <div className="cart-btn-details" onClick={() => navigate("/cart")}>
          <FaShoppingCart size={30} />
          {totalCartItems > 0 && <span className="cart-count_Details">{totalCartItems}</span>}
        </div>
      </div>
      <h1>{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "300px", height: "300px", objectFit: "cover" }}
      />
      <p><strong>ID:</strong> {product.id}</p>
      <p><strong>Pris:</strong> {product.price} kr</p>
      <p><strong>Beskrivning:</strong> {product.description}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Kategori:</strong> {product.category}</p>
      <button onClick={addToCart} className="add-to-cart-btn">Lägg i varukorgen</button>
    </div>
  );
};

export default ProductDetails;
