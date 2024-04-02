const Header = () => {
  return (
    <div
      style={{
        height: "60px ",
        backgroundColor: "var(--main-bg-color)",
        color: "white",
      }}
      className=" row justify-content-between align-content-center px-3"
    >
      <div className=" col-3">
        <h5>SALES MANAGEMENT</h5>
      </div>
      {/* <div className="col-2">
        <span>Contact Us</span>
        <span style={{ marginLeft: "10px" }}>About Us</span>
      </div> */}
    </div>
  );
};
export default Header;
