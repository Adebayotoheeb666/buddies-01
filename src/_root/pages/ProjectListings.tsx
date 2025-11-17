import { useState } from "react";
import { useGetProjectListings, useGetSkills, useCreateProjectListing } from "@/lib/react-query/queries";
import { useAuthContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProjectListings = () => {
  const { user } = useAuthContext();
  const { data: projectsData, isLoading } = useGetProjectListings();
  const { data: skillsData } = useGetSkills();
  const createMutation = useCreateProjectListing();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [] as string[],
  });

  const projects = projectsData?.documents || [];
  const skills = skillsData?.documents || [];

  const filteredProjects = selectedSkill
    ? projects.filter((p) =>
        p.required_skills.some(
          (s: string) =>
            s.toLowerCase().includes(selectedSkill.toLowerCase()) ||
            selectedSkill.toLowerCase().includes(s.toLowerCase())
        )
      )
    : projects;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recruiting":
        return "bg-green-500/20 text-green-400";
      case "in_progress":
        return "bg-yellow-500/20 text-yellow-400";
      case "completed":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        skills: formData.skills.length > 0 ? formData.skills : ["General"],
        creatorId: user.id,
        status: "recruiting",
      });
      alert("Project created successfully!");
      setFormData({ title: "", description: "", skills: [] });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const toggleSkill = (skillName: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillName)
        ? prev.skills.filter((s) => s !== skillName)
        : [...prev.skills, skillName],
    }));
  };

  return (
    <div className="flex flex-col gap-9 w-full max-w-6xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/add-post.svg"
          width={36}
          height={36}
          alt="projects"
        />
        <h2 className="h3-bold md:h2-bold w-full">Project Marketplace</h2>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setSelectedSkill(null)}
          className={`${
            selectedSkill === null
              ? "bg-primary-500 text-white"
              : "bg-dark-3 text-light-1"
          }`}>
          All Skills
        </Button>
        {skills.slice(0, 8).map((skill) => (
          <Button
            key={skill.id}
            onClick={() => setSelectedSkill(skill.name)}
            className={`${
              selectedSkill === skill.name
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-1"
            }`}>
            {skill.name}
          </Button>
        ))}
      </div>

      {isLoading && <Loader />}

      <div className="flex flex-col gap-5 w-full">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 hover:bg-dark-3 transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="h3-bold mb-2">{project.title}</h3>
                <p className="text-light-2 text-small-medium line-clamp-2">
                  {project.description}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-tiny-medium font-medium whitespace-nowrap ml-4 ${getStatusColor(
                  project.status
                )}`}>
                {project.status === "recruiting"
                  ? "Recruiting"
                  : project.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-light-3 text-tiny-medium mb-2">
                Required Skills:
              </p>
              <div className="flex gap-2 flex-wrap">
                {project.required_skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="text-tiny-medium bg-dark-4 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-dark-4">
              <div>
                <p className="text-light-3 text-tiny-medium">Team Size</p>
                <p className="h3-bold text-primary-500">
                  {project.current_members}/{project.team_size}
                </p>
              </div>
              <div>
                <p className="text-light-3 text-tiny-medium">Due Date</p>
                <p className="text-light-1 text-small-medium">
                  {project.due_date ? new Date(project.due_date as string).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-light-3 text-tiny-medium">Open Spots</p>
                <p className="h3-bold text-green-400">
                  {project.team_size - project.current_members}
                </p>
              </div>
            </div>

            <Button className="w-full bg-primary-500 text-white hover:bg-primary-600">
              View Project
            </Button>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && !isLoading && (
        <div className="flex flex-col gap-4 items-center justify-center min-h-96">
          <p className="text-light-3 text-body-medium">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default ProjectListings;
