const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("Usage: node script.js <filename.json>");
  process.exit(1);
}

const filename = process.argv[2];

fs.readFile(filename, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading file: ${filename}`);
    throw err;
  }

  const jsonData = JSON.parse(data);

  if (jsonData.logic && Array.isArray(jsonData.logic)) {
    jsonData.logic.forEach((logicObj) => {
      if (logicObj.ref && !isNaN(logicObj.ref)) {
        let actions = JSON.parse(JSON.stringify(logicObj.actions));
        actions = actions.map((action) => {
          var value = { ...action };
          const variable = `q${logicObj.ref}`;
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
