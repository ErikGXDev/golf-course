import * as fs from "fs";
import * as path from "path";

const args = process.argv.slice(2);

// Directory that points to the "simplified" output folder

const mapDir = args[0] || "./maps/Golf/simplified";

// There are Level folders in the maps directory
// We need to copy:
// _composite.png (rename to map.png)
// data.json
// Decoration.csv (rename to decoration.csv)
//
// The files will be copied into the public/maps/LevelName directory

const maps = fs.readdirSync(mapDir);

for (const map of maps) {
  console.log("Copying map: ", map);

  const mapPath = path.join(mapDir, map);
  if (!fs.statSync(mapPath).isDirectory()) {
    continue;
  }

  const levelName = path.basename(mapPath);
  const publicMapPath = path.join("public", "maps", levelName);

  if (!fs.existsSync(publicMapPath)) {
    fs.mkdirSync(publicMapPath, { recursive: true });
  }

  const files = fs.readdirSync(mapPath);

  for (const file of files) {
    const filePath = path.join(mapPath, file);
    let fileName;

    if (file === "_composite.png") {
      fileName = "map.png";
    }

    if (file === "data.json") {
      fileName = "data.json";
    }

    if (!fileName) {
      continue;
    }

    fs.copyFileSync(filePath, path.join(publicMapPath, fileName));
  }
}

console.log("Done copying maps");
