import { useEffect, useState } from 'react';
import type { ReactNode } from "react";


interface Props {
  children: ReactNode;
}

export function PageTransition({ children }: Props) {
  const [isVisible, setIsVisible] = useState(false);



  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
        }
      `}
    >
      {children}
    </div>
  );
}
