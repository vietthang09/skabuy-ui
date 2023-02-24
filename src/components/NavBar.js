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
import CategoryItem from "./CategoryItem";
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

  // const logout = () => {
  //   navigate("/");
  //   cookie.remove("token");
  //   cookie.remove("user");
  //   showToast("SUCCESS", "Logout successful");
  //   dispatch(logoutUser());
  // };

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

  function SearchSection() {
    return (
      <div className="bg-white py-1 mx-3 px-2 d-flex align-items-center rounded-pill w-100">
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
    );
  }

  function DropdownSection() {
    return (
      <div class="dropdown ml-3">
        <span
          class="dropdown-toggle text-white font-weight-bold"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style={{ fontSize: "1.25em" }}
        >
          Categories
        </span>
        <div
          class="dropdown-menu rounded-lg shadow"
          aria-labelledby="dropdownMenuButton"
        >
          <div className="row" style={{ width: "50vw" }}>
            {categories.map((category, index) => {
              return <CategoryItem category={category} key={index} />;
            })}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="d-lg-none">
        <div className="d-flex justify-content-between align-items-center px-2 py-2 fixed-top bg-info">
          <Link to="/" className="text-decoration-none">
            <span className="text-uppercase text-info bg-white px-1">SKA</span>
            <span className="text-uppercase text-white bg-info">Buy</span>
          </Link>

          <SearchSection />

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
      <div className="d-none d-lg-block bg-info fixed-top">
        <div className="Header-nav container py-1 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="/" className="text-decoration-none">
              <span className="h1 text-info bg-white px-2 rounded">SKA</span>
              <span className="h1 text-white bg-info px-2">Buy</span>
            </Link>
            <DropdownSection />
          </div>
          <div className="w-50">
            <SearchSection />
          </div>
          {!checkLogin ? (
            <div className="d-flex justify-content-between">
              <Link to="/wishlist" className="d-flex justify-content-center">
                <div>
                  <HeartOutlined
                    className="text-white w-100"
                    style={{ fontSize: 24 }}
                  />
                  <h6 className="text-white">Login</h6>
                </div>
              </Link>
              <Link
                to="/shoppingcart"
                className="d-flex justify-content-center mx-3"
              >
                <div>
                  <ShoppingCartOutlined
                    className="text-white w-100"
                    style={{ fontSize: 24 }}
                  />
                  <h6 className="text-white">Cart</h6>
                </div>
              </Link>
              <Link to="/profile" className="d-flex justify-content-center">
                <div>
                  <UserOutlined
                    className="text-white w-100"
                    style={{ fontSize: 24 }}
                  />
                  <h6 className="text-white">Profile</h6>
                </div>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="d-flex justify-content-center">
              <div>
                <UserOutlined
                  className="text-white w-100"
                  style={{ fontSize: 24 }}
                />
                <h6 className="m1-2 font-weight-bold text-white">Login</h6>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
