import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBGM } from "../bgm/bgmContext.jsx";
import axios from "axios";
import styles from "./TopButtons.module.css";
import RoomCreateModal from "./RoomCreateModal";
import RoomSearchModal from "./RoomSearchModal";
import Sidebar from "./sidebar/sidebar";
// import RoomEnterModal from './RoomEnterModal';

import messenger from "../../images/square/icon_messenger.png";
import refresh from "../../images/square/icon_refresh.png";
import search from "../../images/square/icon_search.png";

export default function TopButtons() {
  const channelId = sessionStorage.getItem("channelId");
  const { toggleBGMVisibility } = useBGM();
  const accessToken = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();

  // 모달 상태변수
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  // const [EnterModal, setEnterModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 관리

  // 모달 open/close
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const openSearchModal = () => {
    setSearchModal(true);
  };

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // 사이드바 상태에 따라 BGMPlayer의 가시성을 토글합니다.
    toggleBGMVisibility(!isSidebarOpen);
  };

  // 새로고침 핸들러
  const handleRefreshClick = () => {
    // UserList와 RoomList를 새로고침하기 위한 이벤트 발생
    window.dispatchEvent(new CustomEvent("refreshUserList"));
    window.dispatchEvent(new CustomEvent("refreshRoomList"));
  };

  // 빠른 입장 핸들러
  const handleQuickEnter = async () => {
    // post /api/square/fast
    try {
      // 서버로부터 빠른 입장 가능한 방의 정보를 요청
      const response = await axios.post(
        "https://j10d202.p.ssafy.io/api/square/fast",
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("빠른 입장 응답:", response);
      if (response.status === 200 && response.data.data) {
        // 성공적으로 방 정보를 받아온 경우, 해당 방의 페이지로 이동
        // navigate(`/room/${response.data.data.roomId}`);
        const roomId = response.data.data;
        axios
          .post(
            "https://j10d202.p.ssafy.io/api/room/enter",
            {
              roomId: roomId,
            },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          )
          .then((response) => {
            console.log("입장 성공:", response);
            if (response.status === 200) {
              console.log("입장 성공:", response);
              navigate(`/room/${roomId}`, {
                state: JSON.parse(JSON.stringify({ response })),
              });
            }
          });
        // .catch((error) => {
        //   console.log('비번:', isPassword);
        //   console.log('입장 실패:', error);
        //   if (!error.response) {
        //     alert('알 수 없는 오류가 발생했습니다.');
        //     onClose();
        //     return;
        //   }
        //   switch (error.response.data.statusCode) {
        //     case 423: // 방 비밀번호 틀렸을 때
        //       setShowRoomEnterModal(true)
        //       break;

        //     case 426: // 방이 가득 찼을 때
        //       alert('방이 가득 차서 입장할 수 없어요!');
        //       onClose(); // 모달 닫기
        //       break;

        //     case 404: // 방이 존재하지 않을 때
        //       alert('존재하지 않는 방번호입니다!');
        //       onClose(); // 모달 닫기
        //       break;

        //     default:
        //       // 예외 처리
        //       alert('알 수 없는 오류가 발생!');
        //       onClose(); // 모달 닫기
        //       break;
        //     }
        // });
      } else {
        // 서버로부터 적절한 응답을 받지 못한 경우
        alert("빠른 입장 가능한 방을 찾을 수 없습니다.");
      }
    } catch (error) {
      // 요청 중 오류가 발생한 경우
      console.error("빠른 입장 처리 중 오류 발생:", error);
      alert("빠른 입장 처리 중 오류가 발생했습니다");
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-5">
        {/* 뒤로가기 버튼 */}
        <div>
          <button
            onClick={() => navigate(`/channel`)}
            className="font-bold text-white text-4xl"
          >
            Back
          </button>
        </div>

        <div className="flex-grow flex justify-center gap-4 ml-20">
          {/* 방 만들기 버튼 */}
          <button
            onClick={handleOpenModal}
            className={`flex items-center justify-center font-Bit text-2xl ${styles.textButton}`}
          >
            방 만들기
          </button>

          {/* 빠른 입장 버튼 */}
          <button
            onClick={handleQuickEnter}
            className={`flex items-center justify-center font-Bit text-2xl ${styles.textButton}`}
          >
            빠른 입장
          </button>

          {/* 방 찾기 버튼 */}
          <button
            onClick={openSearchModal}
            className={`flex items-center justify-center font-Bit text-2xl ${styles.searchButton}`}
          >
            방 찾기
          </button>
        </div>

        {/* 우측 상단 아이콘 이미지 버튼 2개 */}
        <div className="flex">
          {/* 새로고침 버튼 */}
          <button
            onClick={handleRefreshClick}
            className={`${styles.refreshButton}`}
          >
            <img src={refresh} alt="RefreshButton" />
          </button>
          {/* 친구 채팅 버튼 */}
          <button
            onClick={toggleSidebar}
            className={`${styles.messengerButton}`}
          >
            <img src={messenger} alt="MessengerButton" />
          </button>
        </div>
      </div>

      {/* 모달 함수 전달 */}
      {/* RoomCreateModal을 렌더링하고, props로 handleCloseModal 함수를 전달 */}
      {isModalOpen && <RoomCreateModal onClose={handleCloseModal} />}

      {searchModal && <RoomSearchModal setSearchModal={setSearchModal} />}
      {searchModal && <RoomSearchModal onClose={() => setSearchModal(false)} />}

      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}
    </>
  );
}
