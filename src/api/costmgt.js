import request from '@/utils/request'
/**
 * 材料管理应用接口
 * Author：classBao-cn
 * date:2020-9-25
 *
 */


//录入获取项目列表
/*
export function getProjectList() {
  // console.log("api", data)
  return request({
    url: '/api/oa/workflow',
    method: 'post',
    data: data,
    // baseURL: 'http://w.yidebim.com:3004'
  })
}
*/

//录入获取供货商列表/产地厂列表
export function getCostMgtInfoList(data) {

  return request({
    url: '/api/tmif/meterial',
    method: 'post',
    data:data
  })
}

//入库出库提交
export function submitMaterial(data) {

  return request({
    url: '/api/tmif/meterial',
    method: 'post',
    data:data
  })
}
/*//材料列表查询
export function queryCostList(data) {

  return request({
    url: '/api/tmif/meterial',
    method: 'post',
    data:data
  })
}*/


















