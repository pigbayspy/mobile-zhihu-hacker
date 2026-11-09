// 打包 dist 为 zip，供上传 Edge Add-ons
// 产物文件名带版本号后缀，如 zhihu-mobile-web-enhancer-1.1.0.zip
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync, readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf-8"));

const outDir = "release";
const zipPath = `${outDir}/zhihu-mobile-web-enhancer-${version}.zip`;

mkdirSync(outDir, { recursive: true });
if (existsSync(zipPath)) rmSync(zipPath);

// PowerShell Compress-Archive，Windows 原生可用
execFileSync(
  "powershell",
  ["-NoProfile", "-Command", `Compress-Archive -Path 'dist/*' -DestinationPath '${zipPath}'`],
  { stdio: "inherit" }
);

console.log(`已生成 ${zipPath}`);
