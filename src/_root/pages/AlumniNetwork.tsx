import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAlumniProfiles,
  getCareerPaths,
  getAlumniEvents,
  getAlumniNetworks,
  getUserMentorships,
  getMentorshipSessions,
} from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AlumniNetwork = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<
    "alumni" | "careerpath" | "events" | "networks" | "mentorship"
  >("alumni");
  const [searchIndustry, setSearchIndustry] = useState("");
  const [searchCompany, setSearchCompany] = useState("");

  const { data: alumni, isLoading: alumniLoading } = useQuery({
    queryKey: ["alumni", searchIndustry, searchCompany],
    queryFn: () =>
      getAlumniProfiles({
        industry: searchIndustry || undefined,
        company: searchCompany || undefined,
      }),
  });

  const { data: careerPaths } = useQuery({
    queryKey: ["career-paths"],
    queryFn: getCareerPaths,
  });

  const { data: events } = useQuery({
    queryKey: ["alumni-events"],
    queryFn: getAlumniEvents,
  });

  const { data: networks } = useQuery({
    queryKey: ["alumni-networks"],
    queryFn: getAlumniNetworks,
  });

  const { data: myMentorships } = useQuery({
    queryKey: ["my-mentorships", user?.id],
    queryFn: () => getUserMentorships(user?.id!, "mentee"),
    enabled: !!user?.id,
  });

  const { data: mySessions } = useQuery({
    queryKey: ["mentorship-sessions", myMentorships?.[0]?.id],
    queryFn: () => getMentorshipSessions(myMentorships?.[0]?.id!),
    enabled: !!myMentorships?.[0]?.id,
  });

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-6">
          Alumni Network & Mentorship
        </h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-dark-4 overflow-x-auto">
          {(
            [
              "alumni",
              "careerpath",
              "events",
              "networks",
              "mentorship",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-light-3 hover:text-light-1"
              }`}>
              {tab === "careerpath"
                ? "Career Paths"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Alumni Directory Tab */}
        {activeTab === "alumni" && (
          <>
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Search by industry..."
                  value={searchIndustry}
                  onChange={(e) => setSearchIndustry(e.target.value)}
                  className="rounded-lg bg-dark-3 border border-dark-4 text-white"
                />
                <Input
                  type="text"
                  placeholder="Search by company..."
                  value={searchCompany}
                  onChange={(e) => setSearchCompany(e.target.value)}
                  className="rounded-lg bg-dark-3 border border-dark-4 text-white"
                />
              </div>
            </div>

            {alumniLoading ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumni?.map((alumnus) => (
                  <div
                    key={alumnus.id}
                    className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                    <h3 className="h4-bold text-light-1 mb-2">
                      Alumni Profile
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-light-3">
                        Graduation Year: {alumnus.graduation_year}
                      </p>
                      {alumnus.current_company && (
                        <p className="text-light-3">
                          Company: {alumnus.current_company}
                        </p>
                      )}
                      {alumnus.current_position && (
                        <p className="text-light-3">
                          Position: {alumnus.current_position}
                        </p>
                      )}
                      {alumnus.industry && (
                        <p className="text-light-3">
                          Industry: {alumnus.industry}
                        </p>
                      )}
                      {alumnus.expertise_areas && alumnus.expertise_areas.length > 0 && (
                        <div className="mt-2">
                          <p className="text-light-2 text-xs font-semibold mb-1">
                            Expertise:
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            {alumnus.expertise_areas
                              .slice(0, 3)
                              .map((area: any, idx: number) => (
                                <span key={idx} className="text-xs bg-dark-4 px-2 py-1 rounded">
                                  {area}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {alumnus.willing_to_mentor && (
                      <div className="mt-3 pt-3 border-t border-dark-4">
                        <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded w-full">
                          Request Mentorship
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!alumniLoading && alumni?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-3">No alumni found</p>
              </div>
            )}
          </>
        )}

        {/* Career Paths Tab */}
        {activeTab === "careerpath" && (
          <div className="space-y-4">
            {careerPaths?.map((path) => (
              <div
                key={path.id}
                className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                <h3 className="h4-bold text-light-1 mb-2">Career Journey</h3>
                {path.path_description && (
                  <p className="text-light-3 text-sm mb-3">
                    {path.path_description}
                  </p>
                )}

                {path.key_milestones && path.key_milestones.length > 0 && (
                  <div className="mb-3">
                    <p className="text-light-2 text-xs font-semibold mb-2">
                      Key Milestones:
                    </p>
                    <div className="space-y-1">
                      {path.key_milestones.map((milestone: any, idx: number) => (
                        <p key={idx} className="text-light-4 text-sm">
                          ✓ {milestone}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {path.challenges_overcome && (
                  <div className="mb-3">
                    <p className="text-light-2 text-xs font-semibold mb-1">
                      Challenges Overcome:
                    </p>
                    <p className="text-light-4 text-sm">
                      {path.challenges_overcome}
                    </p>
                  </div>
                )}

                {path.advice && (
                  <div className="p-3 rounded bg-dark-4 border border-dark-3 border-l-purple-500 border-l-4">
                    <p className="text-light-2 text-xs font-semibold mb-1">
                      💡 Advice:
                    </p>
                    <p className="text-light-3 text-sm">{path.advice}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Alumni Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {events?.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="h4-bold text-light-1">{event.title}</h3>
                  <span className="text-xs bg-purple-500 px-2 py-1 rounded capitalize">
                    {event.event_type}
                  </span>
                </div>
                {event.description && (
                  <p className="text-light-3 text-sm mb-2">
                    {event.description}
                  </p>
                )}
                <p className="text-light-4 text-sm">
                  📅 {new Date(event.event_date).toLocaleDateString()} at{" "}
                  {new Date(event.event_date).toLocaleTimeString()}
                </p>
                <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded mt-3">
                  RSVP
                </Button>
              </div>
            ))}

            {!events ||
              (events.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-light-3">No alumni events scheduled</p>
                </div>
              ))}
          </div>
        )}

        {/* Networks Tab */}
        {activeTab === "networks" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networks?.map((network) => (
              <div
                key={network.id}
                className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                <h3 className="h4-bold text-light-1 mb-2">{network.name}</h3>
                {network.description && (
                  <p className="text-light-3 text-sm mb-2">
                    {network.description}
                  </p>
                )}
                {network.industry_focus && (
                  <p className="text-light-4 text-sm mb-3">
                    Industry: {network.industry_focus}
                  </p>
                )}
                <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded w-full">
                  Join Network
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === "mentorship" && (
          <div>
            <h3 className="h4-bold text-light-1 mb-4">My Mentorships</h3>
            {myMentorships && myMentorships.length > 0 ? (
              <div className="space-y-4">
                {myMentorships.map((mentorship) => (
                  <div
                    key={mentorship.id}
                    className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                    <div className="mb-3">
                      <p className="text-light-2 font-semibold">
                        Mentor ID: {mentorship.mentor_id}
                      </p>
                      <p className="text-light-4 text-sm">
                        Started:{" "}
                        {new Date(mentorship.started_at).toLocaleDateString()}
                      </p>
                    </div>
                    {mentorship.goal && (
                      <p className="text-light-3 text-sm mb-3">
                        Goal: {mentorship.goal}
                      </p>
                    )}

                    {/* Sessions */}
                    <div className="mt-4 pt-4 border-t border-dark-4">
                      <p className="text-light-2 text-sm font-semibold mb-2">
                        Recent Sessions
                      </p>
                      {mySessions && mySessions.length > 0 ? (
                        <div className="space-y-2">
                          {mySessions.slice(0, 3).map((session) => (
                            <div
                              key={session.id}
                              className="p-2 rounded bg-dark-4">
                              <p className="text-light-3 text-xs">
                                {new Date(
                                  session.session_date
                                ).toLocaleDateString()}
                              </p>
                              {session.topic && (
                                <p className="text-light-2 text-sm font-semibold">
                                  {session.topic}
                                </p>
                              )}
                              {session.notes && (
                                <p className="text-light-4 text-xs mt-1">
                                  {session.notes}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-light-4 text-xs">
                          No sessions logged yet
                        </p>
                      )}
                    </div>

                    <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded mt-3">
                      Log Session
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-light-3">No active mentorships</p>
                <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded mt-4">
                  Find a Mentor
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniNetwork;
