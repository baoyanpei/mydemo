function loadtowerSection(towerGroup,Tname){
var m575 = new THREE.MeshLambertMaterial( { color: 0x5f401d,transparent:true,opacity:1 } );
var x575_geometry = new THREE.BufferGeometry();
var x575_vertices = new Float32Array( [
0.9,-0.883476,2.2,
-0.9,-0.883476,2.2,
-1,-0.983476,2.2,
-0.9,0.916524,2.2,
-1,-0.983476,2.2,
-0.9,-0.883476,2.2,
-1,1.01652,2.2,
-1,-0.983476,2.2,
-0.9,0.916524,2.2,
1,-0.983476,2.2,
0.9,-0.883476,2.2,
-1,-0.983476,2.2,
0.9,0.916524,2.2,
0.9,-0.883476,2.2,
1,-0.983476,2.2,
1,1.01652,2.2,
0.9,0.916524,2.2,
1,-0.983476,2.2,
1,1.01652,2.2,
-1,1.01652,2.2,
-0.9,0.916524,2.2,
1,1.01652,2.2,
-0.9,0.916524,2.2,
0.9,0.916524,2.2,
0.98,0.996524,0,
1,1.01652,0,
1,-0.983476,0,
0.98,0.996524,0,
1,-0.983476,0,
0.98,-0.963476,0,
-0.98,-0.963476,0,
1,-0.983476,0,
-1,-0.983476,0,
-0.98,-0.963476,0,
0.98,-0.963476,0,
1,-0.983476,0,
-1,1.01652,0,
-0.98,0.996524,0,
-0.98,-0.963476,0,
-1,1.01652,0,
-0.98,-0.963476,0,
-1,-0.983476,0,
-1,1.01652,0,
1,1.01652,0,
0.98,0.996524,0,
-1,1.01652,0,
0.98,0.996524,0,
-0.98,0.996524,0,
-0.8,1.01652,0.180549,
-0.7,1.01652,0.08,
-1,1.01652,0,
1,1.01652,0,
-0.7,1.01652,0.08,
0.8,1.01652,0.08,
-1,1.01652,2.2,
-0.8,1.01652,0.180549,
-1,1.01652,0,
-0.8,1.01652,2.12,
-0.8,1.01652,0.180549,
-1,1.01652,2.2,
0.8,1.01652,2.01945,
1,1.01652,0,
0.8,1.01652,0.08,
0.7,1.01652,2.12,
-0.8,1.01652,2.12,
-1,1.01652,2.2,
1,1.01652,2.2,
1,1.01652,0,
0.8,1.01652,2.01945,
1,1.01652,2.2,
0.8,1.01652,2.01945,
0.7,1.01652,2.12,
1,1.01652,0,
-1,1.01652,0,
-0.7,1.01652,0.08,
-1,1.01652,2.2,
1,1.01652,2.2,
0.7,1.01652,2.12,
0.8,1.01652,2.01945,
-0.7,1.01652,0.08,
0.7,1.01652,2.12,
0.7,1.01652,2.12,
-0.7,1.01652,0.08,
-0.8,1.01652,0.180549,
-1,-0.683476,2.12,
-1,1.01652,2.2,
-1,0.816524,2.12,
-1,-0.983476,2.2,
-1,-0.683476,2.12,
-1,-0.783476,2.01917,
-1,0.816524,0.180828,
-1,1.01652,2.2,
-1,1.01652,0,
-1,0.816524,0.180828,
-1,0.816524,2.12,
-1,1.01652,2.2,
-1,0.716524,0.08,
-1,0.816524,0.180828,
-1,1.01652,0,
-1,-0.983476,0,
-1,-0.783476,2.01917,
-1,-0.783476,0.08,
-1,-0.983476,0,
-1,-0.783476,0.08,
-1,0.716524,0.08,
-1,-0.983476,0,
-1,-0.983476,2.2,
-1,-0.783476,2.01917,
-1,1.01652,0,
-1,-0.983476,0,
-1,0.716524,0.08,
-1,-0.983476,2.2,
-1,1.01652,2.2,
-1,-0.683476,2.12,
-1,0.716524,0.08,
-1,-0.783476,2.01917,
-1,-0.683476,2.12,
-1,0.716524,0.08,
-1,-0.683476,2.12,
-1,0.816524,0.180828,
-0.98,0.816524,0.180828,
-0.98,0.816524,2.12,
-1,0.816524,2.12,
-0.98,0.816524,0.180828,
-1,0.816524,2.12,
-1,0.816524,0.180828,
-0.98,0.816524,0.180828,
-0.98,0.716524,0.08,
-0.98,0.996524,0,
-0.98,-0.963476,0,
-0.98,0.716524,0.08,
-0.98,-0.783476,0.08,
-0.98,-0.963476,0,
-0.98,0.996524,0,
-0.98,0.716524,0.08,
-0.98,0.996524,2.18,
-0.98,0.816524,0.180828,
-0.98,0.996524,0,
-0.98,0.816524,2.12,
-0.98,0.816524,0.180828,
-0.98,0.996524,2.18,
-0.98,-0.783476,2.01917,
-0.98,-0.963476,0,
-0.98,-0.783476,0.08,
-0.98,-0.683476,2.12,
-0.98,0.816524,2.12,
-0.98,0.996524,2.18,
-0.98,-0.963476,2.18,
-0.98,-0.963476,0,
-0.98,-0.783476,2.01917,
-0.98,-0.963476,2.18,
-0.98,-0.783476,2.01917,
-0.98,-0.683476,2.12,
-0.98,0.996524,2.18,
-0.98,-0.963476,2.18,
-0.98,-0.683476,2.12,
-0.98,0.816524,0.180828,
-0.98,-0.683476,2.12,
-0.98,-0.783476,2.01917,
-0.98,0.816524,0.180828,
-0.98,-0.783476,2.01917,
-0.98,0.716524,0.08,
0.7,0.996524,2.12,
-0.98,0.996524,2.18,
-0.8,0.996524,2.12,
0.98,0.996524,2.18,
0.7,0.996524,2.12,
0.8,0.996524,2.01945,
-0.8,0.996524,0.180549,
-0.8,0.996524,2.12,
-0.98,0.996524,2.18,
-0.98,0.996524,0,
-0.8,0.996524,0.180549,
-0.98,0.996524,2.18,
-0.7,0.996524,0.08,
-0.8,0.996524,0.180549,
-0.98,0.996524,0,
0.98,0.996524,0,
0.8,0.996524,2.01945,
0.8,0.996524,0.08,
0.98,0.996524,0,
0.8,0.996524,0.08,
-0.7,0.996524,0.08,
0.98,0.996524,0,
0.98,0.996524,2.18,
0.8,0.996524,2.01945,
0.98,0.996524,0,
-0.7,0.996524,0.08,
-0.98,0.996524,0,
0.98,0.996524,2.18,
-0.98,0.996524,2.18,
0.7,0.996524,2.12,
0.7,0.996524,2.12,
-0.8,0.996524,0.180549,
0.8,0.996524,2.01945,
0.8,0.996524,2.01945,
-0.8,0.996524,0.180549,
-0.7,0.996524,0.08,
-0.8,0.996524,2.12,
-0.8,0.996524,0.180549,
-0.8,1.01652,0.180549,
-0.8,0.996524,2.12,
-0.8,1.01652,0.180549,
-0.8,1.01652,2.12,
0.8,0.996524,0.08,
0.8,0.996524,2.01945,
0.8,1.01652,2.01945,
0.8,0.996524,0.08,
0.8,1.01652,2.01945,
0.8,1.01652,0.08,
0.98,0.816524,2.01945,
0.98,0.716524,2.12,
0.98,0.996524,2.18,
0.98,-0.963476,2.18,
0.98,0.716524,2.12,
0.98,-0.783476,2.12,
0.98,0.996524,0,
0.98,0.816524,2.01945,
0.98,0.996524,2.18,
0.98,0.816524,0.08,
0.98,0.816524,2.01945,
0.98,0.996524,0,
0.98,-0.783476,0.180549,
0.98,-0.963476,2.18,
0.98,-0.783476,2.12,
0.98,-0.683476,0.08,
0.98,0.816524,0.08,
0.98,0.996524,0,
0.98,-0.963476,0,
0.98,-0.783476,0.180549,
0.98,-0.683476,0.08,
0.98,-0.963476,0,
0.98,-0.683476,0.08,
0.98,0.996524,0,
0.98,-0.963476,0,
0.98,-0.963476,2.18,
0.98,-0.783476,0.180549,
0.98,-0.963476,2.18,
0.98,0.996524,2.18,
0.98,0.716524,2.12,
0.98,0.816524,2.01945,
0.98,-0.683476,0.08,
0.98,0.716524,2.12,
0.98,0.716524,2.12,
0.98,-0.683476,0.08,
0.98,-0.783476,0.180549,
1,0.816524,0.08,
1,0.816524,2.01945,
0.98,0.816524,2.01945,
1,0.816524,0.08,
0.98,0.816524,2.01945,
0.98,0.816524,0.08,
1,-0.683476,0.08,
1,1.01652,0,
1,0.816524,0.08,
1,-0.983476,0,
1,-0.683476,0.08,
1,-0.783476,0.180549,
1,0.816524,2.01945,
1,1.01652,0,
1,1.01652,2.2,
1,0.816524,2.01945,
1,0.816524,0.08,
1,1.01652,0,
1,0.716524,2.12,
1,0.816524,2.01945,
1,1.01652,2.2,
1,-0.983476,2.2,
1,-0.783476,0.180549,
1,-0.783476,2.12,
1,-0.983476,2.2,
1,-0.783476,2.12,
1,0.716524,2.12,
1,-0.983476,2.2,
1,-0.983476,0,
1,-0.783476,0.180549,
1,-0.983476,0,
1,1.01652,0,
1,-0.683476,0.08,
1,1.01652,2.2,
1,-0.983476,2.2,
1,0.716524,2.12,
1,0.716524,2.12,
1,-0.783476,0.180549,
1,0.816524,2.01945,
1,0.816524,2.01945,
1,-0.783476,0.180549,
1,-0.683476,0.08,
-0.8,-0.983476,2.01945,
-0.7,-0.983476,2.12,
-1,-0.983476,2.2,
1,-0.983476,2.2,
-0.7,-0.983476,2.12,
0.8,-0.983476,2.12,
-1,-0.983476,0,
-0.8,-0.983476,2.01945,
-1,-0.983476,2.2,
-0.8,-0.983476,0.08,
-0.8,-0.983476,2.01945,
-1,-0.983476,0,
0.8,-0.983476,0.180549,
1,-0.983476,2.2,
0.8,-0.983476,2.12,
0.7,-0.983476,0.08,
-0.8,-0.983476,0.08,
-1,-0.983476,0,
1,-0.983476,0,
1,-0.983476,2.2,
0.8,-0.983476,0.180549,
1,-0.983476,0,
0.8,-0.983476,0.180549,
0.7,-0.983476,0.08,
-1,-0.983476,0,
1,-0.983476,0,
0.7,-0.983476,0.08,
1,-0.983476,2.2,
-1,-0.983476,2.2,
-0.7,-0.983476,2.12,
-0.8,-0.983476,2.01945,
0.7,-0.983476,0.08,
-0.7,-0.983476,2.12,
-0.7,-0.983476,2.12,
0.7,-0.983476,0.08,
0.8,-0.983476,0.180549,
1,-0.783476,2.12,
1,-0.783476,0.180549,
0.98,-0.783476,0.180549,
1,-0.783476,2.12,
0.98,-0.783476,0.180549,
0.98,-0.783476,2.12,
0.7,-0.963476,0.08,
-0.98,-0.963476,0,
-0.8,-0.963476,0.08,
0.98,-0.963476,0,
-0.98,-0.963476,0,
0.7,-0.963476,0.08,
0.8,-0.963476,0.180549,
0.98,-0.963476,0,
0.7,-0.963476,0.08,
-0.8,-0.963476,2.01945,
-0.98,-0.963476,0,
-0.98,-0.963476,2.18,
-0.8,-0.963476,2.01945,
-0.8,-0.963476,0.08,
-0.98,-0.963476,0,
-0.7,-0.963476,2.12,
-0.8,-0.963476,2.01945,
-0.98,-0.963476,2.18,
0.98,-0.963476,2.18,
0.8,-0.963476,0.180549,
0.8,-0.963476,2.12,
0.98,-0.963476,2.18,
0.8,-0.963476,2.12,
-0.7,-0.963476,2.12,
-0.98,-0.963476,2.18,
0.98,-0.963476,2.18,
-0.7,-0.963476,2.12,
0.98,-0.963476,2.18,
0.98,-0.963476,0,
0.8,-0.963476,0.180549,
-0.7,-0.963476,2.12,
0.8,-0.963476,0.180549,
-0.8,-0.963476,2.01945,
-0.8,-0.963476,2.01945,
0.8,-0.963476,0.180549,
0.7,-0.963476,0.08,
0.8,-0.963476,0.180549,
0.8,-0.983476,2.12,
0.8,-0.963476,2.12,
0.8,-0.983476,0.180549,
0.8,-0.983476,2.12,
0.8,-0.963476,0.180549,
-0.8,-0.983476,2.01945,
-0.8,-0.983476,0.08,
-0.8,-0.963476,0.08,
-0.8,-0.983476,2.01945,
-0.8,-0.963476,0.08,
-0.8,-0.963476,2.01945,
-0.98,-0.783476,2.01917,
-0.98,-0.783476,0.08,
-1,-0.783476,0.08,
-0.98,-0.783476,2.01917,
-1,-0.783476,0.08,
-1,-0.783476,2.01917,
1,0.816524,0.08,
0.98,0.816524,0.08,
0.98,-0.683476,0.08,
1,0.816524,0.08,
0.98,-0.683476,0.08,
1,-0.683476,0.08,
-1,0.816524,2.12,
-0.98,0.816524,2.12,
-0.98,-0.683476,2.12,
-1,0.816524,2.12,
-0.98,-0.683476,2.12,
-1,-0.683476,2.12,
-0.9,-0.883476,2.18,
0.9,-0.883476,2.18,
0.98,-0.963476,2.18,
0.9,0.916524,2.18,
0.98,-0.963476,2.18,
0.9,-0.883476,2.18,
-0.98,-0.963476,2.18,
-0.9,-0.883476,2.18,
0.98,-0.963476,2.18,
0.98,0.996524,2.18,
0.98,-0.963476,2.18,
0.9,0.916524,2.18,
-0.9,0.916524,2.18,
-0.9,-0.883476,2.18,
-0.98,-0.963476,2.18,
-0.98,0.996524,2.18,
-0.9,0.916524,2.18,
-0.98,-0.963476,2.18,
-0.98,0.996524,2.18,
0.98,0.996524,2.18,
0.9,0.916524,2.18,
-0.98,0.996524,2.18,
0.9,0.916524,2.18,
-0.9,0.916524,2.18,
0.9,-0.883476,2.2,
0.9,-0.883476,2.18,
-0.9,-0.883476,2.18,
0.9,-0.883476,2.2,
-0.9,-0.883476,2.18,
-0.9,-0.883476,2.2,
-0.9,-0.883476,2.2,
-0.9,-0.883476,2.18,
-0.9,0.916524,2.18,
-0.9,-0.883476,2.2,
-0.9,0.916524,2.18,
-0.9,0.916524,2.2,
0.9,0.916524,2.18,
0.9,0.916524,2.2,
-0.9,0.916524,2.2,
0.9,0.916524,2.18,
-0.9,0.916524,2.2,
-0.9,0.916524,2.18,
0.9,-0.883476,2.18,
0.9,-0.883476,2.2,
0.9,0.916524,2.2,
0.9,-0.883476,2.18,
0.9,0.916524,2.2,
0.9,0.916524,2.18,
0.7,-0.963476,0.08,
-0.8,-0.983476,2.01945,
-0.8,-0.963476,2.01945,
0.7,-0.983476,0.08,
-0.8,-0.983476,2.01945,
0.7,-0.963476,0.08,
-0.7,-0.963476,2.12,
0.8,-0.983476,0.180549,
0.8,-0.963476,0.180549,
-0.7,-0.983476,2.12,
0.8,-0.983476,0.180549,
-0.7,-0.963476,2.12,
0.98,-0.783476,0.180549,
1,0.716524,2.12,
0.98,0.716524,2.12,
1,-0.783476,0.180549,
1,0.716524,2.12,
0.98,-0.783476,0.180549,
0.98,0.816524,2.01945,
1,-0.683476,0.08,
0.98,-0.683476,0.08,
1,0.816524,2.01945,
1,-0.683476,0.08,
0.98,0.816524,2.01945,
-0.8,1.01652,0.180549,
0.7,0.996524,2.12,
0.7,1.01652,2.12,
-0.8,0.996524,0.180549,
0.7,0.996524,2.12,
-0.8,1.01652,0.180549,
0.8,1.01652,2.01945,
-0.7,0.996524,0.08,
-0.7,1.01652,0.08,
0.8,0.996524,2.01945,
-0.7,0.996524,0.08,
0.8,1.01652,2.01945,
-0.98,-0.683476,2.12,
-0.98,0.816524,0.180828,
-1,0.816524,0.180828,
-0.98,-0.683476,2.12,
-1,0.816524,0.180828,
-1,-0.683476,2.12,
-1,0.716524,0.08,
-0.98,-0.783476,2.01917,
-1,-0.783476,2.01917,
-0.98,0.716524,0.08,
-0.98,-0.783476,2.01917,
-1,0.716524,0.08,
-0.8,1.01652,2.12,
0.7,1.01652,2.12,
0.7,0.996524,2.12,
-0.8,1.01652,2.12,
0.7,0.996524,2.12,
-0.8,0.996524,2.12,
-0.7,-0.963476,2.12,
0.8,-0.963476,2.12,
0.8,-0.983476,2.12,
-0.7,-0.963476,2.12,
0.8,-0.983476,2.12,
-0.7,-0.983476,2.12,
0.98,0.716524,2.12,
1,-0.783476,2.12,
0.98,-0.783476,2.12,
0.98,0.716524,2.12,
1,0.716524,2.12,
1,-0.783476,2.12,
-0.7,1.01652,0.08,
0.8,0.996524,0.08,
0.8,1.01652,0.08,
-0.7,1.01652,0.08,
-0.7,0.996524,0.08,
0.8,0.996524,0.08,
-0.8,-0.963476,0.08,
-0.8,-0.983476,0.08,
0.7,-0.983476,0.08,
-0.8,-0.963476,0.08,
0.7,-0.983476,0.08,
0.7,-0.963476,0.08,
-0.98,0.716524,0.08,
-1,-0.783476,0.08,
-0.98,-0.783476,0.08,
-0.98,0.716524,0.08,
-1,0.716524,0.08,
-1,-0.783476,0.08,
]);
x575_normals = new Float32Array( [
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
1,3.37905e-033,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
3.37905e-033,-1,2.18516e-032,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
-1,-3.37905e-033,2.18516e-032,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-3.37905e-033,1,2.18516e-032,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
-1.54423e-029,1.35153e-033,1,
-1.54423e-029,1.35153e-033,1,
-1.54423e-029,1.35153e-033,1,
-1.54423e-029,1.35153e-033,1,
-1.54423e-029,1.35153e-033,1,
-1.54423e-029,1.35153e-033,1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
0,1,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
1,0,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
0,-1,0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-1,-0,-0,
-0.791022,4.64948e-015,-0.611788,
-0.791022,4.64948e-015,-0.611788,
-0.791022,4.64948e-015,-0.611788,
-0.791022,4.64948e-015,-0.611788,
-0.791022,4.64948e-015,-0.611788,
-0.791022,4.64948e-015,-0.611788,
0.791022,-4.14108e-015,0.611788,
0.791022,-4.14108e-015,0.611788,
0.791022,-4.14108e-015,0.611788,
0.791022,-4.14108e-015,0.611788,
0.791022,-4.14108e-015,0.611788,
0.791022,-4.14108e-015,0.611788,
-9.27413e-015,-0.791022,0.611788,
-9.27413e-015,-0.791022,0.611788,
-9.27413e-015,-0.791022,0.611788,
-9.27413e-015,-0.791022,0.611788,
-9.27413e-015,-0.791022,0.611788,
-9.27413e-015,-0.791022,0.611788,
1.0684e-014,0.791022,-0.611788,
1.0684e-014,0.791022,-0.611788,
1.0684e-014,0.791022,-0.611788,
1.0684e-014,0.791022,-0.611788,
1.0684e-014,0.791022,-0.611788,
1.0684e-014,0.791022,-0.611788,
-0.791022,1.23938e-014,0.611788,
-0.791022,1.23938e-014,0.611788,
-0.791022,1.23938e-014,0.611788,
-0.791022,1.23938e-014,0.611788,
-0.791022,1.23938e-014,0.611788,
-0.791022,1.23938e-014,0.611788,
0.791022,-1.30017e-014,-0.611788,
0.791022,-1.30017e-014,-0.611788,
0.791022,-1.30017e-014,-0.611788,
0.791022,-1.30017e-014,-0.611788,
0.791022,-1.30017e-014,-0.611788,
0.791022,-1.30017e-014,-0.611788,
-7.73583e-015,0.790979,0.611843,
-7.73583e-015,0.790979,0.611843,
-7.73583e-015,0.790979,0.611843,
-7.73583e-015,0.790979,0.611843,
-7.73583e-015,0.790979,0.611843,
-7.73583e-015,0.790979,0.611843,
-4.94686e-015,-0.790979,-0.611843,
-4.94686e-015,-0.790979,-0.611843,
-4.94686e-015,-0.790979,-0.611843,
-4.94686e-015,-0.790979,-0.611843,
-4.94686e-015,-0.790979,-0.611843,
-4.94686e-015,-0.790979,-0.611843,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
0,0,-1,
1.35153e-033,-1.54423e-029,1,
1.35153e-033,-1.54423e-029,1,
1.35153e-033,-1.54423e-029,1,
1.35153e-033,-1.54423e-029,1,
1.35153e-033,-1.54423e-029,1,
1.35153e-033,-1.54423e-029,1,
-1.35153e-033,1.54423e-029,1,
-1.35153e-033,1.54423e-029,1,
-1.35153e-033,1.54423e-029,1,
-1.35153e-033,1.54423e-029,1,
-1.35153e-033,1.54423e-029,1,
-1.35153e-033,1.54423e-029,1,
1.54423e-029,-1.35153e-033,1,
1.54423e-029,-1.35153e-033,1,
1.54423e-029,-1.35153e-033,1,
1.54423e-029,-1.35153e-033,1,
1.54423e-029,-1.35153e-033,1,
1.54423e-029,-1.35153e-033,1,
]);
x575_uvs = new Float32Array( [
0.95,0.05,0.05,0.05,0,0,
0.05,0.95,0,0,0.05,0.05,
0,1,0,0,0.05,0.95,
1,0,0.95,0.05,0,0,
0.95,0.95,0.95,0.05,1,0,
1,1,0.95,0.95,1,0,
1,1,0,1,0.05,0.95,
1,1,0.05,0.95,0.95,0.95,
0.01,0.99,0,1,0,0,
0.01,0.99,0,0,0.01,0.01,
0.99,0.01,0,0,1,0,
0.99,0.01,0.01,0.01,0,0,
1,1,0.99,0.99,0.99,0.01,
1,1,0.99,0.01,1,0,
1,1,0,1,0.01,0.99,
1,1,0.01,0.99,0.99,0.99,
0.0820675,0.1,0.0363636,0.15,0,0,
0,1,0.0363636,0.15,0.0363636,0.9,
1,0,0.0820675,0.1,0,0,
0.963636,0.1,0.0820675,0.1,1,0,
0.917933,0.9,0,1,0.0363636,0.9,
0.963636,0.85,0.963636,0.1,1,0,
1,1,0,1,0.917933,0.9,
1,1,0.917933,0.9,0.963636,0.85,
0,1,0,0,0.0363636,0.15,
1,0,1,1,0.963636,0.85,
0.917933,0.9,0.0363636,0.15,0.963636,0.85,
0.963636,0.85,0.0363636,0.15,0.0820675,0.1,
0.0363636,0.85,0,0,0.0363636,0.1,
0,1,0.0363636,0.85,0.0821946,0.9,
0.917805,0.1,0,0,1,0,
0.917805,0.1,0.0363636,0.1,0,0,
0.963636,0.15,0.917805,0.1,1,0,
1,1,0.0821946,0.9,0.963636,0.9,
1,1,0.963636,0.9,0.963636,0.15,
1,1,0,1,0.0821946,0.9,
1,0,1,1,0.963636,0.15,
0,1,0,0,0.0363636,0.85,
0.963636,0.15,0.0821946,0.9,0.0363636,0.85,
0.963636,0.15,0.0363636,0.85,0.917805,0.1,
1,1,5.15272e-016,1,5.15272e-016,0,
1,1,5.15272e-016,0,1,0,
0.0829487,0.0918367,0.0366972,0.142857,0,0,
0,1,0.0366972,0.142857,0.0366972,0.908163,
0,1,0,0,0.0366972,0.142857,
1,0,0.0829487,0.0918367,0,0,
0.972477,0.0918367,0.0829487,0.0918367,1,0,
0.926226,0.908163,0,1,0.0366972,0.908163,
0.972477,0.857143,0.972477,0.0918367,1,0,
1,1,0,1,0.926226,0.908163,
1,1,0.926226,0.908163,0.972477,0.857143,
1,0,1,1,0.972477,0.857143,
0.0829487,0.0918367,0.972477,0.857143,0.926226,0.908163,
0.0829487,0.0918367,0.926226,0.908163,0.0366972,0.142857,
0.0275229,0.857143,0,0,0.0275229,0.0918367,
0,1,0.0275229,0.857143,0.0736461,0.908163,
0.91718,0.0918367,0.0275229,0.0918367,0,0,
1,0,0.91718,0.0918367,0,0,
0.963303,0.142857,0.91718,0.0918367,1,0,
1,1,0.0736461,0.908163,0.963303,0.908163,
1,1,0.963303,0.908163,0.963303,0.142857,
1,1,0,1,0.0736461,0.908163,
1,1,0.963303,0.142857,1,0,
0,1,0,0,0.0275229,0.857143,
0.0275229,0.857143,0.91718,0.0918367,0.0736461,0.908163,
0.0736461,0.908163,0.91718,0.0918367,0.963303,0.142857,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,2.28977e-016,1,2.28977e-016,0,
1,1,2.28977e-016,0,1,0,
0.0736461,0.0918367,0.0275229,0.142857,0,0,
0,1,0.0275229,0.142857,0.0275229,0.908163,
1,0,0.0736461,0.0918367,0,0,
0.963303,0.0918367,0.0736461,0.0918367,1,0,
0.91718,0.908163,0,1,0.0275229,0.908163,
0.963303,0.857143,0.963303,0.0918367,1,0,
1,1,0.91718,0.908163,0.963303,0.857143,
1,1,0.963303,0.857143,1,0,
1,1,0,1,0.91718,0.908163,
0,1,0,0,0.0275229,0.142857,
0.0736461,0.0918367,0.963303,0.857143,0.0275229,0.142857,
0.0275229,0.142857,0.963303,0.857143,0.91718,0.908163,
1,1,2.28977e-016,1,2.28977e-016,0,
1,1,2.28977e-016,0,1,0,
0.0363636,0.85,0,0,0.0363636,0.1,
0,1,0.0363636,0.85,0.0820675,0.9,
0.917933,0.1,0,0,1,0,
0.917933,0.1,0.0363636,0.1,0,0,
0.963636,0.15,0.917933,0.1,1,0,
1,1,0.0820675,0.9,0.963636,0.9,
1,1,0.963636,0.9,0.963636,0.15,
1,1,0,1,0.0820675,0.9,
0,1,0,0,0.0363636,0.85,
1,0,1,1,0.963636,0.15,
0.963636,0.15,0.0820675,0.9,0.917933,0.1,
0.917933,0.1,0.0820675,0.9,0.0363636,0.85,
0.0820675,0.1,0.0363636,0.15,0,0,
0,1,0.0363636,0.15,0.0363636,0.9,
1,0,0.0820675,0.1,0,0,
0.963636,0.1,0.0820675,0.1,1,0,
0.917933,0.9,0,1,0.0363636,0.9,
0.963636,0.85,0.963636,0.1,1,0,
1,1,0,1,0.917933,0.9,
1,1,0.917933,0.9,0.963636,0.85,
1,0,1,1,0.963636,0.85,
0,1,0,0,0.0363636,0.15,
0.0820675,0.1,0.963636,0.85,0.0363636,0.15,
0.0363636,0.15,0.963636,0.85,0.917933,0.9,
1,1,1.9463e-015,1,1.9463e-015,0,
1,1,1.9463e-015,0,1,0,
0.0366972,0.857143,0,0,0.0366972,0.0918367,
0,1,0,0,0.0366972,0.857143,
0.0828204,0.908163,0,1,0.0366972,0.857143,
0.926354,0.0918367,0,0,1,0,
0.926354,0.0918367,0.0366972,0.0918367,0,0,
0.972477,0.142857,0.926354,0.0918367,1,0,
1,1,0.0828204,0.908163,0.972477,0.908163,
1,1,0.972477,0.908163,0.972477,0.142857,
1,0,1,1,0.972477,0.142857,
1,1,0,1,0.0828204,0.908163,
0.972477,0.142857,0.0828204,0.908163,0.926354,0.0918367,
0.926354,0.0918367,0.0828204,0.908163,0.0366972,0.857143,
1,0,2.51874e-015,1,2.51874e-015,0,
1,1,2.51874e-015,1,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,1,0,7.40149e-017,
1,1,0,7.40149e-017,1,7.40149e-017,
1,1,0,1,0,7.40149e-017,
1,1,0,7.40149e-017,1,7.40149e-017,
0.959184,0.0408163,0.0408163,0.0408163,0,0,
0.0408163,0.959184,0,0,0.0408163,0.0408163,
1,0,0.959184,0.0408163,0,0,
0,1,0,0,0.0408163,0.959184,
0.959184,0.959184,0.959184,0.0408163,1,0,
1,1,0.959184,0.959184,1,0,
1,1,0,1,0.0408163,0.959184,
1,1,0.0408163,0.959184,0.959184,0.959184,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,0,9.05628e-017,1,9.05628e-017,0,
1,1,9.05628e-017,1,1,0,
1,0,-9.05628e-017,1,-9.05628e-017,-5.55112e-015,
1,1,-9.05628e-017,1,1,0,
1,0,0,1,0,0,
1,1,0,1,1,0,
1,0,0,1,0,0,
1,1,0,1,1,0,
1,0,1.449e-015,1,1.449e-015,0,
1,1,1.449e-015,1,1,0,
1,5.55112e-015,0,1,0,5.55112e-015,
1,1,0,1,1,5.55112e-015,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,5.55112e-015,5.43426e-016,1,5.43426e-016,-5.55112e-015,
1,1,5.43426e-016,1,1,5.55112e-015,
1,1,7.40149e-017,1,7.40149e-017,0,
1,1,7.40149e-017,0,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,0,1,0,
1,1,0,1,0,0,
1,1,0,0,1,0,
1,1,0,1,0,0,
1,1,0,1,0,7.40149e-017,
1,1,0,7.40149e-017,1,7.40149e-017,
1,1,0,0,1,0,
1,1,0,1,0,0,
]);
x575_geometry.addAttribute( 'position', new THREE.BufferAttribute( x575_vertices, 3));
x575_geometry.addAttribute( 'normal', new THREE.BufferAttribute( x575_normals, 3));
x575_geometry.addAttribute( 'uv', new THREE.BufferAttribute( x575_uvs, 2));
mesh575 = new THREE.Mesh( x575_geometry , m575);
mesh575.name = 'Section';
towerGroup.getObjectByName(Tname+"_U",true).add(mesh575)
}
