import React, { useEffect } from "react";

const useKeyboardListener = (keyCode: string, fn: VoidFunction) => {
  useEffect(() => {
    const keydownListener = (e: KeyboardEvent) => {
      if (e.code === keyCode) {
        e.preventDefault();
        fn();
      }
    };

    document.addEventListener("keydown", keydownListener);

    return () => {
      document.removeEventListener("keydown", keydownListener);
    };
  }, [keyCode, fn]);
};

export default useKeyboardListener;
