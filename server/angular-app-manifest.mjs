
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Started-at-ToDoApp/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Started-at-ToDoApp"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6610, hash: 'bd8adbf0f760ae4b7e7a0b1a00a8f3c6d93ae4ecac14d49b4bdc8182e6fd38c4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1071, hash: 'bf985548b5ef13844221e5d73b20b7e30a3986794491b4c5b4b4a9489ae839c0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 11583, hash: 'e247589bbd6adf2448d2be481aa7b0c54ba001d39c52e9c9e0b03f4a53b982fe', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-4UZIGD5P.css': {size: 14234, hash: '+FX7N7LZ2YM', text: () => import('./assets-chunks/styles-4UZIGD5P_css.mjs').then(m => m.default)}
  },
};
