'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollAnchor() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 100;
    setIsAtBottom(isBottom);
  };

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  return {
    scrollRef,
    isAtBottom,
    checkScroll,
    scrollToBottom,
  };
}
