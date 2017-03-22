// @flow
import { globalConfigGet, globalRemotesGet } from '../global-config';
import { DEFAULT_HUB_DOMAIN, CFG_HUB_DOMAIN_KEY, REMOTE_ALIAS_SIGN } from '../constants';
import getScopeJson from './scope-json-getter';

const buildRegistrySSHUrl = (hubDomain, scope) => `ssh://bit@${hubDomain}:${scope}`;

function isUserConfiguredScope(scope: string) {
  return scope.startsWith(REMOTE_ALIAS_SIGN);
}

export default function getRemote(scope: string): string {
  if (isUserConfiguredScope(scope)) {
    const scopeWithoutRemoteSign = scope.replace(REMOTE_ALIAS_SIGN, '');
    return localRemotesGet(scopeWithoutRemoteSign) || globalRemotesGet(scopeWithoutRemoteSign);
  }

  const userHubDomain = globalConfigGet(CFG_HUB_DOMAIN_KEY);
  return buildRegistrySSHUrl(userHubDomain || DEFAULT_HUB_DOMAIN, scope);
}

function localRemotesGet(scope: string): ?string {
  const currentDir = process.cwd();
  const scopeJson = getScopeJson(currentDir);
  if (!scopeJson) return undefined;

  try {
    return scopeJson.remotes ?
    scopeJson.remotes[scope] : undefined;
  } catch (e) {
    return undefined;
  }
}
