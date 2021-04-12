<template>
  <div class="app-container">
    <el-row style="margin-bottom: 10px">
      <el-col :span="6">
        <el-dropdown style="margin-bottom: 8px" @command="handleCommand">
          <el-button type="primary">
            选择病例类别<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>传染病</el-dropdown-item>
            <el-dropdown-item>寄生虫病</el-dropdown-item>
            <el-dropdown-item>内科</el-dropdown-item>
            <el-dropdown-item>外产科疾病</el-dropdown-item>
            <el-dropdown-item>常用手术</el-dropdown-item>
            <el-dropdown-item>免疫</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="6" :offset="12">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="searchText"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="onSearchClicked">搜索</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="item in list" :key="item.caseId" :span="12" style="margin-bottom: 8px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.caseName }}</span>
          </div>
          <div>
            <el-button type="primary" @click="onLearnCaseClicked(item.caseId)">学习该病例</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchCaseList } from '@/api/case'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      wordsDialog: {
        visible: false,
        title: '',
        changeMode: 'add' // has two value: 'add' and 'update'
      },
      mediaDialog: {
        visible: false,
        imageVisible: false,
        videoVisible: false,
        title: ''
      },
      form: {
        caseId: -1,
        caseIndex: -1,
        caseName: '',
        jieZhen: '',
        zhenDuan: '',
        zhiLiao: ''
      },
      imageUrls: [],
      videoUrl: '',
      postUrl: '',
      uploadTip: '',
      uploadParamName: 'image',
      fileList: [],
      searchText: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchCaseList().then(response => {
        this.list = response.data.responseMap.result
        this.listLoading = false
      })
    },
    onLearnCaseClicked(caseId) {
      this.$router.push({
        path: '/case_front/detail/caseId/' + caseId
      })
    },
    onSearchClicked() {
      console.log('onSearch: ' + this.searchText)
    },
    handleCommand(command) {
      console.log('click on item ' + command)
    }
  }
}
</script>
