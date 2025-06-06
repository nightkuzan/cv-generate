"use client";

import React, { useEffect } from "react";

/**
 * A component that directly modifies the DOM for printing
 */
export default function PrintOptimizer() {
  useEffect(() => {
    // Create a style element for print optimization
    const createPrintStyle = () => {
      const styleId = "print-optimizer-style";
      if (document.getElementById(styleId)) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #cv-preview, #cv-preview * {
            visibility: visible !important;
          }
          #cv-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            padding: 20mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            color: black !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `;
      document.head.appendChild(style);
    };

    // Enhanced print preparation
    const beforePrint = () => {
      // Ensure our print styles are in place
      createPrintStyle();

      const cvPreview = document.getElementById("cv-preview");
      if (cvPreview) {
        // Force element to be visible and properly positioned
        cvPreview.style.display = "block";
        cvPreview.style.maxHeight = "none";
        cvPreview.style.overflow = "visible";

        // Clone the CV preview and make it full page for print
        const originalDiv = cvPreview;
        const clonedDiv = originalDiv.cloneNode(true);

        // Add additional print-specific attributes
        clonedDiv.setAttribute("id", "print-cv-preview");
        clonedDiv.style.position = "fixed";
        clonedDiv.style.left = "0";
        clonedDiv.style.top = "0";
        clonedDiv.style.width = "100%";
        clonedDiv.style.backgroundColor = "white";
        clonedDiv.style.zIndex = "9999";
        clonedDiv.style.padding = "20mm";

        // Add to body for printing
        document.body.appendChild(clonedDiv);
      }
    };

    const afterPrint = () => {
      // Clean up after printing
      const printPreview = document.getElementById("print-cv-preview");
      if (printPreview) {
        document.body.removeChild(printPreview);
      }
    };

    // Add event listeners for print events
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);

    // Add print styles immediately on mount
    createPrintStyle();

    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);

      // Clean up style element
      const style = document.getElementById("print-optimizer-style");
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return null;
}
