import { useEffect, useState } from "react";
import String from "../../string";
import { useNavigate } from "react-router";
const Invoice = () => {
  const [stockOption, setStockOption] = useState([]);
  const [isCreatingSale, setIsCreatingSale] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [idFromValid, setIsFromValid] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState([
    {
      id: 0,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      quantity: "",
      total_price: "",
      mrp: "",
    },
  ]);
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
      } else {
        alert(data.message);
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
    let json = product.map((e) => {
      return {
        ...e,
        name: e?.name.split(",")[0],
      };
    });
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(json),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        // alert("Sale invoice created successfully!");
        navigate("/" + String.InvoiceReceipt, {
          state: product,
        });
        // setProduct([
        //   {
        //     name: "",
        //     brand: "",
        //     category: "",
        //     price: "",
        //     quantity_available: "",
        //     quantity: "",
        //     total_price: "",
        //     mrp: "",
        //   },
        // ]);
      } else {
        alert(data.message);
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
  const handelChange = (e, id) => {
    const { name, value } = e.target;

    if (name === "name") {
      const selectProduct = stockOption?.filter((e) => {
        if (
          value?.split(",")[0] === e.name &&
          value?.split(",")[1] == e?.brand
        ) {
          return e;
        }
      })[0];
      console.log(selectProduct);
      let res = product.map((e) => {
        console.log(e.id, id);
        if (e?.id == id) {
          return {
            id: id,
            name: value,
            brand: selectProduct?.brand,
            category: selectProduct?.category,
            price: selectProduct?.price,
            quantity_available: selectProduct?.quantity_available,
            quantity: "",
            total_price: "",
            mrp: selectProduct?.price,
          };
        } else {
          return e;
        }
      });
      setProduct(res);
    } else if (name == "quantity" || name == "price") {
      let res = product.map((e) => {
        console.log(e.id, id);
        if (e?.id == id) {
          return {
            ...e,
            [name]: value,
            total_price:
              ((name === "quantity" ? value : e.quantity) || 0) *
              ((name === "price" ? value : e.price) || 0),
          };
        } else {
          return e;
        }
      });
      checkIsFormValid(name, value);
      setProduct(res);
    }
  };
  const checkIsFormValid = (name, value) => {
    product?.map((e) => {
      if (
        (name == "price" ? value : e.price) &&
        (name == "quantity" ? value : e.quantity)
      ) {
        setIsFromValid(true);
      } else {
        setIsFromValid(false);
      }
    });
  };
  const createInvoice = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">No.</th>
            <th scope="col">Product Name</th>
            <th scope="col">Brand</th>
            <th scope="col">Category</th>
            <th scope="col">MRP</th>
            <th scope="col">Sale Rate</th>
            <th scope="col">Available Quantity</th>
            <th scope="col">Quantity</th>
            <th scope="col">Total Price</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {product?.map((event, index) => (
            <tr key={event?.id}>
              <td>
                {index === product.length - 1 && (
                  <span
                    onClick={handelAddNew}
                    style={{
                      fontSize: "20px",
                      fontWeight: "bolder",
                      cursor: "pointer",
                    }}
                    aria-hidden="true"
                  >
                    &#43;
                  </span>
                )}
              </td>
              <td>{index + 1}</td>
              <td>
                <select
                  type="text"
                  name="name"
                  value={product && product[index]?.name}
                  id="name"
                  className="form-control"
                  onChange={(e) => handelChange(e, event?.id)}
                >
                  <option value={0}>select</option>
                  {stockOption?.map((e) => (
                    <option key={e.id} value={e?.name + "," + e?.brand}>
                      {e?.name + ", " + e?.brand}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  disabled
                  type="text"
                  name="brand"
                  value={product && product[index]?.brand}
                  id="brand"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  disabled
                  type="text"
                  name="category"
                  value={product && product[index]?.category}
                  id="category"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  disabled
                  onChange={(e) => handelChange(e, event?.id)}
                  type="text"
                  name="price"
                  value={product && product[index]?.mrp}
                  id="price"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  onChange={(e) => {
                    let number = e.target.value;
                    if (isNaN(number) || number < 0) {
                      return;
                    } else if (/^0/.test(number)) {
                      number = number.replace(/^0/, "");
                    } else {
                      handelChange(e, event?.id);
                    }
                  }}
                  type="text"
                  name="price"
                  value={product && product[index]?.price}
                  id="price"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  disabled
                  type="text"
                  value={product && product[index]?.quantity_available}
                  name="quantity_available"
                  id="quantity_available"
                  className="form-control"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={product && product[index]?.quantity}
                  name="quantity"
                  id="quantity"
                  className="form-control"
                  onChange={(e) => {
                    let number = e.target.value;
                    if (isNaN(number) || number < 0 || number % 1 !== 0) {
                      return;
                    } else if (
                      number > (product && product[index]?.quantity_available)
                    ) {
                      alert(
                        "Quantity cannot be greater than available quantity!"
                      );
                      return;
                    } else {
                      handelChange(e, event?.id);
                    }
                  }}
                />
              </td>
              <td>
                <input
                  disabled
                  type="text"
                  value={product && product[index]?.total_price}
                  name="total_price"
                  id="total_price"
                  className="form-control"
                />
              </td>
              <td>
                <span
                  onClick={() => handelDelete(event?.id)}
                  style={{
                    fontSize: "20px",
                    fontWeight: "bolder",
                    cursor: "pointer",
                  }}
                  aria-hidden="true"
                >
                  &times;
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handelAddNew = () => {
    if (product.length == stockOption.length) {
      alert("Max row reaced!");
      return;
    }
    setIsFromValid(false);
    const insertNew = {
      id: Math.random() * 100,
      name: "",
      brand: "",
      category: "",
      price: "",
      quantity_available: "",
      quantity: "",
      total_price: "",
    };
    setProduct((prev) => {
      return [...prev, insertNew];
    });
  };
  const handelDelete = (id) => {
    if (product.length == 1) return;
    let afterDeletProduct = product?.filter((e) => e?.id !== id);
    setProduct((prev) => {
      return afterDeletProduct;
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
          disabled={!idFromValid}
        >
          Create Sale
        </button>
      </div>
      {createInvoice()}
    </div>
  );
};

export default Invoice;
