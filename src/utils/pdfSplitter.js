/**
 * PDF helper function to split a large canvas into multiple pages
 * This improves how multi-page PDF files are generated
 */
export const splitCanvasIntoPages = (canvas, pageHeight, pdf, margin = 0) => {
  const totalHeight = canvas.height;
  const width = canvas.width;
  const pageHeightInPx = (pageHeight * width) / 210; // Convert mm to px based on canvas width

  // Calculate how many pages we need
  const pageCount = Math.ceil(totalHeight / pageHeightInPx);

  console.log(`Splitting canvas into ${pageCount} pages`, {
    canvasWidth: width,
    canvasHeight: totalHeight,
    pageHeightInPx,
    pageHeight,
  });

  // Create one page at a time by drawing portions of the canvas
  for (let i = 0; i < pageCount; i++) {
    // Calculate the portion of the canvas to use for this page
    const srcY = i * pageHeightInPx;
    const srcHeight = Math.min(pageHeightInPx, totalHeight - srcY);

    // If we're not on the first page, add a new page to the PDF
    if (i > 0) {
      pdf.addPage();
    }

    // Create a temporary canvas for this page
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = srcHeight;

    // Draw the portion of the original canvas onto this temporary canvas
    const ctx = tempCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0,
      srcY,
      width,
      srcHeight, // Source rectangle
      0,
      0,
      width,
      srcHeight // Destination rectangle
    );

    // Convert to image data
    const imgData = tempCanvas.toDataURL("image/jpeg", 0.95);

    // Add to PDF - adjusting the position with margins
    const imgWidth = 210 - margin * 2; // A4 width minus margins
    const imgHeight = (srcHeight * imgWidth) / width;

    pdf.addImage(imgData, "JPEG", margin, margin, imgWidth, imgHeight);
  }

  return pageCount;
};

/**
 * Alternative PDF generation approach that renders content section by section
 * This can help with very tall documents that might be cut off
 */
export const generateSectionBySection = async (cvData, formatDateRange) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // Start position
    let yPosition = 10; // mm from top
    const margin = 10; // mm
    const pageWidth = 210 - margin * 2; // A4 width minus margins
    const pageHeight = 297 - margin * 2; // A4 height minus margins

    // Track if we need a new page
    let currentPage = 1;

    // Add a section and advance the Y position
    const addSection = (html, estimatedHeight) => {
      // Check if we need a new page
      if (yPosition + estimatedHeight > pageHeight) {
        pdf.addPage();
        currentPage++;
        yPosition = 10; // Reset Y position for new page
      }

      // Create a temporary element
      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;
      tempElement.style.width = `${pageWidth}mm`;
      tempElement.style.position = "absolute";
      tempElement.style.left = "-9999px";
      document.body.appendChild(tempElement);

      // Render this section to canvas
      return html2canvas(tempElement).then((canvas) => {
        // Calculate image dimensions
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add to PDF
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 0.95),
          "JPEG",
          margin,
          yPosition,
          imgWidth,
          imgHeight
        );

        // Advance position
        yPosition += imgHeight + 5; // 5mm spacing between sections

        // Clean up
        document.body.removeChild(tempElement);

        return imgHeight;
      });
    };

    // Add each section one by one

    // Header
    await addSection(
      `
      <div style="text-align: center; margin-bottom: 10mm;">
        <h1 style="font-size: 24px;">${cvData.personalInfo.fullName}</h1>
        <p>${cvData.personalInfo.email || ""} ${
        cvData.personalInfo.phone ? `• ${cvData.personalInfo.phone}` : ""
      }</p>
        ${
          cvData.personalInfo.address
            ? `<p>${cvData.personalInfo.address}</p>`
            : ""
        }
        <p style="margin-top: 5mm;">
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
      </div>
    `,
      40
    );

    // Projects section
    if (cvData.projects && cvData.projects.length > 0) {
      let projectsHtml = `
        <div style="margin-bottom: 20mm; page-break-inside: avoid;">
          <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #ccc; padding-bottom: 2mm;">Projects</h2>
          <div style="display: flex; flex-direction: column; gap: 5mm;">
      `;

      cvData.projects.forEach((project) => {
        projectsHtml += `
          <div style="margin-bottom: 5mm; page-break-inside: avoid;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2mm;">
              <strong style="font-size: 16px;">${project.name}</strong>
              <span>
                ${
                  project.url
                    ? `<a href="${project.url}" style="color: #1d4ed8; text-decoration: underline; margin-right: 2mm;">Demo</a>`
                    : ""
                }
                ${
                  project.github
                    ? `<a href="${project.github}" style="color: #1d4ed8; text-decoration: underline;">Code</a>`
                    : ""
                }
              </span>
            </div>
            ${
              project.description
                ? `<p style="margin: 2mm 0;">${project.description}</p>`
                : ""
            }
            ${
              project.technologies && project.technologies.length
                ? `<div style="font-size: 12px; color: #555;">${project.technologies.join(
                    " • "
                  )}</div>`
                : ""
            }
          </div>
        `;
      });

      projectsHtml += `</div></div>`;

      // Estimate height based on number of projects and their content
      const estimatedHeight = 20 + cvData.projects.length * 30;
      await addSection(projectsHtml, estimatedHeight);
    }

    // Languages section
    if (cvData.languages && cvData.languages.length > 0) {
      let languagesHtml = `
        <div style="margin-bottom: 15mm; page-break-inside: avoid;">
          <h2 style="font-size: 18px; margin-bottom: 5mm; border-bottom: 1px solid #ccc; padding-bottom: 2mm;">Languages</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3mm;">
      `;

      // Create individual language items with proper spacing
      cvData.languages.forEach((lang) => {
        languagesHtml += `
          <div style="display: flex; justify-content: space-between; padding: 2mm 0; page-break-inside: avoid;">
            <span style="font-weight: 500;">${lang.name}</span>
            <span style="color: #555; margin-left: 4mm;">${lang.proficiency}</span>
          </div>
        `;
      });

      languagesHtml += `</div></div>`;

      // Estimate height based on number of languages - increase space per item
      const estimatedHeight = 20 + Math.ceil(cvData.languages.length / 2) * 15;
      await addSection(languagesHtml, estimatedHeight);
    }

    // Save the PDF
    return pdf;
  } catch (error) {
    console.error("Error in section-by-section PDF generation:", error);
    throw error;
  }
};
