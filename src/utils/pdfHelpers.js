// PDF Generation helper functions

/**
 * Ensures that all CV sections are properly formatted for PDF generation
 * This helps with ensuring consistent data structure and avoiding errors
 */
export const prepareCVDataForPDF = (cvData) => {
  // Create a deep copy to avoid mutation
  const processedData = JSON.parse(JSON.stringify(cvData));

  // Ensure all sections have IDs
  if (processedData.projects && processedData.projects.length > 0) {
    processedData.projects = processedData.projects.map((project, index) => ({
      ...project,
      id: project.id || `project-${Date.now()}-${index}`,
    }));
  }

  if (processedData.languages && processedData.languages.length > 0) {
    processedData.languages = processedData.languages.map(
      (language, index) => ({
        ...project,
        id: language.id || `language-${Date.now()}-${index}`,
      })
    );
  }

  return processedData;
};

/**
 * Creates a layout-friendly HTML representation of the CV data
 * This is designed to work with html2canvas and be PDF-friendly
 */
export const createPDFFriendlyHTML = (cvData) => {
  // Create sections for each part of the CV
  const sections = [];

  // Add projects section if available
  if (cvData.projects && cvData.projects.length > 0) {
    const projectsHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
          Projects
        </h2>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${cvData.projects
            .map(
              (project) => `
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: bold;">${project.name}</span>
                <span>
                  ${
                    project.url
                      ? `<a href="${project.url}" style="color: blue;">Demo</a>`
                      : ""
                  }
                  ${
                    project.github
                      ? ` | <a href="${project.github}" style="color: blue;">Code</a>`
                      : ""
                  }
                </span>
              </div>
              ${
                project.description
                  ? `<p style="margin: 5px 0;">${project.description}</p>`
                  : ""
              }
              ${
                project.technologies && project.technologies.length > 0
                  ? `<div style="font-size: 12px; color: #666;">${project.technologies.join(
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
    `;
    sections.push(projectsHTML);
  }

  // Add languages section if available
  if (cvData.languages && cvData.languages.length > 0) {
    const languagesHTML = `
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
          Languages
        </h2>
        <table style="width: 100%;">
          <tbody>
            ${Array.from({ length: Math.ceil(cvData.languages.length / 2) })
              .map(
                (_, i) => `
              <tr>
                ${
                  cvData.languages[i * 2]
                    ? `
                  <td style="width: 40%; padding: 4px 0;">${
                    cvData.languages[i * 2].name
                  }</td>
                  <td style="width: 10%; text-align: right; padding: 4px 0;">${
                    cvData.languages[i * 2].proficiency
                  }</td>
                `
                    : '<td colspan="2"></td>'
                }
                
                ${
                  cvData.languages[i * 2 + 1]
                    ? `
                  <td style="width: 40%; padding: 4px 0 4px 20px;">${
                    cvData.languages[i * 2 + 1].name
                  }</td>
                  <td style="width: 10%; text-align: right; padding: 4px 0;">${
                    cvData.languages[i * 2 + 1].proficiency
                  }</td>
                `
                    : '<td colspan="2"></td>'
                }
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    sections.push(languagesHTML);
  }

  return sections.join("\n");
};

/**
 * Enhances HTML links to ensure they're visible in PDF exports
 * This helps solve issues with links not showing up in PDFs
 */
export const enhanceLinksForPDF = (element) => {
  if (!element) return;

  // Find all links in the element
  const links = element.querySelectorAll("a");

  links.forEach((link) => {
    // Add data attribute for PDF rendering
    link.setAttribute("data-pdf-link", "true");

    // Ensure link is styled properly
    link.style.color = "#1d4ed8";
    link.style.textDecoration = "underline";
    link.style.display = "inline-block";
    link.style.visibility = "visible";

    // Clone link attributes to ensure they're captured by PDF renderer
    const href = link.getAttribute("href");
    if (href) {
      link.setAttribute("data-href", href);
    }
  });

  return element;
};

/**
 * Special handling for external links and social profiles in CVs
 * This improves how website, LinkedIn, and GitHub links appear in PDFs
 */
export const processSocialLinks = (cvData) => {
  const socialLinksHTML = `
    <div style="margin-top: 5px; margin-bottom: 10px;">
      ${
        cvData.personalInfo.website
          ? `<a href="${cvData.personalInfo.website}" 
            style="color: #1d4ed8; text-decoration: underline; margin-right: 15px;" 
            data-pdf-link="true">Website</a>`
          : ""
      }
      ${
        cvData.personalInfo.linkedin
          ? `<a href="${cvData.personalInfo.linkedin}" 
            style="color: #1d4ed8; text-decoration: underline; margin-right: 15px;" 
            data-pdf-link="true">LinkedIn</a>`
          : ""
      }
      ${
        cvData.personalInfo.github
          ? `<a href="${cvData.personalInfo.github}" 
            style="color: #1d4ed8; text-decoration: underline;" 
            data-pdf-link="true">GitHub</a>`
          : ""
      }
    </div>
  `;

  return socialLinksHTML;
};
