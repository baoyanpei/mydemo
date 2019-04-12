//设置默认的电梯门开合高度，单位：米。
var doorDistance = 2.5;

function modifyElevator(elevatorGroup, name, high, state) {
  //判断是新增还是更新信息
  var isEx = elevatorGroup.getObjectByName(name, true);
  if (isEx) {
    updateElevator(isEx, high, state)
  } else {
    addElevator(elevatorGroup, name, high, state)
  }
}

function updateElevator(isEx, high, state) {
  SetHigh(isEx, high);
  SetState(isEx, state);
}

function addElevator(elevatorGroup, name, high, state) {
  var elevator = new THREE.Group();
  elevator.name = name;
  elevatorGroup.add(elevator);
  var _loader = new THREE.ObjectLoader();
  _loader.load('/static/TowerAndElevator/Units/Elevator.json', function (obj) {
    obj.name = name;
    elevator.add(obj);
  })
  _loader.load('/static/TowerAndElevator/Units/FrontDoor.json', function (obj) {
    obj.name = name + "_f";
    if (state) {
      obj.position.z = doorDistance;
    }
    elevator.add(obj);
  })
  _loader.load('/static/TowerAndElevator/Units/BackDoor.json', function (obj) {
    obj.name = name + "_b";
    if (state) {
      obj.position.z = doorDistance;
    }
    elevator.add(obj);
  })
  SetPosition(elevator);
  SetHigh(elevator, high);
}

function SetHigh(elevator, high) {
  elevator.position.z = high;
}

function SetPosition(elevator) {
  var cood = getCoodByName(name);
  elevator.position.x = cood.x;
  elevator.position.y = cood.y;
  elevator.rotation.z = Math.PI / 180 * cood.r;
}

function getCoodByName(name) {
  //根据传入的设备名称，初始化电梯的位置、角度
  return {
    x: 0,
    y: 0,
    r: 0
  }
}

function SetState(elevator, state) {
  name = elevator.name;
  if (state) {
    elevator.getObjectByName(name + "_f", true).position.z = doorDistance;
    elevator.getObjectByName(name + "_b", true).position.z = doorDistance;
  } else {
    elevator.getObjectByName(name + "_f", true).position.z = 0;
    elevator.getObjectByName(name + "_b", true).position.z = 0;
  }
}
