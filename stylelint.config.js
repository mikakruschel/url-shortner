module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-scss'],
  rules: {
    'selector-list-comma-newline-after': 'always-multi-line',
    'number-leading-zero': 'always',
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': [true, { ignoreAtRules: ['include'] }],
    'no-descending-specificity': null,
  },
};
