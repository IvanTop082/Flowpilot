import { OpenAI } from "openai";

// Mock implementation to replace starknet-agent-kit
class StarknetAgent {
  private config: any;
  private openai: OpenAI;

  constructor(config: any) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: config.aiProviderApiKey,
    });
  }

  async execute(instruction: string): Promise<string> {
    console.log("Executing:", instruction);
    const response = await this.openai.chat.completions.create({
      model: this.config.aiModel,
      messages: [
        { role: "system", content: "You are a helpful DeFi agent." },
        { role: "user", content: instruction }
      ]
    });
    return response.choices[0].message.content || "";
  }
}

export const agent = new StarknetAgent({
  aiProviderApiKey: process.env.OPENAI_API_KEY,
  aiModel: "gpt-3.5-turbo",
  provider: "https://www.alchemy.com/starknet",
  accountPublicKey: process.env.ACCOUNT_PUBLIC_KEY,
  accountPrivateKey: process.env.ACCOUNT_PRIVATE_KEY,
});

export async function executeAgentQuery(prompt: string): Promise<string> {
  try {
    const response = await agent.execute(prompt);
    return response?.toString() || "No response from agent";
  } catch (error) {
    console.error("Error executing agent query:", error);
    return "Error processing your request";
  }
}