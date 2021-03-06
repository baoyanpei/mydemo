import request from '@/utils/request'


/*
        '401': '会话Token失效',
        '1001': '参数不全',
        '1002': '参数值不符合要求',
        '1010': '用户未登录',
        '1011': '接口访问受限',
        '1012': '角色访问权限受限',
        '1013': '非项目成员',
        '1014': '没有绑定手机号码',
        '1015': '手机号码长度不正确',
        '1016': '手机号码格式不正确',
        '1017': '你请求的太频繁了，请1分钟后再试',
        '1018': '今天发送的认证码太多了',
        '1021': '数据库查询异常，检查查询条件',
        '1022': '数据库更新异常',
        '1031': '用户状态异常',
        '1041': '项目信息不存在',
        '1042': '用户信息不存在',
        '1043': '项目用户为离职或注销状态',

*/

// 项目人员信息查询
/*
/api/info/project
method:query_person
项目人员信息查询，
        project_id:
        id :personid 可选
*/
export function queryProjectPerson(data) {
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

// 项目人员分组信息查询
/*
/api/info/project
method:query_group
参数：project_id
*/
export function queryProjectGroup(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

// 获取最新的统计数据

export function queryProjectCount(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project_count',
    method: 'post',
    data: data
  })
}

// 获取最新的进出person

export function queryProjectGatePerson(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project_gateperson',
    method: 'post',
    data: data
  })
}

// 获取单个person的信息
/*
http://w.yidebim.com:3002/api/info/user_test?project_id=10000&method=query&idcard_no=500101199010167631
id,mobile,idcard_no
*/
export function queryProjectUser(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/user_test',
    method: 'get',
    params: data
  })
}
// 查询项目进出人员列表
/*
/api/info/project
查询项目进出人员列表
        method:query_person_inout
        参数: project_id
             in_status 进出状态 0 场外， 1 场内
             可选：
             bt:开始时间 格式 2016-6-5 00:00:00
             et:结束时间 格式 2016-6-5 00:00:00
             必须和 in_status==1 一起使用
*/

export function queryProjectPersonInout(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

/* 清场*/
export function queryProjectPersonGoOut(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

/* 设置人证校验是否为本人 */
/*
logs_person_comfirm
人工确认进场照片是否是本人,(目前只有进门采集了图片)
        参数：
        project_id:项目id
        id:日志id
        compare :2：人工确认本人，3:人工确认不是本人
        remark:说明 1|人脸过小

api: /api/info/gate
*/
export function queryLogsPersonComfirm(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/gate',
    method: 'post',
    data: data
  })
}


/*
进出车辆查询：

进出车辆日志查询
/api/info/gate
query_vehicle_logs
        project_id,
        lisence:车牌模糊查询

        可选参数:
        bt 开始时间
        et 结束时间
        return {"status":"success","msg":'',"data":[]}
*/
export function queryVehicleGate(data) {
  return request({
    url: '/api/info/gate',
    method: 'post',
    data: data
  })
}

/*
query_person_inday(self, params):
        '''
        查询一段时间内用户在场天数
        参数 project_id:
            bt: 2018-09-27 00:00:00
            et: 2018-09-27 23:59:59
*/
export function queryProjectPersonInDay(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

/*
检查用户是否可以访问
/api/info/person
method:checkPersonAccess

参数：
project_id:
url:
url:
天气 tianqi_mobile
门禁 menjin_mobile

任务大厅任务详情 info_details
人员考勤 huamingce_admin
场内人员 changneiyuanyuan_admin
通讯录 tongxunlu_admin
日历 rili_admin
*/
export function checkPersonAccess(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/person',
    method: 'post',
    data: {
      method: 'checkPersonAccess',
      ...data
    }
  })
}

// 查询每天最大进场人数
/*
/api/rpt/project
method query_online_max
查询每天最大进场人数
参数 project_id
bt: yyyy-mm-dd 开始时间 天
et: yyyy-mm-dd 结束时间 天
*/
export function queryPersonOnlineMax(param) {
  // console.log('planTypeQuery')
  return request({
    url: '/api/rpt/project',
    method: 'post',
    data: param
  })
}

/*
查询用户信息：根据登录信息，返回用户资料
return {"status":"success","msg":'',"data":{"user":{},"person":{},"project":[] }}

*/
export function queryPersonInfo(param) {
  // console.log('planTypeQuery')
  return request({
    url: '/api/info/person',
    method: 'post',
    data: param
  })
}

