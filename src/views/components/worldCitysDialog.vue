<style lang="scss">
  @import "./worldCitysDialog";

</style>
<template>
  <div class="world-city-dialog">
    <el-dialog :modal="true" width="260px" :lock-scroll="true" :close-on-click-modal="false"
      :visible.sync="worldCitysDialog.show" :title="title">
      <div style="text-align: center;width: 100%;">
        <el-radio-group v-model="type" size="mini">
          <el-radio-button label="1">国内</el-radio-button>
          <el-radio-button label="2">海外</el-radio-button>
        </el-radio-group>
        <div v-if="type==1" style="margin-top: 10px;">

          <el-select v-model="chinaProvince" filterable placeholder="请选择省份" size="mini" @change="chinaProvinceChangeHandle">
            <el-option v-for="province in chinaProvinceList" :key="province.code" :label="province.name"
              :value="province.name">
            </el-option>
          </el-select>
          <el-select v-model="chinaCity" filterable placeholder="请选择城市" size="mini" style="margin-top: 10px;">
            <el-option v-for="city in chinaCityList" :key="city.code" :label="city.name" :value="city.name">
            </el-option>
          </el-select>
        </div>
        <div v-if="type==2" style="margin-top: 10px;">

          <el-select v-model="externalCountry" filterable placeholder="请选择国家" size="mini"
            @change="externalCountryChangeHandle">
            <el-option v-for="country in externalCountryList" :key="country.id" :label="country.cname"
              :value="country.id">
            </el-option>
          </el-select>
          <el-select v-model="externalCity" filterable placeholder="请选择城市" size="mini" style="margin-top: 10px;">
            <el-option v-for="city in externalCityList" :key="city.id" :label="city.cname" :value="city.cname">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="text-align: center;margin-top: 20px;">
        <el-button type="success" :loading="loading" @click.native.prevent="handleSubmit()" size="mini"
          style="width: 100%;">确定
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  // import vpdf from 'vpdf'
  // import pdf from 'vue-pdf'
  // import vueshowpdf from 'vueshowpdf'
  import {
    chinaCitysConfig
  } from './china_city'

  import {
    countriesConfig
  } from './countries'
  import {
    statesConfig
  } from './states'
  import {
    citiesConfig
  } from './cities'
  export default {
    components: {
      // pdf
      // vueshowpdf
    },
    directives: {},

    data() {

      return {
        title: '选择城市',
        loading: false,
        type: '1',
        chinaProvinceList: [],
        chinaCityList: [],
        externalCountryList: [],
        externalCityList: [],
        chinaProvince: "",
        chinaCity: "",
        externalCountry: "",
        externalCity: '',
        chinaProvinceMap: new Map(),
        countriesMap: new Map()

      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      worldCitysDialog: {
        get: function () {
          return this.$store.state.tools.worldCitysDialog
        },
        set: function (newValue) {
          this.$store.state.tools.worldCitysDialog = newValue
        }
      },
      // personInfoChanged() {
      //   return this.$store.state.project.personInfoChanged
      // }

    },
    created: function () {
      // console.log(countriesConfig)
      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      worldCitysDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // this.initData()
            // this.getProjectPersonInfo()
            // this.getPersonDatum()

          } else {
            // this.initData()
          }

        },
        deep: true
      },
      // personInfoChanged(curVal, oldVal) {
      //   this.initData()
      //   this.getProjectPersonInfo()
      // },
    },
    methods: {
      openPersonFaceHealthDialogHandle() {
        // console.log("----22222---")
      },
      handleCloseDialog() {

      },
      handleSubmit() {

      },
      chinaProvinceChangeHandle(province) {
        console.log('province', province)
        this.chinaCity = ""
        this.chinaCityList = this.chinaProvinceMap.get(province)
      },
      externalCountryChangeHandle(country_id) {
        console.log('country_id', country_id)
        this.externalCity = ""
        this.externalCityList = this.countriesMap.get(country_id).citys
        console.log('this.externalCityList', this.externalCityList)
      }
    },
    mounted() {

      this.chinaProvinceList = chinaCitysConfig.citys.provinces
      this.externalCountryList = countriesConfig.countries.RECORDS
      this.chinaProvinceList.forEach(province => {
        this.chinaProvinceMap.set(province.name, province.cities)
      });

      const _states = statesConfig.states.RECORDS
      const _statesMap = new Map()
      _states.forEach(state => {
        _statesMap.set(state.id, state)
      })

      const _countries = countriesConfig.countries.RECORDS
      console.log("_countries", _countries)
      const _countriesMap = new Map()
      _countries.forEach(country => {
        country['citys'] = []
        _countriesMap.set(country.id, country)
      })

      // console.log(this.chinaProvinceMap)

      // console.log("_statesMap", _statesMap)

      const _cities = citiesConfig.cities.RECORDS
      console.log("_cities", _cities)
      _cities.forEach(city => {
        let _state = _statesMap.get(city.state_id)

        if (_state !== undefined) {
          let _country = _countriesMap.get(_state.country_id)
          console.log("_country", _country)
          if (_country !== undefined) {
            _country.citys.push(city)
          }
        }
      })
      this.countriesMap = _countriesMap
      console.log("_countriesMap", _countriesMap)
    }
  }

</script>
