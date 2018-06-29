const {
  append,
  assoc,
  compose,
  contains,
  evolve,
  has,
  prop,
  replace,
  tap,
  unless,
} = require('ramda');

module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      ramda: '^0.25.0',
    },
  });
  if (api.hasPlugin('babel')) {
    api.extendPackage({
      devDependencies: {
        'babel-plugin-ramda': '^1.2.0',
      },
    });
    api.render(tree => compose(
      tap((x) => { tree['babel.config.js'] = api.genJSConfig(x); }), // eslint-disable-line no-param-reassign
      unless(
        compose(
          contains('ramda'),
          prop('plugins'),
        ), evolve({
          plugins: append('ramda'),
        }),
      ),
      unless(has('plugins'), assoc('plugins', [])),
      x => eval(x)(), // eslint-disable-line no-eval
      replace(/^(.*)/sm, '() => ($1)'), // easiest way to read a JS config file is make it a funciton
      replace(/;$/m, ''),
      replace('module.exports =', ''),
      prop('babel.config.js'),
    )(tree));
  }
};
