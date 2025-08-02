import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import StartingPage from "./pages/StartingPage/StartingPage";
import Join from "./pages/Auth/Join";
import Login from "./pages/Auth/Login";
import OauthKakao from "./pages/Auth/Callback";
import Welcome from "./pages/Auth/Welcome";
import InfoSteps from "./pages/Auth/InfoSteps";
import FindPassword from "./pages/Auth/FindPassword";
import Callback from "./pages/Auth/Callback";

import Home from "./pages/Home/Home";
import Budget from "./pages/Budget/Budget";
import Shop from "./pages/Shop/Shop";
import Challenge from "./pages/Challenge/Challenge";
import Friends from "./pages/Friends/Friends";
import MyPage from "./pages/MyPage/MyPage";
import SettingsPage from "./pages/MyPage/components/SettingsPage";
import EditProfilePage from "./pages/MyPage/components/EditProfilePage";
import ChangePasswordPage from "./pages/MyPage/components/ChangePasswordPage";
import Guestbook from "./pages/Friends/GuestBooks";
import useTheme from "./hooks/useTheme";
import { ThemeProvider } from "./context/ThemeProvider";
import "./styles/CalendarThemes.css";
import { ProfileProvider } from "./context/ProfileProvider";
import GuestbookHistoryPage from "./pages/Friends/GuestbookHistoryPage";
import FriendHome from "./pages/Friends/FriendHome";
import FriendManagePage from "./pages/MyPage/components/FriendManagePage";
import EmotionReportPage from "./pages/Home/components/EmotionReportPage";

import "./styles/App.css";

function App() {
  const location = useLocation();

  // Header/Sidebar 없이 보여야 하는 페이지들
  const noLayoutRoutes = [
    "/",
    "/join",
    "/login",
    "/welcome",
    "/info-steps",
    "/find-password",
  ];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);

  const memberId = localStorage.getItem("memberId");
  if (memberId && !localStorage.getItem("ownerId")) {
    localStorage.setItem("ownerId", memberId);
  }

  return (
    <ThemeProvider>
      <ProfileProvider>
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
                {/* 로그인 전 */}
                <Route path="/" element={<StartingPage />} />
                <Route path="/join" element={<Join />} />
                <Route path="/login" element={<Login />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/info-steps" element={<InfoSteps />} />
                <Route path="/find-password" element={<FindPassword />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/oauth/kakao" element={<OauthKakao />} />

                {/* 로그인 후 */}
                <Route path="/home" element={<Home />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/challenge" element={<Challenge />} />
                <Route path="/friends/:friendId" element={<FriendHome />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/mypage" element={<MyPage />} />

                {/* ✅ 월말 리포트 경로 추가 */}
                <Route path="/report" element={<EmotionReportPage />} />

                {/*설정페이지 라우터*/}

                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/settings/edit-profile"
                  element={<EditProfilePage />}
                />
                <Route
                  path="/settings/change-password"
                  element={<ChangePasswordPage />}
                />
                <Route
                  path="/settings/friend-manage"
                  element={<FriendManagePage />}
                />
                <Route
                  path="/guestbook/history"
                  element={<GuestbookHistoryPage />}
                />
                <Route path="/friends/:friendId" element={<FriendHome />} />
              </Routes>
            </main>
          </div>
        </div>
      </ProfileProvider>
    </ThemeProvider>
  );
}

export default App;
