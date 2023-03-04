import { ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Container from "./components/Container";
import "react-toastify/dist/ReactToastify.css";
import "./css/custom.css";
import "./css/style.css";

function App() {
  return (
    <div className="background-color">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <NavBar />
      <Container />
      <Footer />
    </div>
  );
}
export default App;
