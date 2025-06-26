import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MarksView from "./pages/MarksView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/marks" element={<MarksView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
