import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Chat from "./components/ChatUI";
import Profile from "./pages/Profile";
import BioPage from "./pages/BioPages";
import Dashboard from "./pages/Dasboard";
import { ToastContainer, Bounce } from 'react-toastify';
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bio" element={<BioPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Forget" element={<ForgetPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Routes>
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
}

export default App;

