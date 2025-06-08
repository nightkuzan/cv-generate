// Test utility for PDF generation
// This file provides a way to test PDF generation without using the UI

import { renderToString } from "react-dom/server";
import { CVData } from "@/types/cv";

/**
 * Generates a preview of the HTML that will be used for PDF generation
 * This can be used for debugging purposes to see what HTML will be rendered
 */
export const generatePDFPreviewHTML = (cvData: CVData): string => {
  // First create a base HTML document
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>CV PDF Preview</title>
        <style>
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            color: #000000;
            background: #ffffff;
          }
          h1 { font-size: 24px; margin-bottom: 5px; }
          h2 { font-size: 18px; margin-top: 15px; margin-bottom: 10px; border-bottom: 1px solid #ccc; }
          .container { max-width: 800px; margin: 0 auto; }
          .section { margin-bottom: 15px; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
          .text-sm { font-size: 14px; }
          .font-semibold { font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Personal Info -->
          <div class="section">
            <h1>${cvData.personalInfo.fullName || "Your Name"}</h1>
            <p>
              ${cvData.personalInfo.email || ""}
              ${
                cvData.personalInfo.phone
                  ? ` • ${cvData.personalInfo.phone}`
                  : ""
              }
            </p>
            ${
              cvData.personalInfo.address
                ? `<p>${cvData.personalInfo.address}</p>`
                : ""
            }
          </div>
          
          <!-- Projects -->
          ${
            cvData.projects.length > 0
              ? `
            <div class="section" id="projects-section">
              <h2>Projects</h2>
              <div>
                ${cvData.projects
                  .map(
                    (project) => `
                  <div class="project-item">
                    <div class="flex justify-between">
                      <div class="font-semibold">${project.name}</div>
                      <div>
                        ${
                          project.url ? `<a href="${project.url}">Demo</a>` : ""
                        }
                        ${
                          project.github
                            ? `<a href="${project.github}">Code</a>`
                            : ""
                        }
                      </div>
                    </div>
                    ${
                      project.description
                        ? `<p class="text-sm">${project.description}</p>`
                        : ""
                    }
                    ${
                      project.technologies.length > 0
                        ? `<div class="text-sm">${project.technologies.join(
                            " • "
                          )}</div>`
                        : ""
                    }
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
          
          <!-- Languages -->
          ${
            cvData.languages.length > 0
              ? `
            <div class="section" id="languages-section">
              <h2>Languages</h2>
              <div class="grid">
                ${cvData.languages
                  .map(
                    (language) => `
                  <div class="language-item flex justify-between">
                    <span>${language.name}</span>
                    <span>${language.proficiency}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }
        </div>
      </body>
    </html>
  `;

  return html;
};

/**
 * Logs the PDF preview HTML to the console for debugging
 */
export const logPDFPreviewHTML = (cvData: CVData): void => {
  console.log("--- PDF PREVIEW HTML ---");
  console.log(generatePDFPreviewHTML(cvData));
  console.log("--- END PDF PREVIEW HTML ---");
};
