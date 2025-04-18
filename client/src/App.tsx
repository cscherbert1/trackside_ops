import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Layouts from "./pages/setup/Layouts";
import Locations from "./pages/setup/Locations"
import Cars from "./pages/setup/Cars";
import Industries from "./pages/setup/Industries";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="setup/layouts" element={<Layouts />} />
          <Route path="setup/layouts/:layoutId/locations" element={<Locations/>}/>
          <Route path="setup/cars" element={<Cars />} />
          <Route path="setup/industries" element={<Industries />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
