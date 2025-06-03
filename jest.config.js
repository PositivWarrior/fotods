/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/client/src'],
	moduleNameMapper: {
		// Handle CSS imports
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		// Handle image imports
		'\\.(jpg|jpeg|png|gif|webp|svg)$':
			'<rootDir>/client/__mocks__/fileMock.js',
		// Alias for @/ to client/src/
		'^@/(.*)$': '<rootDir>/client/src/$1',
		// Mock problematic ES modules
		'^wouter$': '<rootDir>/client/__mocks__/wouter.js',
		'^lucide-react$': '<rootDir>/client/__mocks__/lucide-react.js',
	},
	setupFilesAfterEnv: ['<rootDir>/client/jest.setup.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: {
					jsx: 'react-jsx',
				},
			},
		],
	},
	// Automatically clear mock calls and instances between every test
	clearMocks: true,
};
