const esModules = ['lodash-es', 'axios'].join('|');

module.exports = {
  transform: {
    [`^(${esModules}).+\\.js$`]: 'babel-jest',
  },
  // transformIgnorePatterns: [`node_modules/(?!(${esModules}))`],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!axios)'],
};
