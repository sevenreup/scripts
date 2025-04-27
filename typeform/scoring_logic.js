const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node script.js <filename.json>");
  process.exit(1);
}

const filename = process.argv[2];

let types = [];
let typeMap = {};
const typesRaw = process.argv[3] ?? "";
if (typesRaw !== "") {
  if (typesRaw.includes(":")) {
    typesRaw.split(",").forEach((type) => {
      const single = type.split(":");
      typeMap[single[1]] = single[0];
    });
  } else {
    types = typesRaw.split(",");
  }
}

fs.readFile(filename, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${filename}`);
    throw err;
  }

  const jsonData = JSON.parse(data);

  if (jsonData.logic && Array.isArray(jsonData.logic)) {
    jsonData.logic.forEach((logicObj) => {
      if (logicObj.ref && (!isNaN(logicObj.ref) || isInTypes(logicObj.ref))) {
        let actions = JSON.parse(JSON.stringify(logicObj.actions));
        actions = actions.map((action) => {
          var value = { ...action };
          const variable = isNumeric(logicObj.ref)
            ? `q${logicObj.ref}`
            : getVariableName(logicObj.ref);
          console.log(variable);
          value.details.target.value = variable;
          jsonData.variables[variable] = 0;
          return value;
        });
        logicObj.actions = [...logicObj.actions, ...actions];
      }
    });

    const outputFolder = "output";
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    const outputPath = path.join(outputFolder, path.basename(filename));
    const updatedJson = JSON.stringify(jsonData, null, 2);
    fs.writeFile(outputPath, updatedJson, "utf8", (writeErr) => {
      if (writeErr) {
        console.error(`Error writing file: ${outputPath}`);
        throw writeErr;
      }
      console.log(
        `File updated successfully. Updated file saved to ${outputPath}`
      );
    });
  } else {
    console.error(
      'Invalid JSON format. The "logic" attribute must be an array.'
    );
  }
});

function getVariableName(ref) {
  if (Object.keys(typeMap).length > 0) {
    const pref = ref.replace(/\d+/g, "");
    const number = ref.match(/\d+/)[0];
    const type = typeMap[pref];
    return `${type}${number}`;
  }
  return ref;
}

function isInTypes(ref) {
  if (Object.keys(typeMap).length > 0) {
    const type = ref.replace(/\d+/g, "");
    return typeMap[type] !== undefined;
  }
  if (types.length === 0) return false;
  for (let i = 0; i < types.length; i++) {
    if (ref.includes(types[i])) return true;
  }
  return false;
}

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}
