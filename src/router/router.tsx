import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
// import Footer from "../components/editor_ui/ai/Footer";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import TestGround from "@/components/editor_ui/model/test_ground";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    // element: <TestGround />,

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
