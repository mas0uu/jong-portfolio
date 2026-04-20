"use client";

import { FileText, Folder, IdCard, Mail, Settings, User, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import DesktopIcon from "./components/DesktopIcon";
import DraggableWindow from "./components/DraggableWindow";
import SnowPile from "./components/SnowPile";

import AboutWindow from "./components/windows/AboutWindow";
import ContactWindow from "./components/windows/ContactWindow";
import ProfileWindow from "./components/windows/ProfileWindow";
import ProjectsWindow from "./components/windows/ProjectsWindow";
import SkillsWindow from "./components/windows/SkillsWindow";
import WelcomeWindow from "./components/windows/WelcomeWindow";

import Snowfall from 'react-snowfall';
import useSound from "use-sound";

type WindowId = "about" | "profile" | "welcome" | "projects" | "skills" | "contact";
type DesktopIconId = "about" | "projects" | "skills" | "contact" | "welcome" | "profile";

type WindowConfig = {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
};

type WindowState = Record<WindowId, WindowConfig>;
type ZState = Record<WindowId, number>;
type WorkspaceMetrics = {
  width: number;
  height: number;
  railWidth: number;
  maxWindowWidth: number;
  maxWindowHeight: number;
};

const iconMap: Record<DesktopIconId, LucideIcon> = {
  about: IdCard,
  projects: Folder,
  skills: Settings,
  contact: Mail,
  welcome: FileText,
  profile: User,
};

const leftDesktopIconIds: DesktopIconId[] = ["about", "projects", "skills", "contact"];
const rightDesktopIconIds: DesktopIconId[] = ["profile", "welcome"];

const iconColors: Record<DesktopIconId, string> = {
  about: "bg-sky-200",
  projects: "bg-green-200",
  skills: "bg-emerald-200",
  contact: "bg-cyan-200",
  welcome: "bg-orange-200",
  profile: "bg-rose-200",
};

const initialWindows: WindowState = {
  about: {
    title: "About me",
    x: 180,
    y: 50,
    width: 610,
    height: 430,
    isOpen: false,
  },
  profile: {
    title: "profile.png",
    x: 950,
    y: 20,
    width: 360,
    height: 410,
    isOpen: true,
  },
  welcome: {
    title: "welcome.txt",
    x: 250,
    y: 200,
    width: 720,
    height: 260,
    isOpen: true,
  },
  projects: {
    title: "Projects",
    x: 260,
    y: 110,
    width: 820,
    height: 590,
    isOpen: false,
  },
  skills: {
    title: "Skills",
    x: 340,
    y: 160,
    width: 860,
    height: 520,
    isOpen: false,
  },
  contact: {
    title: "Contact",
    x: 420,
    y: 210,
    width: 460,
    height: 350,
    isOpen: false,
  },
};

const initialZ: ZState = {
  about: 3,
  profile: 4,
  welcome: 5,
  projects: 1,
  skills: 1,
  contact: 1,
};

const DESKTOP_BREAKPOINT = 900;
const DESKTOP_ICON_RAIL_WIDTH = 160;
const MEDIUM_SCREEN_PADDING = 48;
const SMALL_SCREEN_PADDING = 32;
const WINDOW_VERTICAL_GUTTER = 16;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getWorkspaceMetrics = (): WorkspaceMetrics => {
  if (typeof window === "undefined") {
    return {
      width: 1280,
      height: 720,
      railWidth: DESKTOP_ICON_RAIL_WIDTH,
      maxWindowWidth: 1280 - DESKTOP_ICON_RAIL_WIDTH * 2,
      maxWindowHeight: 720 - WINDOW_VERTICAL_GUTTER * 2,
    };
  }

  const screenPadding =
    window.innerWidth >= 768 ? MEDIUM_SCREEN_PADDING : SMALL_SCREEN_PADDING;
  const width = Math.max(320, window.innerWidth - screenPadding * 2);
  const height = Math.max(360, window.innerHeight - screenPadding * 2);
  const railWidth =
    window.innerWidth >= DESKTOP_BREAKPOINT ? DESKTOP_ICON_RAIL_WIDTH : 0;

  return {
    width,
    height,
    railWidth,
    maxWindowWidth: Math.max(280, width - railWidth * 2),
    maxWindowHeight: Math.max(220, height - WINDOW_VERTICAL_GUTTER * 2),
  };
};

const getResponsiveWindowSize = (id: WindowId, metrics: WorkspaceMetrics) => ({
  width: Math.min(initialWindows[id].width, metrics.maxWindowWidth),
  height: Math.min(initialWindows[id].height, metrics.maxWindowHeight),
});

const clampWindowToWorkspace = (
  windowConfig: WindowConfig,
  metrics: WorkspaceMetrics,
) => {
  const minX = metrics.railWidth;
  const maxX = Math.max(
    minX,
    metrics.width - metrics.railWidth - windowConfig.width,
  );
  const maxY = Math.max(0, metrics.height - windowConfig.height);

  return {
    ...windowConfig,
    x: clamp(windowConfig.x, minX, maxX),
    y: clamp(windowConfig.y, 0, maxY),
  };
};

const getDefaultWindowPosition = (
  id: WindowId,
  width: number,
  height: number,
  metrics: WorkspaceMetrics,
) => {
  const workLeft = metrics.railWidth;
  const workRight = metrics.width - metrics.railWidth;
  const workWidth = Math.max(width, workRight - workLeft);
  const centeredX = workLeft + (workWidth - width) / 2;

  const positions: Record<WindowId, Pick<WindowConfig, "x" | "y">> = {
    about: {
      x: workLeft + workWidth * 0.08,
      y: 50,
    },
    profile: {
      x: workRight - width,
      y: 20,
    },
    welcome: {
      x: workLeft + workWidth * 0.18,
      y: 200,
    },
    projects: {
      x: centeredX - 40,
      y: 110,
    },
    skills: {
      x: centeredX + 20,
      y: 160,
    },
    contact: {
      x: centeredX + 60,
      y: 210,
    },
  };

  const positionedWindow = {
    ...initialWindows[id],
    width,
    height,
    ...positions[id],
  };

  return clampWindowToWorkspace(positionedWindow, metrics);
};

const applyResponsiveWindowLayout = (
  currentWindows: WindowState,
  mode: "place" | "clamp",
) => {
  const metrics = getWorkspaceMetrics();

  return (Object.keys(currentWindows) as WindowId[]).reduce((next, id) => {
    const size = getResponsiveWindowSize(id, metrics);
    const sizedWindow = {
      ...currentWindows[id],
      ...size,
    };

    next[id] =
      mode === "place"
        ? {
          ...getDefaultWindowPosition(id, size.width, size.height, metrics),
          isOpen: currentWindows[id].isOpen,
        }
        : clampWindowToWorkspace(sizedWindow, metrics);

    return next;
  }, {} as WindowState);
};

export default function Home() {
  const [windows, setWindows] = useState<WindowState>(initialWindows);
  const [zIndexes, setZIndexes] = useState<ZState>(initialZ);
  const [, setTopZ] = useState(10);
  const [playOpen] = useSound("/sounds/open.mp3", {
    volume: 0.35,
    interrupt: true,
  });
  const [playClose] = useSound("/sounds/close.mp3", {
    volume: 0.35,
    interrupt: true,
  });

  useEffect(() => {
    const initialLayoutFrame = window.requestAnimationFrame(() => {
      setWindows((current) => applyResponsiveWindowLayout(current, "place"));
    });

    const handleResize = () => {
      setWindows((current) => applyResponsiveWindowLayout(current, "clamp"));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(initialLayoutFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const bringToFront = useCallback((id: WindowId) => {
    setTopZ((prev) => {
      const next = prev + 1;
      setZIndexes((current) => ({ ...current, [id]: next }));
      return next;
    });
  }, []);

  const openWindow = (id: WindowId) => {
    if (!windows[id].isOpen) {
      playOpen();
    }
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
      },
    }));
    bringToFront(id);
  };

  const closeWindow = (id: WindowId) => {
    if (windows[id].isOpen) {
      playClose();
    }
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
  };

  const dragWindow = useCallback((id: WindowId, nextX: number, nextY: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: clampWindowToWorkspace(
        {
          ...prev[id],
          x: nextX,
          y: nextY,
        },
        getWorkspaceMetrics(),
      ),
    }));
  }, []);

  return (
    <main className="relative h-screen overflow-hidden bg-[#cbd5dc] text-slate-800">
      <Snowfall color="#ffffff" />
      <SnowPile windows={windows} />

      <div className="relative z-20 flex min-h-screen flex-col">
        <section className="flex-1 p-8 md:p-12">
          <div className="relative min-h-[calc(100vh-96px)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-between">
              <div className="pointer-events-auto flex flex-col gap-4">
                {leftDesktopIconIds.map((id) => (
                  <DesktopIcon
                    key={id}
                    label={windows[id].title}
                    icon={iconMap[id]}
                    color={iconColors[id]}
                    onClick={() => openWindow(id)}
                  />
                ))}
              </div>

              <div className="pointer-events-auto flex flex-col gap-4">
                {rightDesktopIconIds.map((id) => (
                  <DesktopIcon
                    key={id}
                    label={windows[id].title}
                    icon={iconMap[id]}
                    color={iconColors[id]}
                    onClick={() => openWindow(id)}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-96px)]">
              {windows.about.isOpen && (
                <DraggableWindow
                  id="about"
                  title={windows.about.title}
                  x={windows.about.x}
                  y={windows.about.y}
                  width={windows.about.width}
                  height={windows.about.height}
                  zIndex={zIndexes.about}
                  onDrag={dragWindow}
                  onFocus={bringToFront}
                  onClose={closeWindow}
                >
                  <AboutWindow />
                </DraggableWindow>
              )}

              {windows.profile.isOpen && (
                <DraggableWindow
                  id="profile"
                  title={windows.profile.title}
                  x={windows.profile.x}
                  y={windows.profile.y}
                  width={windows.profile.width}
                  height={windows.profile.height}
                  zIndex={zIndexes.profile}
                  onDrag={dragWindow}
                  onFocus={bringToFront}
                  onClose={closeWindow}
                  scrollable={false}
                >
                  <ProfileWindow />
                </DraggableWindow>
              )}

              {windows.welcome.isOpen && (
                <DraggableWindow
                  id="welcome"
                  title={windows.welcome.title}
                  x={windows.welcome.x}
                  y={windows.welcome.y}
                  width={windows.welcome.width}
                  height={windows.welcome.height}
                  zIndex={zIndexes.welcome}
                  onDrag={dragWindow}
                  onFocus={bringToFront}
                  onClose={closeWindow}
                  scrollable={false}
                >
                  <WelcomeWindow />
                </DraggableWindow>
              )}

              {windows.projects.isOpen && (
                <DraggableWindow
                  id="projects"
                  title={windows.projects.title}
                  x={windows.projects.x}
                  y={windows.projects.y}
                  width={windows.projects.width}
                  height={windows.projects.height}
                  zIndex={zIndexes.projects}
                  onDrag={dragWindow}
                  onFocus={bringToFront}
                  onClose={closeWindow}
                >
                  <ProjectsWindow />
                </DraggableWindow>
              )}

              {windows.skills.isOpen && (
                <DraggableWindow
                  id="skills"
                  title={windows.skills.title}
                  x={windows.skills.x}
                  y={windows.skills.y}
                  width={windows.skills.width}
                  height={windows.skills.height}
                  zIndex={zIndexes.skills}
                  onDrag={dragWindow}
                  onFocus={bringToFront}
                  onClose={closeWindow}
                >
                  <SkillsWindow />
                </DraggableWindow>
              )}

              {windows.contact.isOpen && (
                <DraggableWindow
                  id="contact"
                  title={windows.contact.title}
                  x={windows.contact.x}
                  y={windows.contact.y}
                  width={windows.contact.width}
                  height={windows.contact.height}
                  zIndex={zIndexes.contact}
                  onDrag={dragWindow}
                  onFocus={bringToFront}
                  onClose={closeWindow}
                >
                  <ContactWindow />
                </DraggableWindow>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
