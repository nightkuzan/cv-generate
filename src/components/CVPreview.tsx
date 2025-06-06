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
          padding: 20mm !important;
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

      console.log("Starting html2canvas...");

      // Create canvas from the CV element with simplified options
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale to avoid memory issues
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: true, // Enable logging for debugging
        removeContainer: true,
        ignoreElements: (element) => {
          // Ignore elements that might cause issues
          return (
            element.classList.contains("print:hidden") ||
            element.getAttribute("data-html2canvas-ignore") === "true"
          );
        },
      });

      console.log("Canvas created:", canvas.width, "x", canvas.height);

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Failed to create canvas or canvas is empty");
      }

      // Get canvas dimensions for PDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm (corrected)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log("PDF dimensions:", { imgWidth, imgHeight, pageHeight });

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL("image/jpeg", 0.95); // Use JPEG with compression

      console.log("Image data created, length:", imgData.length);

      // Add image to PDF
      if (imgHeight <= pageHeight) {
        // Single page
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages
        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Additional pages
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
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
            "Could not capture the CV content. Please try scrolling to the top of the CV and try again.";
        } else if (
          error.message.includes("memory") ||
          error.message.includes("size")
        ) {
          errorMessage +=
            "The CV is too large to process. Try reducing the content or contact support.";
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
    <div className="bg-white rounded border border-gray-300 overflow-hidden">
      <div
        className="p-4 bg-gray-50 border-b border-gray-300 print:hidden"
        data-html2canvas-ignore="true"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">CV Preview</h2>
          <div className="flex gap-2">
            <PrintButton cvData={cvData} />
            <button
              onClick={handleDownload}
              data-download-btn
              className="bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <div
        id="cv-preview"
        className="p-6 bg-white max-h-screen overflow-y-auto print:max-h-none print:overflow-visible print:p-6 print:m-0 print:shadow-none print:block"
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
                >
                  GitHub
                </a>
              </>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {cvData.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Summary
            </h2>
            <p className="text-gray-800 text-sm leading-relaxed">
              {cvData.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {cvData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <div key={exp.id}>
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
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {cvData.education.map((edu) => (
                <div key={edu.id}>
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
        )}

        {/* Skills */}
        {cvData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cvData.skills.map((skill) => (
                <div key={skill.id} className="flex justify-between text-sm">
                  <span className="text-black">{skill.name}</span>
                  <span className="text-xs text-gray-600">{skill.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {cvData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-black text-sm">
                      {project.name}
                    </h3>
                    <div className="flex gap-2 text-xs">
                      {project.url && (
                        <a
                          href={project.url}
                          className="text-gray-900 underline"
                        >
                          Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          className="text-gray-900 underline"
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
          <div>
            <h2 className="text-lg font-semibold text-black mb-2 border-b border-gray-300 pb-1">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {cvData.languages.map((language) => (
                <div key={language.id} className="flex justify-between text-sm">
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
