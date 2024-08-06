"use client";
import React, { useState } from "react";

import DATA from "../api/data-inconsistency/data.json";

const HomePage: React.FC = () => {
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAnalyze = async () => {
    setIsLoading(true);

    const response = await fetch("/api/data-inconsistency");

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const openAiResponse = await response.json();

    setAnalyzeResult(openAiResponse.message);
    setIsLoading(false);
  };

  return (
    <section className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Transaction Data Analysis
      </h1>
      <div className="overflow-x-auto w-full max-w-3xl mb-6">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">UUID</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Currency</th>
              <th className="py-3 px-6 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {DATA.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{item.id}</td>
                <td className="py-3 px-6 text-left">{item.transaction_id}</td>
                <td className="py-3 px-6 text-left">{item.amount}</td>
                <td className="py-3 px-6 text-left">{item.currency}</td>
                <td className="py-3 px-6 text-left">{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        disabled={isLoading}
        onClick={onAnalyze}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Analyze the Data
      </button>

      {isLoading && <p className="mt-4 text-gray-800">Analyzing the data...</p>}

      {analyzeResult && (
        <div className="mt-8 bg-white p-4 shadow-md rounded w-full max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Analysis Result</h2>
          <div
            className="font-mono text-gray-800"
            dangerouslySetInnerHTML={{ __html: analyzeResult }}
          ></div>
        </div>
      )}
    </section>
  );
};

export default HomePage;
