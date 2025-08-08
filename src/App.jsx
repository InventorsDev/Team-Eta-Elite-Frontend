import { Routes, Route, Navigate } from "react-router-dom";
import LoadingUI from "./components/LoadingUI/LoadingUI";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" loader={LoadingUI} element={<LoginPage />} />
        <Route path="/signup" loader={LoadingUI} element={<SignupPage />}/>
        <Route path="/dashboard/:role" />
      </Routes>
    </>
  )
}

export default App
