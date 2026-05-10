#!/usr/bin/env node

import { execSync } from "child_process";

const args = process.argv.slice(2);
const command = args[0];

let setup_requuirements = () => {
    try {
        execSync("cargo --version", { stdio: "ignore" });
        console.log("✅ cargo found");
    } catch {
        console.log("🚀 Installing Rust (cargo) via rustup...");
        run_command("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y");
        run_command("source $HOME/.cargo/env");
    }

    try {
        execSync("wasm-pack --version", { stdio: "ignore" });
        console.log("✅ wasm-pack found");
    } catch {
        console.log("📦 Installing wasm-pack...");
        run_command("$HOME/.cargo/bin/cargo install wasm-pack");
    }

    console.log("⚙️ Building project...");
    run_command("cargo build --release && wasm-pack build --target web");

}

let run_command = (cmd) => {
    console.log(`▶️  ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
}

switch (command) {
    case "setup-requirements":
        setup_requuirements();
        break;

    case "dev":
        console.log("🚀 Starting Weavo dev server...");
        execSync("pnpm dev", { stdio: "inherit" });
        break;

    case "build":
        console.log("📦 Building Weavo app...");
        execSync("vite build", { stdio: "inherit" });
        break;

    default:
        console.log(`Unknown command: ${command}`);
        console.log(`
            Weavo CLI ⚡️

            Usage:
            weavo setup-requirements   Install Rust & Wasm deps
            weavo dev                  Start dev server
            weavo build                Build for production
            weavo help                 Show help
        `);
        process.exit(1);
}
