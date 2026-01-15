// @ts-ignore
import { ResumeData } from "@/types/resume";
import html2pdf from "html2pdf.js";

export const downloadResumeAsPDF = async (
  resumeData: ResumeData, 
  _templateName: string = "Executive Minimal"
): Promise<void> => {
  // Create a temporary div for PDF generation
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '-9999px';
  tempDiv.style.width = '210mm';
  tempDiv.style.minHeight = '297mm';
  
  // Professional font styling
  const fontFamily = 'Inter, "Source Sans 3", Lato, Roboto, Helvetica, Arial, sans-serif';
  
  tempDiv.innerHTML = generateResumeHTML(resumeData, fontFamily);
  
  document.body.appendChild(tempDiv);
  
  const userName = resumeData.personalInfo.name || "Resume";
  const filename = `Resume-${userName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  const options = {
    margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: false
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait' as const,
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(options).from(tempDiv).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};

const generateResumeHTML = (resumeData: ResumeData, fontFamily: string): string => {
  return `
    <div style="
      font-family: ${fontFamily};
      line-height: 1.4;
      color: #1f2937;
      padding: 32px;
      background: white;
    ">
      <!-- Header -->
      <div style="text-center; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb;">
        <h1 style="
          font-size: 28px; 
          font-weight: 700; 
          color: #111827; 
          margin-bottom: 6px;
          letter-spacing: -0.025em;
        ">
          ${resumeData.personalInfo.name || "Your Name"}
        </h1>
        <p style="
          font-size: 16px;
          color: #4b5563; 
          margin-bottom: 12px;
          font-weight: 500;
        ">
          ${resumeData.personalInfo.jobTitle || "Job Title"}
        </p>
        <div style="
          font-size: 13px; 
          color: #6b7280;
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        ">
          <span>${resumeData.personalInfo.email}</span>
          ${resumeData.personalInfo.phone ? `<span>• ${resumeData.personalInfo.phone}</span>` : ''}
          ${resumeData.personalInfo.location ? `<span>• ${resumeData.personalInfo.location}</span>` : ''}
          ${resumeData.personalInfo.linkedin ? `<span>• ${resumeData.personalInfo.linkedin}</span>` : ''}
          ${resumeData.personalInfo.github ? `<span>• ${resumeData.personalInfo.github}</span>` : ''}
        </div>
      </div>

      ${resumeData.personalInfo.summary ? `
        <!-- Summary -->
        <div style="margin-bottom: 24px;">
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            PROFESSIONAL SUMMARY
          </h3>
          <p style="
            font-size: 14px; 
            color: #374151; 
            line-height: 1.6;
            text-align: justify;
          ">
            ${resumeData.personalInfo.summary}
          </p>
        </div>
      ` : ''}

      ${(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0 || resumeData.skills.tools.length > 0) ? `
        <!-- Skills -->
        <div style="margin-bottom: 24px;">
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            SKILLS
          </h3>
          <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
            ${resumeData.skills.technical.length > 0 ? `
              <div>
                <strong style="font-size: 14px; color: #374151; font-weight: 600;">Technical Skills:</strong>
                <p style="font-size: 13px; color: #4b5563; margin-top: 4px; line-height: 1.5;">
                  ${resumeData.skills.technical.join(" • ")}
                </p>
              </div>
            ` : ''}
            ${resumeData.skills.tools.length > 0 ? `
              <div>
                <strong style="font-size: 14px; color: #374151; font-weight: 600;">Tools & Technologies:</strong>
                <p style="font-size: 13px; color: #4b5563; margin-top: 4px; line-height: 1.5;">
                  ${resumeData.skills.tools.join(" • ")}
                </p>
              </div>
            ` : ''}
            ${resumeData.skills.soft.length > 0 ? `
              <div>
                <strong style="font-size: 14px; color: #374151; font-weight: 600;">Soft Skills:</strong>
                <p style="font-size: 13px; color: #4b5563; margin-top: 4px; line-height: 1.5;">
                  ${resumeData.skills.soft.join(" • ")}
                </p>
              </div>
            ` : ''}
          </div>
        </div>
      ` : ''}

      ${resumeData.experience[0]?.role ? `
        <!-- Experience -->
        <div style="margin-bottom: 24px;">
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            EXPERIENCE
          </h3>
          ${resumeData.experience.map(exp => `
            <div style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <strong style="font-size: 15px; color: #111827; font-weight: 600;">${exp.role}</strong>
                <span style="font-size: 13px; color: #6b7280; font-weight: 500;">${exp.duration}</span>
              </div>
              <p style="font-size: 14px; color: #4b5563; margin-bottom: 6px; font-weight: 500;">${exp.company}</p>
              ${exp.description ? `
                <div style="font-size: 13px; color: #374151; line-height: 1.6;">
                  ${exp.description.split('\n').map(line => 
                    `<p style="margin-bottom: 2px; padding-left: ${line.trim().startsWith('•') ? '0' : '12px'};">
                      ${line.trim().startsWith('•') ? line : `• ${line}`}
                    </p>`
                  ).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.projects[0]?.title ? `
        <!-- Projects -->
        <div style="margin-bottom: 24px;">
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            PROJECTS
          </h3>
          ${resumeData.projects.map(project => `
            <div style="margin-bottom: 16px;">
              <strong style="font-size: 15px; color: #111827; font-weight: 600;">${project.title}</strong>
              ${project.techStack.length > 0 ? `
                <p style="font-size: 13px; color: #6b7280; margin-top: 2px; font-style: italic;">
                  Technologies: ${project.techStack.join(" • ")}
                </p>
              ` : ''}
              ${project.description ? `
                <p style="font-size: 13px; color: #374151; line-height: 1.6; margin-top: 4px;">
                  ${project.description}
                </p>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.education[0]?.degree ? `
        <!-- Education -->
        <div style="margin-bottom: 24px;">
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            EDUCATION
          </h3>
          ${resumeData.education.map(edu => `
            <div style="margin-bottom: 12px;">
              <strong style="font-size: 15px; color: #111827; font-weight: 600;">${edu.degree}</strong>
              <p style="font-size: 14px; color: #4b5563; margin-top: 2px;">${edu.college}</p>
              <div style="font-size: 13px; color: #6b7280; margin-top: 2px;">
                ${edu.year} ${edu.cgpa ? `• GPA: ${edu.cgpa}` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${resumeData.certifications.length > 0 ? `
        <!-- Certifications -->
        <div style="margin-bottom: 24px;">
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            CERTIFICATIONS
          </h3>
          <ul style="list-style: none; padding: 0;">
            ${resumeData.certifications.map(cert => `
              <li style="
                font-size: 14px; 
                color: #374151;
                margin-bottom: 6px;
                padding-left: 12px;
                position: relative;
              ">
                <span style="position: absolute; left: 0; font-weight: bold;">•</span>
                ${cert}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      ${resumeData.achievements.length > 0 ? `
        <!-- Achievements -->
        <div>
          <h3 style="
            font-size: 16px;
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">
            ACHIEVEMENTS
          </h3>
          <ul style="list-style: none; padding: 0;">
            ${resumeData.achievements.map(achievement => `
              <li style="
                font-size: 14px; 
                color: #374151;
                margin-bottom: 6px;
                padding-left: 12px;
                position: relative;
              ">
                <span style="position: absolute; left: 0; font-weight: bold;">•</span>
                ${achievement}
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;
};
