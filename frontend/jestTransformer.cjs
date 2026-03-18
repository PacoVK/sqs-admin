const { TsJestTransformer } = require('ts-jest');

class ImportMetaTransformer extends TsJestTransformer {
  constructor() {
    super({ useESM: true });
  }

  process(sourceText, sourcePath, options) {
    const modified = sourceText.replace(
      /import\.meta\.env\.(\w+)/g,
      'process.env["$1"]'
    );
    return super.process(modified, sourcePath, options);
  }
}

module.exports = {
  createTransformer() {
    return new ImportMetaTransformer();
  },
};
