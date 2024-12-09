/**
 * Created by solvek on 14.03.16.
 */

import { inspect } from 'node:util';

const REGEX = /\s*(-?\d+)/g;

const str = '500,Test3';

const res = str.match(REGEX);

console.log(inspect(res));
