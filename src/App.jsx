import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import StartingPage from "./pages/StartingPage/StartingPage";
import Join from "./pages/Auth/Join";
import Login from "./pages/Auth/Login";
import Welcome from "./pages/Auth/Welcome";
import InfoSteps from "./pages/Auth/InfoSteps";
import Home from "./pages/Home/Home";
import Budget from "./pages/Budget/Budget";
import Shop from "./pages/Shop/Shop";
import Challenge from "./pages/Challenge/Challenge";
import Friends from "./pages/Friends/Friends";
import MyPage from "./pages/MyPage/MyPage";

import "./styles/App.css";

function App() {
  return (
    // <Router>
      <div className="app-wrapper">
        <Header />
        <div className="body-wrapper">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<StartingPage />} />
              <Route path="/join" element={<Join />} />
              <Route path="/login" element={<Login />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/info-steps" element={<InfoSteps />} />
              <Route path="/home" element={<Home />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/challenge" element={<Challenge />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </main>
        </div>
      </div>
    // </Router>
  );
}

export default App;
