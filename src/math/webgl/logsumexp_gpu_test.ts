/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import * as test_util from '../../test_util';
import * as logsumexp_gpu from './logsumexp_gpu';

function cpuLogSumExp(m: Float32Array): number {
  if (m.length === 0) {
    throw new Error('m must have length greater than zero.');
  }
  let mMax = m[0];
  for (let i = 0; i < m.length; ++i) {
    mMax = Math.max(mMax, m[i]);
  }
  let expSum = 0;
  for (let i = 0; i < m.length; ++i) {
    expSum += Math.exp(m[i] - mMax);
  }
  const logSumExp = mMax + Math.log(expSum);
  return logSumExp;
}

describe('logsumexp_gpu', () => {
  it('returns 0 (ln(1) = 0) when the 1x1 input matrix is [0]', () => {
    const a = new Float32Array([0]);
    const result = logsumexp_gpu.uploadLogSumExpDownload(a, 1, 1);
    expect(result).toEqual(0);
  });

  it('returns ln(length) when the input matrix is [0]', () => {
    const a = new Float32Array(512 * 512);
    const result = logsumexp_gpu.uploadLogSumExpDownload(a, 512, 512);
    expect(result).toBeCloseTo(Math.log(a.length));
  });

  it('computes the same result as cpuLogSumExp', () => {
    const a = test_util.randomArrayInRange(12 * 29, -2, 2);
    const result = logsumexp_gpu.uploadLogSumExpDownload(a, 12, 29);
    const expected = cpuLogSumExp(a);
    expect(result).toBeCloseTo(expected);
  });
});
