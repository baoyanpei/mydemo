// 电梯使用的标准框架 参数：高度(米)


const cood = {
  x: 0,
  y: 0,
  r: 0
}

function LoadSection(sectionGroup, high) {
  var _loader = new THREE.ObjectLoader();
  _loader.load('/static/TowerAndElevator/Units/Section.json', function (obj) {
    obj.name = "ElevatorEection";
    InitSection(sectionGroup, obj, high);
  })
}

function InitSection(sectionGroup, obj, high) {
  obj.position.x = cood.x;
  obj.position.y = cood.y;
  obj.rotation.z = Math.PI / 180 * cood.r;
  obj.name = "ElevatorEection_0";
  sectionGroup.add(obj);
  //计算附加标准节数量
  secNum = Math.ceil(high);
  // 循环克隆创建标准节
  for (var i = 1; i < secNum; i++) {
    s = obj.clone();
    s.position.z += i; //高度偏移
    s.name = "ElevatorEection_" + String(i);
    sectionGroup.add(s);
  }
}
