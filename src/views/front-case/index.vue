<template>
  <div class="app-container">
    <el-dropdown style="margin-bottom: 8px">
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
import { fetchCaseList, deleteCaseById, getInfoByIdAndType, updateCaseWordsInfo, addNewCase, addNewCaseInfo } from '@/api/case'

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
      fileList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchCaseList().then(response => {
        console.log(response.data.responseMap)
        this.list = response.data.responseMap.result
        this.listLoading = false
      })
    },
    onLearnCaseClicked(caseId) {
      this.$router.push({
        path: '/case_front/detail/caseId/' + caseId
      })
    },
    onDeleteClicked(caseId, caseIndex) {
      this.$confirm('是否删除？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCaseById(caseId).then(response => {
          console.log(response.data)
          if (response.data.status === 200) {
            this.$message('删除成功')
            this.list.splice(caseIndex, 3)
          } else {
            this.$message('删除失败 请重试')
          }
        })
      }).catch(() => {
        this.$message('取消删除')
      })
    },
    onCreateNewClicked() {
      this.wordsDialog.visible = true
      this.wordsDialog.title = '创建病例'
      this.form.caseName = ''
      this.form.jieZhen = ''
      this.form.zhenDuan = ''
      this.form.zhiLiao = ''
      this.wordsDialog.changeMode = 'add'
    },
    onEditClicked(case_id, case_index) {
      this.wordsDialog.title = '编辑病例'
      this.form.caseId = case_id
      this.form.caseIndex = case_index
      this.form.caseName = this.list[case_index].caseName
      this.form.jieZhen = this.list[case_index].jieZhen
      this.form.zhenDuan = this.list[case_index].zhenDuan
      this.form.zhiLiao = this.list[case_index].zhiLiao
      this.wordsDialog.visible = true
      this.wordsDialog.changeMode = 'update'
    },
    wordsDialogConfirmOnClicked() {
      const this_ = this
      const params = {
        caseId: this.form.caseId,
        caseIndex: this.form.caseIndex,
        caseName: this.form.caseName,
        jieZhen: this.form.jieZhen,
        zhenDuan: this.form.zhenDuan,
        zhiLiao: this.form.zhiLiao,
        changeMode: this.wordsDialog.changeMode
      }
      if (params.changeMode === 'add') {
        addNewCase(params).then(response => {
          console.log(response)
          if (response.data.status === 200) {
            params.caseId = response.data.responseMap.result
            addNewCaseInfo(params).then(this_.$axios.spread(function(responseJieZhen, responseZhenDuan, responseZhiLiao) {
              if (responseJieZhen.data.status === 200 &&
                responseZhenDuan.data.status === 200 &&
                responseZhiLiao.data.status === 200) {
                this_.$message('添加成功')
                console.log('add success')
                this_.list.push(
                  {
                    caseId: response.data.responseMap.caseId,
                    type: 'words',
                    caseName: this_.form.caseName,
                    jieZhen: this_.form.jieZhen,
                    zhenDuan: this_.form.zhenDuan,
                    zhiLiao: this_.form.zhiLiao
                  }, {
                    caseId: response.data.responseMap.caseId,
                    type: 'image',
                    caseName: this_.form.caseName,
                    jieZhen: '',
                    zhenDuan: '',
                    zhiLiao: ''
                  }, {
                    caseId: response.data.responseMap.caseId,
                    type: 'video',
                    caseName: this_.form.caseName,
                    jieZhen: '',
                    zhenDuan: '',
                    zhiLiao: ''
                  }
                )
              } else {
                this_.$message('病例文字信息添加失败 请重试')
              }
            }))
          } else {
            this_.$message('病例添加失败 请重试')
          }
          this_.wordsDialog.visible = false
        })
      } else if (params.changeMode === 'update') {
        updateCaseWordsInfo(params).then(this_.$axios.spread(function(responseName, responseDesc) {
          const caseIndex = params.caseIndex
          if (responseName.data.status === 200 && responseDesc.data.status === 200) {
            this_.$message('更新成功')
            console.log('update success')
            if (caseIndex != null && caseIndex >= 0) {
              this.list[caseIndex].caseName = this_.form.caseName
              this.list[caseIndex].jieZhen = this_.form.jieZhen
              this.list[caseIndex].zhenDuan = this_.form.zhenDuan
              this.list[caseIndex].zhiLiao = this_.form.zhiLiao
            }
          } else {
            if (responseName.data.status !== 200) {
              console.log('name update fail')
              console.log(responseName)
              this_.$message('病例名更新失败 请重试')
            } else if (responseDesc.data.status !== 200) {
              console.log('desc update fail')
              console.log(responseDesc)
              this_.$message('病例信息更新失败 请重试')
            }
          }
          this_.wordsDialog.visible = false
        }))
      }
    },
    onImageClicked(caseId, type) {
      this.mediaDialog.visible = true
      this.mediaDialog.imageVisible = true
      this.mediaDialog.videoVisible = false
      this.mediaDialog.title = '病例图片'
      this.uploadTip = '上传图片please，太大了不收'
      this.uploadParamName = 'image'
      const base_url = 'http://47.101.217.16:8080'
      if (type === 'jieZhen') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/consult/image'
      } else if (type === 'zhenDuan') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/diag/image'
      } else if (type === 'zhiLiao') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/therapy/image'
      }
      getInfoByIdAndType(caseId, type).then(response => {
        console.log(response)
        var imageUrl = ''
        if (type === 'jieZhen') {
          imageUrl = 'http://' + response.data.responseMap.result.consultImageUrl
        } else if (type === 'zhenDuan') {
          imageUrl = 'http://' + response.data.responseMap.result.diagImageUrl
        } else if (type === 'zhiLiao') {
          imageUrl = 'http://' + response.data.responseMap.result.therapyImageUrl
        }
        console.log(imageUrl)
        this.imageUrls = [imageUrl]
      })
    },
    onVideoClicked(caseId, type) {
      this.mediaDialog.visible = true
      this.mediaDialog.imageVisible = false
      this.mediaDialog.videoVisible = true
      this.mediaDialog.title = '病例视频'
      this.uploadTip = '上传视频please，太大了不收'
      this.uploadParamName = 'video'
      const base_url = 'http://47.101.217.16:8080'
      if (type === 'jieZhen') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/consult/video'
      } else if (type === 'zhenDuan') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/diag/video'
      } else if (type === 'zhiLiao') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/therapy/video'
      }
      getInfoByIdAndType(caseId, type).then(response => {
        console.log(response)
        this.videoUrl = 'https://v-cdn.zjol.com.cn/280443.mp4'
        var videoUrl = ''
        if (type === 'jieZhen') {
          videoUrl = 'http://' + response.data.responseMap.result.consultVideoUrl
        } else if (type === 'zhenDuan') {
          videoUrl = 'http://' + response.data.responseMap.result.diagVideoUrl
        } else if (type === 'zhiLiao') {
          videoUrl = 'http://' + response.data.responseMap.result.therapyVideoUrl
        }
        console.log(videoUrl)
        // todo 有数据之后注释去掉
        // this.videoUrl = videoUrl
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    }
  }
}
</script>
