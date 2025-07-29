export default function getOwnerId() {
  const myId = localStorage.getItem("ownerId");
  if (!myId) {
    throw new Error("로그인 정보가 없습니다 (myId 누락)");
  }
  return myId;
}
