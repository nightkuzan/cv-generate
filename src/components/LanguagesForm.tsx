"use client";

import { Language } from "../types/cv";

interface LanguagesFormProps {
  languages: Language[];
  updateLanguages: (languages: Language[]) => void;
}

export default function LanguagesForm({
  languages,
  updateLanguages,
}: LanguagesFormProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: "",
      proficiency: "Conversational",
    };
    updateLanguages([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    const updatedLanguages = languages.map((language) =>
      language.id === id ? { ...language, [field]: value } : language
    );
    updateLanguages(updatedLanguages);
  };

  const removeLanguage = (id: string) => {
    updateLanguages(languages.filter((language) => language.id !== id));
  };

  const proficiencyLevels: Language["proficiency"][] = [
    "Basic",
    "Conversational",
    "Fluent",
    "Native",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-black mb-2">Languages</h3>
          <p className="text-gray-600">
            Add languages you speak and your proficiency level
          </p>
        </div>
        <button
          onClick={addLanguage}
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
            Add Language
          </span>
        </button>
      </div>

      {languages.length === 0 && (
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
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            No languages added yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Click "Add Language" to get started
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {languages.map((language, index) => (
          <div
            key={language.id}
            className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded text-gray-700 font-bold text-xs flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Language #{index + 1}
                </span>
              </div>
              <button
                onClick={() => removeLanguage(language.id)}
                className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded border border-red-200 text-xs"
              >
                <svg
                  className="w-3 h-3"
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
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language *
                </label>
                <input
                  type="text"
                  value={language.name}
                  onChange={(e) =>
                    updateLanguage(language.id, "name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                  placeholder="e.g., Spanish"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proficiency Level *
                </label>
                <select
                  value={language.proficiency}
                  onChange={(e) =>
                    updateLanguage(
                      language.id,
                      "proficiency",
                      e.target.value as Language["proficiency"]
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                >
                  {proficiencyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
