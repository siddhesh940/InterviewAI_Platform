"use client";

import ResumeFields, { TabKey } from "@/config/resume-fields";
import { useResumeBuilderContext } from "@/contexts/ResumeBuilderContext";
import { motion } from "framer-motion";
import { useCallback } from "react";
import FormInput from "./FormInput";

interface SingleEditorProps {
  tab: TabKey;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

export default function SingleEditor({ tab }: SingleEditorProps) {
  const { resumeData, updateField } = useResumeBuilderContext();
  const { fields } = ResumeFields[tab];

  // Get current data for this tab - use unknown first then Record for safer type casting
  const tabData = (resumeData[tab] as unknown as Record<string, string>) || {};

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      updateField(tab, name, value);
    },
    [tab, updateField]
  );

  return (
    <motion.div 
      className="grid md:grid-cols-2 gap-4 md:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {fields.map((field) => (
        <motion.div key={`${tab}-${field.name}`} variants={itemVariants}>
          <FormInput
            {...field}
            value={tabData[field.name] || ""}
            onChange={handleChange}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
