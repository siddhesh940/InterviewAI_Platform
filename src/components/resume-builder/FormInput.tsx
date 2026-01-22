import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FieldConfig } from "@/types/resume-builder";
import { motion } from "framer-motion";

interface FormInputProps extends FieldConfig {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  required,
  span,
  rows = 4,
  multipoints,
  value,
  onChange,
}: FormInputProps) {
  const inputId = `field-${name}`;

  return (
    <motion.div 
      className={cn("space-y-2", span && "md:col-span-2")}
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <Label htmlFor={inputId} className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {label}
        {required && (
          <motion.span 
            className="text-red-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            *
          </motion.span>
        )}
      </Label>

      {type === "textarea" ? (
        <motion.div whileTap={{ scale: 0.995 }}>
          <Textarea
            id={inputId}
            name={name}
            value={value || ""}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "w-full resize-none transition-all duration-200",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md",
              multipoints && "font-mono text-sm"
            )}
            onChange={onChange}
          />
        </motion.div>
      ) : (
        <motion.div whileTap={{ scale: 0.995 }}>
          <Input
            id={inputId}
            name={name}
            type={type}
            value={value || ""}
            placeholder={placeholder}
            className={cn(
              "w-full transition-all duration-200",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md"
            )}
            onChange={onChange}
          />
        </motion.div>
      )}

      {multipoints && (
        <motion.p 
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Start each point with • or press Enter for new points
        </motion.p>
      )}
    </motion.div>
  );
}
