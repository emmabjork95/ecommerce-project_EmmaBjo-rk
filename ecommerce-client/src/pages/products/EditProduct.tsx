import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProductById, updateProduct } from "../../services/apiProducts";
import { IProduct } from "../../types/IProduct";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError("Kunde inte hämta produktdata");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!product) return;
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !product.id) {
      setError("Produktens ID saknas eller är ogiltigt.");
      return;
    }

    try {
      await updateProduct(product.id, product);
      alert("Produkten har uppdaterats!");
      navigate("/admin/products");
    } catch (err) {
      setError("Misslyckades att uppdatera produkten.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Laddar produkt...</p>;

  return (
    <div className="create-product-container">
      <form onSubmit={handleSubmit}>
        <h2>Redigera Produkt</h2>

        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "150px", height: "auto", borderRadius: "5px" }}
          />
        )}

        <div className="create-product-group">
          <label className="create-product-label">Produktnamn:</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} className="create-product-input" />
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Pris:</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} className="create-product-input" />
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Lagerantal:</label>
          <input type="number" name="stock" value={product.stock} onChange={handleChange} className="create-product-input" />
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Kategori:</label>
          <select name="category" value={product.category} onChange={handleChange} className="create-product-select">
            <option value="Pennor">Pennor</option>
            <option value="Böcker">Böcker</option>
          </select>
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Beskrivning:</label>
          <textarea name="description" value={product.description} onChange={handleChange} className="create-product-textarea"></textarea>
        </div>

        <div className="create-product-group">
          <label className="create-product-label">Bild-URL:</label>
          <input type="text" name="image" value={product.image} onChange={handleChange} className="create-product-input" />
        </div>

        <div className="create-product-buttons">
          <button type="submit" className="create-product-btn">Spara ändringar</button>
          <button type="button" onClick={() => navigate("/admin/products")} className="cancel-btn">Avbryt</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
