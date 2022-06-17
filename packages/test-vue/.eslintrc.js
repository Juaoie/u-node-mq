module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  globals: {
    plus: "readonly",
  },

  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

  parserOptions: {
    ecmaVersion: 9,
    parser: "babel-eslint",
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/experimental-script-setup-vars": "off",
  },
};
