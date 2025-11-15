import { useQuery } from "@tanstack/react-query";
import { getDepartmentNetworks } from "@/lib/supabase/api";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import DepartmentNetworkCard from "@/components/social/DepartmentNetworkCard";

const NetworkDiscovery = () => {
  const { data: departmentNetworks = [], isLoading } = useQuery({
    queryKey: ["departmentNetworks"],
    queryFn: getDepartmentNetworks,
  });

  const features = [
    {
      id: "class-year",
      title: "Class Year Network",
      description: "Connect with students from your class year",
      icon: "👥",
      route: "#",
    },
    {
      id: "department",
      title: "Department Networks",
      description: "Find students in your department or major",
      icon: "🏫",
      route: "#",
    },
    {
      id: "international",
      title: "International Student Hub",
      description: "Resources and community for international students",
      icon: "🌍",
      route: "#",
    },
    {
      id: "commuter",
      title: "Commuter Network",
      description: "Find carpool buddies and parking information",
      icon: "🚗",
      route: "#",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Network Discovery</h1>
          <p className="text-light-3">
            Find communities and networks that match your interests
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-dark-3 rounded-lg p-6 border border-dark-4 hover:border-primary-500 transition-colors"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-light-3 mb-4">{feature.description}</p>
              <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white">
                Explore
              </Button>
            </div>
          ))}
        </div>

        {/* Department Networks Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Department Networks</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : departmentNetworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentNetworks.map((network) => (
                <DepartmentNetworkCard
                  key={network.id}
                  network={network}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-light-3">
                No department networks available yet.
              </p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-dark-3 rounded-lg p-6 border border-dark-4">
          <h3 className="text-xl font-bold mb-4">💡 Tips for Networking</h3>
          <ul className="space-y-2 text-light-3">
            <li>
              ✓ Join your class year group to connect with peers from your year
            </li>
            <li>
              ✓ Explore department networks to find your academic community
            </li>
            <li>
              ✓ Connect with international students if you're from abroad
            </li>
            <li>
              ✓ Find commute buddies to save time and make new friends
            </li>
            <li>
              ✓ Be active in networks - comment, share, and help others
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiscovery;
