module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    'plugin:prettier/recommended',
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error"
    ],
    "import/no-unresolved": [2, { commonjs: true, amd: true }],
    "import/order": [
      "warn",
      {
        "newlines-between": "always",
        "alphabetize": {
          "order": 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
          "caseInsensitive": true /* ignore case. Options: [true, false] */
        },
        "groups": [
          ["builtin",
            "internal",
            "external"],
          [
            "parent",
            "sibling",
            "index",
          ],
          "object",
          "type"
        ]
      }
    ]
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
