import ResumeFields, { TAB_ORDER, TabKey } from "@/config/resume-fields";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function EditorTabs({ activeTab, onTabChange }: TabsProps) {
  return (
    <motion.div 
      className="flex w-full gap-1.5 overflow-x-auto pb-1 scrollbar-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {TAB_ORDER.map((tab, index) => (
        <motion.button
          key={tab}
          type="button"
          className={cn(
            "relative cursor-pointer rounded-xl px-4 py-2 text-sm font-medium capitalize transition-all duration-200 whitespace-nowrap overflow-hidden",
            activeTab === tab
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 border border-transparent hover:border-gray-300"
          )}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onTabChange(tab)}
        >
          {/* Active tab shimmer effect */}
          {activeTab === tab && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
          )}
          <span className="relative z-10">{ResumeFields[tab].name}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
