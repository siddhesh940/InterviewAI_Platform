"use client";

import ResumeFields, { TabKey } from "@/config/resume-fields";
import MultiEditor from "./MultiEditor";
import SingleEditor from "./SingleEditor";

interface EditorFormProps {
  tab: TabKey;
}

export default function EditorForm({ tab }: EditorFormProps) {
  // Redirect check happens at page level
  const config = ResumeFields[tab];
  
  if (!config) {
    return (
      <div className="text-center py-8 text-gray-500">
        Invalid section selected.
      </div>
    );
  }

  const isMultiple = config.multiple;

  return (
    <div className="w-full">
      {isMultiple ? (
        <MultiEditor tab={tab} />
      ) : (
        <SingleEditor tab={tab} />
      )}
    </div>
  );
}
