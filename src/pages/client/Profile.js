import Axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../util/helper";
import cookie from "react-cookies";
import Navbar from "./components/Navbar";
import { useNavigate } from "react-router";
import { baseURL } from "../../util/constants";
import { logoutUser } from "../../redux/actions/logoutUser";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal } from "antd";
const { confirm } = Modal;
function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.user);

  // states for profile
  const [userInfor, setUserInfor] = useState({
    user_id: "",
    user_fullname: "",
    user_email: "",
    user_phone_number: "",
    user_address: "",
    user_gender: "",
    user_date_of_birth: "",
  });
  // end states for profile
  // states for orders

  // end states for orders

  // handlers for profile
  const onSaveHandler = async () => {
    if (
      userInfor.user_fullname == "" ||
      userInfor.user_phone_number == "" ||
      userInfor.user_gender == "-- Gender --" ||
      userInfor.user_date_of_birth == ""
    ) {
      showToast("WARNING", "Please fill in all the information");
    } else {
      Axios.post(`${baseURL}/user/editUser`, userInfor).then((response) => {
        let responseData = response.data;
        if (responseData.status == "success") {
          cookie.save("user", userInfor);
          showToast("SUCCESS", "Update successfully!");
          window.location.reload(false);
        } else {
          showToast("ERROR", responseData.message);
        }
      });
    }
  };

  const showConfirm = () => {
    confirm({
      title: "Do you Want to logout?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        navigate("/");
        cookie.remove("token");
        cookie.remove("user");
        showToast("SUCCESS", "Logout successful");
        dispatch(logoutUser());
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    if (userRedux.user == undefined && userRedux.user == null) {
      navigate("/login");
    } else {
      setUserInfor({
        user_id: userRedux.user.user_id,
        user_fullname: userRedux.user.user_fullname,
        user_email: userRedux.user.user_email,
        user_phone_number: userRedux.user.user_phone_number,
        user_address: userRedux.user.user_address,
        user_gender: userRedux.user.user_gender,
        user_date_of_birth: userRedux.user.user_date_of_birth,
      });
    }
  }, []);

  function ProfileSection() {
    return (
      <div className="p-4 bg-white rounded">
        <h5>My profile</h5>
        <div className="row">
          <div className="col-md-6 form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              value={userInfor.user_fullname}
              onChange={(e) =>
                setUserInfor((current) => ({
                  ...current,
                  user_fullname: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>E-mail</label>
            <input
              className="form-control"
              type="text"
              value={userInfor.user_email}
              disabled
            />
          </div>
          <div className="col-md-6 form-group">
            <label>Phone number</label>
            <input
              className="form-control"
              type="number"
              value={userInfor.user_phone_number}
              onChange={(e) =>
                setUserInfor((current) => ({
                  ...current,
                  user_phone_number: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-6 form-group">
            <label>Gender</label>
            <select
              className="form-control"
              name="gender"
              onChange={(e) =>
                setUserInfor((current) => ({
                  ...current,
                  user_gender: e.target.value,
                }))
              }
            >
              <option selected={userRedux.user == undefined}>
                -- Gender --
              </option>
              <option value={"male"} selected={userInfor.user_gender == "male"}>
                Male
              </option>
              <option
                value={"female"}
                selected={userInfor.user_gender == "female"}
              >
                Female
              </option>
            </select>
          </div>
          <div className="col-md-12 form-group">
            <label>Address</label>
            <input
              className="form-control"
              type="text"
              value={userInfor.user_address}
              onChange={(e) =>
                setUserInfor((current) => ({
                  ...current,
                  user_address: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-12 form-group">
            <label>Date of birth</label>
            <input
              className="form-control"
              type="date"
              value={new Date(userInfor.user_date_of_birth).toLocaleDateString(
                "en-CA"
              )}
              onChange={(e) =>
                setUserInfor((current) => ({
                  ...current,
                  user_date_of_birth: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-md-12 form-group d-flex justify-content-between">
            <button
              className="btn btn-info success"
              onClick={() => onSaveHandler()}
            >
              Save
            </button>
            <Button onClick={showConfirm}>Logout</Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {userRedux.user != undefined && userRedux.user != null && (
        <div className="laptop:w-9/12 mobile:w-11/12 w-full h-full m-auto">
          <div className="flex mobile:flex-row flex-col mt-16 pt-3">
            <div className="mobile:w-3/12 w-full">
              <Navbar />
            </div>
            <div className="mobile:w-9/12 w-full">
              <ProfileSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Profile;
