// 打包 dist 为 zip，供上传 Edge Add-ons
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync } from "node:fs";

const outDir = "release";
const zipPath = `${outDir}/zhihu-mobile-web-enhancer.zip`;

mkdirSync(outDir, { recursive: true });
if (existsSync(zipPath)) rmSync(zipPath);

// PowerShell Compress-Archive，Windows 原生可用
execFileSync(
  "powershell",
  ["-NoProfile", "-Command", `Compress-Archive -Path 'dist/*' -DestinationPath '${zipPath}'`],
  { stdio: "inherit" }
);

console.log(`已生成 ${zipPath}`);
