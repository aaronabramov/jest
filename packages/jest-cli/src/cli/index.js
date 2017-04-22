/**
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

import type {Path} from 'types/Config';

const args = require('./args');
const getJest = require('./getJest');
const pkgDir = require('pkg-dir');
const runCLI = require('./runCLI');
const validateCLIOptions = require('jest-util').validateCLIOptions;
const yargs = require('yargs');

function run(argv?: Object, root?: Path) {
  argv = yargs(argv || process.argv.slice(2))
    .usage(args.usage)
    .help()
    .alias('help', 'h')
    .options(args.options)
    .epilogue(args.docs)
    .check(args.check).argv;

  validateCLIOptions(argv, args.options);

  if (argv.help) {
    yargs.showHelp();
    process.on('exit', () => process.exit(1));
    return;
  }

  if (!root) {
    root = pkgDir.sync();
  }

  argv.projects = argv.experimentalProjects;
  if (!argv.projects) {
    argv.projects = [root];
  }

  const execute = argv.projects.length === 1 ? getJest(root).runCLI : runCLI;
  execute(argv, argv.projects, result => {
    const code = !result || result.success ? 0 : 1;
    process.on('exit', () => process.exit(code));
    if (argv && argv.forceExit) {
      process.exit(code);
    }
  });
}

exports.run = run;
exports.runCLI = runCLI;
