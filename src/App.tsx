import { createBrowserRouter } from "react-router";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Location } from "./pages/location";
import { Dashboard } from "./pages/dashboard";
import { New } from "./pages/dashboard/new";
import { Header } from "./components/header";
import { Layout } from "./components/layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [{
        path: '/',
        element: <Home />
      },
      {
        path: "/location/:id",
        element: <Location />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/New",
        element: <New />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
])

export { router };