import { AIAnswerSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

// ✅ Helper function to sanitize markdown content
function sanitizeMarkdownContent(content: string): string {
  let sanitized = content;

  // Fix unclosed code blocks
  const codeBlockMatches = sanitized.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    sanitized += '\n```'; // Close unclosed code block
  }

  // Ensure code blocks have language identifiers
  sanitized = sanitized.replace(/```\n(?!```)/g, '```text\n');
  
  // Remove problematic characters
  sanitized = sanitized
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Control chars
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/<br\s*\/?>/gi, '\n') // Replace <br> with newlines
    .trim();

  // Wrap raw JSX/HTML in code blocks
  if (/^<[\s\S]*>$/m.test(sanitized.trim())) {
    sanitized = `\`\`\`jsx\n${sanitized}\n\`\`\``;
  }

  return sanitized;
}

export async function POST(req: Request) {
  try {
    const { question, content } = await req.json();
    
    console.log("API received:", { question, content });
    
    const validatedData = AIAnswerSchema.safeParse({ question, content });
    if (!validatedData.success) {
      console.error("Validation failed:", validatedData.error.flatten());
      
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Validation failed",
          details: validatedData.error.flatten().fieldErrors 
        }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Build messages array for OpenRouter
    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that provides informative responses in markdown format.

CRITICAL RULES:
- ALWAYS use proper markdown syntax
- For code blocks, ALWAYS use \`\`\`language and close with \`\`\`
- NEVER leave code blocks unclosed
- ALWAYS specify a language identifier (js, jsx, css, html, python, etc.)
- Examples:
  \`\`\`jsx
  import React from "react";
  \`\`\`
  
  \`\`\`css
  .button { color: red; }
  \`\`\`

- NEVER output raw HTML/JSX outside of fenced code blocks
- Use headings (#, ##, ###) for structure
- Use lists (-, 1.) for organization`,
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
      console.error("OpenRouter error:", data);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: data.error?.message || data.error || "OpenRouter API error" 
        }),
        { 
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Enhanced post-processing with sanitization
    let answer = data.choices?.[0]?.message?.content || "";

    if (!answer) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "No response generated from AI" 
        }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // ✅ Enhanced sanitization and validation
    answer = sanitizeMarkdownContent(answer);

    return NextResponse.json({ success: true, data: answer }, { status: 200 });
    
  } catch (err) {
    console.error("API route error:", err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Internal Server Error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}