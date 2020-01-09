/*
视点相关接口
*/

import request from '@/utils/request'

/*
1、视点保存接口：SaveViewPoint
调用样例：
{
    "method":"SaveViewPoint",
    "type":"1",
    "project_id":"10000",
    "name":"aqwe",
    "desc":"asdfasdfasfasdfasdfDASD",
    "file_ids":"235,678",
    "camera_info":"sgsdfgsdrgergdgsdf",
    "picture_info":"vsdfgsdasefrgtsdgdsfgsdrg",
    "creator":"123333"
}

其中，project_id，name，file_ids，camera_info，picture_info，creator不可空。
type字段：1-基于项目的公共位置视点；2-普通视点
*/
export function saveViewPoint(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data
    // baseURL: 'http://admin.yidebim.com'
  })
}

/*
2、通过项目ID获取视点列表：GetViewpointsByProjectId
调用样例：
{
    "method":"GetViewpointsByProjectId",
    "project_id":"10000"
}

*/
export function getViewpointsByProjectId(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/web',
    method: 'post',
    data: data,
    // baseURL: 'http://admin.yidebim.com'
  })
}

/*
3、通过文件ID获取与其相关的视点列表：GetViewpointsByFileId
调用样例：
{
    "method":"GetViewpointsByFileId",
    "file_id":"123"
}
*/
export function getViewpointsByFileId(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data
  })
}

/*
4、通过模块ID获取其各个版本文件信息列表，包含文件ID，文件模型地址等信息：GetFileListByItemId
调用样例：
{
    "method":"GetFileListByItemId",
    "item_id":"1528"
}
*/
export function getFileListByItemId(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/web',
    method: 'post',
    data: data,
    // baseURL: 'http://admin.yidebim.com'
  })
}

/*
新增通过视点ID获取视点信息接口：
调用示例：
{
    "method":"GetViewpointsById",
    "id":"1"
}
*/
export function getViewpointsById(data) {
  // console.log("api", data)
  return request({
    url: '/api/bcp/web',
    method: 'post',
    data: data,
    // baseURL: 'http://admin.yidebim.com'
  })
}

/*
通过视点ID删除视点：
调用示例：
{
    "method":"DeleteViewpointById",
    "id":"10000"

}
*/
export function deleteViewpointById(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data
  })
}

/*
4.1.4视点综合查询
api:/api/bim/bcp
method:GetViewPoints
保存视点信息
file_id为空 取出所有project_id相关的列表
        参数
        project_id:必选
        file_id:(可选) file_id为空 取出所有project_id相关的列表
        type:(可选) 根据类型选视点
        item_id:(可选)根据建筑物id选视点
返回：
{
    "data": [{
        "camera_info": "",
        "creator": 100587,
        "creator_name": "陈玮",
        "desc": "desc",
        "file_ids": "[200223,1232412]",
        "floor_name": "",
        "id": 6,
        "item_id": "",
        "name": "测试视点2",
        "picture_info": "",
        "project_id": 10000,
        "svg_info": ""
    }],
    "msg": "",
    "status": "success"
}

*/
export function getViewPoints(data) {
  // console.log("api", data)
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data,
  })
}