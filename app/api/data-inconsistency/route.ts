import { NextRequest, NextResponse } from 'next/server';

const DATA = require("./data.json");
import { openai } from "../../lib/openai";


export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
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
    
    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error) {
    // Handle errors and return a JSON response with an error message
    return NextResponse.json(
      { error: 'An error occurred: ' + error },
      { status: 500 }
    );
  }
}