import { useState } from "react";
import { FaLock, FaUnlock } from "react-icons/fa";
import String from "../../string";
import { useNavigate } from "react-router";
const Login = (props) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isloogedin, setIsLoogedIn] = useState(false);
  const checkUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${String.BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ``,
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (data.accessToken) {
        setIsLoogedIn(true);
        props.setLogging(true)
        sessionStorage.setItem("accessToken",data.accessToken)
        setTimeout(() => {
          navigate("/" + String.Dashboard);
        }, 500);
      } else {
        alert(data.message);
      }
    } catch (error) {
      throw error;
    }
  };
  const handelchanges = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const validate = () => {
    if (form.email.trim() == "") {
      alert("Please enter valid email");
      return false;
    } else if (form.password.trim() == "") {
      alert("Please enterr valid password");
      return false;
    } else {
      return true;
    }
  };
  const handelsubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      checkUser();
    }
  };
  const leftcomponent = () => {
    return (
      <div
        style={{
          height: "100vh",
          color: "white",
          fontWeight: "700",
          fontSize: "30px",
        }}
        className="felx justify-content-center text-center  align-content-center "
      >
        Sales Management
      </div>
    );
  };
  const rightcomponent = () => {
    return (
      <div
        style={{ height: "100vh" }}
        className="row justify-content-center  text-center  align-content-center "
      >
        <div className=" col-10">
          <p style={{ fontSize: "16px" }}>
            Sales Management <b>@DMS</b>
          </p>
          {isloogedin ? (
            <FaUnlock color="grey" size={30} />
          ) : (
            <FaLock color="grey" size={30} />
          )}
          {loginForm()}
        </div>
      </div>
    );
  };
  const loginForm = () => {
    return (
      <form onSubmit={(e) => handelsubmit(e)} className=" text-start">
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={(e) => handelchanges(e)}
            name="email"
            className=" form-control "
            type="email"
          />
        </div>
        <div className="mt-2">
          <label htmlFor="password">Password</label>
          <input
            onChange={(e) => handelchanges(e)}
            id="password"
            type="password"
            name="password"
            className=" form-control "
          />
        </div>
        <div>
          <button
            style={{ backgroundColor: "var(--main-bg-color)", color: "white" }}
            className=" form-control mt-3"
          >
            Login
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className=" row w-100 ">
      <div className=" col-8 login-left">{leftcomponent()}</div>
      <div className=" col-4">{rightcomponent()}</div>
    </div>
  );
};

export default Login;
