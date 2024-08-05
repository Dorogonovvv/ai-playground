"use client";
import React, { useState } from "react";
import { openai } from "../lib/openai";

const DATA = [
  {
    id: 1,
    transaction_id: "txn_123e4567-e89b-12d3-a456-426614174000",
    amount: 1900,
    currency: "USD",
    timestamp: 1722892023429,
  },
  {
    id: 2,
    transaction_id: "txn_550e8400-e29b-41d4-a716-446655440000",
    amount: 2100.6,
    currency: "USD",
    timestamp: 1722892046823,
  },
  {
    id: 3,
    transaction_id: "txn_6f1e0400-e29b-41d4-a716-446655440001",
    amount: 2300.3,
    currency: "GBP",
    timestamp: 1722892059234,
  },
  {
    id: 4,
    transaction_id: "70e8400e-e29b-41d4-a716-446655440002",
    amount: 2500,
    currency: "USD",
    timestamp: 1722892072848,
  },
  {
    id: 5,
    transaction_id: "txn_80e8400e-e29b-41d4-a716-446655440003",
    amount: 2700,
    currency: "USD",
    timestamp: 1722892072,
  },
];

const HomePage: React.FC = () => {
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onAnalyze = async () => {
    setIsLoading(true);

    const requestToOpenAI = `
      Try to find potential anomalies in the provided data: ${JSON.stringify(
        DATA
      )}.
      Put id as a reference for each anomaly.
      Return response ol with li tags inside.
      Please ignore comparing the transaction amount.
      Try to find as many anomalies as possible.
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: requestToOpenAI,
        },
      ],
      model: "gpt-4o-mini-2024-07-18",
    });

    console.info(completion);
    setAnalyzeResult(completion.choices[0].message.content);
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
