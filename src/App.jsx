import { Routes, Route, Navigate } from "react-router-dom";
import LoadingUI from "./components/LoadingUI/LoadingUI";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useAuth } from "./utils/hooks/useAuth";
import VendorDashboard from "./pages/Dashboard/Vendor/Vendor";
import BuyerDashboard from "./pages/Dashboard/Buyer/Buyer";
import ProductsListing from "./pages/Dashboard/ProductsListing/ProductsListing";
import ProductDetails from "./pages/Dashboard/ProductsListing/ProductDetails/ProductDetails";

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
        <Route path="/products/" loader={LoadingUI} element={<ProductsListing />} />
        <Route path="/products/:id" loader={LoadingUI} element={<ProductDetails />} />
      </Routes>
    </>
  )
}

export default App
