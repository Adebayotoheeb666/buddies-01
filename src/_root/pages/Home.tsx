import { Models } from "appwrite";
import { AlertCircle, RefreshCw } from "lucide-react";

import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const { toast } = useToast();

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    error: postsError,
    refetch: refetchPosts,
  } = useGetRecentPosts();

  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
    error: creatorsError,
    refetch: refetchCreators,
  } = useGetUsers(10);

  const handleRetryPosts = async () => {
    toast({
      title: "Retrying...",
      description: "Loading posts again.",
    });
    await refetchPosts();
  };

  const handleRetryCreators = async () => {
    toast({
      title: "Retrying...",
      description: "Loading creators again.",
    });
    await refetchCreators();
  };

  const renderError = (
    title: string,
    error: Error | null,
    onRetry: () => Promise<void>
  ) => (
    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-lg bg-dark-2 border border-red-500/20">
      <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
      <h3 className="text-light-1 font-semibold mb-1 text-center">{title}</h3>
      <p className="text-light-3 text-sm text-center mb-4 max-w-sm">
        {error?.message ||
          "Unable to load data. Please check your connection and try again."}
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {isErrorPosts && !isPostLoading ? (
            renderError("Failed to Load Posts", postsError, handleRetryPosts)
          ) : isPostLoading && !posts ? (
            <Loader />
          ) : posts?.documents && posts.documents.length > 0 ? (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts.documents.map((post: Models.Document, index: number) => (
                <li
                  key={post.$id || index}
                  className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center py-8 text-light-3">
              <p>No posts yet. Check back later!</p>
            </div>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>

        {isErrorCreators && !isUserLoading ? (
          renderError(
            "Failed to Load Creators",
            creatorsError,
            handleRetryCreators
          )
        ) : isUserLoading && !creators ? (
          <Loader />
        ) : creators?.documents && creators.documents.length > 0 ? (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators.documents.map((creator, index) => (
              <li key={creator?.$id || index}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center py-8 text-light-3 text-sm">
            <p>No creators available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
