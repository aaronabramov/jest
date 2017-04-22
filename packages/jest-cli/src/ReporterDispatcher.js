/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import type {GlobalConfig} from 'types/Config';
import type {Context} from 'types/Context';
import type {Test} from 'types/TestRunner';
import type {TestResult, AggregatedResult} from 'types/TestResult';
import type BaseReporter from './reporters/BaseReporter';
import type {ReporterOnStartOptions} from 'types/Reporters';

export type RunOptions = {
  estimatedTime: number,
  showStatus: boolean,
};

class ReporterDispatcher {
  _disabled: boolean;
  _reporters: Array<BaseReporter>;

  constructor() {
    this._reporters = [];
  }

  register(reporter: BaseReporter): void {
    this._reporters.push(reporter);
  }

  unregister(ReporterClass: Function) {
    this._reporters = this._reporters.filter(
      reporter => !(reporter instanceof ReporterClass),
    );
  }

  onTestResult(
    test: Test,
    testResult: TestResult,
    results: AggregatedResult,
  ) {
    this._reporters.forEach(reporter =>
      reporter.onTestResult(test, testResult, results),
    );
  }

  onTestStart(test: Test) {
    this._reporters.forEach(reporter => reporter.onTestStart(test));
  }

  onRunStart(
    config: GlobalConfig,
    results: AggregatedResult,
    options: ReporterOnStartOptions,
  ) {
    this._reporters.forEach(reporter =>
      reporter.onRunStart(config, results, options),
    );
  }

  onRunComplete(
    contexts: Set<Context>,
    config: GlobalConfig,
    results: AggregatedResult,
  ) {
    this._reporters.forEach(reporter =>
      reporter.onRunComplete(contexts, config, results),
    );
  }

  // Return a list of last errors for every reporter
  getErrors(): Array<Error> {
    return this._reporters.reduce((list, reporter) => {
      const error = reporter.getLastError();
      return error ? list.concat(error) : list;
    }, []);
  }

  hasErrors(): boolean {
    return this.getErrors().length !== 0;
  }
}

module.exports = ReporterDispatcher;
