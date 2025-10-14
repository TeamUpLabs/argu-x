// 앞면용 배경 이미지 색상 감지 함수 (왼쪽 상단 영역)
export const getFrontImageBrightness = (imageSrc: string): Promise<'light' | 'dark'> => {
  return new Promise((resolve) => {
    const img = new globalThis.Image();
    img.crossOrigin = 'anonymous';

    const onLoad = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve('dark');
        return;
      }

      const sampleSize = 100;
      canvas.width = sampleSize;
      canvas.height = sampleSize;

      // 이미지 왼쪽 상단 영역을 샘플링 (이미지의 0-20% 영역)
      const sourceX = 0;
      const sourceY = 0;
      const sourceWidth = Math.floor(img.width * 0.8);
      const sourceHeight = Math.floor(img.height * 0.2);

      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, sampleSize, sampleSize
      );

      const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imageData.data;

      let totalBrightness = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
      }

      const averageBrightness = totalBrightness / pixelCount;
      resolve(averageBrightness > 128 ? 'light' : 'dark');
    };

    const onError = () => {
      resolve('dark');
    };

    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = imageSrc;
  });
};

// 텍스트 색상 결정 함수
export const getTextColorClass = (brightness: 'light' | 'dark') => {
  return brightness === 'light' ? 'text-black' : 'text-white';
};

export const getTextOpacityClass = (brightness: 'light' | 'dark', opacity: number = 1) => {
  if (brightness === 'light') {
    const opacityValue = Math.floor(opacity * 100);
    return opacity === 1 ? 'text-gray-700' : `text-gray-600 opacity-${opacityValue}`;
  }
  const opacityValue = Math.floor(opacity * 100);
  return opacity === 1 ? 'text-white' : `text-white opacity-${opacityValue}`;
};