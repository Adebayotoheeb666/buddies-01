import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getResearchOpportunities,
  getStartupOpportunities,
  getCoFounderMatches,
  getPitchCompetitions,
  getUserResearchApplications,
} from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";

const ResearchStartups = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<
    "research" | "startups" | "cofounders" | "pitches" | "myapps"
  >("research");
  const [selectedStage, setSelectedStage] = useState("");

  const { data: research, isLoading: researchLoading } = useQuery({
    queryKey: ["research-opportunities"],
    queryFn: getResearchOpportunities,
  });

  const { data: startups } = useQuery({
    queryKey: ["startup-opportunities", selectedStage],
    queryFn: () => getStartupOpportunities(selectedStage || undefined),
  });

  const { data: cofounders } = useQuery({
    queryKey: ["cofounder-matches"],
    queryFn: getCoFounderMatches,
  });

  const { data: competitions } = useQuery({
    queryKey: ["pitch-competitions"],
    queryFn: getPitchCompetitions,
  });

  const { data: myResearchApps } = useQuery({
    queryKey: ["my-research-applications", user?.id],
    queryFn: () => getUserResearchApplications(user?.id!),
    enabled: !!user?.id,
  });

  const stages = ["idea", "prototype", "mvp", "funded"];

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-6">
          Research & Startup Opportunities
        </h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-dark-4 overflow-x-auto">
          {(
            ["research", "startups", "cofounders", "pitches", "myapps"] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-light-3 hover:text-light-1"
              }`}>
              {tab === "myapps"
                ? "My Applications"
                : tab === "cofounders"
                ? "Co-Founders"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Research Opportunities Tab */}
        {activeTab === "research" && (
          <>
            {researchLoading ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                {research?.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="h4-bold text-light-1">{opp.title}</h3>
                        {opp.lab_name && (
                          <p className="text-light-3 text-sm">{opp.lab_name}</p>
                        )}
                      </div>
                      <span className="text-xs bg-blue-500 px-2 py-1 rounded capitalize">
                        {opp.position_type}
                      </span>
                    </div>

                    {opp.description && (
                      <p className="text-light-3 text-sm mb-3 line-clamp-2">
                        {opp.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                      {opp.start_date && (
                        <p className="text-light-4">
                          📅 {new Date(opp.start_date).toLocaleDateString()}
                        </p>
                      )}
                      {opp.duration && (
                        <p className="text-light-4">⏱️ {opp.duration}</p>
                      )}
                      {opp.stipend && (
                        <p className="text-light-4">💰 ${opp.stipend}</p>
                      )}
                      <p className="text-light-4">
                        📊 {opp.applications_count} applied
                      </p>
                    </div>

                    {opp.required_skills && opp.required_skills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-light-2 text-xs font-semibold mb-1">
                          Required Skills:
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {opp.required_skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-dark-4 px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded">
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!researchLoading && research?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-3">
                  No research opportunities available
                </p>
              </div>
            )}
          </>
        )}

        {/* Startups Tab */}
        {activeTab === "startups" && (
          <>
            <div className="mb-6 flex gap-2 flex-wrap">
              <Button
                onClick={() => setSelectedStage("")}
                className={`rounded-lg px-3 py-2 text-sm ${
                  selectedStage === ""
                    ? "bg-purple-500 text-white"
                    : "bg-dark-3 text-light-2"
                }`}>
                All Stages
              </Button>
              {stages.map((stage) => (
                <Button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`rounded-lg px-3 py-2 text-sm capitalize ${
                    selectedStage === stage
                      ? "bg-purple-500 text-white"
                      : "bg-dark-3 text-light-2"
                  }`}>
                  {stage}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {startups?.map((startup) => (
                <div
                  key={startup.id}
                  className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="h4-bold text-light-1">
                        {startup.startup_name}
                      </h3>
                      <p className="text-light-4 text-sm">
                        By: Founder ID {startup.creator_id}
                      </p>
                    </div>
                    <span className="text-xs bg-green-500 px-2 py-1 rounded capitalize">
                      {startup.stage}
                    </span>
                  </div>

                  {startup.description && (
                    <p className="text-light-3 text-sm mb-3">
                      {startup.description}
                    </p>
                  )}

                  {startup.looking_for && startup.looking_for.length > 0 && (
                    <div className="mb-3">
                      <p className="text-light-2 text-xs font-semibold mb-1">
                        Looking for:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {startup.looking_for.map((role, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-dark-4 px-2 py-1 rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {startup.equity_offered && (
                    <p className="text-light-3 text-sm mb-3">
                      💰 Offering: {startup.equity_offered}% equity
                    </p>
                  )}

                  <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded">
                    Learn More
                  </Button>
                </div>
              ))}
            </div>

            {!startups ||
              (startups.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-light-3">No startups in this stage</p>
                </div>
              ))}
          </>
        )}

        {/* Co-Founders Tab */}
        {activeTab === "cofounders" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cofounders?.map((cofounder) => (
              <div
                key={cofounder.id}
                className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                <h3 className="h4-bold text-light-1 mb-2">
                  Potential Co-Founder
                </h3>

                {cofounder.entrepreneurial_experience && (
                  <p className="text-light-3 text-sm mb-2">
                    Experience: {cofounder.entrepreneurial_experience}
                  </p>
                )}

                {cofounder.industry_interest &&
                  cofounder.industry_interest.length > 0 && (
                    <div className="mb-3">
                      <p className="text-light-2 text-xs font-semibold mb-1">
                        Industries:
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {cofounder.industry_interest.map((industry, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-dark-4 px-2 py-1 rounded">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {cofounder.ideal_cofounder_description && (
                  <p className="text-light-4 text-sm mb-3">
                    Seeking: {cofounder.ideal_cofounder_description}
                  </p>
                )}

                <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded w-full">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Pitch Competitions Tab */}
        {activeTab === "pitches" && (
          <div className="space-y-4">
            {competitions?.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                <h3 className="h4-bold text-light-1 mb-2">{comp.title}</h3>

                {comp.description && (
                  <p className="text-light-3 text-sm mb-3">
                    {comp.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                  <p className="text-light-4">
                    📅 {new Date(comp.competition_date).toLocaleDateString()}
                  </p>
                  {comp.prize_pool && (
                    <p className="text-light-4">
                      🏆 ${comp.prize_pool.toLocaleString()}
                    </p>
                  )}
                  {comp.max_teams && (
                    <p className="text-light-4">
                      👥 {comp.max_teams} teams max
                    </p>
                  )}
                  <p className="text-light-4">
                    📌 By{" "}
                    {new Date(comp.registration_deadline).toLocaleDateString()}
                  </p>
                </div>

                <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded">
                  Register
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* My Applications Tab */}
        {activeTab === "myapps" && (
          <div className="space-y-4">
            {myResearchApps && myResearchApps.length > 0 ? (
              myResearchApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-light-2 font-semibold">
                      Research Opportunity ID: {app.opportunity_id}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        app.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : app.status === "interview"
                          ? "bg-blue-500/20 text-blue-400"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-light-4 text-sm">
                    Applied: {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-light-3">No research applications yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchStartups;
