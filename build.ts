import { execSync } from "node:child_process";
import { cpSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outputDir = join(root, ".output");
const targetDir = join(root, "src-tauri", ".output");

const ext = process.platform === "win32" ? ".exe" : "";

const rustInfo = execSync("rustc -vV").toString();
const targetTripleMatch = /host: (\S+)/g.exec(rustInfo);
if (!targetTripleMatch) {
  console.error("❌ Failed to determine platform target triple");
  process.exit(1);
}
const targetTriple = targetTripleMatch[1];

const finalExe = join(root, `src-tauri/bin/node_server-${targetTriple}${ext}`);

try {
  console.log("🛠️ Building TanStack app...");
  execSync("bun run build", { stdio: "inherit" });

  rmSync(targetDir, { recursive: true, force: true });
  mkdirSync(targetDir, { recursive: true });

  console.log("📦 Copying .output/public...");
  cpSync(join(outputDir, "public"), join(targetDir, "public"), { recursive: true });

  console.log("📦 Copying .output/server/chunks...");
  cpSync(join(outputDir, "server", "chunks"), join(targetDir, "server", "chunks"), { recursive: true });

  console.log("🔨 Packing server with nexe...");
  const tempExe = join(root, "node_server_temp" + ext);
  execSync(`nexe -i "${join(outputDir, "server", "index.mjs")}" -o "${tempExe}" --build`, { stdio: "inherit" });

  renameSync(tempExe, finalExe);

  console.log(`✅ Done! Sidecar binary is at ${finalExe}`);
} catch (err) {
  console.error("❌ Build failed:", err);
  process.exit(1);
}
