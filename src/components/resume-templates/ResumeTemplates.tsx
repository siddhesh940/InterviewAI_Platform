import { ResumeData } from "@/hooks/useResumeBuilder";

interface ResumeTemplateProps {
  data: ResumeData;
  template: string;
}

export function ExecutiveMinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white p-8 min-h-full font-serif text-gray-900">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2 tracking-wide">
          {data.personalInfo.name || "YOUR NAME"}
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          {data.personalInfo.jobTitle || "Professional Title"}
        </p>
        <div className="text-sm text-gray-600 space-x-4">
          <span>{data.personalInfo.email}</span>
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.github) && (
          <div className="text-sm text-gray-600 mt-1">
            {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
            {data.personalInfo.linkedin && data.personalInfo.github && <span> • </span>}
            {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && data.experience[0].role && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.role}</h3>
                <span className="text-sm text-gray-600 italic">{exp.duration}</span>
              </div>
              <p className="text-sm text-gray-700 mb-2 font-medium">{exp.company}</p>
              {exp.description && (
                <div className="text-sm text-gray-800 leading-relaxed">
                  {exp.description.split('\n').map((line, lineIndex) => (
                    <p key={lineIndex} className="mb-1">{line}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {data.skills.technical.length > 0 && (
              <div>
                <strong className="text-sm">Technical Skills: </strong>
                <span className="text-sm text-gray-800">
                  {data.skills.technical.join(" • ")}
                </span>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <strong className="text-sm">Professional Skills: </strong>
                <span className="text-sm text-gray-800">
                  {data.skills.soft.join(" • ")}
                </span>
              </div>
            )}
            {data.skills.tools.length > 0 && (
              <div>
                <strong className="text-sm">Tools & Technologies: </strong>
                <span className="text-sm text-gray-800">
                  {data.skills.tools.join(" • ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.length > 0 && data.projects[0].title && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
            KEY PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="font-bold text-sm">{project.title}</h3>
              {project.techStack.length > 0 && (
                <p className="text-xs text-gray-600 mb-1">
                  Technologies: {project.techStack.join(", ")}
                </p>
              )}
              {project.description && (
                <p className="text-sm text-gray-800 leading-relaxed">{project.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && data.education[0].degree && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{edu.degree}</h3>
                <span className="text-sm text-gray-600">{edu.year}</span>
              </div>
              <p className="text-sm text-gray-700">{edu.college}</p>
              {edu.cgpa && (
                <p className="text-xs text-gray-600">CGPA: {edu.cgpa}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements */}
      {(data.certifications.length > 0 || data.achievements.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
                CERTIFICATIONS
              </h2>
              <ul className="text-sm text-gray-800 space-y-1">
                {data.certifications.map((cert, index) => (
                  <li key={index}>• {cert}</li>
                ))}
              </ul>
            </div>
          )}
          {data.achievements.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-3 tracking-wide border-b border-gray-300 pb-1">
                ACHIEVEMENTS
              </h2>
              <ul className="text-sm text-gray-800 space-y-1">
                {data.achievements.map((achievement, index) => (
                  <li key={index}>• {achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ModernBlueTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white min-h-full font-sans">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">
          {data.personalInfo.name || "YOUR NAME"}
        </h1>
        <p className="text-xl mb-3 text-blue-100">
          {data.personalInfo.jobTitle || "Professional Title"}
        </p>
        <div className="text-sm text-blue-100 grid grid-cols-2 gap-4">
          <div>
            <div>{data.personalInfo.email}</div>
            <div>{data.personalInfo.phone}</div>
          </div>
          <div>
            <div>{data.personalInfo.location}</div>
            <div>{data.personalInfo.linkedin}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded mr-3" />
              <h2 className="text-lg font-bold text-gray-900">PROFESSIONAL SUMMARY</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-700 ml-7">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && data.experience[0].role && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded mr-3" />
              <h2 className="text-lg font-bold text-gray-900">EXPERIENCE</h2>
            </div>
            <div className="ml-7">
              {data.experience.map((exp, index) => (
                <div key={index} className="mb-4 border-l-2 border-blue-200 pl-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-base text-blue-800">{exp.role}</h3>
                    <span className="text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 font-medium">{exp.company}</p>
                  {exp.description && (
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {exp.description.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className="mb-1">{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded mr-3" />
              <h2 className="text-lg font-bold text-gray-900">SKILLS</h2>
            </div>
            <div className="ml-7 grid grid-cols-1 gap-3">
              {data.skills.technical.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.technical.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.soft.length > 0 && (
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.soft.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && data.projects[0].title && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded mr-3" />
              <h2 className="text-lg font-bold text-gray-900">PROJECTS</h2>
            </div>
            <div className="ml-7">
              {data.projects.map((project, index) => (
                <div key={index} className="mb-4 p-3 border-l-4 border-blue-300 bg-blue-50">
                  <h3 className="font-bold text-sm text-blue-800">{project.title}</h3>
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 mb-2">
                      {project.techStack.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-blue-200 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && data.education[0].degree && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-blue-600 rounded mr-3" />
              <h2 className="text-lg font-bold text-gray-900">EDUCATION</h2>
            </div>
            <div className="ml-7">
              {data.education.map((edu, index) => (
                <div key={index} className="mb-3 p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <span className="text-sm text-blue-600 font-medium">{edu.year}</span>
                  </div>
                  <p className="text-sm text-gray-700">{edu.college}</p>
                  {edu.cgpa && (
                    <p className="text-xs text-gray-600 mt-1">CGPA: {edu.cgpa}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResumeTemplate({ data, template }: ResumeTemplateProps) {
  switch (template) {
    case 'executive-minimal':
      return <ExecutiveMinimalTemplate data={data} />;
    case 'modern-blue':
      return <ModernBlueTemplate data={data} />;
    // Add more templates as needed
    default:
      return <ExecutiveMinimalTemplate data={data} />;
  }
}
