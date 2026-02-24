import { BrowserRouter, Route, Routes } from "react-router";
import Splash from "@/features/splash";
import Home from "@/features/home";
import { AuthRedirect } from "./components/AuthRedirect";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Splash />} />
        <Route
          path="/app"
          element={
            <AuthRedirect>
              <Home />
            </AuthRedirect>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
