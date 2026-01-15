"use client";

import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import Modal from "@/components/dashboard/Modal";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useInterviews } from "@/contexts/interviews.context";
import { ClientService } from "@/services/clients.service";
import { InterviewService } from "@/services/interviews.service";
import { ResponseService } from "@/services/responses.service";
import { useOrganization } from "@clerk/nextjs";
import { Gem, Plus, TrendingUp, Users, Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

function Interviews() {
  const { interviews, interviewsLoading } = useInterviews();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [allowedResponsesCount, setAllowedResponsesCount] =
    useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function InterviewsLoader() {
    return (
      <>
        <div className="flex flex-row gap-4">
          <div className="h-60 w-56 flex-none animate-pulse rounded-xl bg-gray-200/80 border border-gray-200" />
          <div className="h-60 w-56 flex-none animate-pulse rounded-xl bg-gray-200/80 border border-gray-200 delay-75" />
          <div className="h-60 w-56 flex-none animate-pulse rounded-xl bg-gray-200/80 border border-gray-200 delay-150" />
        </div>
      </>
    );
  }

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        if (organization?.id) {
          const data = await ClientService.getOrganizationById(organization.id);
          if (data?.plan) {
            setCurrentPlan(data.plan);
            if (data.plan === "free_trial_over") {
              setIsModalOpen(true);
            }
          }
          if (data?.allowed_responses_count) {
            setAllowedResponsesCount(data.allowed_responses_count);
          }
        }
      } catch (error) {
        console.error("Error fetching organization data:", error);
      }
    };

    fetchOrganizationData();
  }, [organization]);

  useEffect(() => {
    const fetchResponsesCount = async () => {
      if (!organization || currentPlan !== "free") {
        return;
      }

      setLoading(true);
      try {
        const totalResponses =
          await ResponseService.getResponseCountByOrganizationId(
            organization.id,
          );
        const hasExceededLimit = totalResponses >= allowedResponsesCount;
        if (hasExceededLimit) {
          setCurrentPlan("free_trial_over");
          await InterviewService.deactivateInterviewsByOrgId(organization.id);
          await ClientService.updateOrganization(
            { plan: "free_trial_over" },
            organization.id,
          );
        }
      } catch (error) {
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsesCount();
  }, [organization, currentPlan, allowedResponsesCount]);

  return (
    <main className="page-container">
      <div className="content-container">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl section-icon">
              <Video className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                My Interviews
              </h2>
              <h3 className="text-gray-600 mt-1">
                Start getting responses now!
              </h3>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 grid-animate">
          <Card className="card-bordered hover:border-indigo-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-xl icon-hover-scale">
                  <Video className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{interviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-green-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-xl icon-hover-scale">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Responses</p>
                  <p className="text-2xl font-bold text-gray-900">{allowedResponsesCount - (allowedResponsesCount > 0 ? 0 : 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-bordered hover:border-purple-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-xl icon-hover-scale">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{currentPlan || 'Free'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Cards Grid */}
        <div className="relative flex items-center flex-wrap gap-4 animate-fade-in-up delay-150">
          {currentPlan == "free_trial_over" ? (
            <Card className="card-bordered flex bg-gray-50 items-center border-dashed border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg ease-in-out duration-300 h-60 w-56 rounded-xl shrink-0 overflow-hidden">
              <CardContent className="flex items-center flex-col mx-auto">
                <div className="flex flex-col justify-center items-center w-full overflow-hidden">
                  <Plus size={90} strokeWidth={0.5} className="text-gray-400" />
                </div>
                <CardTitle className="p-0 text-md text-center text-gray-600">
                  You cannot create any more interviews unless you upgrade
                </CardTitle>
              </CardContent>
            </Card>
          ) : (
            <CreateInterviewCard />
          )}
          {interviewsLoading || loading ? (
            <InterviewsLoader />
          ) : (
            <>
              {isModalOpen && (
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                  <div className="flex flex-col space-y-4 animate-fade-in-up">
                    <div className="flex justify-center text-indigo-600">
                      <div className="p-4 bg-indigo-50 rounded-full">
                        <Gem className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center text-gray-900">
                      Upgrade to Pro
                    </h3>
                    <p className="text-gray-600 text-center">
                      You have reached your limit for the free trial. Please
                      upgrade to pro to continue using our features.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex justify-center items-center">
                        <Image
                          src={"/premium-plan-icon.png"}
                          alt="Graphic"
                          width={299}
                          height={300}
                          className="drop-shadow-lg"
                        />
                      </div>

                      <div className="grid grid-rows-2 gap-3">
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                          <h4 className="text-lg font-semibold text-gray-900">Free Plan</h4>
                          <ul className="list-disc pl-5 mt-2 text-gray-600 text-sm space-y-1">
                            <li>10 Responses</li>
                            <li>Basic Support</li>
                            <li>Limited Features</li>
                          </ul>
                        </div>
                        <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50">
                          <h4 className="text-lg font-semibold text-indigo-900">Pro Plan</h4>
                          <ul className="list-disc pl-5 mt-2 text-indigo-700 text-sm space-y-1">
                            <li>Flexible Pay-Per-Response</li>
                            <li>Priority Support</li>
                            <li>All Features</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-center mt-4">
                      Contact{" "}
                      <span className="font-semibold text-indigo-600">founders@folo-up.co</span>{" "}
                      to upgrade your plan.
                    </p>
                  </div>
                </Modal>
              )}
              {interviews.map((item, index) => (
                <div 
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <InterviewCard
                    id={item.id}
                    interviewerId={item.interviewer_id}
                    name={item.name}
                    url={item.url ?? ""}
                    readableSlug={item.readable_slug}
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default Interviews;
