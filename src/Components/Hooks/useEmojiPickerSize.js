import { useEffect, useState } from "react";

const useEmojiPickerSize = () => {
  const [pickerSize, setPickerSize] = useState({ width: 310, height: 350 });

  const calculatePickerSize = () => {
    const width = window.innerWidth;

    if (width < 640) {
      // mobile
      setPickerSize({ width: Math.min(280, width - 20), height: 350 });
    } else if (width < 1024) {
      // tablet
      setPickerSize({ width: 310, height: 350 });
    } else {
      // desktop
      setPickerSize({ width: 350, height: 350 });
    }
  };

  useEffect(() => {
    calculatePickerSize();

    const handleResize = () => {
      calculatePickerSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return pickerSize;
};

export default useEmojiPickerSize;
