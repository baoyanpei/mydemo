export function getOriStr(data) {
  // console.log('data', data)
  var str = atob(data)
  // console.log('str', str)
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  var tmpUint8Array = new Uint8Array(arr);
  var inflate = new Zlib.Inflate(tmpUint8Array);
  var plain = inflate.decompress();
  var dataString = "";
  for (var i = 0; i < plain.length; i++) {
    dataString += String.fromCharCode(plain[i]);
  }
  // console.log("dataString", dataString)
  return dataString
}
const zlib = require('zlib');
export function getOriMesh(data) {
  // console.log('mesh', data)
  const buffer = Buffer.from(data, 'base64')
  return JSON.parse(zlib.unzipSync(buffer).toString())
  // console.log("dataString", dataString)
}
