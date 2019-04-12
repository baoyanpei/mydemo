function modifyTower(towerGroup, name, high, degree, distance, length) {
  //判断是新增还是更新信息
  degree = degree - 90 // 根据现场实际的角度进行了修正90度
  var isEx = towerGroup.getObjectByName(name, true);
  if (isEx) {
    updateTower(isEx, degree, distance, length)
    //数据更新的时候不处理高度！因为在一天之内，塔吊高度不会变化
  } else {
    addTower(towerGroup, name, high, degree, distance, length)
  }
}

function addTower(towerGroup, Tname, Thigh, Tdegree, Tdistance, Tlength) {
  //初始化组变量，一个要转，一个不转
  var tower = new THREE.Object3D();
  var tower_unmove = new THREE.Object3D();
  //加载大臂
  $.getScript('/static/TowerAndElevator/Units/tower_arm.js', () => {
    loadtowerArm(towerGroup, Tname) //加载
    setArmHigh(towerGroup, Tname, Thigh) //设置大臂高度
  });
  //加载标准节
  $.getScript('/static/TowerAndElevator/Units/tower_section.js', () => {
    loadtowerSection(towerGroup, Tname) //加载
    createSectionHigh(towerGroup, Tname, Thigh) //设置各个标准节，并调整高度
  });
  //加载小车
  $.getScript('/static/TowerAndElevator/Units/tower_car.js', () => {
    loadtowerCar(towerGroup, Tname) //加载
    initCar(towerGroup, Tname, Tdistance) //初始化小车车位置
  });
  //加载吊钩
  $.getScript('/static/TowerAndElevator/Units/tower_hook.js', () => {
    loadtowerHook(towerGroup, Tname) //加载
    initHook(towerGroup, Tname, Tdistance, Tlength) //初始化吊钩
  });
  //加载挂线
  $.getScript('/static/TowerAndElevator/Units/tower_line.js', () => {
    loadtowerLine(towerGroup, Tname) //加载
    initLine(towerGroup, Tname, Tdistance, Tlength, Thigh) //初始化各个线
  });
  //加载其他部件
  //根据名称获取塔吊的位置信息，更新整个盒子的位置
  var cood = getCoodByName(Tname);
  tower.position.x = tower_unmove.position.x = cood["x"];
  tower.position.y = tower_unmove.position.y = cood["y"];
  tower.name = Tname
  tower_unmove.name = Tname + "_U"
  towerGroup.add(tower)
  towerGroup.add(tower_unmove)
  //定义钻转角度
  tower.rotation.z = Math.PI / 180 * Tdegree;
}

function initCar(towerGroup, Tname, Tdistance) {
  //移动小车的位置
  towerGroup.getObjectByName(Tname, true).getObjectByName("Car", true).position.x = Tdistance;
}

function initHook(towerGroup, Tname, Tdistance, Tlength) {
  //确定线的数量
  lNum = Math.ceil(Tlength / 0.5)
  //移动小车
  towerGroup.getObjectByName(Tname, true).getObjectByName("Hook", true).position.x = Tdistance;
  //通过线段数量确定吊钩的高度
  towerGroup.getObjectByName(Tname, true).getObjectByName("Hook", true).position.z = -(lNum * 0.5);
}

function initLine(towerGroup, Tname, Tdistance, Tlength, Thigh) {
  line = towerGroup.getObjectByName(Tname, true).getObjectByName("Line", true);
  line.position.x = Tdistance; //移动原始线段的位置
  maxNum = Math.floor((Thigh - 3) / 0.5) //确定可能的线段数量，减去3米是因为小车与吊钩自带一部分线
  lNum = Math.ceil(Tlength / 0.5) //确定将要显示的线段数量
  //创建各个线段，不在显示范围之内的则不显示
  for (var i = 1; i <= maxNum; i++) {
    s = line.clone();
    s.position.z -= i * 0.5; //逐步偏移Z坐标
    s.name = "Line_" + String(i);
    if (i > lNum) {
      s.visible = false
    }
    towerGroup.getObjectByName(Tname, true).add(s);
  }

}

//按照参数更新
function updateTower(isEx, degree, distance, length) {
  //更新旋转角度
  isEx.rotation.z = Math.PI / 180 * degree;
  //更新小车，吊钩，初始线段的水平位置
  isEx.getObjectByName("Car", true).position.x = distance;
  isEx.getObjectByName("Hook", true).position.x = distance;
  isEx.getObjectByName("Line", true).position.x = distance;
  //处理各个线段
  lNum = Math.ceil(length / 0.5)
  maxNum = isEx.children.length - 4;
  for (var i = 1; i <= maxNum; i++) {
    //更新水平位置和显示属性
    isEx.getObjectByName("Line_" + String(i), true).position.x = distance;
    isEx.getObjectByName("Line_" + String(i), true).visible = i > lNum ? false : true;
  }
  //根据线段情况更新吊钩高度
  isEx.getObjectByName("Hook", true).position.z = -(lNum * 0.5);
}

function getCoodByName(name) {
  // 根据塔吊名字获取塔吊位置
  return {
    x: 0,
    y: 0
  };
}

function setArmHigh(towerGroup, Tname, Thigh) {
  //设置大臂高度
  secNum = Math.ceil(Thigh / 2.2); //计算标准节数量
  //根据标准节数量确定大臂高度（初始高度22米=10个标准节）
  towerGroup.getObjectByName(Tname, true).position.z = (secNum - 10) * 2.2
}

function createSectionHigh(towerGroup, Tname, Thigh) {
  // 初始化标准节
  var section = towerGroup.getObjectByName(Tname + "_U", true).getObjectByName("Section", true);
  //计算标准节数量
  secNum = Math.ceil(Thigh / 2.2);
  // 循环克隆创建标准节
  for (var i = 1; i < secNum; i++) {
    s = section.clone();
    s.position.z += i * 2.2; //高度偏移
    s.name = "Section_" + String(i);
    towerGroup.getObjectByName(Tname + "_U", true).add(s);
  }
  //更新所有需要旋转的部件组的高度
  towerGroup.getObjectByName(Tname, true).position.z = (secNum - 10) * 2.2
}
