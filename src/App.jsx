import { Routes, Route, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // Header/Sidebar 없이 보여야 하는 페이지들
  const noLayoutRoutes = ["/", "/join", "/login", "/welcome", "/info-steps"];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="app-wrapper">
      {/* 홈 이후부터 Header/Sidebar 표시 */}
      {!isNoLayout && <Header />}

      <div className="body-wrapper">
        {!isNoLayout && <Sidebar />}

        <main
          className="main-content"
          style={{
            // 홈 이후부터 margin 적용
            marginTop: !isNoLayout ? "60px" : "0",
            marginLeft: !isNoLayout ? "250px" : "0",
            padding: "0px",
          }}
        >
          <Routes>
            {/* 로그인 전 페이지 */}
            <Route path="/" element={<StartingPage />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/info-steps" element={<InfoSteps />} />

            {/* 로그인 후 페이지 */}
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
  );
}

export default App;
