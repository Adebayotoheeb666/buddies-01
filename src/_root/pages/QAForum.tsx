import { useGetQAQuestions } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";

const QAForum = () => {
  const { data: questionsData, isLoading } = useGetQAQuestions();
  const questions = questionsData?.documents || [];

  return (
    <div className="flex flex-col gap-9 w-full max-w-5xl">
      <div className="flex gap-2 justify-between w-full max-w-full">
        <div className="flex gap-2">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
          />
          <h2 className="h3-bold md:h2-bold">Q&A Forum</h2>
        </div>
        <button className="shad-button_primary">Ask Question</button>
      </div>

      {isLoading && <Loader />}

      <div className="flex flex-col gap-4 w-full">
        {questions.map((question) => (
          <div
            key={question.id}
            className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 cursor-pointer hover:bg-dark-3 transition">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded">
                  <img
                    src="/assets/icons/add-post.svg"
                    width={20}
                    height={20}
                    alt="votes"
                  />
                </div>
                <p className="text-small-medium text-light-3">
                  {question.upvotes}
                </p>
                <p className="text-tiny text-light-4">votes</p>
              </div>

              <div className="flex-1">
                <h3 className="h3-bold mb-2">{question.title}</h3>
                <p className="text-light-2 text-small-regular mb-3 line-clamp-2">
                  {question.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {question.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-dark-3 text-light-3 rounded text-tiny font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-small-medium text-light-3">
                  <div className="flex items-center gap-4">
                    <span>{question.views} views</span>
                    <span>{question.answers_count || 0} answers</span>
                  </div>
                  {question.is_answered && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-tiny font-medium">
                      Answered
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAForum;
