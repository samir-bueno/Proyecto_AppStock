import { useState } from 'react';

export const useCameraState = () => {
  const [showScanner, setShowScanner] = useState(false);

  const openCamera = () => setShowScanner(true);
  const closeCamera = () => setShowScanner(false);

  return {
    showScanner,
    openCamera,
    closeCamera,
  };
};