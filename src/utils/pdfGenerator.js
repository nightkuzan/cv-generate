/**
 * A utility to help with PDF generation for CVs with correct page splitting
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Improved PDF pagination that ensures all content is properly displayed
 * across multiple pages when needed
 */
export const generatePDFWithProperPagination = async (
  element,
  options = {}
) => {
  // Default options
  const defaultOptions = {
    scale: 2.0, // Increased scale for better quality
    quality: 0.95,
    margin: 0, // No margin around the PDF edge
    padding: 2, // Reduced padding (in mm) - smaller value for less space at top/bottom
    filename: "cv.pdf",
    pageFormat: "a4",
  };

  // Merge options
  const config = { ...defaultOptions, ...options };

  try {
    console.log("Starting enhanced PDF generation with proper pagination");

    // 1. Pre-process the element to ensure full content visibility
    const clonedElement = element.cloneNode(true);

    // Force all sections to be visible, especially projects and languages
    const projectsSection = clonedElement.querySelector("#projects-section");
    const languagesSection = clonedElement.querySelector("#languages-section");

    console.log("Element verification before processing:", {
      hasProjectsSection: !!projectsSection,
      hasLanguagesSection: !!languagesSection,
      projectItems: clonedElement.querySelectorAll(".project-item").length,
      languageItems: clonedElement.querySelectorAll(".language-item").length,
    });

    // Remove all height and overflow restrictions
    clonedElement.style.maxHeight = "none";
    clonedElement.style.height = "auto";
    clonedElement.style.overflow = "visible";

    // Add styles to force visibility of all content
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      * {
        max-height: none !important;
        height: auto !important;
        overflow: visible !important;
      }
      
      /* Reduce top and bottom margins/padding for the content */
      #cv-preview {
        padding-top: 2mm !important;
        padding-bottom: 2mm !important;
      }
      
      /* Tighten section spacing */
      .mb-6 {
        margin-bottom: 0.75rem !important;
      }
      
      h2 {
        margin-top: 0.5rem !important;
        margin-bottom: 0.5rem !important;
      }
      
      .project-item, .language-item, .skill-item {
        display: block !important;
        visibility: visible !important;
        overflow: visible !important;
        page-break-inside: avoid !important;
      }
      
      #projects-section, #languages-section, [data-section-type] {
        display: block !important;
        visibility: visible !important;
        overflow: visible !important;
        margin-bottom: 0.5rem !important;
        margin-top: 0.5rem !important;
      }
      
      .grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
      }
      
      /* Ensure links are visible */
      a, a[data-pdf-link="true"] {
        color: #1d4ed8 !important;
        text-decoration: underline !important;
        display: inline-block !important;
        visibility: visible !important;
      }
    `;
    clonedElement.appendChild(styleElement);

    // Force grid layouts to be properly displayed
    const gridElements = clonedElement.querySelectorAll(".grid");
    gridElements.forEach((grid) => {
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "1fr 1fr";
      grid.style.gap = "8px";
    });

    // Add to DOM but hide
    clonedElement.style.position = "absolute";
    clonedElement.style.left = "-9999px";
    clonedElement.style.width = "210mm"; // A4 width

    // Allow content to expand to its natural height
    clonedElement.setAttribute("data-enhanced-pdf-clone", "true");
    document.body.appendChild(clonedElement);

    // Calculate full element height with margins
    const calculateFullHeight = (element) => {
      let totalHeight = element.scrollHeight;

      // Add some padding to ensure we capture everything
      return totalHeight + 50;
    };

    const requiredHeight = calculateFullHeight(clonedElement);
    console.log(`Calculated required canvas height: ${requiredHeight}px`);

    // 2. Generate canvas with appropriate dimensions
    const canvas = await html2canvas(clonedElement, {
      scale: config.scale,
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: "#ffffff",
      height: requiredHeight,
      windowHeight: requiredHeight + 100,
      onclone: (clonedDoc) => {
        // Add additional styles to the cloned document
        const clonedTarget = clonedDoc.querySelector(
          '[data-enhanced-pdf-clone="true"]'
        );
        if (clonedTarget) {
          // Ensure projects and languages sections are visible
          const sections = clonedTarget.querySelectorAll(
            "#projects-section, #languages-section"
          );
          sections.forEach((section) => {
            if (section) {
              section.style.display = "block";
              section.style.visibility = "visible";
              section.style.overflow = "visible";
              section.style.maxHeight = "none";
              section.style.height = "auto";
            }
          });

          // Ensure links are visible
          const links = clonedTarget.querySelectorAll(
            "a, a[data-pdf-link='true']"
          );
          links.forEach((link) => {
            link.style.color = "#1d4ed8";
            link.style.textDecoration = "underline";
            link.style.display = "inline-block";
            link.style.visibility = "visible";
          });
        }
      },
    });

    console.log("Canvas created successfully:", {
      width: canvas.width,
      height: canvas.height,
    });

    // 3. Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: config.pageFormat,
    });

    // A4 dimensions in mm
    const pageWidth = 210;
    const pageHeight = 297;

    // 4. Calculate dimensions
    const imgData = canvas.toDataURL(`image/jpeg`, config.quality);
    const imgWidth = pageWidth - config.margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    console.log("PDF image dimensions:", {
      imgWidth: imgWidth + "mm",
      imgHeight: imgHeight + "mm",
      pageHeight: pageHeight + "mm",
      pages: Math.ceil(imgHeight / (pageHeight - config.margin * 2)),
    });

    // 5. Handle pagination with improved positioning
    if (imgHeight <= pageHeight - config.margin * 2) {
      // Single page - simple case
      pdf.addImage(
        imgData,
        "JPEG",
        config.margin,
        config.margin,
        imgWidth,
        imgHeight
      );
      console.log("Generated single-page PDF");
    } else {
      // Multi-page with accurate positioning
      const contentHeight = pageHeight - config.margin * 2;
      const pageCount = Math.ceil(imgHeight / contentHeight);
      console.log(`PDF requires ${pageCount} pages`);

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate positioning based on original canvas size
        const sourceY = i * contentHeight * (canvas.height / imgHeight);
        const sourceHeight = Math.min(
          canvas.height - sourceY,
          contentHeight * (canvas.height / imgHeight)
        );

        // Draw the correct portion on each page
        pdf.addImage(
          imgData,
          "JPEG",
          config.margin,
          config.margin,
          imgWidth,
          imgHeight,
          null,
          "FAST",
          i === 0 ? 0 : -sourceY * (imgWidth / canvas.width)
        );

        console.log(`Added page ${i + 1} of PDF with source Y: ${sourceY}px`);
      }
    }

    // 6. Clean up
    if (document.body.contains(clonedElement)) {
      document.body.removeChild(clonedElement);
    }

    return pdf;
  } catch (error) {
    console.error("Error in PDF generation:", error);
    throw error;
  }
};

/**
 * Simplified approach that renders a CV directly from HTML string
 * instead of converting from DOM elements
 */
export const generatePDFFromHTML = async (cvData, formatDateRange) => {
  try {
    console.log("Starting PDF generation from HTML string");

    // Create more robust HTML representation of the CV with improved table layouts
    const html = `
      <div style="font-family: Arial, sans-serif; color: black; background-color: white; padding: 8px;">
        <h1 style="font-size: 24px; color: black; margin-bottom: 10px;">${
          cvData.personalInfo.fullName || "Your Name"
        }</h1>
        <p style="font-size: 14px; color: black; margin-bottom: 5px;">
          ${cvData.personalInfo.email || ""} 
          ${cvData.personalInfo.phone ? `• ${cvData.personalInfo.phone}` : ""}
        </p>
        ${
          cvData.personalInfo.address
            ? `<p style="font-size: 14px; color: black; margin-bottom: 10px;">${cvData.personalInfo.address}</p>`
            : ""
        }
        
        <!-- Links Section -->
        <p style="font-size: 14px; margin-bottom: 10px;">
          ${
            cvData.personalInfo.website
              ? `<a href="${cvData.personalInfo.website}" style="color: #1d4ed8; text-decoration: underline; margin-right: 15px;">Website</a>`
              : ""
          }
          ${
            cvData.personalInfo.linkedin
              ? `<a href="${cvData.personalInfo.linkedin}" style="color: #1d4ed8; text-decoration: underline; margin-right: 15px;">LinkedIn</a>`
              : ""
          }
          ${
            cvData.personalInfo.github
              ? `<a href="${cvData.personalInfo.github}" style="color: #1d4ed8; text-decoration: underline;">GitHub</a>`
              : ""
          }
        </p>
        
        <hr style="border: 1px solid #ccc; margin: 10px 0;" />
        
        ${
          cvData.personalInfo.summary
            ? `
          <h2 style="font-size: 18px; color: black; margin: 8px 0 6px 0;">Summary</h2>
          <p style="font-size: 14px; color: black; margin-bottom: 10px;">${cvData.personalInfo.summary}</p>
        `
            : ""
        }
        
        <!-- Experience Section -->
        ${
          cvData.experience.length > 0
            ? `
          <h2 style="font-size: 18px; color: black; margin: 8px 0 6px 0;">Experience</h2>
          ${cvData.experience
            .map(
              (exp) => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <strong style="color: black;">${exp.position}</strong>
                <span style="color: #555; font-size: 12px;">${formatDateRange(
                  exp.startDate,
                  exp.endDate,
                  exp.isCurrentJob
                )}</span>
              </div>
              <div style="color: black;">${exp.company}</div>
              <p style="color: black; font-size: 14px; margin-top: 5px;">${
                exp.description || ""
              }</p>
            </div>
          `
            )
            .join("")}
        `
            : ""
        }
        
        <!-- Projects Section with improved layout -->
        ${
          cvData.projects.length > 0
            ? `
          <h2 style="font-size: 18px; color: black; margin: 12px 0 8px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;" id="projects-section">Projects</h2>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${cvData.projects
              .map(
                (project) => `
              <div style="margin-bottom: 8px; padding-bottom: 5px; break-inside: avoid;" class="project-item">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <strong style="color: black; font-size: 16px;">${
                    project.name
                  }</strong>
                  <span style="font-size: 12px;">
                    ${
                      project.url
                        ? `<a href="${project.url}" style="color: blue; text-decoration: underline; margin-right: 8px;">Demo</a>`
                        : ""
                    }
                    ${
                      project.github
                        ? `<a href="${project.github}" style="color: blue; text-decoration: underline;">Code</a>`
                        : ""
                    }
                  </span>
                </div>
                ${
                  project.description
                    ? `<p style="color: black; font-size: 14px; margin: 8px 0;">${project.description}</p>`
                    : ""
                }
                ${
                  project.technologies?.length > 0
                    ? `<div style="color: #555; font-size: 12px; margin-top: 6px;">${project.technologies.join(
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
        
        <!-- Languages Section with improved layout -->
        ${
          cvData.languages.length > 0
            ? `
          <h2 style="font-size: 18px; color: black; margin: 10px 0 8px 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;" id="languages-section">Languages</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%;">
            ${cvData.languages
              .map(
                (lang) => `
              <div style="display: flex; justify-content: space-between; padding: 5px 0; break-inside: avoid;" class="language-item">
                <span style="color: black; font-size: 14px;">${lang.name}</span>
                <span style="color: #555; font-size: 12px; margin-left: 10px;">${lang.proficiency}</span>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>
    `;

    // Create a container for the HTML with proper styling
    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = "210mm"; // A4 width
    container.style.maxHeight = "none";
    container.style.height = "auto";
    container.style.overflow = "visible";
    container.setAttribute("data-html-pdf-container", "true");
    document.body.appendChild(container);

    // Log the HTML for debugging
    console.log(
      `Generated HTML container with ${cvData.projects.length} projects and ${cvData.languages.length} languages`
    );

    // Generate canvas with higher scale for better quality
    const canvas = await html2canvas(container, {
      scale: 2.0, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      logging: true,
      backgroundColor: "#ffffff",
      height: container.scrollHeight + 50, // Add some padding
      windowHeight: container.scrollHeight + 100,
    });

    console.log("Canvas created from HTML:", {
      width: canvas.width,
      height: canvas.height,
    });

    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Get dimensions
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    console.log("PDF dimensions from HTML:", {
      imgWidth,
      imgHeight,
      pageHeight,
      pages: Math.ceil(imgHeight / pageHeight),
    });

    // Add to PDF with improved pagination
    if (imgHeight <= pageHeight) {
      // Single page case
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      console.log("Generated single-page PDF from HTML");
    } else {
      // Multi-page with proper positioning
      const pageCount = Math.ceil(imgHeight / pageHeight);
      console.log(`PDF from HTML will have ${pageCount} pages`);

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();

        // Calculate positioning based on original canvas size
        const sourceY = i * pageHeight * (canvas.height / imgHeight);
        const sourceHeight = Math.min(
          canvas.height - sourceY,
          pageHeight * (canvas.height / imgHeight)
        );

        // Position the image properly on each page
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0, // Position at top left
          imgWidth,
          imgHeight, // Full image dimensions
          "", // No alias
          "FAST", // Fast compression
          0, // No rotation
          i === 0 ? 0 : -sourceY * (imgWidth / canvas.width) // Crop position
        );

        console.log(
          `Added page ${i + 1} of HTML PDF with source Y: ${sourceY}px`
        );
      }
    }

    // Clean up
    document.body.removeChild(container);

    return pdf;
  } catch (error) {
    console.error("Error generating PDF from HTML:", error);
    throw error;
  }
};
