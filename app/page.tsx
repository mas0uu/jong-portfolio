"use client";

import { useState } from "react";
import { FileText, Folder, IdCard, Mail, Settings, User, type LucideIcon } from "lucide-react";

import DesktopIcon from "./components/DesktopIcon";
import DraggableWindow from "./components/DraggableWindow";

import AboutWindow from "./components/windows/AboutWindow";
import ProfileWindow from "./components/windows/ProfileWindow";
import WelcomeWindow from "./components/windows/WelcomeWindow";
import ProjectsWindow from "./components/windows/ProjectsWindow";
import SkillsWindow from "./components/windows/SkillsWindow";
import ContactWindow from "./components/windows/ContactWindow";

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
    width: 495,
    height: 350,
    isOpen: false,
  },
  profile: {
    title: "profile.png",
    x: 950,
    y: 20,
    width: 260,
    height: 300,
    isOpen: true,
  },
  welcome: {
    title: "welcome.txt",
    x: 250,
    y: 200,
    width: 560,
    height: 200,
    isOpen: true,
  },
  projects: {
    title: "Projects",
    x: 260,
    y: 110,
    width: 650,
    height: 500,
    isOpen: false,
  },
  skills: {
    title: "Skills",
    x: 340,
    y: 160,
    width: 725,
    height: 440,
    isOpen: false,
  },
  contact: {
    title: "Contact",
    x: 420,
    y: 210,
    width: 360,
    height: 300,
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

  const bringToFront = (id: WindowId) => {
    setTopZ((prev) => {
      const next = prev + 1;
      setZIndexes((current) => ({ ...current, [id]: next }));
      return next;
    });
  };

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

  const dragWindow = (id: WindowId, nextX: number, nextY: number) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: Math.max(120, nextX),
        y: Math.max(20, nextY),
      },
    }));
  };

  return (
    <main className="relative h-screen overflow-hidden bg-[#eef1f5] text-slate-800">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      <Snowfall color="#82C3D9"/>

      <div className="relative flex min-h-screen flex-col">
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
                    onDoubleClick={() => openWindow(id)}
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
                    onDoubleClick={() => openWindow(id)}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-[700px]">
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
