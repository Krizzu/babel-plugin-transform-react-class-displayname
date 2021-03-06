module.exports = function myPlugin({ types: t }) {
  const addDisplayName = name => t.classProperty(
      t.identifier('displayName'),
      t.stringLiteral(name),
      null,
      null,
      false
  );

  const visitorClassBody = (path, className) => {
    const length = path.node.body.length;
    let added = false;

    for (let i = 0; i < length; i++) {
      if (t.isClassProperty(path.node.body[i])) {
        const key = path.node.body[i].key;
        if (t.isIdentifier(key, { name: 'displayName' }) && !added) {
          added = true;
        }
      }
    }
    if (!added && className) {
      const node = addDisplayName(className);
      path.unshiftContainer('body', node);
      path.get('body.0').node.static = true;
    }
  };

  const classVisitor = {
    ClassDeclaration(path) {
      const pathBody = path.get('body');
      visitorClassBody(pathBody, path.node.id.name);
    },
    ClassExpression(path) {
      const pathBody = path.get('body');
      visitorClassBody(pathBody, path.node.id.name);
    },
  };

  return {
    visitor: {
      Program(path) {
        path.traverse(classVisitor);
      },
    },
  };
};
