"use client";
import { useState } from "react";
import {
  AiOutlineQuestionCircle,
  AiOutlineFileText,
  AiOutlineCopy,
} from "react-icons/ai";
import ReactMarkdown from "react-markdown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//@ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//@ts-ignore
import { tomorrow as codeStyle } from "react-syntax-highlighter/dist/cjs/styles/prism";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: "",
  dangerouslyAllowBrowser: true,
});

const Chatbot = () => {
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response).then(() => {
        toast.success("Copied to clipboard!", {
          position: "bottom-right",
          theme: "dark",
        });
      });
    }
  };

  const generateResponse = async () => {
    const prompt =
      `Give me correct code and Just the code no explanation for input ques:  """${inputFormat}"""  and output format should be this ${outputFormat}.
    `.trim();

    setLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "o1-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const aiResponse = completion.choices[0].message.content || "";
      setResponse(aiResponse);
    } catch (error) {
      toast.error("Error generating response.", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResponse = () => {
    if (inputFormat && outputFormat) {
      generateResponse();
    } else {
      toast.warn("Please enter both input and output formats.", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 w-full max-w-9xl">
      <h1 className="text-5xl font-bold text-zinc-100 text-center mb-10">
        🚀 Solve Coding Contest Questions{" "}
        <span className="text-lime-400">In Seconds! ⚡</span>
      </h1>

      <div className="md:flex gap-8 w-full">
        <div className="bg-zinc-900 p-8 border-[1px] border-zinc-700 rounded-xl w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-lime-600 mb-4">
            Enter Formats
          </h2>
          <div className="mb-6">
            <label
              htmlFor="input-format"
              className="block text-lg font-semibold mb-2 text-zinc-300"
            >
              <AiOutlineQuestionCircle className="inline mr-2 text-lime-400" />{" "}
              Input Format
            </label>
            <textarea
              id="input-format"
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value)}
              placeholder="Enter your input format..."
              className="w-full h-[200px] p-4 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none text-lg"
            ></textarea>
          </div>

          <div className="mb-6 ">
            <label
              htmlFor="output-format"
              className="block text-lg font-semibold mb-2 text-zinc-300"
            >
              <AiOutlineFileText className="inline mr-2 text-lime-400" /> Output
              Format
            </label>
            <textarea
              id="output-format"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              placeholder="Enter your output format..."
              className="w-full h-[200px] p-4 bg-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none text-lg"
            ></textarea>
          </div>

          <button
            onClick={handleGenerateResponse}
            className="w-full py-3 bg-lime-500 hover:bg-lime-600 rounded-lg text-black font-bold text-lg transition duration-300"
          >
            {loading ? "Generating..." : "Generate Response"}
          </button>
        </div>

        <div className="bg-zinc-900 border-[1px] border-zinc-700 p-8 rounded-xl w-full md:w-1/2 max-h-[900px] relative">
          <h2 className="text-2xl font-bold text-lime-400 mb-4">Response</h2>
          <div className="bg-black p-6 rounded-lg h-full text-white overflow-y-auto max-h-[550px]">
            {response ? (
              <ReactMarkdown
                className="prose prose-invert"
                components={{
                  //@ts-ignore
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={codeStyle}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {response}
              </ReactMarkdown>
            ) : (
              <p className="text-zinc-500">Your response will appear here...</p>
            )}
          </div>

          {response && (
            <button
              onClick={handleCopyResponse}
              className="absolute top-4 right-4 p-2 bg-zinc-800 rounded-lg text-amber-400 hover:bg-lime-600 hover:text-black transition duration-300"
              title="Copy to clipboard"
            >
              <AiOutlineCopy size={24} />
            </button>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Chatbot;
