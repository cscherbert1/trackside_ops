import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Layouts from "./pages/setup/Layouts";
import Locations from "./pages/setup/Locations";
import Tracks from "./pages/setup/Tracks";
import Cars from "./pages/setup/Cars";
import Commodities from "./pages/setup/Commodities";
import Waybills from "./pages/setup/Waybills";
import WaybillsCreate from "./pages/setup/WaybillCreate";
import WaybillsSearch from "./pages/setup/WaybillsSearch";
import WaybillEdit from "./pages/setup/WaybillEdit";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="setup/layouts" element={<Layouts />} />
          <Route path="setup/layouts/:layoutId/locations" element={<Locations/>}/>
          <Route path="setup/layouts/:layoutId/locations/:locationId/tracks" element={<Tracks/>}/>
          <Route path="setup/cars" element={<Cars />} />
          <Route path="setup/commodities" element={<Commodities />} />
          <Route path="setup/waybills" element={<Waybills />} />
          <Route path="setup/waybills/create/:layoutId" element={<WaybillsCreate />} />
          <Route path="setup/waybills/search/:layoutId" element={<WaybillsSearch />} />
          <Route path="/waybills/:id/edit" element={<WaybillEdit />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
