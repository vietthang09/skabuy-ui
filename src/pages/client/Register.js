import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { baseURL } from "../../util/constants";
import { sendPostRequest } from "../../util/fetchAPI";
import { showToast } from "../../util/helper";
export default function Register() {
  const navigate = useNavigate();
  const [registerInfo, setRegisterInfo] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
  });

  async function onRegisterHandler() {
    if (
      !validateEmail(registerInfo.email) ||
      !validatePassword(registerInfo.password) ||
      registerInfo.fullname == "" ||
      registerInfo.password.localeCompare(registerInfo.confirmPassword) != 1
    ) {
      showToast("WARNING", "Invalid information");
    } else {
      const response = await sendPostRequest(
        `${baseURL}/user/register`,
        registerInfo
      );
      if (response.status == "success") {
        showToast("SUCCESS", "Register successfully!");
        navigate("/login");
      } else {
        showToast("ERROR", response.message);
      }
    }
  }
  return (
    <>
      <div className="container mt-5">
        <div className="row px-xl-5 d-flex justify-content-center">
          <div className="col-lg-6">
            <div>
              <h5 className="section-title position-relative text-uppercase mb-3 text-center">
                Register
              </h5>

              <div className="form-group">
                <label>Fullname</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Fullname"
                  onChange={(e) =>
                    setRegisterInfo((current) => ({
                      ...current,
                      fullname: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="example@email.com"
                  onChange={(e) =>
                    setRegisterInfo((current) => ({
                      ...current,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Example@123"
                  onChange={(e) =>
                    setRegisterInfo((current) => ({
                      ...current,
                      password: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Confirm password</label>
                <input
                  className="form-control"
                  type="password"
                  placeholder="Example@123"
                />
              </div>

              <button
                className="btn btn-block btn-info font-weight-bold py-3"
                onClick={() => onRegisterHandler()}
              >
                REGISTER
              </button>
              <div className="col-md-12 text-center p-3">
                <Link to={"/login"}>Already have an account? Login here</Link>
              </div>
              <span style={{ fontSize: 14 }}>
                *Passwords must have at least 8 characters and contain:
                uppercase letters, lowercase letters, numbers and symbols.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
