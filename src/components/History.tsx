import React, { useState, useEffect } from 'react';

interface Output {
  id: number;
  text: string;
  date: string;
}

const History: React.FC = () => {
  const [outputs, setOutputs] = useState<Output[]>([]);

  useEffect(() => {
    // Fetch generated outputs history from the correct API endpoint
    const fetchOutputs = async () => {
      try {
        const response = await fetch('/api/getGeneratedOutputsHistory'); // Ensure this endpoint is correct
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setOutputs(data.outputs);
      } catch (error) {
        console.error('Failed to fetch generated outputs history:', error);
      }
    };

    fetchOutputs();
  }, []);

  const deleteOutput = async (id: number) => {
    try {
      const response = await fetch(`/api/deleteOutput/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOutputs(outputs.filter(output => output.id !== id));
      } else {
        console.error('Failed to delete output');
      }
    } catch (error) {
      console.error('Failed to delete output:', error);
    }
  };

  return (
    <div>
      <h2>Generated Outputs History</h2>
      <ul>
        {outputs.map(output => (
          <li key={output.id}>
            <span>{output.date}: {output.text}</span>
            <button onClick={() => deleteOutput(output.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
