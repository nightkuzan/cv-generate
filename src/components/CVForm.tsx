"use client";

import { useState } from "react";
import { CVData } from "@/types/cv";
import PersonalInfoForm from "./PersonalInfoForm";
import ExperienceForm from "./ExperienceForm";
import EducationForm from "./EducationForm";
// import SkillsForm from "./SkillsForm";
// import ProjectsForm from "./ProjectsForm";
// import LanguagesForm from "./LanguagesForm";

interface CVFormProps {
  cvData: CVData;
  updateCVData: (data: Partial<CVData>) => void;
}

export default function CVForm({ cvData, updateCVData }: CVFormProps) {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
    },
    {
      id: "experience",
      label: "Experience",
    },
    {
      id: "education",
      label: "Education",
    },
    {
      id: "skills",
      label: "Skills",
    },
    {
      id: "projects",
      label: "Projects",
    },
    {
      id: "languages",
      label: "Languages",
    },
  ];

  const renderActiveForm = () => {
    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoForm
            personalInfo={cvData.personalInfo}
            updatePersonalInfo={(info) => updateCVData({ personalInfo: info })}
          />
        );
      case "experience":
        return (
          <ExperienceForm
            experience={cvData.experience}
            updateExperience={(experience) => updateCVData({ experience })}
          />
        );
      case "education":
        return (
          <EducationForm
            education={cvData.education}
            updateEducation={(education) => updateCVData({ education })}
          />
        );
      case "skills":
        return <div>Skills form temporarily disabled...</div>;
      case "projects":
        return <div>Projects form temporarily disabled...</div>;
      case "languages":
        return <div>Languages form temporarily disabled...</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded border border-gray-300 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-300 bg-gray-50">
        <nav className="flex overflow-x-auto" aria-label="Tabs">
          <div className="flex space-x-1 p-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                } whitespace-nowrap px-4 py-2 rounded font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Form Content */}
      <div className="p-6">{renderActiveForm()}</div>
    </div>
  );
}
