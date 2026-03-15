import { createLocalDatabase } from '@tinacms/datalayer';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

// Use dynamic imports for production deps so they're not loaded during local builds.
// This avoids the ESM/CJS interop issue with upstash-redis-level.
async function createProductionDatabase() {
  const { createDatabase } = await import('@tinacms/datalayer');
  const { GitHubProvider } = await import('tinacms-gitprovider-github');
  const { Redis } = await import('@upstash/redis');
  const redisLevelModule = await import('upstash-redis-level');
  const RedisLevel = redisLevelModule.RedisLevel ?? redisLevelModule.default;

  const branch = process.env.GITHUB_BRANCH || 'main';

  return createDatabase({
    gitProvider: new GitHubProvider({
      repo: process.env.GITHUB_REPO!,
      owner: process.env.GITHUB_OWNER!,
      token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
      branch,
    }),
    databaseAdapter: new RedisLevel({
      redis: new Redis({
        url: process.env.KV_REST_API_URL || 'http://localhost:8079',
        token: process.env.KV_REST_API_TOKEN || 'example_token',
      }),
      debug: process.env.DEBUG === 'true' || false,
      namespace: branch,
    }),
  });
}

export default isLocal ? createLocalDatabase() : await createProductionDatabase();
