<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="病例接诊" class="stepCursor" @click.native="onStepClick(0)"></el-step>
      <el-step title="病例诊断" class="stepCursor" @click.native="onStepClick(1)"></el-step>
      <el-step title="病例治疗" class="stepCursor" @click.native="onStepClick(2)"></el-step>
    </el-steps>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="text-align: center">
        <span style="font-weight: bold; font-size: x-large">{{ cardContent.title }}</span>
      </div>
      <div class="card-content">
        <el-row :gutter="20" style="margin-top: 10px">
          <el-col :span="16" style="height: 300px;">
            <div class="jieZhen-video" style="margin: 0 auto; width: 576px; height: 384px;">
              <video
                v-if="cardContent.videoUrl !== ''"
                style="width: 100%; height: 100%"
                :src="cardContent.videoUrl"
                controls="controls"
              />
            </div>
          </el-col>
          <el-col :span="8">
            <el-row>
              <el-divider></el-divider>
              <div class="description" style="font-size: large">{{ cardContent.description }}</div>
              <el-divider></el-divider>
            </el-row>
            <el-row style="text-align: center">
              <el-image style="margin: 0 auto; width: 50%; height: 50%" :src="cardContent.imageUrl" lazy fit="contain">
                <template #error>
                  <div class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </template>
              </el-image>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetchCaseJieZhen, fetchCaseZhenDuan, fetchCaseZhiLiao } from '@/api/case_front'

export default {
  name: 'Detail',
  data() {
    return {
      caseId: -1,
      active: 0,
      stepStyle: 'stepNoHover',
      nextButtonDisable: false,
      cardContent: {
        title: '',
        id: -1,
        description: '',
        imageUrl: '',
        videoUrl: ''
      },
      jieZhen: {
        id: -1,
        description: '',
        imageUrl: '',
        videoUrl: ''
      },
      zhenDuan: {
        id: -1,
        description: '',
        imageUrl: '',
        videoUrl: ''
      },
      zhiLiao: {
        id: -1,
        description: '',
        imageUrl: '',
        videoUrl: ''
      }
    }
  },
  created() {
    this.$store.dispatch('app/toggleSideBar')
    this.caseId = this.$route.params.caseId
    console.log(this.caseId)
    this.fetchData()
  },
  methods: {
    fetchData() {
      const caseId = this.caseId
      fetchCaseZhenDuan(caseId).then(response => {
        if (response.data.responseMap.result.diagImageUrl !== null) {
          this.zhenDuan.imageUrl = 'http://' + response.data.responseMap.result.diagImageUrl
        } else {
          this.zhenDuan.imageUrl = ''
        }
        if (response.data.responseMap.result.diagVideoUrl !== null) {
          this.zhenDuan.videoUrl = 'http://' + response.data.responseMap.result.diagVideoUrl
        } else {
          this.zhenDuan.videoUrl = ''
        }
        this.zhenDuan.description = response.data.responseMap.result.diagDescrip
        this.zhenDuan.id = response.data.responseMap.result.caseDiagId
        this.listLoading = false
      })
      fetchCaseJieZhen(caseId).then(response => {
        if (response.data.responseMap.result.consultImageUrl !== null) {
          this.jieZhen.imageUrl = 'http://' + response.data.responseMap.result.consultImageUrl
        } else {
          this.jieZhen.imageUrl = ''
        }
        if (response.data.responseMap.result.consultVideoUrl !== null) {
          this.jieZhen.videoUrl = 'http://' + response.data.responseMap.result.consultVideoUrl
        } else {
          this.jieZhen.videoUrl = ''
        }
        this.jieZhen.description = response.data.responseMap.result.consultDescrip
        this.jieZhen.id = response.data.responseMap.result.caseConsultId
        this.listLoading = false

        // update card content
        this.cardContent.title = '病例接诊'
        this.cardContent.description = this.jieZhen.description
        this.cardContent.id = this.jieZhen.id
        this.cardContent.imageUrl = this.jieZhen.imageUrl
        this.cardContent.videoUrl = this.jieZhen.videoUrl
      })
      fetchCaseZhiLiao(caseId).then(response => {
        if (response.data.responseMap.result.therapyImageUrl !== null) {
          this.zhiLiao.imageUrl = 'http://' + response.data.responseMap.result.therapyImageUrl
        } else {
          this.zhiLiao.imageUrl = ''
        }
        if (response.data.responseMap.result.therapyVideoUrl !== null) {
          this.zhiLiao.videoUrl = 'http://' + response.data.responseMap.result.therapyVideoUrl
        } else {
          this.zhiLiao.videoUrl = ''
        }
        this.zhiLiao.description = response.data.responseMap.result.therapyDescrip
        this.zhiLiao.id = response.data.responseMap.result.caseTherapyId
        this.listLoading = false
      })
    },
    onStepClick(active) {
      this.active = active
      if (active === 1) {
        // update card content
        this.cardContent.title = '病例诊断'
        this.cardContent.description = this.zhenDuan.description
        this.cardContent.id = this.zhenDuan.id
        this.cardContent.imageUrl = this.zhenDuan.imageUrl
        this.cardContent.videoUrl = this.zhenDuan.videoUrl
      } else if (active === 2) {
        // update card content
        this.cardContent.title = '病例治疗'
        this.cardContent.description = this.zhiLiao.description
        this.cardContent.id = this.zhiLiao.id
        this.cardContent.imageUrl = this.zhiLiao.imageUrl
        this.cardContent.videoUrl = this.zhiLiao.videoUrl
      } else if (active === 0) {
        // update card content
        this.cardContent.title = '病例接诊'
        this.cardContent.description = this.jieZhen.description
        this.cardContent.id = this.jieZhen.id
        this.cardContent.imageUrl = this.jieZhen.imageUrl
        this.cardContent.videoUrl = this.jieZhen.videoUrl
      }
    }
  }
}
</script>

<style scoped>
  .stepCursor :hover {
    cursor: pointer;
  }
</style>
