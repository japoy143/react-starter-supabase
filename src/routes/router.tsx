import { createBrowserRouter } from "react-router-dom";

//pages
import Homepage from "../pages/Homepage";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Layout from "../components/Layouts/Layout";
import Notfound from "../components/Notfound";
import Article from "../pages/Homepage/Article";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import Dashboard from "../pages/Admin";

import AdminMedicalEquipments from "../pages/Admin/MedicalEquipment";
import AdminMedicalSpecialist from "../pages/Admin/MedicalSpecialist";
import AdminNews from "../pages/Admin/News";
import AdminArticles from "../pages/Admin/Articles";
import SignUp from "../pages/Admin/Auth/SignUp";
import SignIn from "../pages/Admin/Auth/SignIn";
import AuthLayout from "../components/Layouts/AuthLayout";
import PrivateRoute from "./PrivateRoute";
import { AuthContextProvider } from "../context/AuthContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Notfound />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/article/:id",
        element: <Article />,
      },
    ],
  },
  {
    path: "/admin/dashboard",
    element: (
      <AuthContextProvider>
        <DashboardLayout />
      </AuthContextProvider>
    ),
    errorElement: <Notfound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "articles",
        element: <AdminArticles />,
      },
      {
        path: "equipments",
        element: <AdminMedicalEquipments />,
      },
      {
        path: "specialist",
        element: <AdminMedicalSpecialist />,
      },
      {
        path: "news",
        element: <AdminNews />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <Notfound />,
    children: [
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "signin",
        element: <SignIn />,
      },
    ],
  },
]);
