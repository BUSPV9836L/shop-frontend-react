import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useLocation } from "react-router";
import moment from "moment";

const Purchase = () => {
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddNewClicked, setIsAddNewClicked] = useState(false);
  const [popupTitle, setPopUpTitle] = useState("");
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity_available: "",
  });
  const [gridApi, setGridApi] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllPurchase = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const url = new URL(`${String.BASE_URL}/purchases`);
      url.searchParams.append(
        "startdate",
        location?.state?.startDate
          ? moment(location?.state?.startDate).format("DD/MM/YYYY")
          : ""
      );
      url.searchParams.append(
        "enddate",
        location?.state?.endDate
          ? moment(location?.state?.endDate).format("DD/MM/YYYY")
          : ""
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setRowData(data);
      }
    } catch (error) {
      alert("Server Error!");
    } finally {
      setLoading(false);
    }
  };
  const createPurchase = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: product?.name,
          brand: product?.brand,
          category: product?.category,
          price: product?.price,
          quantity_available: product?.quantity_available,
        }),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setProduct({
          id: "",
          name: "",
          brand: "",
          category: "",
          price: "",
          quantity_available: "",
        });
        getAllPurchase();
        alert("Record Saved Succesfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updatePurchase = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch(`${String.BASE_URL}/purchases`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (!data?.stackTrace) {
        setProduct({
          id: "",
          name: "",
          brand: "",
          category: "",
          price: "",
          quantity_available: "",
        });
        getAllPurchase();
        alert("Record Updated Succesfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllPurchase();
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      if (loading) {
        gridApi.showLoadingOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [loading, gridApi]);
  const PurchaseTable = () => {
    const colDefs = [
      {
        headerName: "Product Name",
        field: "name",
        flex: 1,
        cellStyle: { color: "var(--main-bg-color)", cursor: "pointer" },
      },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
      { headerName: "MRP", field: "price", flex: 1 },
      { headerName: "Purcahse Date", field: "createdAt", flex: 1 },
      {
        headerName: "Available Quantity",
        field: "quantity_available",
        flex: 1,
      },
    ];

    return (
      <div
        className="ag-theme-quartz custom-ag-theme"
        style={{ width: "100%", paddingRight: "20px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            width: 100,
          }}
          gridOptions={{ headerHeight: 30, rowHeight: 28 }}
          suppressCellSelection={true}
          rowSelection="multiple"
          pagination={true}
          onGridReady={onGridReady}
          paginationPageSize={10}
          enableCellTextSelection={true}
          domLayout={"autoHeight"}
          onCellClicked={(event) => {
            if (event.colDef.headerName === "Product Name") {
              setProduct(() => {
                return {
                  name: event?.data?.name,
                  brand: event?.data?.brand,
                  category: event?.data?.category,
                  price: event?.data?.price,
                  quantity_available: event.data?.quantity_available,
                  id: event?.data?._id,
                };
              });
              setIsAddNewClicked(false)
              setPopUpTitle("Update Purchase");
              toggleModal();
            }
          }}
        />
      </div>
    );
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const addIteamInPurchasePopUp = () => {
    if (!isModalOpen) return null;
    const addIteam = () => {
      return (
        <div className=" card ">
          <div style={{ marginRight: "20px" }} className=" mb-3 text-end">
            <button
              style={{ marginRight: "20px" }}
              className=" btn "
              onClick={updatePurchase}
              disabled={
                !product?.name ||
                !product?.brand ||
                !product?.category ||
                !product?.price ||
                !product?.quantity_available ||
                !product?.id
              }
            >
              Update
            </button>
            <button
              style={{ marginRight: "20px" }}
              className=" btn "
              onClick={createPurchase}
              disabled={
                !product?.name ||
                !product?.brand ||
                !product?.category ||
                !product?.price ||
                !product?.quantity_available ||
                !isAddNewClicked
              }
            >
              Save
            </button>
          </div>
          <form className=" row ">
            <div class="form-group col-md-3">
              <label for="name" class="form-label">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product?.name}
                id="name"
                class="form-control"
                onChange={(e) => handelChange(e)}
              />
            </div>
            <div class="form-group col-md-3">
              <label for="brand" class="form-label">
                Brand
              </label>
              <input
                onChange={(e) => handelChange(e)}
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
                onChange={(e) => handelChange(e)}
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
                onChange={(e) => handelChange(e)}
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
                onChange={(e) => handelChange(e)}
                type="text"
                value={product?.quantity_available}
                name="quantity_available"
                id="quantity_available"
                class="form-control"
              />
            </div>
          </form>
        </div>
      );
    };
    const handelChange = (e) => {
      const { name, value } = e.target;
      setProduct((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    };
    return (
      <div
        className="modal fade show d-block"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {popupTitle}
              </h5>
              <button
                type="button"
                className="close"
                onClick={toggleModal}
                aria-label="Close"
              >
                <span
                  style={{ fontSize: "20px", fontWeight: "bolder" }}
                  aria-hidden="true"
                >
                  &times;
                </span>
              </button>
            </div>
            <div className="modal-body">{addIteam()}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4 className="heading-text mb-3">Purchase</h4>
      <div style={{ marginRight: "20px" }} className=" mb-3 text-end">
        <button
          className="btn"
          onClick={() => {
            setIsAddNewClicked(!isAddNewClicked);
            setPopUpTitle("Create Purchase");
            setProduct({
              id: "",
              name: "",
              brand: "",
              category: "",
              price: "",
              quantity_available: "",
            });
            toggleModal();
          }}
        >
          Add New
        </button>
      </div>
      {PurchaseTable()}
      {addIteamInPurchasePopUp()}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Purchase;
