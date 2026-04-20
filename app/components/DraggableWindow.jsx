"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function DraggableWindow({
  id,
  title,
  x,
  y,
  width,
  height,
  zIndex,
  onDrag,
  onFocus,
  onClose,
  scrollable = true,
  children,
}) {
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - x,
      y: e.clientY - y,
    };
    onFocus(id);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingRef.current) return;

      const nextX = e.clientX - offsetRef.current.x;
      const nextY = e.clientY - offsetRef.current.y;

      onDrag(id, nextX, nextY);
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id, onDrag]);

  return (
    <div
      onMouseDown={() => onFocus(id)}
      className="absolute flex flex-col overflow-hidden rounded-sm border border-slate-300 bg-white shadow-xl"
      style={{ left: x, top: y, width, height, zIndex }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="flex cursor-move items-center justify-between border-b border-slate-300 bg-slate-100 px-4 py-3 select-none"
      >
        <p className="text-base font-medium text-slate-700">{title}</p>

        <button
          onClick={() => onClose(id)}
          className="rounded p-1.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={`flex-1 bg-white p-6 text-base leading-relaxed ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}>
        {children}
      </div>
    </div>
  );
}
