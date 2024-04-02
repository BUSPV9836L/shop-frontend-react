import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import String from "../../string";
import { useLocation } from "react-router";

const Stocks = () => {
  const location = useLocation();
  const [rowData, setRowData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState({
    id: "",
    name: "",
    brand: "",
    category: "",
    price: "",
    quantity_available: "",
  });

  const getAllStocks = async () => {
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
        setRowData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllStocks();
  }, []);

  const stockTable = () => {
    const colDefs = [
      {
        headerName: "Product Name",
        field: "name",
        flex: 1,
        cellStyle: { color: "var(--main-bg-color)", cursor: "pointer" },
      },
      { headerName: "Brand", field: "brand", flex: 1 },
      { headerName: "Category", field: "category", flex: 1 },
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

  const displayIteamInstockPopUp = () => {
    if (!isModalOpen) return null;
    const displayIteam = () => {
      return (
        <div className=" card ">
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
                disabled
              />
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
          </form>
        </div>
      );
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
                Iteam Details
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
            <div className="modal-body">{displayIteam()}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h4 className="heading-text mb-5">Stocks</h4>
      {stockTable()}
      {displayIteamInstockPopUp()}
      {isModalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default Stocks;
