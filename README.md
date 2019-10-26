# Nuxt parallel middleware module

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Nuxt module to load middlewares parallel to each other.

## Description

Nuxt loads all the middlewares sequentially.

Sometimes, we may have async middlewares (middleware that return promises), that do not need to wait on each other. But need to be waited on before Nuxt starts rendering the page.

This is where `nuxt-parallel-middleware` comes in.

It makes one middleware available called `parallel-middleware` that you can use in a layout.

Then, you have `parallelMiddleware` options available in your page components, where you can defines blocks of middlewares. Where blocks are executed sequentially but middlewares within a block are executed parallel to each other.

## Usage

Include the module in your `nuxt.config.js`

```js
module.exports = {
  modules: ['nuxt-parallel-middleware'],
};
```

Add `parallel-middleware` as a middleware to a layout

```js
// layout/default.vue

export default {
  middleware: ['parallel-middleware'],
};
```

Use `parallelMiddleware` options in your page components to load them simultaneously.

```js
// pages/some-page.vue

export default {
  parallelMiddleware: [['1'], ['2.1', '2.2', '2.3'], ['3.1', '3.2']],
};
```

Here, middleware `1` executes. If it returns a promise, it's waited on. Then the `2` block gets executed. `2.1`, `2.2` and `2.3` are executed parallel. Once the `2` block finishes, execution moves on to `3` block.

## 📑 License

[MIT License](./LICENSE)
