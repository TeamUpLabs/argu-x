// 상대적 날짜를 반환하는 함수
export const getRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays === 2) return '그저께';
  if (diffDays <= 7) return `${diffDays}일 전`;

  return date.toLocaleDateString('ko-KR');
};