import { createDatabase, createLocalDatabase } from '@tinacms/datalayer';
import { GitHubProvider } from 'tinacms-gitprovider-github';
import { Redis } from '@upstash/redis';
import { RedisLevel } from 'upstash-redis-level';

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

const branch = process.env.GITHUB_BRANCH || 'main';

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
      gitProvider: new GitHubProvider({
        repo: process.env.GITHUB_REPO!,
        owner: process.env.GITHUB_OWNER!,
        token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
        branch,
      }),
      databaseAdapter: new RedisLevel<string, Record<string, any>>({
        redis: new Redis({
          url: process.env.KV_REST_API_URL || 'http://localhost:8079',
          token: process.env.KV_REST_API_TOKEN || 'example_token',
        }),
        debug: process.env.DEBUG === 'true' || false,
        namespace: branch,
      }),
    });
