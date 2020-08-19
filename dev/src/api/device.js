import request from '@/utils/request'


// 设备类型列表

/*
api:/api/bim/bcp

设备类型列表
method：device_type
*/

export function getDeviceType(data) {
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data
    // baseURL: 'http://admin.yidebim.com'
  })
}


// 设备配置表列表

/*

设备配置表列表
method:device_config
    参数
        project_id
        可选：
        id:
        device_type
        device_id

*/

export function getDeviceConfig(data) {
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data
    // baseURL: 'http://admin.yidebim.com'
  })
}

/*
更新配置：
method：device_config_update
参数：
        project_id
        id
        可选参数：
"device_id","device_type","check_seconds","device_name","total_used","ratio","factory_name","factory_address","factory_tel","install_date",
"last_online_time","created_time","remark","threshold","today_open_time","tmp_open_time","work_time","status","today_offline_time",
"video_url","stable","buliding_id","floor_id","ori_val","bim_vp","addr","device_desc","family_id","family_location","mqtt_url"

*/

export function updateDeviceConfig(data) {
  return request({
    url: '/api/bim/bcp',
    method: 'post',
    data: data
    // baseURL: 'http://admin.yidebim.com'
  })
}