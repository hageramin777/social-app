import React, { useContext } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Notfound from "./components/Notfound/Notfound";
import PostDetails from "./components/PostDetails/PostDetails";
import Profile from "./components/Profile/Profile";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import AuthContextProvider, {
  authContext,
} from "./components/context/AuthContextProvider";

function RootRedirect() {
  const { token } = useContext(authContext);

  return <Navigate to={token ? "/home" : "/login"} replace />;
}

function ProtectedRoute({ children }) {
  const { token } = useContext(authContext);

  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token } = useContext(authContext);

  return token ? <Navigate to="/home" replace /> : children;
}

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      { index: true, element: <RootRedirect /> },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "posts/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "change-password",
        element: (
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthContextProvider>
  );
}
