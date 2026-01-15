"use client";

import CreateInterviewModal from "@/components/dashboard/interview/createInterviewModal";
import Modal from "@/components/dashboard/Modal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";

function CreateInterviewCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="flex items-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 ease-in-out duration-300 h-60 w-56 rounded-xl shrink-0 overflow-hidden bg-gray-50/50 hover:bg-white group"
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardContent className="flex items-center flex-col mx-auto">
          <div className="flex flex-col justify-center items-center w-full overflow-hidden">
            <div className="p-3 rounded-full bg-gray-100 group-hover:bg-indigo-100 transition-colors duration-300">
              <Plus size={50} strokeWidth={1} className="text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </div>
          </div>
          <CardTitle className="p-0 text-md text-center mt-4 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
            Create an Interview
          </CardTitle>
        </CardContent>
      </Card>
      <Modal
        open={open}
        closeOnOutsideClick={false}
        onClose={() => {
          setOpen(false);
        }}
      >
        <CreateInterviewModal open={open} setOpen={setOpen} />
      </Modal>
    </>
  );
}

export default CreateInterviewCard;
