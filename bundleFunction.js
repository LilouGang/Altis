const fs = require("fs");
const path = require("path");

function bundleProjectFiles(rootDir, outputFile = "bundle.txt") {
  const IGNORE_DIRS = ["node_modules", ".git", ".next", "dist", "build"];
  const IGNORE_EXT = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico"];

  let output = "";

  function walk(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.relative(rootDir, fullPath);

      const stat = fs.statSync(fullPath);

      // Ignore folders
      if (stat.isDirectory()) {
        if (IGNORE_DIRS.includes(file)) continue;
        walk(fullPath);
      } else {
        const ext = path.extname(file);

        // Ignore binary / useless files
        if (IGNORE_EXT.includes(ext)) continue;

        const content = fs.readFileSync(fullPath, "utf-8");

        output += `\n===== FILE: ${relativePath} =====\n`;
        output += content + "\n";
      }
    }
  }

  walk(rootDir);

  fs.writeFileSync(outputFile, output, "utf-8");
  console.log(`✅ Bundle créé : ${outputFile}`);
}

module.exports = { bundleProjectFiles };