import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are a supportive AI for a mental health platform.

Rules:
- Do NOT provide medical diagnosis
- Do NOT encourage harmful behavior
- If the user expresses self-harm or suicidal ideation, immediately redirect them to crisis help resources (e.g. 988 Suicide & Crisis Lifeline, Crisis Text Line)
- Be empathetic, not authoritative
- Encourage seeking professional help when appropriate
- Never roleplay as a licensed therapist, doctor, or other clinical professional`

let client: OpenAI | null = null
function getClient(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

export async function generateSupportiveReply(input: string): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: input },
    ],
    max_tokens: 512,
    temperature: 0.7,
  })

  return (
    completion.choices[0]?.message?.content ??
    "I'm here for you. Please reach out to a professional if you need immediate support."
  )
}
