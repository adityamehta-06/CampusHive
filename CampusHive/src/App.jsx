import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resources from "./pages/Resources";
import ResourceDetails from "./pages/ResourceDetails";
import AddResource from "./pages/AddResource";
import BorrowRequests from "./pages/BorrowRequests";
import BorrowedResources from "./pages/BorrowedResources";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:id" element={<ResourceDetails />} />
      <Route path="/add-resource" element={<AddResource />} />
      <Route path="/requests" element={<BorrowRequests />} />
      <Route path="/borrowed" element={<BorrowedResources />} />
    </Routes>
  );
}

export default App;
