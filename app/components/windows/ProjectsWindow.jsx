"use client";

import Image from "next/image";
import { useState } from "react";
import useSound from "use-sound";

const projects = [
  {
    name: "DERMTECT",
    description:
      "An Android-based system that helps users identify whether skin lesions are cancerous. We trained a CNN model for this.",
    note: "This was our thesis project.",
    technologies: ["Kotlin", "Jetpack Compose", "Firebase", "Python"],
    repository: "https://github.com/ayeerivera/Dermtect",
    screenshots: ["/dermtect-1.png", "/dermtect-2.png"],
  },
  {
    name: "MOODORO",
    description:
      "A Pomodoro task management web system that scans your mood before and after a task. It provides insights and trends over time.",
    note: "This was a project for my Web System Development class.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Python"],
    repository: "https://github.com/mas0uu/MOODORO",
    screenshots: ["/moodoro-1.png"],
  },
  {
    name: "DTR and Payroll System",
    description:
      "A DTR system that manages employees' attendance and calculates payroll.",
    note: "This was my first project at my internship.",
    technologies: ["laravel", "React", "Inertia.js", "MySQL"],
    repository: "https://github.com/mas0uu/DTR-System",
    screenshots: ["/dtr-1.png", "/dtr-2.png"],
  },
  {
    name: "Doxsys Website",
    description:
      "A website for Doxsys, a company that provides IT solutions. The website showcases their services and portfolio.",
    note: "I was responsible for adding and updating content on the website",
    technologies: ["React", "Antdesign", "Tailwind CSS"],
    repository: "",
    screenshots: ["/doxsys-1.png", "/doxsys-2.png"],
  },
  {
    name: "Las Pinas Citizen App",
    description:
      "A mobile application for the city of Las Pinas to report issues and access services.",
    note: "This was also a project for my internship, where I only worked on the frontend.",
    technologies: ["React Native"],
    repository: "",
    screenshotLayout: "phone-grid",
    screenshots: [
      "/laspinas-1.png",
      "/laspinas-2.png",
      "/laspinas-3.png",
      "/laspinas-4.png",
      "/laspinas-5.png",
      "/laspinas-6.png",
    ],
  },
];

const isExternalLink = (value) => value?.startsWith("http");

export default function ProjectsWindow() {
  const [openProject, setOpenProject] = useState(null);
  const [playDropdown] = useSound("/sounds/dropdown.mp3", {
    volume: 0.45,
    interrupt: true,
  });

  const toggleProject = (projectName) => {
    setOpenProject((current) => {
      const next = current === projectName ? null : projectName;
      if (next) playDropdown();
      return next;
    });
  };

  return (
    <div className="space-y-4 pr-2">
      {projects.map((project) => {
        const usesPhoneGrid = project.screenshotLayout === "phone-grid";

        return (
          <details
            key={project.name}
            open={openProject === project.name}
            className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4"
          >
            <summary
              onClick={(event) => {
                event.preventDefault();
                toggleProject(project.name);
              }}
              className="cursor-pointer text-lg font-semibold text-slate-900"
            >
              {project.name}
            </summary>

            <div className="mt-4 space-y-4 text-base text-slate-700">
              <p>{project.description}</p>
              <p>{project.note}</p>

              <div>
                <p className="font-medium text-slate-800">Technologies used</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.repository && (
                <div>
                  {isExternalLink(project.repository) ? (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Github Repository
                    </a>
                  ) : (
                    <p className="text-slate-500">{project.repository}</p>
                  )}
                </div>
              )}

              <div>
                <p className="font-medium text-slate-800">Screenshots</p>
                <div
                  className={
                    usesPhoneGrid
                      ? "mt-3 grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 xl:grid-cols-3"
                      : "mt-3 space-y-3"
                  }
                >
                  {project.screenshots.map((screenshot) => (
                    <div
                      key={screenshot}
                      className={
                        usesPhoneGrid
                          ? "w-full max-w-[260px] rounded-[1.75rem] border border-slate-200 bg-white p-2 shadow-sm"
                          : ""
                      }
                    >
                      <Image
                        src={screenshot}
                        alt={`${project.name} screenshot`}
                        width={900}
                        height={520}
                        className={
                          usesPhoneGrid
                            ? "h-auto w-full rounded-[1.25rem] border border-slate-200 bg-white object-cover"
                            : "h-auto w-full rounded-md border border-slate-200 bg-white object-cover"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
