import { useParams } from "react-router-dom";
import { useGetQuestionById } from "@/lib/react-query/queries";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const QuestionDetail = () => {
  const { questionId } = useParams();
  const { data: questionData, isLoading } = useGetQuestionById(questionId);
  const [answerText, setAnswerText] = useState("");

  if (isLoading) {
    return <Loader />;
  }

  if (!questionData?.question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <p className="text-light-3 text-body-medium">Question not found</p>
      </div>
    );
  }

  const { question, answers } = questionData;

  return (
    <div className="flex flex-col gap-9 w-full max-w-4xl">
      <div className="flex gap-2 justify-start w-full max-w-full">
        <img
          src="/assets/icons/back.svg"
          width={36}
          height={36}
          alt="back"
          className="cursor-pointer hover:opacity-80 transition"
        />
        <h2 className="h3-bold md:h2-bold w-full">Q&amp;A Forum</h2>
      </div>

      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded">
              <span className="text-primary-500 font-bold">↑</span>
            </div>
            <p className="text-small-medium text-light-3">{question.upvotes}</p>
            <p className="text-tiny text-light-4">votes</p>
          </div>

          <div className="flex-1">
            <h1 className="h2-bold mb-4">{question.title}</h1>

            <p className="text-light-2 text-small-regular mb-4">
              {question.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {(question.tags as string[]).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-dark-3 text-light-3 rounded-full text-tiny font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-small-medium text-light-3 pt-4 border-t border-dark-4">
              <div className="flex items-center gap-4">
                <span>{question.views} views</span>
                <span>{question.answers_count || 0} answers</span>
              </div>
              {question.is_answered && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-tiny font-medium">
                  ✓ Answered
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="h3-bold">
          {answers.length} Answer{answers.length !== 1 ? "s" : ""}
        </h3>

        {answers.length === 0 ? (
          <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7 text-center">
            <p className="text-light-3">
              No answers yet. Be the first to answer!
            </p>
          </div>
        ) : (
          answers.map((answer) => (
            <div
              key={answer.id}
              className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
              <div className="flex gap-4 mb-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-500/20 rounded">
                    <span className="text-primary-500 font-bold text-sm">
                      ↑
                    </span>
                  </div>
                  <p className="text-small-medium text-light-3">
                    {answer.upvotes}
                  </p>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-light-1 text-small-medium font-semibold">
                        Tutor User
                      </p>
                      <p className="text-light-3 text-tiny-medium">
                        {new Date(answer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {answer.is_verified && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-tiny font-medium flex items-center gap-1">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <p className="text-light-2 text-small-regular mb-3">
                    {answer.content}
                  </p>

                  <div className="flex gap-3 pt-3 border-t border-dark-4">
                    <Button className="text-small-medium text-light-3 bg-transparent hover:bg-dark-3 px-0">
                      Upvote
                    </Button>
                    <Button className="text-small-medium text-light-3 bg-transparent hover:bg-dark-3 px-0">
                      Downvote
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-dark-2 rounded-[10px] border border-dark-4 p-5 lg:p-7">
        <h3 className="h3-bold mb-4">Post Your Answer</h3>

        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Write your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            className="min-h-32 bg-dark-3 border-dark-4"
          />

          <div className="flex gap-3">
            <Button className="bg-primary-500 text-white hover:bg-primary-600 flex-1">
              Post Answer
            </Button>
            <Button className="bg-dark-3 text-light-1 hover:bg-dark-4 flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
