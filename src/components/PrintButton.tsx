"use client";

import React from "react";
import { CVData } from "@/types/cv";

interface PrintButtonProps {
  cvData: CVData;
}

export default function PrintButton({ cvData }: PrintButtonProps) {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow) {
      alert("Please allow pop-ups to print your CV");
      return;
    }

    // Get the original CV content
    const cvContent = document.getElementById("cv-preview");
    if (!cvContent) {
      printWindow.close();
      alert("Could not find CV content");
      return;
    }

    // Format date function
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    };

    // Format date range
    const formatDateRange = (
      startDate: string,
      endDate: string,
      isCurrent: boolean
    ) => {
      const start = formatDate(startDate);
      const end = isCurrent ? "Present" : formatDate(endDate);
      return `${start} - ${end}`;
    };

    // Create HTML content
    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${cvData.personalInfo.fullName || "CV"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20mm;
              color: black;
              background: white;
            }
            h1, h2, h3 {
              margin-top: 0;
              color: black;
            }
            .cv-section {
              margin-bottom: 15px;
            }
            .cv-header {
              margin-bottom: 20px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .section-title {
              font-size: 18px;
              font-weight: bold;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .entry {
              margin-bottom: 12px;
            }
            .entry-header {
              display: flex;
              justify-content: space-between;
            }
            .entry-title {
              font-weight: bold;
            }
            .entry-org {
              margin-top: 2px;
            }
            .entry-location {
              font-size: 0.9em;
              color: #666;
            }
            .entry-date {
              font-size: 0.9em;
              color: #666;
              text-align: right;
            }
            .skills-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              grid-gap: 8px;
            }
            @page {
              size: A4;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="cv-header">
            <h1>${cvData.personalInfo.fullName || "Your Name"}</h1>
            <div>
              ${
                cvData.personalInfo.email
                  ? `<span>${cvData.personalInfo.email}</span>`
                  : ""
              }
              ${
                cvData.personalInfo.email && cvData.personalInfo.phone
                  ? ` • `
                  : ""
              }
              ${
                cvData.personalInfo.phone
                  ? `<span>${cvData.personalInfo.phone}</span>`
                  : ""
              }
            </div>
            ${
              cvData.personalInfo.address
                ? `<div>${cvData.personalInfo.address}</div>`
                : ""
            }
            <div>
              ${cvData.personalInfo.website ? `<span>Website</span>` : ""}
              ${
                cvData.personalInfo.linkedin
                  ? `${
                      cvData.personalInfo.website ? " • " : ""
                    }<span>LinkedIn</span>`
                  : ""
              }
              ${
                cvData.personalInfo.github
                  ? `${
                      cvData.personalInfo.website ||
                      cvData.personalInfo.linkedin
                        ? " • "
                        : ""
                    }<span>GitHub</span>`
                  : ""
              }
            </div>
          </div>
          
          ${
            cvData.personalInfo.summary
              ? `
            <div class="cv-section">
              <div class="section-title">Summary</div>
              <p>${cvData.personalInfo.summary}</p>
            </div>
          `
              : ""
          }
          
          ${
            cvData.experience.length > 0
              ? `
            <div class="cv-section">
              <div class="section-title">Experience</div>
              ${cvData.experience
                .map(
                  (exp) => `
                <div class="entry">
                  <div class="entry-header">
                    <div>
                      <div class="entry-title">${exp.position}</div>
                      <div class="entry-org">${exp.company}</div>
                      ${
                        exp.location
                          ? `<div class="entry-location">${exp.location}</div>`
                          : ""
                      }
                    </div>
                    <div class="entry-date">
                      ${formatDateRange(
                        exp.startDate,
                        exp.endDate,
                        exp.isCurrentJob
                      )}
                    </div>
                  </div>
                  ${exp.description ? `<p>${exp.description}</p>` : ""}
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            cvData.education.length > 0
              ? `
            <div class="cv-section">
              <div class="section-title">Education</div>
              ${cvData.education
                .map(
                  (edu) => `
                <div class="entry">
                  <div class="entry-header">
                    <div>
                      <div class="entry-title">${edu.degree} in ${
                    edu.field
                  }</div>
                      <div class="entry-org">${edu.institution}</div>
                      <div class="entry-location">
                        ${edu.location ? edu.location : ""}
                        ${edu.gpa && edu.location ? " • " : ""}
                        ${edu.gpa ? `GPA: ${edu.gpa}` : ""}
                      </div>
                    </div>
                    <div class="entry-date">
                      ${formatDateRange(
                        edu.startDate,
                        edu.endDate,
                        edu.isCurrentStudy
                      )}
                    </div>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            cvData.skills.length > 0
              ? `
            <div class="cv-section">
              <div class="section-title">Skills</div>
              <div class="skills-grid">
                ${cvData.skills
                  .map(
                    (skill) => `
                  <div>
                    <span>${skill.name}</span>
                    <span style="float: right; font-size: 0.9em; color: #666;">${skill.level}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
          
          ${
            cvData.projects.length > 0
              ? `
            <div class="cv-section">
              <div class="section-title">Projects</div>
              ${cvData.projects
                .map(
                  (project) => `
                <div class="entry">
                  <div class="entry-header">
                    <div class="entry-title">${project.name}</div>
                    <div>
                      ${project.url ? `<span>Demo</span>` : ""}
                      ${
                        project.github
                          ? `${project.url ? " • " : ""}<span>Code</span>`
                          : ""
                      }
                    </div>
                  </div>
                  ${project.description ? `<p>${project.description}</p>` : ""}
                  ${
                    project.technologies.length > 0
                      ? `<div style="font-size: 0.9em; color: #666;">${project.technologies.join(
                          " • "
                        )}</div>`
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
          
          ${
            cvData.languages.length > 0
              ? `
            <div class="cv-section">
              <div class="section-title">Languages</div>
              <div class="skills-grid">
                ${cvData.languages
                  .map(
                    (language) => `
                  <div>
                    <span>${language.name}</span>
                    <span style="float: right; font-size: 0.9em; color: #666;">${language.proficiency}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </body>
      </html>
    `;

    // Write to the new window
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();

    // Print after everything is loaded
    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();

      // Close the window after printing (optional)
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  return (
    <button
      onClick={handlePrint}
      className="border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
    >
      Print CV
    </button>
  );
}
