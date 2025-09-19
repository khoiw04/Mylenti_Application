import { execSync } from "node:child_process";
import { cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outputDir = join(root, ".output");
const targetDir = join(root, "src-tauri", "bin", ".output");

const serverEntry = join(outputDir, "server", "index.mjs");
const outputExe = join(root, "src-tauri", "bin", "node_server.exe");

try {
  // 1. Build TanStack Start
  console.log("🛠️ Building TanStack app...");
  execSync("bun run build", { stdio: "inherit" });

  // 2. Tạo thư mục bin/.output nếu chưa có
  mkdirSync(targetDir, { recursive: true });

  // 3. Copy .output/public vào bin/.output/public
  console.log("📦 Copying .output/public to bin/.output/public...");
  cpSync(join(outputDir, "public"), join(targetDir, "public"), { recursive: true });

  // 4. Copy .output/server vào bin/.output/server
  console.log("📦 Copying .output/server to bin/.output/server...");
  cpSync(join(outputDir, "server"), join(targetDir, "server"), { recursive: true });

  // 5. Build node_server.exe với nexe
  console.log("🔨 Packing server with nexe (build mode)...");
  execSync(`nexe -i "${serverEntry}" -o "${outputExe}" --build`, {
    stdio: "inherit",
  });

  console.log("✅ All done! Everything is in src-tauri/bin/.output/");
} catch (err) {
  console.error("❌ Build failed:", err);
  process.exit(1);
}
