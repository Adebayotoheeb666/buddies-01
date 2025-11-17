import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDiningHalls,
  getMenus,
  getMenuItems,
  getLatestWaitTime,
  getUserMealPlan,
  getDiningReviews,
} from "@/lib/supabase/api";
import { useAuthContext } from "@/context/AuthContext";
import { Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";

const DiningServices = () => {
  const { user } = useAuthContext();
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<
    "breakfast" | "lunch" | "dinner"
  >("lunch");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { data: diningHalls, isLoading: hallsLoading } = useQuery({
    queryKey: ["dining-halls"],
    queryFn: getDiningHalls,
  });

  const { data: menus } = useQuery({
    queryKey: ["menus", selectedHall, selectedDate],
    queryFn: () => getMenus(selectedHall!, selectedDate),
    enabled: !!selectedHall,
  });

  const { data: waitTimes } = useQuery({
    queryKey: ["wait-times", selectedHall],
    queryFn: () => getLatestWaitTime(selectedHall!),
    enabled: !!selectedHall,
  });

  const { data: mealPlan } = useQuery({
    queryKey: ["meal-plan", user?.id],
    queryFn: () => getUserMealPlan(user?.id!),
    enabled: !!user?.id,
  });

  const { data: reviews } = useQuery({
    queryKey: ["dining-reviews", selectedHall],
    queryFn: () => getDiningReviews(selectedHall!),
    enabled: !!selectedHall,
  });

  const selectedMenu = menus?.find((m) => m.meal_type === selectedMealType);

  const { data: menuItems } = useQuery({
    queryKey: ["menu-items", selectedMenu?.id],
    queryFn: () => getMenuItems(selectedMenu!.id),
    enabled: !!selectedMenu?.id,
  });

  if (hallsLoading) return <Loader />;

  return (
    <div className="common-container">
      <div className="max-w-5xl w-full">
        <h2 className="h3-bold md:h2-bold text-left w-full mb-4">
          Dining Services
        </h2>

        {/* Meal Plan Status */}
        {mealPlan && (
          <div className="mb-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500">
            <h3 className="h4-bold text-light-1 mb-2">Your Meal Plan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-light-4 text-sm">Remaining Meals</p>
                <p className="h4-bold text-light-1">
                  {mealPlan.remaining_meals}
                </p>
              </div>
              <div>
                <p className="text-light-4 text-sm">Remaining Swipes</p>
                <p className="h4-bold text-light-1">
                  {mealPlan.remaining_swipes}
                </p>
              </div>
              <div>
                <p className="text-light-4 text-sm">Balance</p>
                <p className="h4-bold text-light-1">
                  ${mealPlan.balance.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-light-4 text-sm">Expires</p>
                <p className="h4-bold text-light-1">
                  {new Date(mealPlan.expiry_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dining Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {diningHalls?.map((hall) => (
            <div
              key={hall.id}
              onClick={() => setSelectedHall(hall.id)}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                selectedHall === hall.id
                  ? "bg-dark-2 border-purple-500"
                  : "bg-dark-3 border-dark-4 hover:border-purple-500"
              }`}>
              <h3 className="h4-bold text-light-1 mb-2">{hall.name}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-light-3">
                  👥 Capacity: {hall.capacity}
                  {hall.accepts_meal_plan && " · Accepts Meal Plan"}
                  {hall.accepts_cash && " · Accepts Cash"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Hall Details */}
        {selectedHall && (
          <>
            {/* Wait Time */}
            {waitTimes && (
              <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500">
                <h3 className="h4-bold text-light-1">Current Wait Time</h3>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {waitTimes.wait_time_minutes} min
                </p>
                <p className="text-light-4 text-xs mt-1">
                  Last reported:{" "}
                  {new Date(waitTimes.reported_at).toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* Menu Selection */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-dark-3 border border-dark-4 text-white text-sm"
                />
              </div>

              <div className="flex gap-2 mb-4">
                {(["breakfast", "lunch", "dinner"] as const).map((mealType) => (
                  <Button
                    key={mealType}
                    onClick={() => setSelectedMealType(mealType)}
                    className={`rounded-lg px-4 py-2 text-sm capitalize ${
                      selectedMealType === mealType
                        ? "bg-purple-500 text-white"
                        : "bg-dark-3 text-light-2"
                    }`}>
                    {mealType}
                  </Button>
                ))}
              </div>

              {/* Menu Items */}
              {menuItems && menuItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-dark-3 border border-dark-4">
                      <h4 className="font-semibold text-light-1">
                        {item.item_name}
                      </h4>
                      {item.description && (
                        <p className="text-light-3 text-sm mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.dietary_info && item.dietary_info.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {item.dietary_info.map((info: any) => (
                            <span
                              key={info}
                              className="text-xs bg-dark-4 px-2 py-1 rounded">
                              {info}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-light-3 text-center py-4">
                  No menu items available
                </p>
              )}
            </div>

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <div className="p-4 rounded-lg bg-dark-3 border border-dark-4">
                <h3 className="h4-bold text-light-1 mb-4">Reviews</h3>
                <div className="space-y-3">
                  {reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 bg-dark-4 rounded">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i}>⭐</span>
                          ))}
                        </div>
                        {review.food_quality_rating && (
                          <span className="text-light-4 text-xs">
                            Quality: {review.food_quality_rating}/5
                          </span>
                        )}
                      </div>
                      {review.review_text && (
                        <p className="text-light-2 text-sm">
                          {review.review_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiningServices;
