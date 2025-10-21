import React, { useState } from "react";
import AuthPage from "./pages/AuthPage";
import TodoPage from "./pages/TodoPage";

import "./styles/sweetalert.css";
import "./index.css";
import "./styles/global.css";
export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  return (
    <div>
      {loggedIn ? (
        <TodoPage />
      ) : (
        <AuthPage onLogin={() => setLoggedIn(true)} />
      )}
    </div>
  );
}
