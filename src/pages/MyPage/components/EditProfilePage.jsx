import React, { useState } from "react";
import styles from "./EditProfilePage.module.css";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [skins, setSkins] = useState([
    { id: 1, name: "생크림", image: "/skins/꾸미기 스킨 1.png" },
    { id: 2, name: "체리", image: "/skins/꾸미기 스킨 2.png" },
    { id: 3, name: "꽃", image: "/skins/꾸미기 스킨 3.png" },
    { id: 4, name: "데코크림", image: "/skins/꾸미기 스킨 4.png" },
  ]);

  const handleRemoveSkin = (id) => {
    setSkins((prevSkins) => prevSkins.filter((skin) => skin.id !== id));
  };

  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [guestbookList, setGuestbookList] = useState([
    { id: 1, content: "친구 닉네임 (0000-00-00 00:00)" },
    { id: 2, content: "친구 닉네임 (0000-00-00 00:00)" },
    { id: 3, content: "친구 닉네임 (0000-00-00 00:00)" },
  ]);

  const handleDeleteGuestbook = (id) => {
    setGuestbookList(guestbookList.filter((item) => item.id !== id));
  };

  const handleDeleteAllGuestbook = () => {
    setGuestbookList([]);
  };

  const handleSave = () => {
    alert("수정 사항이 저장되었습니다.");
    // 백엔드 연동 시 API 호출 위치
    navigate("/settings"); // 설정 페이지로 이동

    const skins = [
      { id: 1, name: "꾸미기 스킨 1", image: "skin1.png" },
      { id: 2, name: "꾸미기 스킨 2", image: "skin2.png" },
      { id: 3, name: "꾸미기 스킨 3", image: "skin3.png" },
      { id: 4, name: "꾸미기 스킨 4", image: "skin4.png" },
    ];
  };

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        마이 페이지 &gt; 설정 &gt; 프로필 수정
      </div>

      <div className={styles.profileSection}>
        <div className={styles.profileImageBox}>
          <div className={styles.profileImage}>
            <button className={styles.changeImageBtn}>
              ✎ 프로필 이미지 변경
            </button>
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

      <div className={styles.skinSection}>
        <h3>보유한 꾸미기 스킨</h3>
        <div className={styles.skinGrid}>
          {skins.map((skin) => (
            <div className={styles.skinBox} key={skin.id}>
              <img
                src={`${skin.image}`}
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
