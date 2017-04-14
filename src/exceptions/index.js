import { DuplicateComponentException } from './duplicate-component';
import { InvalidBitJsonException } from './invalid-bit-json';
import { InvalidComponentIdException } from './invalid-component-id';
import { VersionNotExistsException } from './version-not-exists';

export const RemoteScopeNotFound = Error('remote scope not found');
export const NetworkError = Error('network error');
export const UnexpectedNetworkError = Error('unexpected network error');
export const PermissionDenied = Error('permission denied');
export const ComponentNotFound = Error('component not found');
export { DuplicateComponentException,
  InvalidBitJsonException,
  InvalidComponentIdException,
  VersionNotExistsException };

