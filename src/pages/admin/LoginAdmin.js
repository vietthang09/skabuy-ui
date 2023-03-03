import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import cookie from "react-cookies";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { loginUser } from "../../redux/actions/loginUser";

export default function LoginAdmin() {
  const [user_emaillg, setUser_emaillg] = useState("");
  const [passwordlg, setPasswordlg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementsByClassName("Header-nav")[0].style.display = "none";
    document.getElementsByClassName("footer")[0].style.display = "none";
  }, []);

  const handleLogin = async () => {
    try {
      const res = await Axios({
        method: "post",
        url: "https://nodejs.skabuy.com/user/login",
        data: {
          user_email: user_emaillg,
          password: passwordlg,
        },
      }).then((result) => result.data);
      if (
        res.message === "Invalid account" ||
        res.message === "Incorrect password"
      ) {
        toast.error(res.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        console.log(res.data);
        finish(JSON.stringify(res.token));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const finish = async (token) => {
    const res = await Axios({
      method: "post",
      url: "https://nodejs.skabuy.com/user/getUser",
      data: {
        token: JSON.parse(token),
      },
    }).then((result) => result.data);
    console.log(res);

    if (res[0].user_rule === 1) {
      cookie.save("token", JSON.stringify(token));
      cookie.save("user", res[0]);

      dispatch(loginUser(res[0]));
      navigate("/admin");
      toast.success("Successful management login!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.error("Please log in with a management account !!!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <div className="container bg-white">
        <div className="row px-xl-5"> 
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <h5 className="section-title position-relative text-uppercase mb-3">
              <span className="bg-secondary pr-3">LOGIN ADMIN</span>
            </h5>
            <div className="bg-light p-30 mb-5">
              <div className="row">
                <div className="col-md-12 form-group">
                  <label>E-mail</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="example@email.com"
                    onChange={(e) => setUser_emaillg(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-12 form-group">
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPasswordlg(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="btn btn-block btn-info font-weight-bold py-3"
                  onClick={() => handleLogin()}
                >
                  LOGIN
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-3"></div>
        </div>
      </div>
    </>
  );
}
