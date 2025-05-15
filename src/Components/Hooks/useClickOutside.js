import { useEffect } from "react";

export default function useClickOutside(refs, callback, isActive = true) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      // refs can be single or array
      const refsArray = Array.isArray(refs) ? refs : [refs];

      const isInside = refsArray.some(
        (ref) => ref.current && ref.current.contains(event.target)
      );

      if (!isInside) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [refs, callback, isActive]);
}
