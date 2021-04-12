<template>
  <div class="app-container">
    <span style="font-size: xx-large; font-weight: bold">病例接诊</span>
    <el-row style="margin-bottom: 30px; margin-top: 10px">
      <el-col :span="24">
        <div class="description" style="font-size: large">{{ jieZhen.description }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px">
      <el-col :span="12" style="text-align: center; height: 300px">
        <el-image style="margin: 0 auto; width: 100%; height: 100%" :src="jieZhen.imageUrl" lazy fit="contain">
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"/>
            </div>
          </template>
        </el-image>
      </el-col>
      <el-col :span="12" style="text-align: center; height: 300px">
        <div class="jieZhen-video" style="margin: 0 auto; width: 90%; height: 90%;">
          <video
            v-if="jieZhen.videoUrl !== ''"
            style="width: 100%; height: 100%"
            :src="jieZhen.videoUrl"
            controls="controls"
          />
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <span style="font-size: xx-large; font-weight: bold">病例诊断</span>
    <div>
      <el-row style="margin-bottom: 30px; margin-top: 10px">
        <el-col :span="24">
          <div class="description" style="font-size: large">{{ zhenDuan.description }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="12" style="text-align: center; height: 300px">
          <el-image style="margin: 0 auto; width: 100%; height: 100%" :src="zhenDuan.imageUrl" lazy fit="contain">
            <template #error>
              <div class="image-slot">
                <i class="el-icon-picture-outline"/>
              </div>
            </template>
          </el-image>
        </el-col>
        <el-col :span="12" style="text-align: center; height: 300px">
          <div class="jieZhen-video" style="margin: 0 auto; width: 90%; height: 90%;">
            <video
              v-if="zhenDuan.videoUrl !== ''"
              style="width: 100%; height: 100%"
              :src="zhenDuan.videoUrl"
              controls="controls"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <span style="font-size: xx-large; font-weight: bold">病例治疗</span>
    <div>
      <el-row style="margin-bottom: 30px; margin-top: 10px">
        <el-col :span="24">
          <div class="description" style="font-size: large">{{ zhiLiao.description }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 10px">
        <el-col :span="12" style="text-align: center; height: 300px">
          <el-image style="margin: 0 auto; width: 100%; height: 100%" :src="zhiLiao.imageUrl" lazy fit="contain">
            <template #error>
              <div class="image-slot">
                <i class="el-icon-picture-outline"/>
              </div>
            </template>
          </el-image>
        </el-col>
        <el-col :span="12" style="text-align: center; height: 300px">
          <div class="jieZhen-video" style="margin: 0 auto; width: 90%; height: 90%;">
            <video
              v-if="zhiLiao.videoUrl !== ''"
              style="width: 100%; height: 100%"
              :src="zhiLiao.videoUrl"
              controls="controls"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { fetchCaseJieZhen, fetchCaseZhenDuan, fetchCaseZhiLiao } from '@/api/case_front'

export default {
  name: 'Detail',
  data() {
    return {
      caseId: -1,
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
    this.caseId = this.$route.params.caseId
    console.log(this.caseId)
    this.fetchData()
  },
  methods: {
    fetchData() {
      const caseId = this.caseId
      fetchCaseZhenDuan(caseId).then(response => {
        this.zhenDuan.videoUrl = 'https://v-cdn.zjol.com.cn/280443.mp4'
        if (response.data.responseMap.result.diagImageUrl !== null) {
          this.zhenDuan.imageUrl = 'http://' + response.data.responseMap.result.diagImageUrl
        } else {
          this.zhenDuan.imageUrl = ''
        }
        this.zhenDuan.description = response.data.responseMap.result.diagDescrip
        this.zhenDuan.id = response.data.responseMap.result.caseDiagId
        this.listLoading = false
      })
      fetchCaseJieZhen(caseId).then(response => {
        this.jieZhen.videoUrl = 'https://v-cdn.zjol.com.cn/280443.mp4'
        if (response.data.responseMap.result.consultImageUrl !== null) {
          this.jieZhen.imageUrl = 'http://' + response.data.responseMap.result.consultImageUrl
        } else {
          this.jieZhen.imageUrl = ''
        }
        this.jieZhen.description = response.data.responseMap.result.consultDescrip
        this.jieZhen.id = response.data.responseMap.result.caseConsultId
        this.listLoading = false
      })
      fetchCaseZhiLiao(caseId).then(response => {
        this.zhiLiao.videoUrl = 'https://v-cdn.zjol.com.cn/280443.mp4'
        if (response.data.responseMap.result.therapyImageUrl !== null) {
          this.zhiLiao.imageUrl = 'http://' + response.data.responseMap.result.therapyImageUrl
        } else {
          this.zhiLiao.imageUrl = ''
        }
        this.zhiLiao.description = response.data.responseMap.result.therapyDescrip
        this.zhiLiao.id = response.data.responseMap.result.caseTherapyId
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
