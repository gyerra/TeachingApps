import React, { useEffect, useState } from 'react';

export default function PromptList() {
  const [prompts, setPrompts] = useState<{ id: number; text: string; created_at: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/prompts');
      const data = await response.json();
      setPrompts(data);
    }
    fetchData();
  }, []);

  async function handleDelete(id) {
    await fetch('/api/prompts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    setPrompts(prompts.filter(prompt => prompt.id !== id));
  }

  return (
    <div>
      <h1>Prompt History</h1>
      <ul>
        {prompts.map(prompt => (
          <li key={prompt.id}>
            {prompt.text} - {new Date(prompt.created_at).toLocaleString()}
            <button onClick={() => handleDelete(prompt.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
