/**
 * Created by solvek on 14.03.16.
 */

import * as util from 'util';

const REGEX = /\s*(-?\d+)/g;

const str = '500,Test3';

const res = str.match(REGEX);

console.log(util.inspect(res));
