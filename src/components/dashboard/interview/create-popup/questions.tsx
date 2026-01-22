import QuestionCard from "@/components/dashboard/interview/create-popup/questionCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInterviews } from "@/contexts/interviews.context";
import { InterviewBase, Question } from "@/types/interview";
import { useClerk, useOrganization } from "@clerk/nextjs";
import axios from "axios";
import { ChevronLeft, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  interviewData: InterviewBase;
  setProceed: (proceed: boolean) => void;
  setOpen: (open: boolean) => void;
}

function QuestionsPopup({ interviewData, setProceed, setOpen }: Props) {
  const { user } = useClerk();
  const { organization } = useOrganization();
  const [isClicked, setIsClicked] = useState(false);

  const [questions, setQuestions] = useState<Question[]>(
    interviewData.questions,
  );
  const [description, setDescription] = useState<string>(
    interviewData.description.trim(),
  );
  const { fetchInterviews } = useInterviews();

  const endOfListRef = useRef<HTMLDivElement>(null);
  const prevQuestionLengthRef = useRef(questions.length);

  const handleInputChange = (id: string, newQuestion: Question) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, ...newQuestion } : question,
      ),
    );
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length === 1) {
      setQuestions(
        questions.map((question) => ({
          ...question,
          question: "",
          follow_up_count: 1,
        })),
      );

      return;
    }
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const handleAddQuestion = () => {
    if (questions.length < interviewData.question_count) {
      setQuestions([
        ...questions,
        { id: uuidv4(), question: "", follow_up_count: 1 },
      ]);
    }
  };

  const onSave = async () => {
    try {
      interviewData.user_id = user?.id || "";
      interviewData.organization_id = organization?.id || "";

      interviewData.questions = questions;
      interviewData.description = description;

      // Convert BigInts to strings if necessary
      const sanitizedInterviewData = {
        ...interviewData,
        interviewer_id: interviewData.interviewer_id.toString(),
        response_count: interviewData.response_count.toString(),
        logo_url: organization?.imageUrl || "",
      };

      const response = await axios.post("/api/create-interview", {
        organizationName: organization?.name,
        interviewData: sanitizedInterviewData,
      });
      setIsClicked(false);
      fetchInterviews();
      setOpen(false);
    } catch (error) {
      console.error("Error creating interview:", error);
    }
  };

  useEffect(() => {
    if (questions.length > prevQuestionLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevQuestionLengthRef.current = questions.length;
  }, [questions.length]);

  return (
    <div className="p-4">
      <div
        className={`text-center px-2 flex flex-col justify-top items-center w-[42rem] ${
          interviewData.question_count > 1 ? "min-h-[32rem]" : ""
        } `}
      >
        <div className="relative flex justify-center w-full mb-2">
          <ChevronLeft
            className="absolute left-0 opacity-50 cursor-pointer hover:opacity-100 text-gray-600 mr-36"
            size={30}
            onClick={() => {
              setProceed(false);
            }}
          />
          <h1 className="text-2xl font-semibold">Create Interview</h1>
        </div>
        <div className="my-4 text-left w-[96%] text-sm text-gray-600">
          We will be using these questions during the interviews. Please make
          sure they are ok.
        </div>
        <ScrollArea className="flex flex-col justify-center items-center w-full mt-2 max-h-[280px]">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              questionNumber={index + 1}
              questionData={question}
              onDelete={handleDeleteQuestion}
              onQuestionChange={handleInputChange}
            />
          ))}
          <div ref={endOfListRef} />
        </ScrollArea>
        {questions.length < interviewData.question_count ? (
          <div
            className="border-indigo-600 opacity-75 hover:opacity-100 w-fit  rounded-full"
            onClick={handleAddQuestion}
          >
            <Plus
              size={45}
              strokeWidth={2.2}
              className="text-indigo-600  cursor-pointer"
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="px-2 mt-4">
        <p className="mb-2 font-medium text-sm">
          Interview Description{" "}
          <span
            style={{ fontSize: "0.7rem", lineHeight: "0.66rem" }}
            className="font-light text-xs italic text-gray-500 block mt-1"
          >
            Note: Interviewees will see this description.
          </span>
        </p>
        <textarea
          value={description}
          className="h-fit py-2 border-2 rounded-md px-3 w-full border-gray-300 focus:border-indigo-400 focus:outline-none transition-colors"
          placeholder="Enter your interview description."
          rows={4}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onBlur={(e) => {
            setDescription(e.target.value.trim());
          }}
        />
        <div className="flex flex-row justify-end items-end w-full mt-4">
          <Button
            disabled={
              isClicked ||
              questions.length < interviewData.question_count ||
              description.trim() === "" ||
              questions.some((question) => question.question.trim() === "")
            }
            className="bg-indigo-600 hover:bg-indigo-800 px-6 py-2"
            onClick={() => {
              setIsClicked(true);
              onSave();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
export default QuestionsPopup;
