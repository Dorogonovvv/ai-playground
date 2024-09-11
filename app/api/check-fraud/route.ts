import { NextRequest, NextResponse } from 'next/server';
import { openai } from "../../lib/openai";

// Utility function to format the address into a readable string
const formatAddress = (address: any) => {
  return `${address.address}, ${address.zip}, ${address.city}, ${address.countryCode}`;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { businessAddress, deliveryAddress } = await request.json();

    const formattedBusinessAddress = formatAddress(businessAddress);
    const formattedDeliveryAddress = formatAddress(deliveryAddress);

    // Prompt to OpenAI to estimate the distance between two addresses
    const requestToOpenAI = `
      Please estimate the approximate distance in kilometers between the following two addresses:
      1. Business registration address: ${formattedBusinessAddress}
      2. Delivery address: ${formattedDeliveryAddress}
      
      Only return the distance in kilometers as a number, no extra text.
    `;

    // Send the prompt to OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: requestToOpenAI,
        },
      ],
      model: "gpt-4o-mini",
    });

    // Extract the response content from OpenAI
    const estimatedDistance = completion.choices[0].message.content?.trim();

    // Return the estimated distance as JSON
    return NextResponse.json({ distance: `${estimatedDistance} km` });
  } catch (error) {
    // Handle errors and return a JSON response with an error message
    return NextResponse.json(
      { error: 'An error occurred: ' + error },
      { status: 500 }
    );
  }
}