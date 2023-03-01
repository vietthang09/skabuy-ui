import React from "react";
import LoginForm from "./components/LoginForm";

export default function Login() {
  return (
    <>
      <div className="container bg-white">
        <div className="mt-5 row d-flex justify-content-center">
          <div className="col-lg-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
