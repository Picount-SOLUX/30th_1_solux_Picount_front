import React, { useEffect, useState } from "react";
import styles from "./EditProfilePage.module.css";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../context/useProfile";
import api from "../../../api/axiosInstance";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const {
    nickname,
    setNickname,
    intro,
    setIntro,
    profileImage,
    setProfileImage,
  } = useProfile();

  const [skins, setSkins] = useState([
    { id: 1, name: "생크림", image: "/skins/꾸미기 스킨 1.png" },
    { id: 2, name: "체리", image: "/skins/꾸미기 스킨 2.png" },
    { id: 3, name: "꽃", image: "/skins/꾸미기 스킨 3.png" },
    { id: 4, name: "데코크림", image: "/skins/꾸미기 스킨 4.png" },
  ]);

  const [guestbookList, setGuestbookList] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // base64 저장
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setProfileImage("/assets/profile_default.png"); // ✅ 기본 이미지로 초기화
  };

  const handleRemoveSkin = (id) => {
    setSkins((prevSkins) => prevSkins.filter((skin) => skin.id !== id));
  };

  const handleDeleteGuestbook = async (id) => {
    try {
      await api.delete(`/guestbook/my/${id}`);
      setGuestbookList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("방명록 삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleDeleteAllGuestbook = async () => {
    try {
      await api.delete("/guestbook/my");
      setGuestbookList([]);
    } catch (error) {
      console.error("전체 방명록 삭제 실패", error);
      alert("전체 삭제에 실패했습니다.");
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        nickname,
        intro,
        profileImage,
      };

      const res = await api.patch("/members/profile", payload);

      if (res.data.success) {
        alert("프로필이 성공적으로 수정되었습니다!");
        navigate("/settings");
      } else {
        alert(res.data.message || "프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    // ✅ 초기 프로필 정보 불러오기
    const memberId = localStorage.getItem("memberId");
    if (memberId) {
      api
        .get(`/members/${memberId}`)
        .then((res) => {
          const data = res.data.data;
          setNickname(data.nickname || "");
          setIntro(data.intro || "");
          setProfileImage(
            data.profileImageUrl || "/assets/profile_default.png"
          );
        })
        .catch((err) => {
          console.error("프로필 정보 불러오기 실패:", err);
        });
    }

    // ✅ 방명록 불러오기
    api.get("/guestbook/my?page=0&size=10").then((res) => {
      if (res.data.success) {
        const formatted = res.data.data.content.map((item) => ({
          id: item.guestbookId,
          content: `${item.ownerNickname} (${item.createdAt
            .slice(0, 16)
            .replace("T", " ")}) - ${item.content}`,
        }));
        setGuestbookList(formatted);
      }
    });
  }, [setNickname, setIntro, setProfileImage]);

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        마이 페이지 &gt; 설정 &gt; 프로필 수정
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileImageBox}>
          <div className={styles.profileImage}>
            <img
              src={profileImage || "/assets/profile_default.png"}
              alt="프로필"
              className={styles.preview}
            />
            <label className={styles.changeImageBtn}>
              ✎ 프로필 이미지 변경
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>
        </div>

        <div className={styles.profileInputs}>
          <label>
            닉네임 ✎
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임 입력"
            />
          </label>
          <label>
            한 줄 소개 ✎
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="한 줄 소개 입력"
            />
          </label>
        </div>
      </div>
      <button onClick={handleResetImage} className={styles.resetBtn}>
        기본 이미지로 변경
      </button>

      <div className={styles.skinSection}>
        <h3>보유한 꾸미기 스킨</h3>
        <div className={styles.skinGrid}>
          {skins.map((skin) => (
            <div className={styles.skinBox} key={skin.id}>
              <img
                src={skin.image}
                alt={skin.name}
                className={styles.skinImage}
              />
              <button
                className={styles.removeSkinBtn}
                onClick={() => handleRemoveSkin(skin.id)}
              >
                스킨 제거
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.guestbookSection}>
        <h3>
          내가 남긴 방명록 글
          <button
            className={styles.deleteAllBtn}
            onClick={handleDeleteAllGuestbook}
          >
            전체 삭제
          </button>
        </h3>
        <ul className={styles.guestbookList}>
          {guestbookList.map((item) => (
            <li key={item.id} className={styles.guestbookItem}>
              <span>{item.content}</span>
              <button
                onClick={() => handleDeleteGuestbook(item.id)}
                className={styles.deleteBtn}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.saveSection}>
        <button className={styles.saveButton} onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}
