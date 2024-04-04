import { useState } from "react";
import { useNavigate } from "react-router";
import NetworkStatus from "../NetworkStatus";

const Header = (props) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const Navigate = useNavigate();
  const showLogOut = () => {
    if (!showDropDown) return;
    return (
      <div
        onClick={() => {
          sessionStorage.clear();
          props.setLogging(false);
          Navigate("/");
        }}
        style={{
          position:"absolute",
          right:"5%",
          top:"50%",
          cursor:"pointer"
        }}
        class="dropdown-menu show px-4 py-3 mt-4"
      >
        <span>Logout</span>
      </div>
    );
  };
  return (
    <div
      style={{
        height: "60px ",
        backgroundColor: "var(--main-bg-color)",
        color: "white",
        position: "fixed",
        width: "102%",
        zIndex: "10",
      }}
      className=" row justify-content-between align-content-center align-items-center "
      onMouseLeave={() => setShowDropDown(false)}
    >
      <div style={{ marginLeft: "20px" }} className=" col-5">
        <h5 style={{ fontSize: "19px", fontWeight: "900" }}>
          SALES MANAGEMENT
        </h5>
      </div>
      <div className="col-2">
        <div
          style={{ width: "100%", paddingRight: "20px" }}
          className=" row justify-content-between"
        >
          
          <div style={{ width: "fit-content" }} className=" mt-2">Network Status: {<NetworkStatus />}</div>
          <div className=" col-4">
          {showLogOut()}
            <svg
              style={{ width: "fit-content" }}
              onMouseEnter={() => setShowDropDown(true)}
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              class="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg> 
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
