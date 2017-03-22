const importer = require('./dist/main');
const mockBitId = ['bit.utils/array/flat-map', 'bit.utils/array/diff', 'bit.utils/empty']; // maybe add :: latest if needed
importer(mockBitId).then((componentDependencies) => {
  console.log(componentDependencies);
});
