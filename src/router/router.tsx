import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
// import Footer from "../components/editor_ui/ai/Footer";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // { index: true, element: <Footer /> },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);
