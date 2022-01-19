import { grayscale, slate, white } from '../../../color';

import { Token, readToken, TokenValue, clamp } from '../../util';

export const surface = (grade: number) => readToken(token, grade);

const token: Token = {
  default: 'light',
  type: 'COLOR',
  modes: { dark, light },
};

function dark(grade: number): TokenValue {
  return grayscale(clamp(-1 * (grade / 4.5 - 1000)));
}

function light(grade: number): TokenValue {
  return grade >= 300 ? white : slate(clamp(-1 * (grade / 2 - 150)));
}

surface.primary = surface(400);
surface.secondary = surface(600);
surface.tertiary = surface(800);
