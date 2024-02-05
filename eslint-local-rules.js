module.exports = {
  'flatlist-to-flashlist': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Change <FlatList> to <FlashList>',
        category: 'Custom',
        recommended: true,
      },
      fixable: 'code',
    },
    create(context) {
      return {
        JSXOpeningElement(node) {
          if (node.name.name === 'FlatList') {
            context.report({
              node,
              message: 'Use <FlashList> instead of <FlatList>',
              fix(fixer) {
                return fixer.replaceText(node, '<FlashList>');
              },
            });
          }
        },
      };
    },
  },
};
