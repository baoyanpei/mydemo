import request from '@/utils/request'
// import requestFile from '@/utils/requestFile'
import axios from 'axios'
/*

BIM模型轻量化接口

BIM模型轻量化接口，包括上传bim文件，查询列表，等接口
接口方式 http JWT content-type：application/json
api: http://w.yidebim.com:3008/api/bcp/pm
参数{"method":xxx,"project_id":xxxx...}
返回：
{"status":"success","data":{}}

*/

// 2.1项目列表
/*
查询到和自己相关的所有项目

包括，自建和参与的别人项目

api:/api/bcp/pm
method:"projects"
参数：
无
返回：
{
    "data": [{
        "desc": "",
        "project_id": 20000,
        "project_name": "天地网络"

    }, {
        "desc": "",
        "project_id": 20001,
        "project_name": "测试第二个项目",
    }],
    "msg": "",
    "status": "success"
}

*/
export function getProjectList(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/pm',
    method: 'post',
    data: data
  })
}

// 新增建筑项目信息
/*
方法：bim_building_add
        参数：
        project_id 
        building_name 
        building_desc 

*/
export function addBimBuilding(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/project',
    method: 'post',
    data: data
  })
}

// 删除项目下建筑信息
/*
方法：bim_building_remove
        参数：
        id
        project_id 
*/
export function removeBimBuilding(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/project',
    method: 'post',
    data: data
  })
}

// 查询项目所有建筑物
/*
方法：bim_building_all
        参数：
        project_id 
返回:
{"status":"success","msg":"","data":[]}
*/
export function queryBimBuildingAll(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/project',
    method: 'post',
    data: data
  })
}

// 7.2模型创建新增
/*
生成一个新的模型聚合模型
api:/api/bcp/pm
method:"project_item_add"
参数：
project_id 项目id
name: 模型项名称
desc: 描述

返回：
{ msg: "", status: "success" }

*/
export function addBimItem(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/pm',
    method: 'post',
    data: data
  })
}


// 7.3模型项编辑名称
/*
模型编辑name和描述聚合模型
api:/api/bcp/pm
method:"project_item_edit"
参数：
project_id 项目id
id: 模型项id
name: 模型名称
desc: 模型描述
返回：
{ msg: "", status: "success" }

*/
export function updateBimItem(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/pm',
    method: 'post',
    data: data
  })
}

// 7.4模型创建删除
/*
删除模型项，如果已经上传过文件，将不能删除
api:/api/bcp/pm
method:"project_item_del"
参数：
project_id 项目id
id:模型id
返回：
{ msg: "", status: "success" }


*/
export function removeBimItem(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/pm',
    method: 'post',
    data: data
  })
}

// 5.4项目文件上传（新增）
/*
新增加一个文件资源

api:/api/bcp/pm
method:"project_file_upload"
http POST 方式，参数放在URL里，文件数据封装在body里 form-data方式
参数：
project_id 项目id
file_type :文件类型：1-Revit(rvt,rfa,rte)；2-AutoCAD(dwg)
file 上传文件
item_id: rvt文件类型上传时，必须携带指定的item_id ,file_type=1 时必须
cid  分类id（CAD 或其它用于目录管理的文件需要携带cid分类目录id）

label 标签（默认和文件名一致，可重名）【可选参数，】
desc 描述（可选）
返回：
{ msg: "", status: "success"，"id":xx}

*/
// export function uploadBimItem(data, params, that) {
//   console.log("that", that)
//   return requestFile({
//     url: '/api/bcp/pm',
//     method: 'post',
//     data: data,
//     params: params,
//     cancelToken: new axios.CancelToken(function executor(c) { // 设置 cancel token
//       that.source = c;
//     })
//   })
// }

// 7.1项目模型列表
/*
api:/api/bcp/pm
method:"project_items"
参数：
project_id 项目id

返回：
{ msg: "", status: "success" ,"data":[{"id":xxx,"name":"","desc":"描述" ,"creator":...,"username":""}]}

*/
export function getProjectItems(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/pm',
    method: 'post',
    data: data,
    baseURL: 'http://admin.yidebim.com'
  })
}


export function getItemInfoListByProID(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/web',
    method: 'post',
    data: data,
    baseURL: 'http://admin.yidebim.com'
  })
}
