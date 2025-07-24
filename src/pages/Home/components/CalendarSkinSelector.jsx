import { useEffect, useState } from "react";
import axios from "axios";
import { useSkin } from "../../context/SkinContext";

export default function CalendarSkinSelector() {
  const { setCalendarSkinUrl } = useSkin();
  const [skins, setSkins] = useState([]);

  useEffect(() => {
    axios.get("/api/items/my-calendar-skins").then((res) => {
      if (res.data.success) {
        setSkins(res.data.data);
      }
    });
  }, []);

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {skins.map((skin) => (
        <img
          key={skin.itemId}
          src={`/assets/ShopItems/CalendarSkin/${skin.previewImageUrl}`}
          alt={skin.name}
          onClick={() =>
            setCalendarSkinUrl({
              backgroundUrl: skin.skinImageUrl, // 배경용
              frameUrl: skin.frameImageUrl, // 장식용 (예: 리본, 별)
            })
          }
        />
      ))}
    </div>
  );
}
