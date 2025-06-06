"use client";

import { Project } from "../types/cv";

interface ProjectsFormProps {
  projects: Project[];
  updateProjects: (projects: Project[]) => void;
}

export default function ProjectsForm({
  projects,
  updateProjects,
}: ProjectsFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      url: "",
      github: "",
    };
    updateProjects([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    );
    updateProjects(updatedProjects);
  };

  const updateTechnologies = (id: string, techString: string) => {
    const technologies = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech);
    updateProject(id, "technologies", technologies);
  };

  const removeProject = (id: string) => {
    updateProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 mb-6">
        <h3 className="text-2xl font-bold text-black">Projects</h3>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          Showcase your projects and accomplishments
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={addProject}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            No projects added yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Project" to showcase your work
          </p>
        </div>
      )}

      {projects.map((project, index) => (
        <div
          key={project.id}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-gray-700 font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Project #{index + 1}
                </h4>
                <p className="text-sm text-gray-500">Portfolio Project</p>
              </div>
            </div>
            <button
              onClick={() => removeProject(project.id)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded border border-red-200 hover:bg-red-100 hover:text-red-700"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) =>
                  updateProject(project.id, "name", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="E-commerce Website"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used *
              </label>
              <input
                type="text"
                value={project.technologies.join(", ")}
                onChange={(e) => updateTechnologies(project.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project URL
              </label>
              <input
                type="url"
                value={project.url}
                onChange={(e) =>
                  updateProject(project.id, "url", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="https://project.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Repository
              </label>
              <input
                type="url"
                value={project.github}
                onChange={(e) =>
                  updateProject(project.id, "github", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description *
            </label>
            <textarea
              rows={4}
              value={project.description}
              onChange={(e) =>
                updateProject(project.id, "description", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Describe what this project does, your role, and key achievements..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
