import {
  getCostMgtInfoList
} from '@/api/costmgt'
import project from "./project";

const costMgt = {
  state: {

    materialStyle:[],
    supplierList:[]

  },
  mutations: {

    //材料类别
    SET_MATERIAL_STYLE_LIST:(state,data)=>{

      state.materialStyle=[];
      data.forEach((item)=> {
        state.materialStyle.push({
          belong: item.belong,
          id: item.id,
          name: item.name
        });

      })

    },
    //供货商
    SET_SUPPLIER_LIST:(state,data)=>{

      state.supplierList=[];
      data.forEach((item)=> {
        state.supplierList.push({
          id: item.id,
          name: item.name
        });

      })
      //f4300u6@icloud.com----ATt778877

    }
  },
  actions: {

    //获取材料类别
    getMaterialStyleList({commit}, param) {

      return new Promise((resolve, reject) => {
        getCostMgtInfoList({"method": "material_style"}).then(response => {

          const {data} = response;
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          commit("SET_MATERIAL_STYLE_LIST",data);
          resolve(data)
        })
        }).catch(error => {
          reject(error)
        })


    },

    //供货商信息
    getSupplierList({commit}, param) {

      return new Promise((resolve, reject) => {
        getCostMgtInfoList(param).then(response => {

          const {data} = response;
          console.log("supplierlist=="+JSON.stringify(data))
          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          commit("SET_SUPPLIER_LIST",data);
          resolve(data)
        })
      }).catch(error => {
        reject(error)
      })


    }

  }
}
export default costMgt
