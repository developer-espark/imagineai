import React, { useState } from "react";
import Search from "../assets/Icon/Search";
import Loader from "../assets/Icon/Loader";

interface QuestionProps {
  onSubmit: (question: string) => Promise<any>;
  loading: boolean;
}

const Question: React.FC<QuestionProps> = ({ onSubmit, loading }: QuestionProps) => {
  const [question, setQuestion] = useState<string>("");
  const [ans, setAns] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data } = await onSubmit(question);

    if (data?.askQuestion) {
      setAns(data?.askQuestion);
    }
    setQuestion("");
  };

  return (

    <>
      <div className="max-w-4xl w-full mx-auto flex items-center gap-4 mb-5">
        <div className="relative flex-1">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search />
                </div>

                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={question}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                {
                  loading ? (
                    <Loader />
                  ) : <input type="submit" value="Submit" disabled={question?.trim() === ""} className="!bg-gray-200 !py-2 text-base text-gray-800 px-3 rounded-lg border border-gray-200 relative" />
                }

              </div>
            </div>
          </form>
        </div>
        {/* <Button loading={loading} />  */}
      </div>

      {ans &&
        <div className="max-w-4xl w-full mx-auto flex items-center gap-4 mb-5 ">
          <span className="text-start w-full border border-[#D1D5DB] p-2 rounded pb-[25px]">
            {ans}
          </span>
        </div>
      }

    </>
  );
};

export default Question;
