import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import NotePage from "./pages/NotePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage onLogin={() => window.location.href = "/notes"} />} />
        <Route path="/login" element={<AuthPage onLogin={() => window.location.href = "/notes"} />} />
        <Route path="/notes" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
