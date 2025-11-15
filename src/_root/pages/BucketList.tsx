import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import {
  getUserBucketLists,
  getBucketListItems,
  createBucketList,
  addBucketListItem,
  completeBucketListItem,
} from "@/lib/supabase/api";
import {
  BucketList as BucketListType,
  BucketListItem,
} from "@/types/gamification.types";

const BucketList = () => {
  const { user } = useAuthContext();
  const [bucketLists, setBucketLists] = useState<BucketListType[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [listItems, setListItems] = useState<BucketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newItemActivity, setNewItemActivity] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      if (!user?.id) return;

      setLoading(true);
      const lists = await getUserBucketLists(user.id);
      setBucketLists(lists);
      if (lists.length > 0) {
        setSelectedList(lists[0].id);
      }
      setLoading(false);
    };

    fetchLists();
  }, [user?.id]);

  useEffect(() => {
    const fetchItems = async () => {
      if (!selectedList) return;

      const items = await getBucketListItems(selectedList);
      setListItems(items);
    };

    fetchItems();
  }, [selectedList]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !newListName.trim()) return;

    const newList = await createBucketList(
      user.id,
      newListName,
      newListDescription || undefined
    );

    if (newList) {
      setBucketLists([...bucketLists, newList]);
      setSelectedList(newList.id);
      setNewListName("");
      setNewListDescription("");
      setShowCreateModal(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedList || !newItemActivity.trim()) return;

    const newItem = await addBucketListItem(selectedList, newItemActivity);

    if (newItem) {
      setListItems([...listItems, newItem]);
      setNewItemActivity("");
      setShowAddItemModal(false);
    }
  };

  const handleCompleteItem = async (itemId: string) => {
    const completed = await completeBucketListItem(itemId);

    if (completed) {
      setListItems(
        listItems.map((item) => (item.id === itemId ? completed : item))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-light-3">Loading...</p>
      </div>
    );
  }

  const completedCount = listItems.filter((item) => item.completed).length;
  const totalCount = listItems.length;
  const completionPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Campus Bucket Lists</h1>
        <p className="text-light-3">
          Create and track memorable campus experiences
        </p>
      </div>

      {/* Bucket Lists Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {bucketLists.map((list) => (
          <button
            key={list.id}
            onClick={() => setSelectedList(list.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
              selectedList === list.id
                ? "bg-primary-500 text-white"
                : "bg-dark-3 text-light-3 hover:bg-dark-2"
            }`}>
            {list.name}
          </button>
        ))}
        <button
          onClick={() => setShowCreateModal(true)}
          className="whitespace-nowrap rounded-lg bg-dark-3 px-4 py-2 font-medium text-primary-500 hover:bg-dark-2 transition">
          + Create List
        </button>
      </div>

      {selectedList && (
        <>
          {/* Progress Bar */}
          <div className="rounded-lg border border-dark-4 bg-dark-2 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-light-3">Progress</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {completedCount} of {totalCount}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary-500">
                  {Math.round(completionPercentage)}%
                </p>
              </div>
            </div>
            <div className="mt-4 h-3 w-full rounded-full bg-dark-3">
              <div
                className="h-3 rounded-full bg-primary-500 transition"
                style={{ width: `${completionPercentage}%` }}></div>
            </div>
          </div>

          {/* Bucket List Items */}
          <div className="space-y-2">
            {listItems.length > 0 ? (
              listItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border p-4 transition flex items-center gap-3 ${
                    item.completed
                      ? "border-primary-500 bg-dark-3 opacity-60"
                      : "border-dark-4 bg-dark-2"
                  }`}>
                  <button
                    onClick={() => handleCompleteItem(item.id)}
                    className={`flex-shrink-0 flex h-6 w-6 items-center justify-center rounded border-2 transition ${
                      item.completed
                        ? "border-primary-500 bg-primary-500"
                        : "border-light-4 hover:border-primary-500"
                    }`}>
                    {item.completed && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        item.completed
                          ? "line-through text-light-4"
                          : "text-white"
                      }`}>
                      {item.activity}
                    </p>
                    {item.photo_url && (
                      <p className="mt-1 text-xs text-light-3">
                        📸 Photo added
                      </p>
                    )}
                  </div>
                  {item.completed && (
                    <div className="flex-shrink-0 text-primary-500">✓ Done</div>
                  )}
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dark-4 bg-dark-2 p-6 text-center">
                <p className="text-light-3">
                  No items yet. Add one to get started!
                </p>
              </div>
            )}
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => setShowAddItemModal(true)}
            className="w-full rounded-lg border border-primary-500 py-3 font-medium text-primary-500 hover:bg-primary-500/10 transition">
            + Add Activity
          </button>
        </>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
            <h2 className="text-xl font-bold text-white">Create Bucket List</h2>

            <form
              onSubmit={handleCreateList}
              className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  List Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Campus Adventures"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-white">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="What do you want to experience?"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full rounded-lg border border-dark-4 px-4 py-2 font-medium text-light-3 hover:bg-dark-3 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="w-full rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-dark-2 p-6">
            <h2 className="text-xl font-bold text-white">Add Activity</h2>
            <p className="mt-1 text-sm text-light-3">
              What do you want to experience?
            </p>

            <form onSubmit={handleAddItem} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Activity
                </label>
                <input
                  type="text"
                  placeholder="e.g., Watch sunrise from the bell tower"
                  value={newItemActivity}
                  onChange={(e) => setNewItemActivity(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-dark-4 bg-dark-3 px-4 py-2 text-white placeholder-light-4 outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="w-full rounded-lg border border-dark-4 px-4 py-2 font-medium text-light-3 hover:bg-dark-3 transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newItemActivity.trim()}
                  className="w-full rounded-lg bg-primary-500 px-4 py-2 font-medium text-white hover:bg-primary-600 disabled:opacity-50 transition">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BucketList;
