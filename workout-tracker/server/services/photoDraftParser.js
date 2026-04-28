const OpenAI = require("openai");

const RESPONSE_SCHEMA = {
  bodyWeight: null,
  bodyWeightUnit: "kg",
  exercises: [
    {
      name: "Exercise name",
      notes: "",
      sets: [
        { weight: 0, reps: 0, notes: "" }
      ]
    }
  ],
  notes: ""
};

function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("OpenAI API key is missing. Add OPENAI_API_KEY to workout-tracker/.env, then restart the server.");
    error.statusCode = 503;
    throw error;
  }

  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function imageToDataUrl(file) {
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
}

function parseJsonContent(content) {
  const trimmed = String(content || "").trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch ? fencedMatch[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

function cleanNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function cleanText(value) {
  return String(value || "").trim();
}

function sanitizeDraft(rawDraft) {
  const draft = rawDraft && typeof rawDraft === "object" ? rawDraft : {};
  const exercises = Array.isArray(draft.exercises) ? draft.exercises : [];

  const cleanedExercises = exercises
    .map((exercise) => {
      const sets = Array.isArray(exercise && exercise.sets) ? exercise.sets : [];
      const cleanedSets = sets
        .map((set) => ({
          weight: cleanNumber(set && set.weight),
          reps: cleanNumber(set && set.reps),
          notes: cleanText(set && set.notes)
        }))
        .filter((set) => set.weight || set.reps || set.notes);

      return {
        name: cleanText(exercise && exercise.name),
        notes: cleanText(exercise && exercise.notes),
        sets: cleanedSets
      };
    })
    .filter((exercise) => exercise.name || exercise.sets.length > 0);

  return {
    bodyWeight: cleanNumber(draft.bodyWeight),
    bodyWeightUnit: cleanText(draft.bodyWeightUnit) || "kg",
    exercises: cleanedExercises,
    notes: cleanText(draft.notes)
  };
}

async function parseWorkoutPhoto(file) {
  const client = getOpenAIClient();
  const imageUrl = imageToDataUrl(file);

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: [
          "You extract workout log data from images.",
          "Return JSON only. No markdown. No explanation.",
          "If a value is unclear, use null or an empty string instead of guessing.",
          "Weights are usually kilograms unless the image clearly says lb/lbs/pounds.",
          "For workout sets, extract exercise name, set weight, reps, and useful notes.",
          "For body weight, extract it only if visible as a bodyweight/scale measurement.",
          "Use this exact shape:",
          JSON.stringify(RESPONSE_SCHEMA)
        ].join("\n")
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Read this workout image and return the structured workout draft JSON."
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high"
            }
          }
        ]
      }
    ]
  });

  const content = response.choices && response.choices[0] && response.choices[0].message
    ? response.choices[0].message.content
    : "";

  let parsed;
  try {
    parsed = parseJsonContent(content);
  } catch (error) {
    const parseError = new Error("AI could not return clean workout data. Try a clearer photo.");
    parseError.statusCode = 502;
    throw parseError;
  }

  const draft = sanitizeDraft(parsed);

  if (!draft.bodyWeight && draft.exercises.length === 0) {
    const emptyError = new Error("AI did not find usable workout data. Try a clearer photo or closer crop.");
    emptyError.statusCode = 422;
    throw emptyError;
  }

  return {
    source: {
      fileName: file.originalname,
      parser: "openai-vision-v1",
      model: response.model || process.env.OPENAI_VISION_MODEL || "gpt-4o-mini"
    },
    draft
  };
}

module.exports = { parseWorkoutPhoto };
