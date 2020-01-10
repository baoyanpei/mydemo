
# BIM - 实名制平台

本地测试 http://localhost:9527.

## 开发

```bash
# 克隆项目
git clone http://git.buskey.cn/hanxiang/yide-smz.git

# 安装依赖
npm install

# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install 

# 启动服务
npm run dev
```



## Build

```调试
# build for test environment
npm run dev

# 生成
npm run build:prod
```


#### 图标库

http://www.fontawesome.com.cn/faicons/

[FullCalendar中文文档：Event日程事件](https://www.helloweba.net/javascript/454.html)

#### vue项目中导出excel表格功能
https://blog.csdn.net/mutouafangzi/article/details/79915441


#### threejs stat

http://mrdoob.github.io/stats.js/

#### vue 实现复制到粘贴板功能需要依赖到 clipboard.js
https://www.cnblogs.com/wyhlightstar/p/8950430.html

#### Vue无缝滚动
https://github.com/chenxuan0000/vue-seamless-scroll
https://chenxuan0000.github.io/component-document/index_prod.html#/component/seamless-default

```cmd
1、 首先需要安装依赖  * 出现错误的话，可以试试 cnpm

npm install --save vue-clipboard2
　　

2、 安装成功之后就可以开始使用了

对于vue-cli

import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
```

#### 小程序中需要调用的视点展示页面

```txt
调用地址
https://xcx.tddata.net/smz/#/xcx/pvshow?projectid=10000&pvid=39&token=123
参数说明：
projectid：项目id
pvid：视点id（PointViewID）
token：用户登录后的token
```

#### 小程序中需要调用的模型展示页面

```txt
调用地址
https://xcx.tddata.net/smz/#/xcx/model?projectid=10000&items=1337|1335|1336&token=123
参数说明：
projectid：项目id
items：模型的itemid，多个用|分割，如1335|1336|1337
token：用户登录后的token
```
