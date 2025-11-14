import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getJobPostings,
  getInternshipPostings,
  getApplicationTracking,
  getUserJobApplications,
} from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const JobBoard = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<"jobs" | "internships" | "myapplications" | "tracking">(
    "jobs"
  );
  const [selectedJobType, setSelectedJobType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", selectedJobType, searchLocation],
    queryFn: () => getJobPostings({ jobType: selectedJobType || undefined, location: searchLocation || undefined }),
  });

  const { data: internships } = useQuery({
    queryKey: ["internships"],
    queryFn: getInternshipPostings,
  });

  const { data: myApplications } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: () => getUserJobApplications(user?.id!),
    enabled: !!user?.id,
  });

  const { data: applicationTracking } = useQuery({
    queryKey: ["application-tracking", user?.id],
    queryFn: () => getApplicationTracking(user?.id!),
    enabled: !!user?.id,
  });

  const jobTypes = ["full-time", "part-time", "internship", "contract"];

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-6">Career & Job Board</h2>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-dark-4 overflow-x-auto">
          {(["jobs", "internships", "myapplications", "tracking"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition ${
                activeTab === tab
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-light-3 hover:text-light-1"
              }`}
            >
              {tab === "myapplications" ? "My Applications" : tab === "tracking" ? "Tracking" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === "jobs" && (
          <>
            <div className="mb-6 space-y-4">
              <Input
                type="text"
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="rounded-lg bg-dark-3 border border-dark-4 text-white"
              />

              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setSelectedJobType("")}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    selectedJobType === ""
                      ? "bg-purple-500 text-white"
                      : "bg-dark-3 text-light-2"
                  }`}
                >
                  All Jobs
                </Button>
                {jobTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedJobType(type)}
                    className={`rounded-lg px-3 py-2 text-sm capitalize ${
                      selectedJobType === type
                        ? "bg-purple-500 text-white"
                        : "bg-dark-3 text-light-2"
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {jobsLoading ? (
              <Loader />
            ) : (
              <div className="space-y-4">
                {jobs?.map((job) => (
                  <div key={job.id} className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="h4-bold text-light-1">{job.job_title}</h3>
                        <p className="text-light-3 text-sm">{job.company_name}</p>
                      </div>
                      <span className="text-xs bg-purple-500 px-2 py-1 rounded capitalize">
                        {job.job_type}
                      </span>
                    </div>

                    {job.description && (
                      <p className="text-light-3 text-sm mb-3 line-clamp-2">{job.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                      {job.location && <p className="text-light-4">📍 {job.location}</p>}
                      {job.salary_range && <p className="text-light-4">💰 {job.salary_range}</p>}
                      {job.application_deadline && (
                        <p className="text-light-4">
                          📅 {new Date(job.application_deadline).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-light-4">📊 {job.application_count} applications</p>
                    </div>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-light-2 text-xs font-semibold mb-1">Requirements:</p>
                        <div className="flex gap-2 flex-wrap">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <span key={idx} className="text-xs bg-dark-4 px-2 py-1 rounded">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="bg-purple-500 text-white px-4 py-2 text-sm rounded">
                      Apply Now
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {!jobsLoading && jobs?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-3">No jobs found matching your criteria</p>
              </div>
            )}
          </>
        )}

        {/* Internships Tab */}
        {activeTab === "internships" && (
          <div className="space-y-4">
            {internships?.map((internship) => (
              <div key={internship.id} className="p-4 rounded-lg bg-dark-3 border border-dark-4 hover:border-purple-500 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="h4-bold text-light-1">{internship.position_title}</h3>
                    <p className="text-light-3 text-sm">{internship.company_name}</p>
                  </div>
                  <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                    {internship.semester}
                  </span>
                </div>

                {internship.description && (
                  <p className="text-light-3 text-sm mb-3">{internship.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <p className="text-light-4">📚 GPA: {internship.gpa_requirement || "N/A"}</p>
                  <p className="text-light-4">📅 {new Date(internship.deadline).toLocaleDateString()}</p>
                </div>

                {internship.major_preferences && internship.major_preferences.length > 0 && (
                  <div className="mb-3">
                    <p className="text-light-2 text-xs font-semibold mb-1">Preferred Majors:</p>
                    <div className="flex gap-2 flex-wrap">
                      {internship.major_preferences.map((major, idx) => (
                        <span key={idx} className="text-xs bg-dark-4 px-2 py-1 rounded">
                          {major}
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

        {/* My Applications Tab */}
        {activeTab === "myapplications" && (
          <div className="space-y-4">
            {myApplications && myApplications.length > 0 ? (
              myApplications.map((app) => (
                <div key={app.id} className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-light-2 font-semibold">Job ID: {app.job_posting_id}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold ${
                        app.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : app.status === "interview"
                          ? "bg-blue-500/20 text-blue-400"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
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
                <p className="text-light-3">No applications yet</p>
              </div>
            )}
          </div>
        )}

        {/* Application Tracking Tab */}
        {activeTab === "tracking" && (
          <div className="space-y-4">
            {applicationTracking && applicationTracking.length > 0 ? (
              applicationTracking.map((track) => (
                <div key={track.id} className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-light-2 font-semibold">{track.position_title}</p>
                      <p className="text-light-3 text-sm">{track.company_name}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-semibold capitalize ${
                        track.status === "offer"
                          ? "bg-green-500/20 text-green-400"
                          : track.status === "interview"
                          ? "bg-blue-500/20 text-blue-400"
                          : track.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {track.status}
                    </span>
                  </div>
                  <p className="text-light-4 text-xs mb-2">
                    Updated: {new Date(track.status_date).toLocaleDateString()}
                  </p>
                  {track.notes && <p className="text-light-3 text-sm">📝 {track.notes}</p>}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-light-3">No tracked applications yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
