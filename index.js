const importer = require('./dist/main');
const mockBitId = ['bit.utils/array/flat-map', 'bit.promise/global/promisify', 'bit.utils/array/diff']; // maybe add :: latest if needed
importer(mockBitId).then((componentDependencies) => {
  console.log(componentDependencies);
});
