import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import cookie from "react-cookies";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../util/localStorageHandle";
import { sendGetRequest } from "../util/fetchAPI";
import * as CONSTANTS from "../util/constants";
export default function NavBar() {
  const [updateCart, setUpdateCart] = useState(false);
  const [categories, setCategories] = useState([]);
  const userRedux = useSelector((state) => state.user);

  const [keyword, setKeyword] = useState("");
  const [cart, setCart] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function loadCategories() {
    const response = await sendGetRequest(`${CONSTANTS.baseURL}/category/all`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

  const logout = () => {
    navigate("/");
    cookie.remove("token");
    cookie.remove("user");
    showToast("SUCCESS", "Logout successful");
    dispatch(logoutUser());
  };

  useEffect(() => {
    loadCategories();
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
  }, []);

  useEffect(() => {
    setCart(JSON.parse(getCookie(CONSTANTS.cartCookie)));
    setUpdateCart(false);
  }, [updateCart]);

  const onKeyDownHandler = (e) => {
    if (e.keyCode == 13) {
      onSearchHandler();
    }
  };

  const onSearchHandler = () => {
    if (keyword.length > 0) {
      navigate(`/search/${keyword}`);
    }
  };
  function checkLogin() {
    const token = cookie.load("token");
    if (token == null || token == undefined) return false;
    else return true;
  }

  const UserLogin = () => {
    const token = cookie.load("token");
    if (token === null || token === undefined) {
      return (
        <Link to="/login" className="btn">
          <button
            type="button"
            className="btn btn-sm"
            style={{
              background: "#17a2b8",
              color: "#fff",
              fontSize: "16px",
              marginTop: "9px",
            }}
          >
            Login
          </button>
        </Link>
      );
    } else {
      const status = getUser(token);
      if (status === false) {
        showToast("ERROR", "Login session expired, please login again!");
      } else if (status == "block") {
        showToast(
          "ERROR",
          "Your account is locked, please contact the manager!"
        );
      } else {
        return (
          <div className="navbar-nav ml-auto py-0 d-none d-lg-block">
            <Link to="/wishlist" className="btn px-0">
              <i
                className="fas fa-heart text-primary"
                style={{
                  paddingBottom: "2px",
                  marginTop: "9px",
                  fontSize: "30px",
                }}
              ></i>
            </Link>
            <Link to="/shoppingcart" className="btn px-0 ml-3">
              <i
                className="fas fa-shopping-cart text-primary"
                style={{
                  paddingBottom: "2px",
                  marginTop: "9px",
                  fontSize: "30px",
                }}
              ></i>
              <span className="badge text-secondary border border-secondary rounded-circle">
                {cart ? cart.length : 0}
              </span>
            </Link>
            <Link to="/profile" className="btn px-0 ml-3">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#17a2b8",
                  color: "#fff",
                  fontSize: "16px",
                  marginTop: "9px",
                }}
              >
                <b>{userRedux.user && userRedux.user.user_fullname}</b>
              </button>
            </Link>
            <div className="btn px-0 ml-3">
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: "#17a2b8",
                  color: "#fff",
                  fontSize: "16px",
                  marginTop: "9px",
                }}
                onClick={() => logout()}
              >
                <b>Logout</b>
              </button>
            </div>
          </div>
        );
      }
    }
  };
  return (
    <div>
      <div className="d-lg-none">
        <div className="d-flex justify-content-between align-items-center px-2 py-2 fixed-top bg-info">
          <Link to="/" className="text-decoration-none">
            <span className="text-uppercase text-info bg-white px-1">SKA</span>
            <span className="text-uppercase text-white bg-info">Buy</span>
          </Link>

          <div className="bg-white py-1 mx-3 px-2 d-flex align-items-center rounded-pill w-auto">
            <input
              type="text"
              className="rounded-pill border-0 w-100"
              placeholder="Search"
              onKeyDown={(e) => onKeyDownHandler(e)}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <SearchOutlined
              className="text-info"
              onClick={() => onSearchHandler()}
            />
          </div>

          <Link to="/shoppingcart">
            <ShoppingCartOutlined
              className="text-white"
              style={{ fontSize: 24 }}
            />
          </Link>
        </div>

        <div className="fixed-bottom px-3 py-2 bg-white border-top">
          {checkLogin ? (
            <div className="d-flex justify-content-between">
              <NavLink to="/">
                <HomeOutlined style={{ fontSize: 24 }} />
              </NavLink>
              <NavLink to="/wishlist">
                <HeartOutlined style={{ fontSize: 24 }} />
              </NavLink>
              <NavLink to="/profile">
                <UserOutlined style={{ fontSize: 24 }} />
              </NavLink>
            </div>
          ) : (
            <Link
              to="/login"
              className="d-flex justify-content-center text-info"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <div className="d-none d-lg-block">
        <div className="Header-nav">
          <div className="container-fluid">
            <div className="row justify-content-between align-items-center bg-light py-3 px-xl-5 d-none d-lg-flex">
              <div className="col-lg-4">
                <Link to="" className="text-decoration-none">
                  <span className="h1 text-uppercase text-info bg-dark px-2">
                    SKA
                  </span>
                  <span className="h1 text-uppercase text-white bg-info px-2 ml-n1">
                    Buy
                  </span>
                </Link>
              </div>
              <div className="col-lg-4 col-6 text-right">
                <p className="m-0">Customer Service</p>
                <h5 className="m-0">+012 345 6789</h5>
              </div>
            </div>
          </div>
          <div className="container-fluid bg-dark mb-30">
            <div className="row px-xl-5">
              <div className="col-lg-3 d-none d-lg-block">
                <a
                  className="btn d-flex align-items-center justify-content-between bg-info w-100"
                  data-toggle="collapse"
                  id="menubar"
                  style={{ height: "65px", padding: "0 30px" }}
                >
                  <h6 className="text-white m-0">
                    <i className="fa fa-bars mr-2"></i>Categories
                  </h6>
                  <i className="fa fa-angle-down text-dark"></i>
                </a>
                <nav
                  className="collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 bg-light"
                  id="navbar-vertical"
                  style={{ width: "calc(100% - 30px)", zIndex: "999" }}
                >
                  <div className="navbar-nav w-100">
                    {categories.map((val, key) => (
                      <div
                        className="pb-1 nav-link nav-item menuhover"
                        key={key}
                      >
                        <Link
                          className="text-decoration-none"
                          to={val.category_slug}
                          state={{ category_id: val.category_id }}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              className="img-fluid"
                              src={val.category_image}
                              alt=""
                              style={{
                                padding: "10px",
                                height: "50px",
                                alignItems: "center",
                              }}
                            />
                            <div className="flex-fill pl-3">
                              <h6 className="">{val.category_name}</h6>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </nav>
              </div>
              <div className="col-lg-9">
                <nav className="navbar navbar-expand-lg bg-dark navbar-dark py-3 py-lg-0 px-0">
                  <Link
                    to="/"
                    className="text-decoration-none d-block d-lg-none"
                  >
                    <span className="h1 text-uppercase text-dark bg-light px-2">
                      Multi
                    </span>
                    <span className="h1 text-uppercase text-light bg-primary px-2 ml-n1">
                      Shop
                    </span>
                  </Link>
                  <button
                    type="button"
                    className="navbar-toggler"
                    data-toggle="collapse"
                    data-target="#navbarCollapse"
                  >
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div
                    className="collapse navbar-collapse justify-content-between"
                    id="navbarCollapse"
                  >
                    <div className="navbar-nav mr-auto py-0">
                      <div className="searchmb" style={{ height: "20px" }}>
                        <div className="input-group nav-item">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search for products"
                            onKeyDown={(e) => onKeyDownHandler(e)}
                            onChange={(e) => setKeyword(e.target.value)}
                          />
                          <div className="input-group-append">
                            <button
                              className="input-group-text text-primary bg-info"
                              onClick={() => onSearchHandler()}
                            >
                              <i
                                className="fa fa-search"
                                style={{ color: "#fff" }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {UserLogin()}
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
