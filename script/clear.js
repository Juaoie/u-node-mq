const del = require("del");

(async () => {
  const deletedDirectoryPaths = await del(["dist", "operators", "plugins", "index.js", "index.js.map"]);

  console.log("Deleted directories:\n", deletedDirectoryPaths.join("\n"));
})();
