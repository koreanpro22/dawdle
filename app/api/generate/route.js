import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
  try {
    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
    const { address, date, time, type } = await req.json(); 

    const systemPrompt = `
    You are an AI assistant specialized in creating detailed itineraries for events. Based on the information provided, generate a comprehensive and engaging itinerary for the event. The itinerary should include activities and recommendations from the start time to 5 hours later. Note that the address provided is the meeting point; activities can occur elsewhere.

      Here are the details for the event:
      - **Meeting Address:** ${address}
      - **Date:** ${date}
      - **Start Time:** ${time}
      - **Type:** ${type}

      The itinerary should:
      1. Begin with a welcoming note or introduction.
      2. Provide a clear schedule with times and suggested activities.
      3. Include recommendations for places to visit, eat, or any specific activities related to the event type.
      4. Be formatted as plain text for easy readability.

      Please ensure the itinerary is detailed, engaging, and tailored to the event type, offering a variety of enjoyable activities and locations beyond the meeting address.

    `    

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: "Generate the itinerary" }
            ],
            model: "gpt-3.5-turbo",
            stream: true,  
          });

          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || '';  
            controller.enqueue(new TextEncoder().encode(text));   
          }

          controller.close();
        } catch (error) {
          controller.error(error);  
        }
      }
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
