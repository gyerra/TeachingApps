import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { country, board, subject, gradeLevel, timeLimit, engagementLevel, model, topic } = await req.json();

    if (!subject || !gradeLevel || !model || !topic) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const API_KEY = process.env.GROQ_API_KEY;
    const GROQ_URL = "https://api.groq.com/v1/chat/completions";

    const prompt = `Generate 5 discussion prompts for the topic "${topic}" from the subject ${subject} at grade level ${gradeLevel}, with a focus on ${engagementLevel} in ${timeLimit} minutes. Consider the ${board} board in ${country}.`;

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from GROQ API:", errorText);
      throw new Error(`GROQ API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ prompts: data.choices[0]?.message?.content || [] });

  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Failed to generate prompts" }, { status: 500 });
  }
}
