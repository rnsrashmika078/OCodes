import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "../signs/Login";
import Nav from "../nav/Nav";
import Signin from "../signs/Signin";
import Sonner from "../sonner/Sonner";
import WaitingConfirmation from "../signs/WaitingConfirmation";
import ConfirmSuccess from "../signs/ConfirmSuccess";
import Home from "../home/Home";

const AppRoutes = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <>
      <Sonner />
      {path !== "/" && <Nav />}
      <Routes>
        {/* <Route path="/" element={<Main />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/confirmation" element={<WaitingConfirmation />} />
        <Route path="/confirmationSuccess" element={<ConfirmSuccess />} />
      </Routes>
    </>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default AppRouter;
