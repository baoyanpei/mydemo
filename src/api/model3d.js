import request from '@/utils/request'

/*
api:/api/bim/web
method:
    funcList = ["GetPropertyListByProID"]  #通过项目ID获取构件属性树  参数不全，floor_id  为空，请核对后提交
    funcList.append("GetModelByID") #通过模型构件的ID获取构件模型数据
    funcList.append("GetModListByFloorID")  #通过楼层ID获取这个楼层所有构件的列表 参数不全，building_id  为空，请核对后提交
    # funcList.append("GetDefaultListByProID") #通过项目ID获取这个项目默认加载的构件列表
    funcList.append("GetBuildingListByProID")  #通过项目ID获取Building列表，用于构造菜单树
    funcList.append("GetFloorListByBudID")  #通过BuildingID获取楼层列表，用于构造菜单树 

默认参数 project_id
model_id,floor_id,building_id
*/
// #通过项目ID获取Building列表，用于构造菜单树
export function queryBuildingListByProID(data) {
  // console.log("api", data)
  return request({
    url: 'api/bim/web',
    method: 'post',
    data: data
  })
}

// 通过BuildingID获取楼层列表，用于构造菜单树
export function queryFloorListByBudID(data) {
  // console.log("api", data)
  return request({
    url: 'api/bim/web',
    method: 'post',
    data: data
  })
}

// 通过项目ID获取构件属性树
export function queryPropertyListByProID(data) {
  // console.log("api", data)
  return request({
    url: 'api/bim/web',
    method: 'post',
    data: data
  })
}


// 通过楼层ID获取这个楼层所有构件的列表
export function queryModListByFloorID(data) {
  // console.log("api", data)
  return request({
    url: 'api/bim/web',
    method: 'post',
    data: data
  })
}

// #通过模型构件的ID获取构件模型数据
export function queryModelByID(data) {
  // console.log("api", data)
  return request({
    url: 'api/bim/web',
    method: 'post',
    data: data
  })
}

export function getItemInfoListByItemIDs(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/web',
    method: 'post',
    data: data,
    baseURL: 'http://admin.yidebim.com'
  })
}