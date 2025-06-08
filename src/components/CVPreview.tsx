"use client";

import { CVData } from "@/types/cv";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrintButton from "./PrintButton";

interface CVPreviewProps {
  cvData: CVData;
}

export default function CVPreview({ cvData }: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const formatDateRange = (
    startDate: string,
    endDate: string,
    isCurrent: boolean
  ) => {
    const start = formatDate(startDate);
    const end = isCurrent ? "Present" : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const handlePrint = () => {
    // Ensure we're ready to print
    const cvPreview = document.getElementById("cv-preview");

    // Create a special print-only style
    const style = document.createElement("style");
    style.id = "print-now-style";
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        #cv-preview, #cv-preview * { visibility: visible !important; }
        #cv-preview { 
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          padding: 8mm !important;
          margin: 0 !important;
          background: white !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Trigger print
    setTimeout(() => {
      window.print();
      // Clean up
      document.head.removeChild(style);
    }, 100);
  };

  const handleDownload = async () => {
    console.log("Starting PDF generation...");

    try {
      // Get the CV preview element
      const element = document.getElementById("cv-preview");
      if (!element) {
        console.error("CV preview element not found");
        alert("CV preview element not found. Please try refreshing the page.");
        return;
      }

      // Import the improved PDF generation utilities
      const { generatePDFWithProperPagination, generatePDFFromHTML } =
        await import("@/utils/pdfGenerator");

      // Ensure all sections are fully rendered before proceeding
      // This helps with async rendering issues that might affect projects and languages
      const waitForSectionsToRender = () => {
        return new Promise<void>((resolve) => {
          // Check if all sections are already present
          const projectsSection = element.querySelector("#projects-section");
          const languagesSection = element.querySelector("#languages-section");

          if (
            cvData.projects.length > 0 &&
            projectsSection &&
            projectsSection.querySelectorAll(".project-item").length ===
              cvData.projects.length &&
            cvData.languages.length > 0 &&
            languagesSection &&
            languagesSection.querySelectorAll(".language-item").length ===
              cvData.languages.length
          ) {
            console.log("All sections already rendered correctly");
            resolve();
            return;
          }

          console.log("Waiting for sections to fully render...");

          // Set up a mutation observer to detect when the DOM is updated
          const observer = new MutationObserver((mutations) => {
            const projectItems = element.querySelectorAll(".project-item");
            const languageItems = element.querySelectorAll(".language-item");

            console.log("DOM mutation detected:", {
              projectItems: projectItems.length,
              languageItems: languageItems.length,
              expectedProjects: cvData.projects.length,
              expectedLanguages: cvData.languages.length,
            });

            // Check if all expected items are now present
            if (
              (cvData.projects.length === 0 ||
                projectItems.length === cvData.projects.length) &&
              (cvData.languages.length === 0 ||
                languageItems.length === cvData.languages.length)
            ) {
              observer.disconnect();
              resolve();
            }
          });

          // Start observing the CV preview for any changes
          observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
          });

          // Set a timeout to prevent hanging if something goes wrong
          setTimeout(() => {
            observer.disconnect();
            console.warn(
              "Timed out waiting for DOM updates, proceeding anyway"
            );
            resolve();
          }, 2000);
        });
      };

      // Pre-process the data for PDF generation
      const ensureAllDataIsProcessed = () => {
        // Create a processed copy of the CV data
        const processedData = { ...cvData };

        // Ensure projects have unique IDs and all required fields
        if (processedData.projects.length > 0) {
          processedData.projects = processedData.projects.map(
            (project, index) => {
              // Make sure we have an ID
              if (!project.id) {
                return {
                  ...project,
                  id: `project-${Date.now()}-${index}`,
                };
              }
              return project;
            }
          );
        }

        // Ensure languages have unique IDs and all required fields
        if (processedData.languages.length > 0) {
          processedData.languages = processedData.languages.map(
            (language, index) => {
              // Make sure we have an ID
              if (!language.id) {
                return {
                  ...language,
                  id: `language-${Date.now()}-${index}`,
                };
              }
              return language;
            }
          );
        }

        console.log("Pre-processed data for PDF generation:", {
          projectsCount: processedData.projects.length,
          languagesCount: processedData.languages.length,
        });

        return processedData;
      };

      // Process the data before continuing
      const processedCVData = ensureAllDataIsProcessed();

      // Wait for DOM to be fully rendered before proceeding
      await waitForSectionsToRender();

      // Import helpers for link enhancement
      try {
        const { enhanceLinksForPDF } = await import("@/utils/pdfHelpers");
        // Enhance links to ensure they're visible in PDF
        enhanceLinksForPDF(element);
        console.log("Links enhanced for PDF export");
      } catch (error) {
        console.warn("Link enhancement unavailable:", error);
      }

      // Run diagnostics on the CV sections if needed
      try {
        const diagnostics = {
          projectsSection: {
            exists: !!element.querySelector("#projects-section"),
            itemCount: element.querySelectorAll(".project-item").length,
          },
          languagesSection: {
            exists: !!element.querySelector("#languages-section"),
            itemCount: element.querySelectorAll(".language-item").length,
          },
        };
        console.log("PDF generation diagnostics:", diagnostics);
      } catch (diagnosticError) {
        console.warn("Diagnostics error:", diagnosticError);
      }

      // Debug data validation
      console.log("CV data during PDF generation:", {
        projectsCount: cvData.projects.length,
        languagesCount: cvData.languages.length,
        projectsData: cvData.projects,
        languagesData: cvData.languages,
      });

      // Verify projects and languages are in the DOM before proceeding
      console.log("Original DOM elements:", {
        projectsCount: element.querySelectorAll(".project-item").length,
        languagesCount: element.querySelectorAll(".language-item").length,
      });

      console.log("CV element found:", element);

      // Show loading state
      const downloadBtn = document.querySelector(
        "[data-download-btn]"
      ) as HTMLButtonElement;
      const originalText = downloadBtn?.textContent || "Download PDF";

      if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = "Generating PDF...";
      }

      // Try the enhanced PDF generation approach
      let pdf;

      try {
        console.log("Using enhanced PDF generation with proper pagination");
        pdf = await generatePDFWithProperPagination(element, {
          scale: 2.0,
          quality: 0.95,
          margin: 0,
          padding: 2,
        });
      } catch (firstAttemptError) {
        console.error(
          "First PDF generation approach failed:",
          firstAttemptError
        );

        // Try the fallback approach using direct HTML generation
        console.log("Trying fallback HTML-based PDF generation");
        pdf = await generatePDFFromHTML(cvData, formatDateRange);
      }

      if (!pdf) {
        throw new Error("Failed to generate PDF with both approaches");
      }

      // Generate filename with current date
      const fullName =
        cvData.personalInfo.fullName?.replace(/[^a-zA-Z0-9]/g, "_") || "CV";
      const fileName = `${fullName}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      console.log("Saving PDF as:", fileName);

      // Download the PDF
      pdf.save(fileName);

      console.log("PDF generated successfully!");

      // Reset button state
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.textContent = originalText;
      }
    } catch (error) {
      console.error("Detailed error generating PDF:", error);

      // More specific error messages
      let errorMessage = "Failed to generate PDF. ";

      if (error instanceof Error) {
        if (error.message.includes("canvas")) {
          errorMessage +=
            "Could not capture the CV content. Please try refreshing the page and try again.";
        } else if (
          error.message.includes("memory") ||
          error.message.includes("size")
        ) {
          errorMessage +=
            "The CV is too large to process. Try reducing the content or contact support.";
        } else if (
          error.message.includes("oklch") ||
          error.message.includes("color")
        ) {
          errorMessage +=
            "There was an issue with color formatting. Please try printing the CV instead.";
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage +=
          "An unknown error occurred. Please try again or refresh the page.";
      }

      alert(errorMessage);

      // Reset button state on error
      const downloadBtn = document.querySelector(
        "[data-download-btn]"
      ) as HTMLButtonElement;
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.textContent = "Download PDF";
      }
    }
  };

  return (
    <div className="bg-white rounded border border-gray-300 overflow-hidden shadow-sm">
      <div
        className="p-4 bg-gray-50 border-b border-gray-300 print:hidden"
        data-html2canvas-ignore="true"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">CV Preview</h2>
          <div className="flex flex-wrap w-full sm:w-auto gap-2">
            <PrintButton cvData={cvData} />
            <button
              onClick={handleDownload}
              data-download-btn
              className="flex-1 sm:flex-none bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div
        id="cv-preview"
        className="p-4 sm:p-5 bg-white max-h-[calc(100vh-180px)] overflow-y-auto print:max-h-none print:overflow-visible print:p-4 print:m-0 print:shadow-none print:block"
        data-pdf-mode="auto"
        style={{ breakInside: "auto" }}
      >
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-black mb-1">
            {cvData.personalInfo.fullName || "Your Name"}
          </h1>
          <div className="text-sm text-gray-700 mb-1">
            {cvData.personalInfo.email && (
              <span>{cvData.personalInfo.email}</span>
            )}
            {cvData.personalInfo.phone && cvData.personalInfo.email && (
              <span> • </span>
            )}
            {cvData.personalInfo.phone && (
              <span>{cvData.personalInfo.phone}</span>
            )}
          </div>
          {cvData.personalInfo.address && (
            <div className="text-sm text-gray-700 mb-1">
              {cvData.personalInfo.address}
            </div>
          )}
          <div className="text-sm">
            {cvData.personalInfo.website && (
              <a
                href={cvData.personalInfo.website}
                className="text-gray-900 underline"
                data-pdf-link="true"
              >
                Website
              </a>
            )}
            {cvData.personalInfo.linkedin && (
              <>
                {cvData.personalInfo.website && (
                  <span className="text-gray-700"> • </span>
                )}
                <a
                  href={cvData.personalInfo.linkedin}
                  className="text-gray-900 underline"
                  data-pdf-link="true"
                >
                  LinkedIn
                </a>
              </>
            )}
            {cvData.personalInfo.github && (
              <>
                {(cvData.personalInfo.website ||
                  cvData.personalInfo.linkedin) && (
                  <span className="text-gray-700"> • </span>
                )}
                <a
                  href={cvData.personalInfo.github}
                  className="text-gray-900 underline"
                  data-pdf-link="true"
                >
                  GitHub
                </a>
              </>
            )}
          </div>
        </div>
        {/* Professional Summary */}
        {cvData.personalInfo.summary && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-black mb-1 border-b border-gray-300 pb-1">
              Summary
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        )}
        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div className="mb-6" data-section-type="experience">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div
                  key={exp.id}
                  data-experience-id={exp.id}
                  className="experience-item"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-black text-sm">
                        {exp.position}
                      </h3>
                      <p className="text-gray-800 text-sm">{exp.company}</p>
                      {exp.location && (
                        <p className="text-xs text-gray-600">{exp.location}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 text-right">
                      {formatDateRange(
                        exp.startDate,
                        exp.endDate,
                        exp.isCurrentJob
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-800 text-sm mt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Education */}
        {cvData.education.length > 0 && (
          <div className="mb-6" data-section-type="education">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div
                  key={edu.id}
                  data-education-id={edu.id}
                  className="education-item"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-black text-sm">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-gray-800 text-sm">{edu.institution}</p>
                      <div className="text-xs text-gray-600">
                        {edu.location && <span>{edu.location}</span>}
                        {edu.gpa && edu.location && <span> • </span>}
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 text-right">
                      {formatDateRange(
                        edu.startDate,
                        edu.endDate,
                        edu.isCurrentStudy
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}{" "}
        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-6" data-section-type="skills">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cvData.skills.map((skill) => (
                <div
                  key={skill.id}
                  data-skill-id={skill.id}
                  className="skill-item flex justify-between text-sm"
                >
                  <span className="text-black">{skill.name}</span>
                  <span className="text-xs text-gray-600">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Projects */}
        {cvData.projects.length > 0 && (
          <div
            className="mb-3"
            id="projects-section"
            data-section-type="projects"
            style={{
              breakInside: "avoid-page",
              pageBreakInside: "avoid",
              display: "block",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Projects
            </h2>
            <div className="space-y-3">
              {cvData.projects.map((project) => (
                <div
                  key={project.id}
                  data-project-id={project.id}
                  className="project-item"
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-black text-sm">
                      {project.name}
                    </h3>
                    <div className="flex gap-2 text-xs">
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-gray-900 underline"
                          data-pdf-link="true"
                        >
                          Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          className="text-gray-900 underline"
                          data-pdf-link="true"
                        >
                          Code
                        </a>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-gray-800 text-sm mb-1">
                      {project.description}
                    </p>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="text-xs text-gray-600">
                      {project.technologies.join(" • ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Languages */}
        {cvData.languages.length > 0 && (
          <div
            className="mt-1"
            id="languages-section"
            data-section-type="languages"
            style={{
              breakInside: "avoid-page",
              pageBreakInside: "avoid",
              display: "block",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cvData.languages.map((language) => (
                <div
                  key={language.id}
                  data-language-id={language.id}
                  className="language-item flex justify-between text-sm"
                  style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                >
                  <span className="text-black">{language.name}</span>
                  <span className="text-xs text-gray-600">
                    {language.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
