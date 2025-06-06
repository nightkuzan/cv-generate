"use client";

import { useState } from "react";
import { Experience } from "../types/cv";

interface ExperienceFormProps {
  experience: Experience[];
  updateExperience: (experience: Experience[]) => void;
}

export default function ExperienceForm({
  experience,
  updateExperience,
}: ExperienceFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrentJob: false,
      description: "",
      location: "",
    };
    updateExperience([...experience, newExperience]);
    setEditingId(newExperience.id);
  };

  const updateExperienceItem = (
    id: string,
    field: keyof Experience,
    value: any
  ) => {
    const updatedExperience = experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateExperience(updatedExperience);
  };

  const removeExperience = (id: string) => {
    updateExperience(experience.filter((exp) => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-black mb-2">
            Work Experience
          </h3>
          <p className="text-gray-600">Add your professional work experience</p>
        </div>
        <button
          onClick={addExperience}
          className="bg-white text-black px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
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
            Add Experience
          </span>
        </button>
      </div>

      {experience.length === 0 && (
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            No work experience added yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Experience" to get started
          </p>
        </div>
      )}

      {experience.map((exp, index) => (
        <div
          key={exp.id}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-700 font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">
                  Experience #{index + 1}
                </h4>
                <p className="text-gray-600 text-sm">
                  Professional work experience
                </p>
              </div>
            </div>
            <button
              onClick={() => removeExperience(exp.id)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded border border-red-200 text-sm"
            >
              <svg
                className="w-4 h-4"
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
                Company *
              </label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) =>
                  updateExperienceItem(exp.id, "company", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) =>
                  updateExperienceItem(exp.id, "position", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Job Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) =>
                  updateExperienceItem(exp.id, "location", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperienceItem(exp.id, "startDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.isCurrentJob}
                  onChange={(e) =>
                    updateExperienceItem(
                      exp.id,
                      "isCurrentJob",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`current-${exp.id}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  I currently work here
                </label>
              </div>
              {!exp.isCurrentJob && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperienceItem(exp.id, "endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              rows={4}
              value={exp.description}
              onChange={(e) =>
                updateExperienceItem(exp.id, "description", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
