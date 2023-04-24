<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="病例接诊" class="stepCursor" @click.native="onStepClick(0)"></el-step>
      <el-step title="病例诊断" class="stepCursor" @click.native="onStepClick(1)"></el-step>
      <el-step title="病例治疗" class="stepCursor" @click.native="onStepClick(2)"></el-step>
      <el-step title="完成学习" class="stepCursor" @click.native="onStepClick(3)"></el-step>
    </el-steps>
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="text-align: center">
        <span style="font-weight: bold; font-size: x-large">{{ cardContent.title }}</span>
      </div>
      <div class="card-content">
        <el-row :gutter="20" style="margin-top: 10px">
          <el-row v-if="cardContent.videoUrl !== null">
            <div class="jieZhen-video" style="margin: 0 auto; width: 576px; height: 384px;">
              <video
                v-if="cardContent.videoUrl !== null"
                style="width: 100%; height: 100%"
                :src="cardContent.videoUrl"
                controls="controls"
              />
            </div>
          </el-row>
          <el-row>
            <el-divider></el-divider>
            <div class="description" style="padding-left: 10%; padding-right: 10%; font-size: large">{{ cardContent.description }}</div>
            <el-divider></el-divider>
          </el-row>
          <el-row v-if="cardContent.imageUrl !== null" style="text-align: center">
            <el-image style="margin: 0 auto; width: 50%; height: 50%" :src="cardContent.imageUrl" lazy fit="contain">
              <template #error>
                <div class="image-slot">
                  <i class="el-icon-picture-outline"/>
                </div>
              </template>
            </el-image>
          </el-row>
        </el-row>
      </div>
    </el-card>
    <el-row>
      <el-col :span="12" style="padding: 5px; text-align: left">
         <el-button type="primary" @click="$router.push({name:'CaseFrontInner'})">返回</el-button>
      </el-col>
      <el-col :span="12" style="padding: 5px; text-align: right">
        <el-button type="success" @click="onNextClick">下一病例</el-button>
      </el-col>
    </el-row>
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
        if (response.data.responseMap.result.diagImageUrl !== 'NULL') {
          this.zhenDuan.imageUrl = 'http://' + response.data.responseMap.result.diagImageUrl
        } else {
          this.zhenDuan.imageUrl = null
        }
        if (response.data.responseMap.result.diagVideoUrl !== 'NULL') {
          this.zhenDuan.videoUrl = 'http://' + response.data.responseMap.result.diagVideoUrl
        } else {
          this.zhenDuan.videoUrl = null
        }
        this.zhenDuan.description = response.data.responseMap.result.diagDescrip
        this.zhenDuan.id = response.data.responseMap.result.caseDiagId
        this.listLoading = false
      })
      fetchCaseJieZhen(caseId).then(response => {
        if (response.data.responseMap.result.consultImageUrl !== 'NULL') {
          this.jieZhen.imageUrl = 'http://' + response.data.responseMap.result.consultImageUrl
        } else {
          this.jieZhen.imageUrl = null
        }
        if (response.data.responseMap.result.consultVideoUrl !== 'NULL') {
          this.jieZhen.videoUrl = 'http://' + response.data.responseMap.result.consultVideoUrl
        } else {
          this.jieZhen.videoUrl = null
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
        if (response.data.responseMap.result.therapyImageUrl !== 'NULL') {
          this.zhiLiao.imageUrl = 'http://' + response.data.responseMap.result.therapyImageUrl
        } else {
          this.zhiLiao.imageUrl = null
        }
        if (response.data.responseMap.result.therapyVideoUrl !== 'NULL') {
          this.zhiLiao.videoUrl = 'http://' + response.data.responseMap.result.therapyVideoUrl
        } else {
          this.zhiLiao.videoUrl = null
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
        console.log(this.cardContent.imageUrl)
        console.log(this.cardContent.videoUrl)
      } else if (active === 2) {
        // update card content
        this.cardContent.title = '病例治疗'
        this.cardContent.description = this.zhiLiao.description
        this.cardContent.id = this.zhiLiao.id
        this.cardContent.imageUrl = this.zhiLiao.imageUrl
        this.cardContent.videoUrl = this.zhiLiao.videoUrl
        console.log(this.cardContent.imageUrl)
        console.log(this.cardContent.videoUrl)
      } else if (active === 0) {
        // update card content
        this.cardContent.title = '病例接诊'
        this.cardContent.description = this.jieZhen.description
        this.cardContent.id = this.jieZhen.id
        this.cardContent.imageUrl = this.jieZhen.imageUrl
        this.cardContent.videoUrl = this.jieZhen.videoUrl
        console.log(this.cardContent.imageUrl)
        console.log(this.cardContent.videoUrl)
      } else if (active === 3) {
        this.cardContent.title = '已完成该病例的学习'
        this.cardContent.description = '恭喜你已完成学习，快快开启下一个病例学习吧！'
        this.cardContent.id = -1
        this.cardContent.imageUrl = 'https://ae01.alicdn.com/kf/U237cdae570764ebdbb861bf33506cb8d1.jpg'
        this.cardContent.videoUrl = null
        console.log(this.cardContent.imageUrl)
        console.log(this.cardContent.videoUrl)
      }
    },
    onNextClick() {
      const nextId = parseInt(this.caseId) + 1
      this.$router.push({
        path: '/case_front/detail/caseId/' + nextId
      })
    }
  }
}
</script>

<style scoped>
  .stepCursor :hover {
    cursor: pointer;
  }
</style>
