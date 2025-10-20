import pako from 'pako';

/**
 * 데이터를 효율적으로 압축하여 URL-safe 문자열로 변환
 */
export function compressData(data: unknown): string {
  // JSON 직렬화
  const jsonString = JSON.stringify(data);

  // 문자열을 바이트 배열로 변환
  const utf8Bytes = Buffer.from(jsonString, 'utf8');

  // pako를 사용해 deflate 압축
  const compressed = pako.deflate(utf8Bytes);

  // URL-safe base64 인코딩 (버퍼를 문자열로 변환)
  const base64String = Buffer.from(compressed).toString('base64');

  // URL-safe 변환
  return base64String
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

/**
 * 압축된 데이터를 복원
 */
export function decompressData(compressedString: string): unknown {
  try {
    // URL-safe base64 디코딩
    const base64String = compressedString
      .replaceAll('-', '+')
      .replaceAll('_', '/');

    // 패딩 복원 (base64는 4의 배수여야 함)
    const paddedString = base64String + '='.repeat((4 - base64String.length % 4) % 4);

    // base64 디코딩 후 inflate 압축 해제
    const compressedBytes = Buffer.from(paddedString, 'base64');
    const decompressedBytes = pako.inflate(compressedBytes);

    // 바이트 배열을 문자열로 변환 후 JSON 파싱
    const jsonString = Buffer.from(decompressedBytes).toString('utf8');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('데이터 압축 해제 실패:', error);
    throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
  }
}

/**
 * 압축률 계산 (참고용)
 */
export function getCompressionRatio(originalData: unknown): number {
  const originalSize = Buffer.from(JSON.stringify(originalData), 'utf8').length;
  const compressedSize = Buffer.from(compressData(originalData), 'utf8').length;
  return Math.round((1 - compressedSize / originalSize) * 100);
}
