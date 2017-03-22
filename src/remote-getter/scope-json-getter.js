import fs from 'fs';
import path from 'path';
import { BIT_HIDDEN_DIR, SCOPE_JSON } from '../constants';

function isBitWorkingDir(dir: string): bool {
  return fs.existsSync(path.join(dir, BIT_HIDDEN_DIR));
}

// TODO - if we want to be able to perform the import from the inner parts of the project
// and still relate to the project remotes
// we will need traverse backwards untill we find a scope.json
export default function getScopeJson(projectDir: string): ?Object {
  if (!isBitWorkingDir(projectDir)) return undefined;
  const scopeJsonPath = path.join(projectDir, BIT_HIDDEN_DIR, SCOPE_JSON);
  let unparsed;
  try {
    unparsed = fs.readFileSync(scopeJsonPath);
  } catch(e) {
    if (e.code !== 'ENOENT') throw e;
    return undefined;
  }

  return unparsed ? JSON.parse(unparsed): undefined;
}
