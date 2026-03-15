import { createLocalDatabase } from '@tinacms/datalayer';

// This module is used by `tinacms build --local` and by the Astro static build.
// Both always run in local mode. The production database is created
// separately in worker.ts for the Cloudflare Worker runtime.
export default createLocalDatabase();
