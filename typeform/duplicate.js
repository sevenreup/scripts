const fs = require("fs");

// Function to find duplicate variables in actions within each field
function findDuplicateVariables(fields) {
  const duplicates = new Set();
  const refCount = new Set();
  const actualDuplicate = new Set();

  for (const field of fields) {
    const variableCounts = {};

    for (const action of field.actions) {
      if (action.details.target != undefined) {
        const variable = action.details.target.value;
        if (variable == "score") {
          continue;
        }
        if (variableCounts[variable]) {
          variableCounts[variable]++;
        } else {
          variableCounts[variable] = 1;
        }
      }
    }

    for (const [variable, count] of Object.entries(variableCounts)) {
      if (count > 1) {
        duplicates.add(variable);
      }
      if (refCount.has(variable)) {
        actualDuplicate.add(variable);
      } else {
        refCount.add(variable);
      }
    }
  }

  return [...actualDuplicate];
}

// Read and parse the JSON file
fs.readFile(process.argv[2], "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    const raw = JSON.parse(data);
    const duplicates = findDuplicateVariables(raw.logic);
    console.log(
      "Variables added multiple times within the same field:",
      duplicates
    );
  } catch (parseErr) {
    console.error("Error parsing the JSON:", parseErr);
  }
});
