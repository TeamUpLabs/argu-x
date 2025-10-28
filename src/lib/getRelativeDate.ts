// 상대적 날짜와 시간을 반환하는 함수
export const getRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  
  // 시간 차이 계산 (밀리초 단위)
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 1분 미만: 방금 전
  if (diffSeconds < 60) return '방금 전';
  
  // 1시간 미만: N분 전
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  
  // 오늘: N시간 전
  if (diffDays === 0) return `${diffHours}시간 전`;
  
  // 어제: 어제
  if (diffDays === 1) return '어제';
  
  // 그저께: 그저께
  if (diffDays === 2) return '그저께';
  
  // 7일 이내: N일 전
  if (diffDays <= 7) return `${diffDays}일 전`;

  // 7일 초과: YYYY. MM. DD. 형식으로 반환
  return date.toLocaleDateString('ko-KR');
};