import request from '@/utils/request'

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
