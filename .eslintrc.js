module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    // All rules disabled for deployment
    curly: "off",
    "newline-before-return": "off",
    "no-restricted-exports": "off",
    "react/jsx-sort-props": "off",
    "react/no-array-index-key": "off",
    "react/no-danger": "off",
    "react/self-closing-comp": "off",
    "react/function-component-definition": "off",
    "jsx-a11y/alt-text": "off",
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off",
    "@next/next/no-img-element": "off",
  },
  ignorePatterns: ["**/*"],
};
