module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
  ],

  parserOptions: {
    ecmaVersion: 10,
  },

  env: {
    browser: true,
    node: true,
  },

  rules: {
    strict: ["error", "global"],

    // Temporarily disable, until can deal with stuff like using separate
    // prop-types package.
    "react/no-deprecated": "off",
  },

  settings: {
    react: {
      version: "detect",
    },
  },
};
