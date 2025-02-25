"use client";
import React from 'react';

type ModelSelectorProps = {
  selectedModel: string;
  onSelectModel: (model: string) => void;
};

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  return (
    <div className="mt-4">
      <label className="block text-gray-700">Select Model:</label>
      <select
        value={selectedModel}
        onChange={(e) => onSelectModel(e.target.value)}
        className="border p-2 rounded w-full mt-1"
      >
        <option value="llama">LLaMA</option>
        <option value="gemini">Gemini</option>
      </select>
    </div>
  );
}
