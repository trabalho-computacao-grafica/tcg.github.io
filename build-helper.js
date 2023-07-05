const fse = require("fs-extra");
const fs = require("fs");
const path = require("path");

const copyStaticDir = () => {
  const srcDir = path.join(__dirname, "static");
  const destDir = path.join(__dirname, "dist", "static");

  try {
    fse.copySync(srcDir, destDir, { overwrite: true });
    console.log("Success! Copied '/static' to '/dist/static'");
  } catch (err) {
    console.error(err);
  }
};

const adjustIndexHtml = () => {
  try {
    const indexHtmlPath = path.join(__dirname, "dist", "index.html");
    const indexHtmlStr = fs.readFileSync(indexHtmlPath, { encoding: "utf-8" });
    const formatedIndexHtmlStr = indexHtmlStr.replace(
      /\"\/assets/g,
      '"./assets'
    );
    fs.writeFileSync(indexHtmlPath, formatedIndexHtmlStr);
    console.log("Success! Formated '/dist/index.html' asset's imports");
  } catch (err) {
    console.error(err);
  }
};

const main = () => {
  copyStaticDir();
  adjustIndexHtml();
};

main();
