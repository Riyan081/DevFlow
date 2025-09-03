import { AIAnswerSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question, content } = await req.json();
  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });
    if (!validatedData.success) {
      return new Response(
        JSON.stringify({ error: validatedData.error.flatten().fieldErrors }),
        { status: 400 }
      );
    }

    // Build messages array for OpenRouter
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that provides informative responses in markdown format. 
- Use proper markdown syntax for headings, lists, and emphasis.  
- For all code snippets, ALWAYS wrap them in fenced code blocks with triple backticks and a language identifier.  
- Example: 
\`\`\`jsx
import React from "react";
\`\`\`
- Never output raw JSX/HTML outside of fenced code blocks.`,
      },
      {
        role: "user",
        content: `${question}\n\n${content}`,
      },
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1:free",
          messages,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error || "OpenRouter error" }),
        { status: response.status }
      );
    }

    // Extract the answer from OpenRouter's response
    let answer = data.choices?.[0]?.message?.content || "";

    // ✅ Post-processing safety net: wrap raw JSX/HTML in fenced code block
    if (/^<[\s\S]*>$/m.test(answer.trim())) {
      answer = `\`\`\`jsx\n${answer}\n\`\`\``;
    }

    return NextResponse.json({ success: true, data: answer }, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
