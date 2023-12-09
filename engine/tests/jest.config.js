import { pathsToModuleNameMapper } from 'ts-jest';

import tsconfig from './tsconfig.json' with { type: "json" };

export default {
    preset: 'ts-jest',
    roots: ['<rootDir>'],
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
};
