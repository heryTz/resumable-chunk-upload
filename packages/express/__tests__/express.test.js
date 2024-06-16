'use strict';

const express = require('..');
const assert = require('assert').strict;

assert.strictEqual(express(), 'Hello from express');
console.info('express tests passed');
