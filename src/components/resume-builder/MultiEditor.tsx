"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ResumeFields, { TabKey } from "@/config/resume-fields";
import { useResumeBuilderContext } from "@/contexts/ResumeBuilderContext";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Minimize2,
  Pencil,
  Plus,
  Trash2
} from "lucide-react";
import { useCallback, useState } from "react";
import FormInput from "./FormInput";

interface MultiEditorProps {
  tab: TabKey;
}

export default function MultiEditor({ tab }: MultiEditorProps) {
  const { resumeData, updateField, addItem, deleteItem, moveItem } = useResumeBuilderContext();
  const { fields } = ResumeFields[tab];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Get array data for this tab - casting through unknown for safety
  const items = (resumeData[tab] as unknown as Record<string, string>[]) || [];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
      const { name, value } = e.target;
      updateField(tab, name, value, index);
    },
    [tab, updateField]
  );

  const handleAdd = () => {
    addItem(tab);
    // Auto-expand newly added item
    setExpandedIndex(items.length);
  };

  const handleDelete = (index: number) => {
    deleteItem(tab, index);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    moveItem(tab, index, direction);
    // Update expanded index if moved
    if (expandedIndex === index) {
      setExpandedIndex(direction === 'up' ? index - 1 : index + 1);
    }
  };

  // Get display title for each item
  const getDisplayTitle = (item: Record<string, string>) => {
    const titleField = fields[0];
    const title = item[titleField?.name] || `New ${ResumeFields[tab].name.replace(/s$/, '')}`;
    
return title || `Untitled`;
  };

  return (
    <div className="space-y-4">
      {/* Add New Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500 py-3"
        onClick={handleAdd}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add {ResumeFields[tab].name.replace(/s$/, '')}
      </Button>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No {tab} added yet. Click the button above to add one.</p>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map((item, index) => {
          // Create a stable key from item content
          const itemKey = `${tab}-${item.id || item.title || item.company || item.institution || index}`;

          return (
            <Card
              key={itemKey}
              className={cn(
                "transition-all duration-300 cursor-pointer",
                expandedIndex === index 
                  ? "ring-2 ring-blue-500 shadow-lg" 
                  : "hover:shadow-md hover:border-gray-300"
              )}
            >
            {/* Header */}
              <div
                className="flex items-center justify-between p-4"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-900 truncate flex-1">
                  {getDisplayTitle(item)}
                </span>

                <div className="flex items-center gap-2 ml-4">
                  {/* Move Up */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={index === 0}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, 'up');
                    }}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>

                  {/* Move Down */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={index === items.length - 1}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMove(index, 'down');
                    }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* Edit/Collapse Toggle */}
                  {expandedIndex === index ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedIndex(null);
                      }}
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Delete */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expanded Form */}
              {expandedIndex === index && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {fields.map((field) => (
                      <FormInput
                        key={`${tab}-item-${itemKey}-${field.name}`}
                        {...field}
                        value={item[field.name] || ""}
                        onChange={(e) => handleChange(e, index)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
