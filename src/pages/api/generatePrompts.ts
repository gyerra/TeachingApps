import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { country, board, subject, gradeLevel, timeLimit, engagementLevel, model, topic } = req.body;

    // Simulate prompt generation logic
    const prompts = [
      `Discuss the impact of ${subject} on ${country}'s education system with a focus on ${topic}.`,
      `How does the ${board} board approach ${subject} differently from other boards in the context of ${topic}?`,
      `What are the challenges faced by ${gradeLevel} students in learning ${subject} with respect to ${topic}?`,
      `Discuss the importance of ${subject} in the context of ${engagementLevel} and ${topic}.`,
    ];

    res.status(200).json({ prompts });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
