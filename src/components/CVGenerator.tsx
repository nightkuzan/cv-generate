"use client";

import { useState } from "react";
import { CVData, PersonalInfo } from "@/types/cv";
import CVForm from "./CVForm";
import CVPreview from "./CVPreview";
import { logPDFPreviewHTML } from "@/utils/pdfTester";

const initialPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  linkedin: "",
  github: "",
  summary: "",
};

const initialCVData: CVData = {
  personalInfo: initialPersonalInfo,
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
};

export default function CVGenerator() {
  const [cvData, setCVData] = useState<CVData>(initialCVData);
  const [showPreview, setShowPreview] = useState(false);

  const updateCVData = (newData: Partial<CVData>) => {
    setCVData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const clearAllData = () => {
    setCVData(initialCVData);
  };
  const loadSampleData = () => {
    // Create a timestamp to ensure unique IDs
    const timestamp = Date.now();

    // Use a direct object construction approach for the sample data
    // First, set each array separately to ensure they're all properly included
    const samplePersonalInfo: PersonalInfo = {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, San Francisco, CA 94105",
      website: "https://johndoe.com",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      summary:
        "Experienced full-stack developer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and emerging technologies.",
    };

    const sampleExperience = [
      {
        id: `exp-${timestamp}-1`,
        company: "Tech Corp",
        position: "Senior Full-Stack Developer",
        startDate: "2022-01",
        endDate: "",
        isCurrentJob: true,
        description:
          "Led development of multiple web applications using React, Node.js, and AWS. Mentored junior developers and improved team productivity by 30%.",
        location: "San Francisco, CA",
      },
      {
        id: `exp-${timestamp}-2`,
        company: "StartupXYZ",
        position: "Frontend Developer",
        startDate: "2020-06",
        endDate: "2021-12",
        isCurrentJob: false,
        description:
          "Developed responsive web applications using React and TypeScript. Collaborated with design team to implement pixel-perfect UI components.",
        location: "Remote",
      },
    ];

    const sampleEducation = [
      {
        id: `edu-${timestamp}-1`,
        institution: "University of California, Berkeley",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2016-08",
        endDate: "2020-05",
        isCurrentStudy: false,
        gpa: "3.8/4.0",
        location: "Berkeley, CA",
      },
    ];

    const sampleSkills = [
      {
        id: `skill-${timestamp}-1`,
        name: "JavaScript",
        level: "Expert" as const,
      },
      { id: `skill-${timestamp}-2`, name: "React", level: "Expert" as const },
      {
        id: `skill-${timestamp}-3`,
        name: "Node.js",
        level: "Advanced" as const,
      },
      {
        id: `skill-${timestamp}-4`,
        name: "Python",
        level: "Intermediate" as const,
      },
      {
        id: `skill-${timestamp}-5`,
        name: "AWS",
        level: "Intermediate" as const,
      },
      {
        id: `skill-${timestamp}-6`,
        name: "PostgreSQL",
        level: "Advanced" as const,
      },
    ];

    const sampleProjects = [
      {
        id: `proj-${timestamp}-1`,
        name: "E-commerce Platform",
        description:
          "Built a full-stack e-commerce platform with React, Node.js, and PostgreSQL. Implemented payment processing, inventory management, and admin dashboard.",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
        url: "https://myecommerce.com",
        github: "https://github.com/johndoe/ecommerce",
      },
      {
        id: `proj-${timestamp}-2`,
        name: "Task Management App",
        description:
          "Developed a collaborative task management application with real-time updates using Socket.io and React.",
        technologies: ["React", "Socket.io", "Express", "MongoDB"],
        url: "https://mytasks.com",
        github: "https://github.com/johndoe/taskapp",
      },
    ];

    const sampleLanguages = [
      {
        id: `lang-${timestamp}-1`,
        name: "English",
        proficiency: "Native" as const,
      },
      {
        id: `lang-${timestamp}-2`,
        name: "Spanish",
        proficiency: "Conversational" as const,
      },
      {
        id: `lang-${timestamp}-3`,
        name: "French",
        proficiency: "Basic" as const,
      },
    ];

    // Create the complete data object
    const completeData: CVData = {
      personalInfo: samplePersonalInfo,
      experience: sampleExperience,
      education: sampleEducation,
      skills: sampleSkills,
      projects: sampleProjects,
      languages: sampleLanguages,
    };

    console.log("About to load sample data:", {
      experienceCount: completeData.experience.length,
      educationCount: completeData.education.length,
      skillsCount: completeData.skills.length,
      projectsCount: completeData.projects.length,
      languagesCount: completeData.languages.length,
    });

    // Use the functional update to ensure we completely replace the previous state
    setCVData(() => completeData);

    // Use setTimeout to log after React has had a chance to update the state
    setTimeout(() => {
      console.log("Sample data loaded - To verify, check these were created:", {
        projectIDs: sampleProjects.map((p) => p.id),
        languageIDs: sampleLanguages.map((l) => l.id),
      });

      // Generate and log PDF preview HTML for debugging
      logPDFPreviewHTML(completeData);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50" data-cv-container>
      {/* Header */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-black">CV Generator</h1>
              <p className="text-gray-600 text-sm">Create a professional CV</p>
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={loadSampleData}
                className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm font-medium"
                aria-label="Load sample CV data"
              >
                Load Sample
              </button>
              <button
                onClick={clearAllData}
                className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm font-medium"
                aria-label="Clear all CV data"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Toggle Controls */}
        <div className="lg:hidden flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                !showPreview
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                showPreview
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Form Section */}
          <div
            className={`${
              showPreview ? "hidden lg:block" : "block"
            } mb-6 lg:mb-0`}
          >
            <CVForm cvData={cvData} updateCVData={updateCVData} />
          </div>

          {/* Preview Section - Always render but hide with CSS for better state preservation */}
          <div
            className={`${
              showPreview ? "block" : "hidden lg:block"
            } lg:sticky lg:top-24 lg:self-start`}
          >
            <CVPreview cvData={cvData} />
          </div>
        </div>
      </div>
    </div>
  );
}
