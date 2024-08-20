import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Create,
  Dashboard,
  Layout,
  Login,
  PageNotFound,
  User,
  Contracts,
  Cards,
  Reports,
  WorkLog,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" pauseOnFocusLoss={true} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/quotes" element={<Create />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/user" element={<User />} />
          <Route path="/workLog" element={<Reports />} />
          <Route path="/workLog/:id" element={<WorkLog />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
