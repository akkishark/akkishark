import React, { useState, useEffect } from "react";
import CustomCalendar from "./Calendar";
import api from "../../../api/axiosInstance";

const RecordBox = () => {
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const [userId, setUserId] = useState(-1);
  const [userNickname, setUserNickname] = useState("");
  const [userTier, setUserTier] = useState("");
  const [songs, setSongs] = useState([]); // 음악 목록을 저장할 상태
  const [clearedSongs, setClearedSongs] = useState(0); // 클리어 곡 수를 저장할 상태
  const [userPosts, setUserPosts] = useState([]); // 유저가 작성한 게시글 목록을 저장할 상태
  const [value, onChange] = useState(new Date());

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = getCookie("accessToken"); // 쿠키에서 accessToken 가져오기
        const response = await api.get("/user/", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 요청 헤더에 인증 토큰 추가
            "Cache-Control": "no-cache",
          },
        });
        console.log("User Info:", response.data); // 응답 데이터 로깅
        setUserId(response.data.userIdx); // 유저 닉네임 상태 업데이트
        setUserNickname(response.data.nickname);
        // 추가로 필요한 유저 정보가 있으면 여기서 상태 업데이트
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    // 서버로부터 티어 정보를 가져오는 함수
    const fetchUserTier = async () => {
      try {
        const accessToken = getCookie("accessToken"); // 쿠키에서 accessToken 가져오기
        const response = await api.get("/user/tier", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 요청 헤더에 인증 토큰 추가
            "Cache-Control": "no-cache",
          },
        });
        console.log("Data:", response.data); // axios는 자동으로 JSON을 파싱합니다.
        setUserTier(response.data); // 상태 업데이트
      } catch (error) {
        console.error("Error fetching user tier:", error);
      }
    };

    const fetchSongs = async () => {
      try {
        const accessToken = getCookie("accessToken"); // 쿠키에서 accessToken 가져오기
        const response = await api.get("/perfectplay/list", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 요청 헤더에 인증 토큰 추가
            "Cache-Control": "no-cache",
          },
        });
        console.log("Songs:", response.data); // 응답 데이터 로깅
        const songData = response.data.data; // 실제 채널 데이터 접근
        if (Array.isArray(songData)) {
          // 응답 데이터가 배열인지 확인
          setSongs(songData); // 배열이면 상태 업데이트
        } else {
          console.error("Received data is not an array"); // 배열이 아니면 에러 로깅
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchUserInfo(); // 유저 정보 조회 함수 호출
    fetchUserTier(); // 유저 티어 조회 함수 호출
    fetchSongs(); // 음악 목록 조회 함수 호출
  }, []);

  const fetchClearedSongs = async () => {
    try {
      const response = await api.get(`/perfectplay/${userId}`, {
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`, // 요청 헤더에 인증 토큰 추가
          "Cache-Control": "no-cache",
        },
      });
      console.log("Cleared Songs:", response.data.data[0].totalClear);
      setClearedSongs(response.data.data[0].totalClear);
    } catch (error) {
      console.error("Error fetching cleared songs:", error);
    }
  };

  // userId가 변경될 때마다 fetchClearedSongs 실행
  useEffect(() => {
    if (userId !== -1) {
      // 초기 값이 아니라 실제로 설정된 경우에만 실행
      fetchClearedSongs();
    }
  }, [userId]);

  const fetchUserPosts = async () => {
    try {
      console.log(userNickname);
      console.log(typeof userNickname);
      const response = await api.get(`/board/user/${userNickname}`, {
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`, // 요청 헤더에 인증 토큰 추가
          "Cache-Control": "no-cache",
        },
      });
      console.log("User Posts:", response.data); // 응답 데이터 로깅
      setUserPosts(response.data); // 유저가 작성한 게시글 목록 상태 업데이트
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    if (userNickname !== "") {
      // 초기 값이 아니라 실제로 설정된 경우에만 실행
      fetchUserPosts(); // 유저가 작성한 게시글 조회 함수 호출
    }
  }, [userNickname]);

  const getTierAbbreviation = (tier) => {
    switch (
      tier.toLowerCase() // 소문자로 변환하여 대소문자 구분 없이 비교
    ) {
      case "bronze":
        return "BR";
      case "silver":
        return "SV";
      case "gold":
        return "GD";
      case "platinum":
        return "PT";
      case "diamond":
        return "DM";
      default:
        return ""; // 일치하는 티어가 없는 경우 빈 문자열 반환
    }
  };

  const userTierStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // 수평 중앙 정렬 추가
    width: "40%", // 필요에 따라 조정하거나 제거
    height: "10%",
    border: "solid", // 필요에 따라 테두리 스타일을 조정
  };

  const getTierStyle = (tier) => {
    const baseStyle = { ...userTierStyle }; // 기본 userTierStyle을 복사하여 사용

    switch (tier) {
      case "bronze":
        return {
          ...baseStyle,
          backgroundColor: "#cd7f32", // Bronze 색상
          color: "white",
          marginLeft: "1.5%",
          marginRight: "3%",
        };
      case "silver":
        return {
          ...baseStyle,
          backgroundColor: "#C0C0C0", // Silver 색상
          color: "white",
        };
      case "gold":
        return {
          ...baseStyle,
          backgroundColor: "#FFD700", // Gold 색상
          color: "white",
        };
      case "platinum":
        return {
          ...baseStyle,
          backgroundColor: "#E5E4E2", // Platinum 색상
          color: "white",
        };
      case "diamond":
        return {
          ...baseStyle,
          backgroundColor: "#b9f2ff", // Diamond 색상
          color: "black", // Diamond는 밝은 색상이므로 텍스트 색상을 검정으로 변경
        };
      default:
        return baseStyle; // 일치하는 티어가 없는 경우 기본 스타일 사용
    }
  };

  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3; // 한 페이지에 표시할 게시글 수

  // 현재 페이지의 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPosts = userPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  // 페이지 그룹 계산 (예: 1~5, 6~10 등)
  const pageGroup = Math.ceil(currentPage / 5);
  const startPage = (pageGroup - 1) * 5 + 1;
  const endPage = Math.min(startPage + 4, totalPages);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 카드 스타일
  const cardStyle1 = {
    display: "block",
    marginTop: "6%", // Navbar 아래에 위치하도록 마진 조정
    marginLeft: "auto",
    marginRight: "auto",
    width: "92%", // 전체 너비 사용
    height: "40%",
    zIndex: "10",
    backgroundColor: "#EFD6BC",
    borderRadius: "10px",
    padding: "20px",
    justifyContent: "space-around", // 내부 박스가 균등하게 분포하도록
  };

  const cardStyle2 = {
    display: "block",
    textAlign: "left",
    marginTop: "50px", // Navbar 아래에 위치하도록 마진 조정
    marginLeft: "auto",
    marginRight: "auto",
    width: "92%", // 전체 너비 사용
    height: "250px",
    zIndex: "10",
    backgroundColor: "#EFD6BC",
    borderRadius: "10px",
    padding: "20px",
    justifyContent: "space-around", // 내부 박스가 균등하게 분포하도록
    position: "relative",
  };

  const cardStyle3 = {
    display: "block",
    marginTop: "50px", // Navbar 아래에 위치하도록 마진 조정
    marginBottom: "14.5%",
    marginLeft: "auto",
    marginRight: "auto",
    width: "92%", // 전체 너비 사용
    height: "400px",
    zIndex: "10",
    backgroundColor: "#EFD6BC",
    borderRadius: "10px",
    padding: "20px",
    justifyContent: "space-around", // 내부 박스가 균등하게 분포하도록
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center", // 가로축 기준 가운데 정렬
  };

  const innerBoxStyle = {
    display: "flex",
    flexDirection: "column",
    border: "3px solid #ccc",
    backgroundColor: "#F9FFF8",
    borderRadius: "4px",
    paddingTop: "0%",
    width: "30%", // 각 박스가 전체의 30% 차지
    height: "275px",
    textAlign: "center",
    marginTop: "3px",
    marginBottom: "17px",
    marginLeft: "10px",
    marginRight: "10px",
    alignItems: "center", // 가로축 기준으로 가운데 정렬합니다.
    // justifyContent: "center", // 세로축 기준으로 가운데 정렬합니다.
  };

  const postListStyle = {
    border: "3px solid #ccc",
    backgroundColor: "#F9FFF8",
    borderRadius: "4px",
    width: "96%",
    maxHeight: "70%",
    marginTop: "2%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "0%",
    paddingLeft: "3%",
    paddingBottom: "1%",
    // listStyleType: "none",
    // overflowY: "auto",
  };

  const postItemStyle = {
    fontSize: "16px",
    fontWeight: "650",
    marginTop: "2%",
    marginBottom: "1%",
    marginLeft: "2%",
    marginRight: "4%",
    paddingBottom: "1%",
    // textAlign: "left",
    borderBottom: "1px solid #C7BDB6",
  };

  const paginationStyle = {
    display: "flex", // Flexbox 레이아웃 사용
    justifyContent: "center", // 가운데 정렬
    position: "absolute", // 절대 위치를 사용하여 cardStyle2에 상대적으로 배치
    bottom: "4%", // 하단에서 10px 위
    left: "0", // 왼쪽 정렬 시작점
    right: "0", // 오른쪽 정렬 시작점, left와 right를 0으로 설정하여 중앙 정렬
  };

  const boxTitle = {
    fontSize: "23px",
    paddingLeft: "18px",
    marginTop: "8px",
  };

  const innerTitle = {
    fontSize: "27px",
  };

  const tierBoxStyle = {
    backgroundColor: "gold", // 'G4' 박스의 배경색을 황금색으로 설정합니다.
    color: "black", // 'G4' 텍스트 색상을 검은색으로 설정합니다.
    padding: "8px 12px", // 적당한 패딩을 추가합니다.
    borderRadius: "5px", // 모서리를 둥글게 합니다.
    fontWeight: "bold", // 글씨를 굵게 합니다.
    marginTop: "4%",
    marginBottom: "8%", // 'Gold 4' 텍스트와의 간격을 설정합니다.
  };

  const tierTextStyle = {
    marginBottom: "3%",
    fontSize: "32px", // 'Gold 4' 텍스트 크기를 크게 설정합니다.
    color: "black", // 'Gold 4' 텍스트 색상을 검은색으로 설정합니다.
    fontWeight: "bold", // 글씨를 굵게 합니다.
  };

  return (
    <div style={{ display: "block" }}>
      <div style={cardStyle1}>
        <h2 style={boxTitle}>나의 퍼펙트 플레이</h2>
        <div style={containerStyle}>
          <div style={innerBoxStyle}>
            <h2 style={innerTitle}>나의 티어</h2>
            <div style={getTierStyle(userTier)}>{getTierAbbreviation(userTier)}</div>
            <br />
            <button>전체 티어표 보기</button>
          </div>
          <div style={innerBoxStyle}>
            <h2 style={innerTitle}>클리어한 곡</h2>
            <br />
            <div style={tierTextStyle}>{clearedSongs}곡</div>
            <br />
            <br />
            <div style={{ fontSize: "20px" }}>총 {songs.length}곡</div>
          </div>
          <div style={innerBoxStyle}>
            <h2 style={innerTitle}>스트릭</h2>
          </div>
        </div>
      </div>
      <div style={cardStyle2}>
        <h2 style={boxTitle}>내가 작성한 글</h2>
        <ul style={postListStyle}>
          {currentPosts.map((post) => (
            <li key={post.boardIdx} style={postItemStyle}>
              {post.boardTitle}
            </li>
          ))}
        </ul>
        <div style={paginationStyle}>
          <button onClick={() => paginate(1)}>{"<<"}</button>
          <button onClick={() => paginate(Math.max(1, startPage - 5))}>{"<"}</button>
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
            <button
              key={startPage + i}
              onClick={() => paginate(startPage + i)}
              style={{ fontWeight: currentPage === startPage + i ? "bold" : "normal" }}
            >
              {startPage + i}
            </button>
          ))}
          <button onClick={() => paginate(Math.min(totalPages, endPage + 1))}>{">"}</button>
          <button onClick={() => paginate(totalPages)}>{">>"}</button>
        </div>
      </div>
      <div style={cardStyle3}>
        <h2 style={boxTitle}>녹화 캘린더</h2>
        <CustomCalendar />
      </div>
    </div>
  );
};

export default RecordBox;
