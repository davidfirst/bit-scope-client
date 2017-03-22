// @flow
import { getSync } from './global-config';
import { DEFAULT_HUB_DOMAIN, CFG_HUB_DOMAIN_KEY } from './constants';
const buildSSHUrl = (hubDomain, scope) => `ssh://bit@${hubDomain}:${scope}`;

export default function getRemote(scope: string): string {
  const userHubDomain = getSync(CFG_HUB_DOMAIN_KEY);
  return buildSSHUrl(userHubDomain || DEFAULT_HUB_DOMAIN, scope);
}
