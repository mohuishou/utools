const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const path = require("path")
const asar = require("asar")
const gzip = require("node-gzip")
const fs = require("fs")

try {
  (async () => {
    let tmp = core.getInput("tag_name").match(/v\d+\.\d+\.\d+/)
    let tag = tmp ? tmp[0] : ""
    let filename = core.getInput("filename")
    let dir = core.getInput("dir")
    let outputDir = core.getInput("output_dir")
    if (!filename) filename = path.basename(dir)

    // 1. 更改版本号
    let pluginPath = path.join(dir, "plugin.json")
    let plugin = JSON.parse(fs.readFileSync(pluginPath))
    plugin.version = tag
    fs.writeFileSync(pluginPath, JSON.stringify(plugin))

    // 2. asar 打包
    let asarDest = path.join(outputDir, filename + ".asar")
    await asar.createPackage(dir, asarDest)

    // 3. 压缩
    let output = path.join(outputDir, filename + "-" + tag + ".upx")
    let compressed = await gzip.gzip(fs.readFileSync(asarDest))
    fs.writeFileSync(output, compressed)
    core.setOutput("filepath", output)

    let uploadUrl = core.getInput("upload_url")
    await uploadRelease(uploadUrl, output)
  })()
} catch (error) {
  core.setFailed(error.message);
}


async function uploadRelease (uploadUrl, assetPath, assetContentType = "application/octet-stream") {
  try {
    const github = new GitHub(process.env.GITHUB_TOKEN);
    const assetName = path.basename(assetPath)

    // Determine content-length for header to upload asset
    const contentLength = filePath => fs.statSync(filePath).size;

    // Setup headers for API call, see Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset for more information
    const headers = { 'content-type': assetContentType, 'content-length': contentLength(assetPath) };

    // Upload a release asset
    // API Documentation: https://developer.github.com/v3/repos/releases/#upload-a-release-asset
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-upload-release-asset
    const uploadAssetResponse = await github.repos.uploadReleaseAsset({
      url: uploadUrl,
      headers,
      name: assetName,
      file: fs.readFileSync(assetPath)
    });

    // Get the browser_download_url for the uploaded release asset from the response
    const {
      data: { browser_download_url: browserDownloadUrl }
    } = uploadAssetResponse;
  } catch (error) {
    core.setFailed(error.message);
  }
}