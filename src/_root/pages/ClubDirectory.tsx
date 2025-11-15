import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "@/lib/supabase/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import ClubCard from "@/components/social/ClubCard";

const ClubDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
  });

  const categories = ["academic", "cultural", "sports", "greek", "service", "other"];

  const filteredOrganizations = (organizations || []).filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || org.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Club Directory</h1>
          <p className="text-light-3">
            Discover and join student organizations on campus
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search clubs by name..."
            className="w-full px-4 py-2 bg-dark-4 border border-dark-4 rounded-lg focus:outline-none focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === null
                ? "bg-primary-500 text-white"
                : "bg-dark-4 text-light-3 hover:bg-dark-3"
            }`}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors capitalize ${
                selectedCategory === category
                  ? "bg-primary-500 text-white"
                  : "bg-dark-4 text-light-3 hover:bg-dark-3"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Organizations Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader />
          </div>
        ) : filteredOrganizations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrganizations.map((org) => (
              <ClubCard key={org.id} organization={org} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-light-3">
              No clubs found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDirectory;
