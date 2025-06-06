"use client";

import { Education } from "../types/cv";

interface EducationFormProps {
  education: Education[];
  updateEducation: (education: Education[]) => void;
}

export default function EducationForm({
  education,
  updateEducation,
}: EducationFormProps) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      isCurrentStudy: false,
      gpa: "",
      location: "",
    };
    updateEducation([...education, newEducation]);
  };

  const updateEducationItem = (
    id: string,
    field: keyof Education,
    value: string | boolean
  ) => {
    const updatedEducation = education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateEducation(updatedEducation);
  };

  const removeEducation = (id: string) => {
    updateEducation(education.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 mb-6">
        <h3 className="text-2xl font-bold text-black">Education Background</h3>
        <p className="text-gray-600 max-w-md mx-auto text-sm">
          Share your educational achievements and degrees
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={addEducation}
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
          Add Education
        </button>
      </div>

      {education.length === 0 && (
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
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No Education Added Yet
          </h4>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Start building your educational profile
          </p>
        </div>
      )}

      {education.map((edu, index) => (
        <div
          key={edu.id}
          className="bg-white border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg text-gray-700 font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Education #{index + 1}
                </h4>
                <p className="text-sm text-gray-500">Academic Achievement</p>
              </div>
            </div>
            <button
              onClick={() => removeEducation(edu.id)}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) =>
                  updateEducationItem(edu.id, "institution", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Harvard University"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) =>
                  updateEducationItem(edu.id, "degree", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Bachelor of Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) =>
                  updateEducationItem(edu.id, "field", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) =>
                  updateEducationItem(edu.id, "location", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Boston, MA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) =>
                  updateEducationItem(edu.id, "startDate", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`current-study-${edu.id}`}
                  checked={edu.isCurrentStudy}
                  onChange={(e) =>
                    updateEducationItem(
                      edu.id,
                      "isCurrentStudy",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`current-study-${edu.id}`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  Currently studying here
                </label>
              </div>
              {!edu.isCurrentStudy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) =>
                      updateEducationItem(edu.id, "endDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa || ""}
                onChange={(e) =>
                  updateEducationItem(edu.id, "gpa", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="3.8/4.0 or First Class Honours"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
