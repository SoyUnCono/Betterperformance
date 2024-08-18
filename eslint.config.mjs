// eslint.config.mjs
import { Linter } from "eslint";

export default /** @type {Linter.Config} */ ({
  extends: ["next/core-web-vitals"],
  rules: {
    "semi": ["error", "always"],      
    "quotes": ["error", "double"],      
    "indent": ["error", 2],             
    "no-unused-vars": "warn",           
    "no-console": "warn",               
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],   
    "array-bracket-spacing": ["error", "never"],    
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
});
