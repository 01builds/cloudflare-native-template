import { defineConfig } from "vitest/config";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";

export default defineConfig({
  plugins: [
    cloudflareTest({
      configPath: "../../wrangler.jsonc",
      miniflare: {
        d1Databases: ["DB"],
        kvNamespaces: ["CACHE_KV"],
        r2Buckets: ["STORAGE_R2"],
      },
    }),
  ],
});
