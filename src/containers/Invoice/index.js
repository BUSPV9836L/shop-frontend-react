import { useEffect, useState } from "react";
import String from "../../string";

const Invoice = () => {
  const [stockOption, setStockOption] = useState([]);
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity_available: "",
    quantity: "",
    total_price: "",
    mrp: "",
  });
  const getAllStocks = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/stocks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setStockOption(data);
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setIsLoading(false);
    }
  };
  const createNewInvoice = async () => {
    setIsLoading(true);
    setIsCreatingSale(true);
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product?.name.split(",")[0],
          brand: product?.brand,
          category: product?.category,
          price: product?.price,
          quantity: product?.quantity,
          total_price: product?.total_price,
          mrp: product?.mrp,
        }),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        alert("Sale invoice created successfully!");
        setProduct({
          name: "",
          brand: "",
          category: "",
          price: "",
          quantity_available: "",
          quantity: "",
          total_price: "",
          mrp: "",
        });
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setIsLoading(false);
      setIsCreatingSale(false);
    }
  };
  useEffect(() => {
    getAllStocks();
  }, []);
  const handelChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      console.log(value?.split(",")[0]);
      const selectProduct = stockOption?.filter((e) => {
        if (
          value?.split(",")[0] === e.name &&
          value?.split(",")[1] == e?.brand
        ) {
          return e;
        }
      })[0];
      setProduct(() => {
        return {
          name: value,
          brand: selectProduct?.brand,
          category: selectProduct?.category,
          price: selectProduct?.price,
          quantity_available: selectProduct?.quantity_available,
          quantity: "",
          total_price: "",
          mrp: selectProduct?.price,
        };
      });
    } else if (name == "quantity" || name == "price") {
      setProduct((prev) => {
        return {
          ...prev,
          [name]: value,
          total_price:
            ((name === "quantity" ? value : prev.quantity) || 0) *
            ((name === "price" ? value : prev.price) || 0),
        };
      });
    }
  };

  const createInvoice = () => {
    return (
      <div className=" card ">
        <form className=" row ">
          <div class="form-group col-md-3">
            <label for="name" class="form-label">
              Product Name
            </label>
            <select
              type="text"
              name="name"
              value={product?.name}
              id="name"
              class="form-control"
              onChange={(e) => handelChange(e)}
            >
              <option value={0}>select</option>
              {stockOption?.map((e) => (
                <option value={e?.name + "," + e?.brand}>
                  {e?.name + ", " + e?.brand}
                </option>
              ))}
            </select>
          </div>
          <div class="form-group col-md-3">
            <label for="brand" class="form-label">
              Brand
            </label>
            <input
              disabled
              type="text"
              name="brand"
              value={product?.brand}
              id="brand"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-3">
            <label for="category" class="form-label">
              Category
            </label>
            <input
              disabled
              type="text"
              name="category"
              value={product?.category}
              id="category"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-3">
            <label for="price" class="form-label">
              MRP
            </label>
            <input
              disabled
              onChange={(e) => handelChange(e)}
              type="text"
              name="price"
              value={product?.mrp}
              id="price"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-3 mt-3">
            <label for="price" class="form-label">
              Sale Rate
            </label>
            <input
              onChange={(e) => {
                let number = e.target.value;
                if (isNaN(number) || number < 0) {
                  return;
                } else if (/^0/.test(number)) {
                  number = number.replace(/^0/, "");
                }
                 else {
                  handelChange(e);
                }
              }}
              type="text"
              name="price"
              value={product?.price}
              id="price"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-3 mt-3">
            <label for="quantity_available" class="form-label">
              Avilable Quantity
            </label>
            <input
              disabled
              type="text"
              value={product?.quantity_available}
              name="quantity_available"
              id="quantity_available"
              class="form-control"
            />
          </div>
          <div class="form-group col-md-3 mt-3">
            <label for="quantity" class="form-label">
              Quantity
            </label>
            <input
              type="text"
              value={product?.quantity}
              name="quantity"
              id="quantity"
              class="form-control"
              onChange={(e) => {
                let number = e.target.value;
                if (isNaN(number) || number < 0 || number % 1 !== 0) {
                  return;
                } else if (/^0/.test(number)) {
                  number = number.replace(/^0/, "");
                }else if(number>product?.quantity_available){
                  alert("Quantity cannot be greater than avilable quantity!");
                  return
                }
                 else {
                  handelChange(e);
                }
              }}
            />
          </div>
          <div class="form-group col-md-3 mt-3">
            <label for="total_price" class="form-label">
              Total Price
            </label>
            <input
              disabled
              type="text"
              value={product?.total_price}
              name="total_price"
              id="total_price"
              class="form-control"
            />
          </div>
        </form>
      </div>
    );
  };
  const handelAddNew = () => {
    setProduct({
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      quantity: "",
      total_price: "",
    });
  };
  return (
    <div>
      <h4 className="heading-text mb-3">Invoice</h4>
      {isLoading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <div style={{ marginRight: "20px" }} className=" mb-3 text-end">
        <button
          onClick={createNewInvoice}
          style={{ marginRight: "20px" }}
          className=" btn "
          disabled={
            !product.name ||
            !product.quantity ||
            !product.price ||
            isCreatingSale
          }
        >
          Create Sale
        </button>
        <button onClick={handelAddNew} className=" btn">
          Add New
        </button>
      </div>
      {createInvoice()}
    </div>
  );
};

export default Invoice;
