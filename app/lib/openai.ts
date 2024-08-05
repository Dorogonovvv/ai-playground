import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
  //   organization: "org-ou3Q5Xx24mmWrtlxoRjxdr1Z",
  //   project: "proj_a4sAop7Wen9psy4oJ0IAc4N0",
});
