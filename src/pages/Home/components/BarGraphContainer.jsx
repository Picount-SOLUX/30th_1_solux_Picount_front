import React, { useEffect, useState } from "react";
import BarGraph from "./BarGraph";

export default function BarGraphContainer({ budgetCategories }) {
  const [categoriesWithSpent, setCategoriesWithSpent] = useState([]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("localEntries") || "{}");
    console.log("BarGraphContainer까진 되나", localData)
    // 각 카테고리별 지출 합산
    const spentMap = {};

    Object.values(localData).forEach((entry) => {
      entry.entries?.forEach((item) => {
        if (item.type === "expense") {
          const category = item.category;
          if (!spentMap[category]) {
            spentMap[category] = 0;
          }
          spentMap[category] += item.amount;
        }
      });
    });

    // 최종 categories 배열 구성
    const merged = budgetCategories.map((cat) => ({
      ...cat,
      spent: spentMap[cat.name] || 0, // 이름 기준 매칭
    }));

    setCategoriesWithSpent(merged);
  }, [budgetCategories]);

  return <BarGraph categories={categoriesWithSpent} />;
}
