import { Route, Routes } from "react-router-dom";
import { Analytics } from "../pages/Analytics";
import { Calls } from "../pages/Calls";
import { Home } from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calls" element={<Calls />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
};

export default AppRoutes;
