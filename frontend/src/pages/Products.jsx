import { useEffect, useState } from "react";
import API from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const [productForm, setProductForm] = useState({
    name: "",
    hsn_code: "",
  });

  const [variantForm, setVariantForm] = useState({
    thickness_mm: "",
    length_ft: "",
    width_ft: "",
    price_type: "SHEET",
    price: "",
    stock_sheets: "",
    minimum_stock: "",
  });

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await API.get("products/");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT
  const handleAddProduct = async (e) => {
    e.preventDefault();

    await API.post("products/", productForm);

    setProductForm({ name: "", hsn_code: "" });
    fetchProducts();
  };

  // ADD VARIANT
  const handleAddVariant = async (productId) => {
    await API.post("variants/", {
      ...variantForm,
      product: productId,
    });

    setVariantForm({
      thickness_mm: "",
      length_ft: "",
      width_ft: "",
      price_type: "SHEET",
      price: "",
      stock_sheets: "",
      minimum_stock: "",
    });

    fetchProducts();
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">Products</h1>

      {/* ADD PRODUCT */}
      <form
        onSubmit={handleAddProduct}
        className="bg-white p-6 rounded-xl shadow mb-10 space-y-4"
      >
        <input
          type="text"
          placeholder="Product Name"
          required
          value={productForm.name}
          onChange={(e) =>
            setProductForm({ ...productForm, name: e.target.value })
          }
          className="border px-3 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder="HSN Code"
          value={productForm.hsn_code}
          onChange={(e) =>
            setProductForm({ ...productForm, hsn_code: e.target.value })
          }
          className="border px-3 py-2 rounded w-full"
        />

        <button className="bg-teal-600 text-white px-6 py-2 rounded">
          Add Product
        </button>
      </form>

      {/* PRODUCT LIST */}
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow mb-6"
        >
          <div
            className="p-4 flex justify-between cursor-pointer border-b"
            onClick={() =>
              setExpanded(expanded === product.id ? null : product.id)
            }
          >
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">
                HSN: {product.hsn_code}
              </p>
            </div>
            <span>{expanded === product.id ? "▲" : "▼"}</span>
          </div>

          {expanded === product.id && (
            <div className="p-6 bg-gray-50 space-y-4">

              {/* VARIANTS */}
              {product.variants.map((v) => (
                <div
                  key={v.id}
                  className="bg-white p-4 rounded border"
                >
                  <p>
                    {v.thickness_mm}mm | {v.length_ft}x{v.width_ft} ft
                  </p>
                  <p>
                    ₹{v.price} ({v.price_type})
                  </p>
                  <p>
                    Stock: {v.stock_sheets} | Status: {v.stock_status}
                  </p>
                </div>
              ))}

              {/* ADD VARIANT */}
              <div className="bg-white p-4 rounded border space-y-3">
                <h3 className="font-semibold">Add Variant</h3>

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    placeholder="Thickness"
                    value={variantForm.thickness_mm}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        thickness_mm: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Length"
                    value={variantForm.length_ft}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        length_ft: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Width"
                    value={variantForm.width_ft}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        width_ft: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <select
                    value={variantForm.price_type}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        price_type: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="SHEET">Per Sheet</option>
                    <option value="SQFT">Per Square Feet</option>
                  </select>

                  <input
                    type="number"
                    placeholder="Price"
                    value={variantForm.price}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        price: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={variantForm.stock_sheets}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        stock_sheets: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />

                  <input
                    type="number"
                    placeholder="Minimum Stock"
                    value={variantForm.minimum_stock}
                    onChange={(e) =>
                      setVariantForm({
                        ...variantForm,
                        minimum_stock: e.target.value,
                      })
                    }
                    className="border px-2 py-1 rounded"
                  />
                </div>

                <button
                  onClick={() => handleAddVariant(product.id)}
                  className="bg-teal-600 text-white px-4 py-2 rounded"
                >
                  Save Variant
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}