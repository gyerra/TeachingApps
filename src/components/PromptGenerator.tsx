"use client";

import { useState } from "react";
import ModelSelector from "./ModelSelector";
import React from "react";

export default function PromptGenerator() {
  const [topic, setTopic] = useState("");
  const [model, setModel] = useState("llama"); // Default model
  const [prompts, setPrompts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePrompts = async () => {
    if (!topic) return alert("Please enter a topic.");
    
    setLoading(true);
    try {
      const response = await fetch("/api/generatePrompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, model }),
      });

      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Discussion Prompt Generator</h2>
      
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic..."
        className="border p-2 rounded w-full"
      />

      <ModelSelector selectedModel={model} onSelectModel={setModel} />

      <button
        onClick={generatePrompts}
        className="bg-blue-500 text-white p-2 mt-4 w-full rounded"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Prompts"}
      </button>

      {prompts.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Generated Prompts:</h3>
          <ul className="list-disc pl-4">
            {prompts.map((prompt, index) => (
              <li key={index} className="mt-2">{prompt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
