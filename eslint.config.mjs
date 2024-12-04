import eslintTypescript from 'typescript-eslint';

export default [
  ...eslintTypescript.configs.recommended,
  {
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', args: 'none', ignoreRestSiblings: true }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off' // Delegating to @typescript-eslint/no-unused-vars
    }
  }
];
