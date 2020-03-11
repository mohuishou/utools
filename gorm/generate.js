const fs = require("fs")
const path = require("path")
const anchor = require('markdown-it-anchor')
const prism = require('markdown-it-prism');
const md = require('markdown-it')({
  html: true,
}).use(anchor).use(prism, {
  defaultLanguage: "bash"
});

const dir = "docs/pages/zh_CN/docs"
const basepath = "public"
const output = "docs"
let indexes = []

let paths = fs.readdirSync(dir)
paths.forEach(p => {
  let file = fs.readFileSync(path.join(dir, p)).toString()
  let html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <link rel="stylesheet" href="prism.css">
      <link rel="stylesheet" href="vue.css">
    </head>
    <body>
      ${md.render(file)}
    </body>
  </html>
  `
  let filename = path.basename(p, ".md")
  let outFilename = filename + ".html"
  let outPath = path.join(output, outFilename)
  fs.writeFileSync(path.join(basepath, outPath), html)

  indexes.push({
    t: filename,
    d: filename,
    p: outPath,
  })


  let r = new RegExp(/#+\s+(.*)\n+(.*)/g)
  while ((header = r.exec(file)) != null) {
    indexes.push({
      t: header[1],
      d: header[2],
      p: outPath + `#${encodeURIComponent(header[1].toLowerCase().replace(/\s+/g, "-"))}`,
    })
  }
})

fs.writeFileSync(path.join(basepath, "indexes.json"), JSON.stringify(indexes))