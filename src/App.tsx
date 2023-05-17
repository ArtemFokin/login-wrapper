import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import { lazy, Suspense } from "react";
import { loginResponsePath } from "./constants";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const LoginResponsePage = lazy(() => import("./pages/LoginResponsePage"));
const LogoutPage = lazy(() => import("./pages/LogoutPage"));
const LogoutSuccessPage = lazy(() => import("./pages/LogoutSuccessPage"));

function App() {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <Suspense fallback="">
            <LoginPage />
          </Suspense>
        }
      />
      <Route
        path={loginResponsePath}
        element={
          <Suspense fallback="">
            <LoginResponsePage />
          </Suspense>
        }
      />
      <Route
        path="logout"
        element={
          <Suspense fallback="">
            <LogoutPage />
          </Suspense>
        }
      />
      <Route
        path="logout-logout"
        element={
          <Suspense fallback="">
            <LogoutSuccessPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
}

export default App;
