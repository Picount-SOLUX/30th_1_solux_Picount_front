import { useContext } from "react";
import { SkinContext } from "./SkinContext";

export default function useSkin() {
  return useContext(SkinContext);
}
