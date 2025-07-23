import React, { useState } from "react";
import { ProfileContext } from "./ProfileContext";

export const ProfileProvider = ({ children }) => {
  const [nickname, setNickname] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  return (
    <ProfileContext.Provider
      value={{
        nickname,
        setNickname,
        intro,
        setIntro,
        profileImage,
        setProfileImage,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
