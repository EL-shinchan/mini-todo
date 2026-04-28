async function parseWorkoutPhoto(file) {
  const originalName = file && file.originalname ? file.originalname : "workout photo";

  return {
    source: {
      fileName: originalName,
      parser: "mock-v1",
      confidence: "demo"
    },
    draft: {
      bodyWeight: 68.4,
      bodyWeightUnit: "kg",
      exercises: [
        {
          name: "Bench Press",
          notes: "Mock extract — review before saving.",
          sets: [
            { weight: 40, reps: 8, notes: "" },
            { weight: 45, reps: 6, notes: "" }
          ]
        },
        {
          name: "Lat Pulldown",
          notes: "",
          sets: [
            { weight: 50, reps: 10, notes: "" },
            { weight: 55, reps: 8, notes: "" }
          ]
        }
      ],
      notes: "Mock AI draft from uploaded workout photo. Check every number before saving."
    }
  };
}

module.exports = { parseWorkoutPhoto };
