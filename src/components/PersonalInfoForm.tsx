"use client";

import { PersonalInfo } from "@/types/cv";

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  updatePersonalInfo: (info: PersonalInfo) => void;
}

export default function PersonalInfoForm({
  personalInfo,
  updatePersonalInfo,
}: PersonalInfoFormProps) {
  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    updatePersonalInfo({
      ...personalInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-black mb-1">
          Personal Information
        </h3>
        <p className="text-gray-600 text-sm">Basic information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            value={personalInfo.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={personalInfo.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            value={personalInfo.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={personalInfo.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        <div>
          <label
            htmlFor="website"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Website
          </label>
          <input
            type="url"
            id="website"
            value={personalInfo.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            LinkedIn
          </label>
          <input
            type="url"
            id="linkedin"
            value={personalInfo.linkedin}
            onChange={(e) => handleInputChange("linkedin", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label
            htmlFor="github"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            GitHub
          </label>
          <input
            type="url"
            id="github"
            value={personalInfo.github}
            onChange={(e) => handleInputChange("github", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Professional Summary
        </label>
        <textarea
          id="summary"
          value={personalInfo.summary}
          onChange={(e) => handleInputChange("summary", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe your professional background, key skills, and career
          objectives in 2-3 sentences.
        </p>
      </div>
    </div>
  );
}
