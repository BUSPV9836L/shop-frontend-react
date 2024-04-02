import { Outlet } from "react-router";
import Header from "../Header";
import SideBar from "../SideBar";

const Layout = () => {
  return (
    <div>
      <Header />
      <div className=" row">
        <div style={{width:"20%"}}>
          <SideBar />
        </div>
        <div style={{width:"80%", marginTop:"10px"}}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
