import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => {
  try {
    return SetMetadata('roles', roles);
  } catch (e) /* istanbul ignore next */ {
    console.error(e);
    return e;
  }
};