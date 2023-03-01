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
import { sendGetRequest } from "../util/fetchAPI";
import * as CONSTANTS from "../util/constants";
import CategoryItem from "./CategoryItem";
export default function NavBar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  function checkLogin() {
    const token = cookie.load("token");
    if (token == null || token == undefined) return false;
    else return true;
  }

  async function loadCategories() {
    const response = await sendGetRequest(`${CONSTANTS.baseURL}/category/all`);
    if (response.status == "success") {
      setCategories(response.data);
    } else {
      showToast("ERROR", "There are some mistake!");
    }
  }

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

  useEffect(() => {
    loadCategories();
  }, []);

  function updateKeyword(value) {
    // setKeyword(value);
  }

  function SearchSection() {
    return (
      <div className="bg-white mx-3 px-2 d-flex align-items-center rounded-pill w-100 border">
        <input
          type="text"
          className="form-control rounded-pill border-0 w-100"
          placeholder="Search"
          onKeyDown={(e) => onKeyDownHandler(e)}
          onChange={(e) => updateKeyword(e.target.value)}
        />
        <SearchOutlined
          className="text-info"
          onClick={() => onSearchHandler()}
          style={{ fontSize: "24px" }}
        />
      </div>
    );
  }

  function DropdownSection() {
    return (
      <div className="dropdown ml-3">
        <span
          className="dropdown-toggle text-white font-weight-bold"
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
          className="dropdown-menu rounded-lg shadow"
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
              <NavLink to="/" className={currentPage == 0 && "text-info"}>
                <HomeOutlined
                  onClick={() => setCurrentPage(0)}
                  style={{ fontSize: 24 }}
                />
              </NavLink>
              <NavLink
                to="/wishlist"
                className={currentPage == 1 && "text-info"}
              >
                <HeartOutlined
                  onClick={() => setCurrentPage(1)}
                  style={{ fontSize: 24 }}
                />
              </NavLink>
              <NavLink
                to="/profile"
                className={currentPage == 2 && "text-info"}
              >
                <UserOutlined
                  onClick={() => setCurrentPage(2)}
                  style={{ fontSize: 24 }}
                />
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
          {checkLogin ? (
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
