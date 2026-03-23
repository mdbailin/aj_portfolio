import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: 'tina/__generated__/.cache/1774254446815', url: 'http://localhost:4001/graphql', token: 'null', queries,  });
export default client;
  
