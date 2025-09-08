import { Routes, Route, Navigate } from "react-router-dom";
import LoadingUI from "./components/LoadingUI/LoadingUI";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useAuth } from "./utils/hooks/useAuth";
import VendorDashboard from "./pages/Dashboard/Vendor/Vendor";
import BuyerDashboard from "./pages/Dashboard/Buyer/Buyer";
import VendorListing from "./pages/VendorListing/VendorListing";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

function App() {
  const { loadingSession } = useAuth();

  if (loadingSession) {
    return <LoadingUI />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" loader={LoadingUI} element={<LoginPage />} />
        <Route path="/signup" loader={LoadingUI} element={<SignupPage />} />
        <Route path="/dashboard/" loader={LoadingUI} element={<Dashboard />} />
        <Route path="/dashboard/vendor/*" loader={LoadingUI} element={<VendorDashboard />} />
        <Route path="/dashboard/buyer/*" loader={LoadingUI} element={<BuyerDashboard />} />
        <Route path="/vendors/:slug" loader={LoadingUI} element={<VendorListing />} />
        <Route path="*" loader={LoadingUI} element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
