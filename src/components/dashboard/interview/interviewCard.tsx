import MiniLoader from "@/components/loaders/mini-loader/miniLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { InterviewerService } from "@/services/interviewers.service";
import { ResponseService } from "@/services/responses.service";
import axios from "axios";
import { ArrowUpRight, Copy, CopyCheck } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  name: string | null;
  interviewerId: bigint;
  id: string;
  url: string;
  readableSlug: string;
}

const base_url = process.env.NEXT_PUBLIC_LIVE_URL;

function InterviewCard({ name, interviewerId, id, url, readableSlug }: Props) {
  const [copied, setCopied] = useState(false);
  const [responseCount, setResponseCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [img, setImg] = useState("");

  useEffect(() => {
    const fetchInterviewer = async () => {
      const interviewer =
        await InterviewerService.getInterviewer(interviewerId);
      setImg(interviewer.image);
    };
    fetchInterviewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResponses = useCallback(async () => {
    try {
      const responses = await ResponseService.getAllResponses(id);
      setResponseCount(responses.length);
      if (responses.length > 0) {
        setIsFetching(true);
        for (const response of responses) {
          if (!response.is_analysed) {
            try {
              const result = await axios.post("/api/get-call", {
                id: response.call_id,
              });

              if (result.status !== 200) {
                throw new Error(`HTTP error! status: ${result.status}`);
              }
            } catch (error) {
              console.error(
                `Failed to call api/get-call for response id ${response.call_id}:`,
                error,
              );
            }
          }
        }
        setIsFetching(false);
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  // Add visibility change listener to refresh response count
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh response count
        fetchResponses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchResponses]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(
        readableSlug ? `${base_url}/call/${readableSlug}` : (url as string),
      )
      .then(
        () => {
          setCopied(true);
          toast.success(
            "The link to your interview has been copied to your clipboard.",
            {
              position: "bottom-right",
              duration: 3000,
            },
          );
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        },
        (err) => {
          console.log("failed to copy", err.mesage);
        },
      );
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const interviewUrl = readableSlug
      ? `/call/${readableSlug}`
      : `/call/${url}`;
    window.open(interviewUrl, "_blank");
  };

  return (
    <a
      href={`/interviews/${id}`}
      style={{
        pointerEvents: isFetching ? "none" : "auto",
        cursor: isFetching ? "default" : "pointer",
      }}
    >
      <Card className="relative p-0 inline-block cursor-pointer h-60 w-56 rounded-xl shrink-0 overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 group">
        <CardContent className={`p-0 ${isFetching ? "opacity-60" : ""}`}>
          <div className="w-full h-40 overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-700 dark:to-indigo-800 flex items-center text-center">
            <CardTitle className="w-full mt-3 mx-2 text-white text-lg font-semibold">
              {name}
              {isFetching && (
                <div className="z-100 mt-[-5px]">
                  <MiniLoader />
                </div>
              )}
            </CardTitle>
          </div>
          <div className="flex flex-row items-center mx-4">
            <div className="w-full overflow-hidden">
              <Image
                src={img}
                alt="Picture of the interviewer"
                width={70}
                height={70}
                className="object-cover object-center rounded-lg"
              />
            </div>
            <div className="text-gray-800 dark:text-gray-200 text-sm font-semibold mt-2 mr-2 whitespace-nowrap">
              Responses:{" "}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                {responseCount?.toString() || 0}
              </span>
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5">
            <Button
              className="text-xs text-indigo-600 dark:text-indigo-400 px-1.5 h-7 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-white/50 dark:border-slate-600/50"
              variant={"secondary"}
              onClick={handleJumpToInterview}
            >
              <ArrowUpRight size={16} />
            </Button>
            <Button
              className={`text-xs px-1.5 h-7 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 shadow-sm border border-white/50 dark:border-slate-600/50 ${
                copied ? "bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500" : "text-indigo-600 dark:text-indigo-400"
              }`}
              variant={"secondary"}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                copyToClipboard();
              }}
            >
              {copied ? <CopyCheck size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default InterviewCard;
