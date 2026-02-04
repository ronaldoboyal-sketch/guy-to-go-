import { GoogleGenAI } from "@google/genai";
import { LessonPlanRequest } from "../types";

const SYSTEM_INSTRUCTION = `
Role: You are a Curriculum Specialist for the Guyana Ministry of Education (MoE).
Task: Generate a Lesson Plan that strictly follows the official 8-column landscape template.

### WEEKLY CURRICULUM SYNC:
You are synchronized with the 2024/2025 MoE Renewed Curriculum updates. Always use the latest competency-based frameworks, Guyanese local context (Regions 1-10), and cultural references.

### TABLE LAYOUT (8 COLUMNS - LANDSCAPE):
Columns: [Time] | [Specific Objectives] | [Content/Concept] | [Prerequisite Knowledge] | [Teacher’s Activities] | [Students’ Activities] | [RESOURCES] | [EVALUATION]

### STRUCTURAL RULES:
1. **Spanning**: Columns 1, 2, 3, 4, 7, and 8 MUST use 'rowspan' to cover the entire lesson duration in one block.
2. **Activity Subdivision**: Columns 5 (Teacher’s Activities) and 6 (Students’ Activities) must be subdivided into exactly 5 chronological stages:
   - Introduction
   - Development Stage I
   - Stage II
   - Stage III
   - Conclusion
3. **Content Restriction**: In the activity columns, only provide specific actions for the teacher and students. Do not repeat objectives or content summaries here.
4. **Empty Evaluation**: The 'EVALUATION' column (Column 8) MUST be left completely empty (empty <td></td>) for the teacher to provide manual input after the lesson.

### FORMATTING:
- Output: Raw HTML only (no markdown code blocks).
- Orientation: Optimized for Letter Landscape (11" x 8.5").
- Style: <table border="1" style="border-collapse: collapse; width: 100%; border: 2px solid black; font-family: 'Times New Roman', serif;">.
- Heading: <h2>The Lesson Plan Template</h2> (Centered).
`;

export const GeminiService = {
  generateLessonPlan: async (request: LessonPlanRequest): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    Generate a Guyanese Lesson Plan for:
    - Subject: ${request.subject}
    - Grade Level: ${request.grade}
    - Topic: ${request.topic}
    - Duration: ${request.duration}

    REQUIREMENTS:
    - Use the 8-column MoE Template.
    - Subdivide activities into: Introduction, Stage I, II, III, and Conclusion.
    - LEAVE THE EVALUATION COLUMN BLANK.
    - Ensure all Guyanese local contexts are applied.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const cleanText = response.text || "Failed to generate content.";
      return cleanText.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("The AI service is currently unavailable. Please try again later.");
    }
  }
};