/*
查询项目人员进出记录
api/info/project method:query_inout_detail
查询项目人员进出记录
        method:query_inout_detail
        参数: project_id
             person_id:人员ID
             可选：
             bt:开始时间 格式 2016-6-5 00:00:00
             et:结束时间 格式 2016-6-5 00:00:00

created_time:进场时间
direction: 1 进 2 出

*/
export function queryInOutDetail(param) {
  // console.log('planTypeQuery')
  return request({
    url: '/api/info/project',
    method: 'post',
    data: param
  })
}

/*
/api/info/project  method query_person_worktime(self, params):
        '''
查询工作人员在场内时间(按天显示)
        method:query_person_in_hours
        参数: project_id
             person_id:人员ID
             可选：
             bt:开始时间 格式 2016-6-5 00:00:00
             et:结束时间 格式 2016-6-5 23:59:59
        '''
*/
export function queryPersonWorktime(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

/*

按统计时段内年龄阶段人数
tj_online_age_by_time

'''
按统计时段内年龄阶段人数
project_id: 项目编码
bt='yyyy-mm-dd'
et='yyyy-mm-dd'
'''
*/
export function queryTjOnlineAgeByTime(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/rpt/project',
    method: 'post',
    data: data
  })
}



/*
按统计时段内区域人数
tj_online_area_by_time
        '''
        按统计时段内区域人数
        project_id: 项目编码
        bt='yyyy-mm-dd'
        et='yyyy-mm-dd'
*/
export function queryTjOnlineAreaByTime(data) {
  // console.log("queryProjectGroupAPI", data)
  return request({
    url: '/api/rpt/project',
    method: 'post',
    data: data
  })
}

/*
/api/info/info_project
query_project_worktime
  '''
  查询一段时间内项目用户在场时长（秒）
  参数 project_id:
      bt: 2018-09-27 00:00:00
      et: 2018-09-27 23:59:59
  '''
*/
export function queryProjectWorktime(data) {
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

/*
/api/datum/person:

query(self, params):
'''
根据用户ID信息查询档案资料
一个用户保留最新一套4类资料，上传文件的pdf地址
参数：
project_id:
person_id:
return {"status":"success","msg":'',"data":[]}

datum_type：资料类型1安全责任书2劳动合同3安全交底4技术交底5三级安全教育记录卡6考试试题及结果
datum_file_url：资料文件地址
'''
*/
export function queryPersonDatum(data) {
  return request({
    url: '/api/datum/person',
    method: 'post',
    data: data
  })
}

/*
接口：/api/info/user
注销卡：
card_opera
'''
method:card_opera
卡操作，主要就行卡注销，激活，等操作
参数: project_id,
      rfid_ori
      #status: 人员状态 -1注销0正常1需要激活2离职3手动注销10是默认值
      status：人员状态 -1注销0正常1需要激活2离职3手动注销4开除10是默认值
'''


*/
export function persongroupchange(data) {//个人信息页面，组别信息更改
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}
export function setCardOpera(data) {
  return request({
    url: '/api/info/user',
    method: 'post',
    data: data
  })
}

/*
接口：/api/info/user
开除：辞职：

quit_left(self, params):

用户离职，辞退，开除
project_id,
idcard_no:身份证号码
name : 用户姓名
status 人员状态 -1注销0正常1需要激活2离职3手动注销4开除10是默认值
      status:2,4 增加一下字段：
      cancel_card：是否注销卡0/1
      return_datum：是否归还资料0/1
      turn_over：是否交结工作0/1
      eturn_safety_helmet：是否归还安全帽
      score：评分
      resume_reason：离职原因10个人原因11项目结束12开除13更换部门
remark ：离职备注原因
人员离职，开除操作 信息增加到个人person_resume表中
'''
*/
export function setQuitLeft(data) {
  return request({
    url: '/api/info/user',
    method: 'post',
    data: data
  })
}

/*
api:/api/info/project
method:queryDutyWeek
'''
更新值班周表
参数：
project_id:

'''
*/
export function queryDutyWeek(data) {
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}

/*
/api/info/project
project_duty_day
查询项目值班表天
        参数:
        project_id
        可选：
        day: 不填为当天 '2018-09-27'
        查多天 day 和 bt,et互斥 bt,et优先
        bt:'2018-09-27'
        et:'2018-09-28'
*/
export function queryDutyDay(data) {
  return request({
    url: '/api/info/project_test',
    method: 'post',
    data: data
  })
}

/*
api:/api/info/project
method:update_duty_week
'''
更新值班周表
参数：
project_id:
day1:周一
day2:
day3
day4:
day5:
day6:
day0:周日
后接person_id,两person_id用“|”分割
*/
export function updateDutyWeek(data) {
  return request({
    url: '/api/info/project',
    method: 'post',
    data: data
  })
}
