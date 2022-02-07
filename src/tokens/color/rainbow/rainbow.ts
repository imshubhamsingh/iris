import { Token, readToken } from '../../util';

const dark =
  'conic-gradient(#FA4343, #9F3D5C, #503873, #73D2F6, #10B5FC, #8BCF0D, #FFC34E, #FB8920, #FA4343)';
const light =
  'conic-gradient(#FA4343, #9F3D5C, #503873, #73D2F6, #10B5FC, #8BCF0D, #FFC34E, #FB8920, #FA4343)';

const token: Token = {
  default: 'light',
  type: 'COLOR',
  modes: { dark, light },
};

export const rainbow = readToken(token);
