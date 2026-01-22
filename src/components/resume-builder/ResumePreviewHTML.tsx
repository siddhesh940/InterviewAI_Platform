"use client";

import { formatDate, formatDateRange } from "@/lib/format-date";
import { ResumeBuilderData } from "@/types/resume-builder";

interface ResumePreviewProps {
  data: ResumeBuilderData;
}

interface ContactLink {
  label: string;
  href: string;
}

/**
 * HTML Live Preview Component
 * Matches the uploaded PDF layout: Header, Summary, Skills, Experience, Projects, Education, Certifications
 * This is used for live preview and as the source for PDF export
 */
export default function ResumePreviewHTML({ data }: ResumePreviewProps) {
  const { contact, summary, skills, experience, projects, education, certifications } = data;

  // Parse skills into structured format
  const parseSkills = (skillsText: string) => {
    if (!skillsText) {return [];}
    
    return skillsText
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        const colonIndex = cleanLine.indexOf(':');
        
        if (colonIndex > 0 && colonIndex < 40) {
          return {
            category: cleanLine.substring(0, colonIndex).trim(),
            items: cleanLine.substring(colonIndex + 1).trim(),
          };
        }
        
return { category: null, items: cleanLine };
      });
  };

  // Parse bullet points from description
  const parseBullets = (text: string) => {
    if (!text) {return [];}
    
return text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
      .slice(0, 5); // Limit to 5 bullets
  };

  // Build contact links with proper typing
  const contactLinks: ContactLink[] = [
    contact.phone ? { label: contact.phone, href: `tel:${contact.phone}` } : null,
    contact.email ? { label: contact.email, href: `mailto:${contact.email}` } : null,
    contact.linkedin ? { label: 'LinkedIn', href: contact.linkedin.startsWith('http') ? contact.linkedin : `https://${contact.linkedin}` } : null,
    contact.github ? { label: 'GitHub', href: contact.github.startsWith('http') ? contact.github : `https://${contact.github}` } : null,
    contact.portfolio ? { label: 'Portfolio', href: contact.portfolio.startsWith('http') ? contact.portfolio : `https://${contact.portfolio}` } : null,
  ].filter((link): link is ContactLink => link !== null);

  return (
    <div
      id="resume-preview"
      className="bg-white text-gray-900 font-serif"
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: '10pt',
        lineHeight: '1.5',
        color: '#1a1a1a',
        padding: '32px 36px',
        minHeight: '100%',
        width: '100%',
      }}
    >
      {/* ========== HEADER ========== */}
      <div style={{ textAlign: 'center', marginBottom: '16px', paddingBottom: '8px' }}>
        {/* Name */}
        <h1
          style={{
            fontSize: '20pt',
            fontWeight: 'bold',
            marginBottom: '6px',
            letterSpacing: '0.5px',
          }}
        >
          {contact.name || 'Your Name'}
        </h1>

        {/* Contact Links */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '9pt',
            color: '#333',
          }}
        >
          {contactLinks.map((link, i) => (
            <span key={link?.href || `contact-${i}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <a
                href={link?.href}
                style={{ color: '#1e40af', textDecoration: 'none' }}
              >
                {link?.label}
              </a>
              {i < contactLinks.length - 1 && (
                <span style={{ margin: '0 8px', color: '#888' }}>|</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ========== SUMMARY ========== */}
      {summary?.summary && (
        <Section title="Summary">
          <p style={{ textAlign: 'justify', fontSize: '9.5pt', lineHeight: '1.6' }}>
            {summary.summary}
          </p>
        </Section>
      )}

      {/* ========== SKILLS ========== */}
      {skills?.skills && (
        <Section title="Skills">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {parseSkills(skills.skills).map((group) => (
              <div key={`${group.category}-${group.items?.slice(0, 30)}`} style={{ fontSize: '9.5pt', lineHeight: '1.55' }}>
                <span style={{ marginRight: '6px' }}>•</span>
                {group.category ? (
                  <>
                    <span style={{ fontWeight: 'bold' }}>{group.category}:</span>
                    <span> {group.items}</span>
                  </>
                ) : (
                  <span>{group.items}</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ========== EXPERIENCE ========== */}
      {experience.length > 0 && experience[0]?.role && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={`exp-${exp.role}-${exp.company}-${exp.start}`} style={{ marginBottom: i < experience.length - 1 ? '14px' : '0' }}>
              {/* Title Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '10.5pt' }}>{exp.role}</span>
                  {exp.company && (
                    <span style={{ fontSize: '9.5pt', color: '#333' }}>, {exp.company}</span>
                  )}
                  {exp.location && (
                    <span style={{ fontSize: '9pt', color: '#555' }}>, {exp.location}</span>
                  )}
                </div>
                <span style={{ fontSize: '9pt', color: '#555', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDateRange(exp.start, exp.end)}
                </span>
              </div>

              {/* Bullets */}
              {exp.description && (
                <div style={{ marginTop: '4px', paddingLeft: '4px' }}>
                  {parseBullets(exp.description).map((bullet) => (
                    <div key={`exp-bullet-${bullet.slice(0, 40)}`} style={{ display: 'flex', fontSize: '9.5pt', lineHeight: '1.55', marginBottom: '3px' }}>
                      <span style={{ marginRight: '8px', width: '8px' }}>•</span>
                      <span style={{ flex: 1 }}>{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ========== PROJECTS ========== */}
      {projects.length > 0 && projects[0]?.title && (
        <Section title="Projects">
          {projects.map((project, i) => (
            <div key={`proj-${project.title}-${project.url}`} style={{ marginBottom: i < projects.length - 1 ? '12px' : '0' }}>
              {/* Title Row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '10.5pt' }}>{project.title}</span>
                {project.url && (
                  <>
                    <span style={{ color: '#555' }}> - </span>
                    <a
                      href={project.url}
                      style={{ fontSize: '9pt', color: '#1e40af', textDecoration: 'none' }}
                    >
                      {project.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    </a>
                  </>
                )}
              </div>

              {/* Bullets */}
              {project.description && (
                <div style={{ marginTop: '4px', paddingLeft: '4px' }}>
                  {parseBullets(project.description).map((bullet) => (
                    <div key={`proj-bullet-${bullet.slice(0, 40)}`} style={{ display: 'flex', fontSize: '9.5pt', lineHeight: '1.55', marginBottom: '3px' }}>
                      <span style={{ marginRight: '8px', width: '8px' }}>•</span>
                      <span style={{ flex: 1 }}>{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ========== EDUCATION ========== */}
      {education.length > 0 && education[0]?.degree && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={`edu-${edu.degree}-${edu.institution}`} style={{ marginBottom: i < education.length - 1 ? '8px' : '0' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '10.5pt' }}>{edu.degree}</span>
                  {edu.institution && (
                    <span style={{ fontSize: '9.5pt', color: '#333' }}>, {edu.institution}</span>
                  )}
                  {edu.location && (
                    <span style={{ fontSize: '9pt', color: '#555' }}>, {edu.location}</span>
                  )}
                  {edu.gpa && (
                    <span style={{ fontSize: '9pt', color: '#555' }}> ({edu.gpa})</span>
                  )}
                </div>
                <span style={{ fontSize: '9pt', color: '#555', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {formatDateRange(edu.start, edu.end)}
                </span>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* ========== CERTIFICATIONS ========== */}
      {certifications.length > 0 && certifications[0]?.title && (
        <Section title="Certifications">
          {certifications.map((cert, i) => (
            <div
              key={`cert-${cert.title}-${cert.issuer}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: i < certifications.length - 1 ? '6px' : '0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontWeight: 'bold', fontSize: '10.5pt' }}>{cert.title}</span>
                {cert.issuer && (
                  <span style={{ fontSize: '9pt', color: '#444', marginLeft: '8px' }}>
                    {cert.issuer}
                  </span>
                )}
              </div>
              {cert.date && (
                <span style={{ fontSize: '9pt', color: '#555' }}>
                  {formatDate(cert.date)}
                </span>
              )}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

// Section Component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: '14px' }}>
      {/* Section Title */}
      <div
        style={{
          fontSize: '11.5pt',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '6px',
          letterSpacing: '1px',
          borderBottom: '1.5px solid #1e40af',
          paddingBottom: '6px',
        }}
      >
        {title}
      </div>
      {/* Section Content */}
      <div style={{ marginTop: '8px' }}>{children}</div>
    </div>
  );
}
