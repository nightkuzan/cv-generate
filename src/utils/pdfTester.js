/**
 * PDF testing utilities to help diagnose and fix rendering issues
 */

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Test function to verify Projects and Languages sections are properly rendered
 * This helps diagnose rendering issues in the PDF export
 */
export const testSectionsRendering = async (element) => {
  // Log the current state of key sections
  const projectsSection = element.querySelector("#projects-section");
  const languagesSection = element.querySelector("#languages-section");

  console.log("Projects section diagnostics:", {
    exists: !!projectsSection,
    projectItemCount:
      projectsSection?.querySelectorAll(".project-item").length || 0,
    computedHeight: projectsSection
      ? window.getComputedStyle(projectsSection).height
      : "N/A",
    overflow: projectsSection
      ? window.getComputedStyle(projectsSection).overflow
      : "N/A",
    display: projectsSection
      ? window.getComputedStyle(projectsSection).display
      : "N/A",
    visibility: projectsSection
      ? window.getComputedStyle(projectsSection).visibility
      : "N/A",
  });

  console.log("Languages section diagnostics:", {
    exists: !!languagesSection,
    languageItemCount:
      languagesSection?.querySelectorAll(".language-item").length || 0,
    computedHeight: languagesSection
      ? window.getComputedStyle(languagesSection).height
      : "N/A",
    overflow: languagesSection
      ? window.getComputedStyle(languagesSection).overflow
      : "N/A",
    display: languagesSection
      ? window.getComputedStyle(languagesSection).display
      : "N/A",
    visibility: languagesSection
      ? window.getComputedStyle(languagesSection).visibility
      : "N/A",
  });

  return {
    projectsSection: {
      exists: !!projectsSection,
      itemCount: projectsSection?.querySelectorAll(".project-item").length || 0,
    },
    languagesSection: {
      exists: !!languagesSection,
      itemCount:
        languagesSection?.querySelectorAll(".language-item").length || 0,
    },
  };
};

/**
 * Generate a test PDF with debugging information
 */
export const generateDebugPDF = async (element, cvData) => {
  console.log("Generating debug PDF...");

  // Create a clone to avoid modifying the original
  const clone = element.cloneNode(true);
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.width = "210mm"; // A4 width
  clone.style.maxHeight = "none";
  clone.style.height = "auto";
  clone.style.overflow = "visible";

  // Add debug information
  const debugInfo = document.createElement("div");
  debugInfo.style.background = "#f0f0f0";
  debugInfo.style.padding = "10px";
  debugInfo.style.marginBottom = "20px";
  debugInfo.style.border = "1px solid #ccc";
  debugInfo.innerHTML = `
    <h3 style="margin: 0 0 10px 0;">PDF Debug Information</h3>
    <p>Projects: ${cvData.projects.length}</p>
    <p>Languages: ${cvData.languages.length}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
  `;

  // Add the debug info to the beginning of the clone
  clone.insertBefore(debugInfo, clone.firstChild);

  // Add to DOM
  document.body.appendChild(clone);

  try {
    // Generate canvas with debug features
    const canvas = await html2canvas(clone, {
      scale: 1.5,
      logging: true,
      backgroundColor: "#ffffff",
      height: clone.scrollHeight,
      windowHeight: clone.scrollHeight + 200,
    });

    // Create PDF
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

    // Handle multi-page
    if (imgHeight <= pageHeight) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      const pageCount = Math.ceil(imgHeight / pageHeight);

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) pdf.addPage();

        // Position the image
        pdf.addImage(
          imgData,
          "JPEG",
          0, // x
          0 - i * pageHeight, // y
          imgWidth, // width
          imgHeight // height
        );
      }
    }

    return pdf;
  } catch (error) {
    console.error("Error generating debug PDF:", error);
    throw error;
  } finally {
    // Clean up
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
};
