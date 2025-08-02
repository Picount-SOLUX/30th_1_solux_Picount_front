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

  const [guestbookList, setGuestbookList] = useState([]);
  const [imageFile, setImageFile] = useState(null); // ✅ 실제 업로드할 파일

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // ✅ base64는 UI 표시용
        setImageFile(file); // ✅ File 객체는 FormData용
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setProfileImage("/assets/profile_default.png");
    setImageFile(null); // ✅ 이미지 초기화
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
      const profileInfo = {
        nickname,
        intro,
      };

      const formData = new FormData();
      formData.append(
        "profileInfo",
        new Blob([JSON.stringify(profileInfo)], { type: "application/json" })
      );
      if (imageFile) {
        formData.append("profileImage", imageFile);
      }

      const res = await api.put("/members/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedUser = {
          nickname,
          intro,
          profileImage: profileImage, // ✅ 서버 응답 이미지 URL 우선
        };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ 로컬 저장
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
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setNickname(userData.nickname || "");
      setIntro(userData.intro || "");
      setProfileImage(userData.profileImage || "/assets/profile_default.png");
    } else {
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
            // ✅ 로컬에도 저장
            localStorage.setItem(
              "user",
              JSON.stringify({
                nickname: data.nickname || "",
                intro: data.intro || "",
                profileImage:
                  data.profileImageUrl || "/assets/profile_default.png",
              })
            );
          })
          .catch((err) => {
            console.error("프로필 정보 불러오기 실패:", err);
          });
      }
    }

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
              alt='프로필'
              className={styles.preview}
            />
            <label className={styles.changeImageBtn}>
              ✎ 프로필 이미지 변경
              <input
                type='file'
                accept='image/*'
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
              type='text'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder='닉네임 입력'
            />
          </label>
          <label>
            한 줄 소개 ✎
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder='한 줄 소개 입력'
            />
          </label>
          <div className={styles.resetBtnWrapper}>
            <button onClick={handleResetImage} className={styles.resetBtn}>
              기본 이미지로 변경
            </button>
          </div>
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
