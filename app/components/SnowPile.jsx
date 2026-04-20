"use client";

import { useEffect, useRef } from "react";

const CANVAS_HEIGHT = 176;
const COLUMN_WIDTH = 4;
const DESKTOP_PADDING = 48;
const COMPACT_PADDING = 32;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getDesktopPadding = () =>
  window.innerWidth >= 768 ? DESKTOP_PADDING : COMPACT_PADDING;

const createTerrain = (count) =>
  Array.from({ length: count }, (_, index) => {
    const wave =
      Math.sin(index * 0.12) * 8 +
      Math.sin(index * 0.037 + 1.7) * 15 +
      Math.sin(index * 0.211 + 0.4) * 4;

    return wave;
  });

const createGrains = (width) =>
  Array.from({ length: Math.max(260, Math.floor(width / 2.8)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * CANVAS_HEIGHT,
    radius: 0.45 + Math.random() * 1.15,
    alpha: 0.16 + Math.random() * 0.28,
    tint: Math.random() > 0.72 ? "186,230,253" : "226,232,240",
  }));

export default function SnowPile({ windows = {} }) {
  const canvasRef = useRef(null);
  const windowsRef = useRef(windows);

  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return undefined;

    let animationFrame = 0;
    let width = 0;
    let columnCount = 0;
    let heights = [];
    let velocities = [];
    let terrain = [];
    let grains = [];
    let startedAt = performance.now();
    let lastInteractionAt = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const pointer = {
      x: -1000,
      y: -1000,
      previousX: -1000,
      previousY: -1000,
      speed: 0,
      time: 0,
    };

    const stamp = (x, radius, amount) => {
      if (!heights.length) return;

      const center = Math.round(x / COLUMN_WIDTH);
      const spread = Math.max(1, Math.round(radius / COLUMN_WIDTH));

      for (let offset = -spread; offset <= spread; offset += 1) {
        const index = center + offset;
        if (index < 0 || index >= heights.length) continue;

        const distance = Math.abs(offset / spread);
        const influence = (1 + Math.cos(distance * Math.PI)) / 2;
        velocities[index] += amount * influence;
      }
    };

    const resize = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      columnCount = Math.ceil(width / COLUMN_WIDTH) + 1;

      canvas.width = width * devicePixelRatio;
      canvas.height = CANVAS_HEIGHT * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${CANVAS_HEIGHT}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      terrain = createTerrain(columnCount);
      grains = createGrains(width);

      heights = Array.from({ length: columnCount }, (_, index) => {
        const previous = heights[index] ?? 22;
        return clamp(previous, 8, 118);
      });
      velocities = Array.from({ length: columnCount }, () => 0);
    };

    const handlePointerMove = (event) => {
      const now = performance.now();
      const distance = Math.hypot(
        event.clientX - pointer.previousX,
        event.clientY - pointer.previousY,
      );

      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.speed = distance;
      pointer.time = now;
    };

    const applyMousePressure = (now) => {
      if (now - pointer.time > 140) return;

      const localY = pointer.y - (window.innerHeight - CANVAS_HEIGHT);
      if (localY < -32 || localY > CANVAS_HEIGHT + 24) return;

      const index = clamp(Math.round(pointer.x / COLUMN_WIDTH), 0, heights.length - 1);
      const surfaceY = CANVAS_HEIGHT - heights[index];
      const pressure = clamp((localY - surfaceY + 34) / 74, 0, 1);

      if (pressure <= 0) return;

      const speed = clamp(pointer.speed / 32, 0.35, 1.5);
      const strength = pressure * speed;

      stamp(pointer.x, 54, -2.7 * strength);
      stamp(pointer.x - 42, 30, 0.86 * pressure);
      stamp(pointer.x + 42, 30, 0.86 * pressure);
      lastInteractionAt = now;
    };

    const applyWindowPressure = (now) => {
      const workspaceOffset = getDesktopPadding();
      const canvasTop = window.innerHeight - CANVAS_HEIGHT;

      Object.values(windowsRef.current).forEach((desktopWindow) => {
        if (!desktopWindow?.isOpen) return;

        const left = workspaceOffset + desktopWindow.x;
        const right = left + desktopWindow.width;
        const bottom = workspaceOffset + desktopWindow.y + desktopWindow.height;
        const localBottom = bottom - canvasTop;

        if (localBottom < -18 || localBottom > CANVAS_HEIGHT + 40) return;

        const firstColumn = clamp(
          Math.floor(left / COLUMN_WIDTH),
          0,
          heights.length - 1,
        );
        const lastColumn = clamp(
          Math.ceil(right / COLUMN_WIDTH),
          0,
          heights.length - 1,
        );

        for (let index = firstColumn; index <= lastColumn; index += 1) {
          const x = index * COLUMN_WIDTH;
          const centerFalloff =
            Math.sin(((x - left) / Math.max(1, right - left)) * Math.PI) * 0.45 +
            0.55;
          const surfaceY = CANVAS_HEIGHT - heights[index];
          const penetration = localBottom - surfaceY + 12;

          if (penetration > 0) {
            velocities[index] -= clamp(penetration * 0.022, 0, 0.95) * centerFalloff;
            lastInteractionAt = now;
          }
        }

        if (localBottom > CANVAS_HEIGHT - 102) {
          stamp(left, 34, 0.28);
          stamp(right, 34, 0.28);
        }
      });
    };

    const relaxSnow = (targetBaseHeight) => {
      for (let index = 0; index < heights.length; index += 1) {
        const target = targetBaseHeight + terrain[index] * 0.35;
        velocities[index] += (target - heights[index]) * 0.006;
      }

      for (let index = 1; index < heights.length - 1; index += 1) {
        const neighborAverage = (heights[index - 1] + heights[index + 1]) / 2;
        velocities[index] += (neighborAverage - heights[index]) * 0.045;
      }

      for (let index = 0; index < heights.length; index += 1) {
        velocities[index] *= 0.86;
        heights[index] = clamp(heights[index] + velocities[index], 7, 124);
      }
    };

    const drawSurface = (now) => {
      const growth = prefersReducedMotion.matches
        ? 0.84
        : clamp((now - startedAt) / 105000, 0, 1);
      const interactionGlow = clamp(1 - (now - lastInteractionAt) / 500, 0, 1);
      const targetBaseHeight = 20 + growth * 62;

      relaxSnow(targetBaseHeight);
      applyMousePressure(now);
      applyWindowPressure(now);

      context.clearRect(0, 0, width, CANVAS_HEIGHT);

      const fillGradient = context.createLinearGradient(
        0,
        CANVAS_HEIGHT - 118,
        0,
        CANVAS_HEIGHT,
      );
      fillGradient.addColorStop(0, "rgba(255,255,255,0.94)");
      fillGradient.addColorStop(0.55, "rgba(239,246,255,0.9)");
      fillGradient.addColorStop(1, "rgba(219,234,254,0.74)");

      context.beginPath();
      context.moveTo(0, CANVAS_HEIGHT);
      context.lineTo(0, CANVAS_HEIGHT - heights[0]);

      for (let index = 1; index < heights.length - 2; index += 1) {
        const currentX = index * COLUMN_WIDTH;
        const nextX = (index + 1) * COLUMN_WIDTH;
        const currentY = CANVAS_HEIGHT - heights[index];
        const nextY = CANVAS_HEIGHT - heights[index + 1];
        context.quadraticCurveTo(currentX, currentY, (currentX + nextX) / 2, (currentY + nextY) / 2);
      }

      context.lineTo(width, CANVAS_HEIGHT - heights[heights.length - 1]);
      context.lineTo(width, CANVAS_HEIGHT);
      context.closePath();
      context.fillStyle = fillGradient;
      context.fill();

      context.save();
      context.clip();

      grains.forEach((grain) => {
        const index = clamp(Math.round(grain.x / COLUMN_WIDTH), 0, heights.length - 1);
        const surfaceY = CANVAS_HEIGHT - heights[index];
        if (grain.y < surfaceY + 3) return;

        context.beginPath();
        context.fillStyle = `rgba(${grain.tint},${grain.alpha})`;
        context.arc(grain.x, grain.y, grain.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.restore();

      context.beginPath();
      for (let index = 0; index < heights.length; index += 1) {
        const x = index * COLUMN_WIDTH;
        const y = CANVAS_HEIGHT - heights[index];

        if (index === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = `rgba(186,230,253,${0.26 + interactionGlow * 0.18})`;
      context.lineWidth = 2;
      context.stroke();

      context.fillStyle = "rgba(255,255,255,0.24)";
      for (let index = 8; index < heights.length; index += 17) {
        const x = index * COLUMN_WIDTH;
        const y = CANVAS_HEIGHT - heights[index] + 8;
        context.beginPath();
        context.ellipse(x, y, 11, 2.6, -0.12, 0, Math.PI * 2);
        context.fill();
      }

      animationFrame = window.requestAnimationFrame(drawSurface);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);
    animationFrame = window.requestAnimationFrame(drawSurface);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 w-full"
    />
  );
}
