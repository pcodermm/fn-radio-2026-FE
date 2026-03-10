import React from 'react';
import { getPlatform } from './lib/device';

test('uses web as the platform identifier', () => {
  expect(getPlatform()).toBe('web');
});
