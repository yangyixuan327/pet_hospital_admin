<template>
  <div class="app-container">
    <el-button type="primary" style="margin-bottom: 10px;" @click="onCreateNewClicked">新建
      <i class="el-icon-plus el-icon--right"/>
    </el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      :span-method="rowSpanMethod"
      element-loading-text="Loading"
      border
      fit
    >
      <el-table-column align="center" label="病例ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.caseId }}
        </template>
      </el-table-column>
      <el-table-column label="病例名称">
        <template slot-scope="scope">
          {{ scope.row.caseName }}
        </template>
      </el-table-column>
      <el-table-column label="接诊">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='words'">{{ scope.row.jieZhen }}</span>
          <el-button v-if="scope.row.type==='image'" type="primary" @click="onImageClicked(scope.row.caseId, scope.row.jieZhen)">图片</el-button>
          <el-button v-if="scope.row.type==='video'" type="primary" @click="onVideoClicked(scope.row.caseId, scope.row.jieZhen)">视频</el-button>
        </template>
      </el-table-column>
      <el-table-column label="诊断方案">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='words'">{{ scope.row.zhenDuan }}</span>
          <el-button v-if="scope.row.type==='image'" type="primary" @click="onImageClicked(scope.row.caseId, scope.row.zhenDuan)">图片</el-button>
          <el-button v-if="scope.row.type==='video'" type="primary" @click="onVideoClicked(scope.row.caseId, scope.row.zhenDuan)">视频</el-button>
        </template>
      </el-table-column>
      <el-table-column label="治疗方案">
        <template slot-scope="scope">
          <span v-if="scope.row.type==='words'">{{ scope.row.zhiLiao }}</span>
          <el-button v-if="scope.row.type==='image'" type="primary" @click="onImageClicked(scope.row.caseId, scope.row.zhiLiao)">图片</el-button>
          <el-button v-if="scope.row.type==='video'" type="primary" @click="onVideoClicked(scope.row.caseId, scope.row.zhiLiao)">视频</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.row.caseId, scope.$index)"/>
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.row.caseId, scope.$index)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="wordsDialog.visible"
      :title="wordsDialog.title"
      width="50%"
      center
      destroy-on-close
      @close="wordsDialog.visible = false"
    >
      <el-form :model="form">
        <el-form-item label="病例名称" label-width="120px">
          <el-input v-model="form.caseName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="接诊文字A" label-width="120px">
          <el-input v-model="form.jieZhen" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="诊断文字A" label-width="120px">
          <el-input v-model="form.zhenDuan" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="治疗文字A" label-width="120px">
          <el-input v-model="form.zhiLiao" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="wordsDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="wordsDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="mediaDialog.visible"
      :title="mediaDialog.title"
      width="50%"
      center
      destroy-on-close
      @close="mediaDialog.visible = false"
    >
      <div v-if="mediaDialog.imageVisible" class="case-image" style="width: 90%; height: 90%; margin: 0 auto">
        <el-image v-for="url in imageUrls" :key="url" :src="url" lazy>
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"/>
            </div>
          </template>
        </el-image>
      </div>
      <div v-if="mediaDialog.videoVisible" class="case-video" style="width: 90%; height: 90%; margin: 0 auto">
        <video
          v-if="videoUrl !== ''"
          style="width: 100%; height: 100%"
          :src="videoUrl"
          controls="controls"
        />
      </div>
      <el-upload
        class="media-upload"
        :action="postUrl"
        :name="uploadParamName"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        multiple
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" style="margin-left: auto; margin-top: 40px">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            {{ uploadTip }}
          </div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="mediaDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="mediaDialog.visible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
        const result = response.data.responseMap.result
        const description = response.data.responseMap.descrip
        const itemCount = response.data.responseMap.count
        console.log('item count: ' + itemCount)
        var data = []
        for (let i = 0; i < result.length; i++) {
          const item = result[i]
          data.push({
            caseId: item.caseId,
            type: 'words',
            caseName: item.caseName,
            jieZhen: description[i][0],
            zhenDuan: description[i][1],
            zhiLiao: description[i][2]
          })
          data.push({
            caseId: item.caseId,
            type: 'image',
            caseName: item.caseName,
            jieZhen: 'jieZhen',
            zhenDuan: 'zhenDuan',
            zhiLiao: 'zhiLiao'
          })
          data.push({
            caseId: item.caseId,
            type: 'video',
            caseName: item.caseName,
            jieZhen: 'jieZhen',
            zhenDuan: 'zhenDuan',
            zhiLiao: 'zhiLiao'
          })
        }
        this.list = data
        this.listLoading = false
      })
    },
    rowSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 5) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
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
      this.wordsDialog.visible = false
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
            console.log(params.caseId)
            addNewCaseInfo(params).then(this_.$axios.spread(function(responseJieZhen, responseZhenDuan, responseZhiLiao) {
              if (responseJieZhen.data.status === 200 &&
                responseZhenDuan.data.status === 200 &&
                responseZhiLiao.data.status === 200) {
                this_.$message('添加成功')
                this_.list.push(
                  {
                    caseId: params.caseId,
                    type: 'words',
                    caseName: this_.form.caseName,
                    jieZhen: this_.form.jieZhen,
                    zhenDuan: this_.form.zhenDuan,
                    zhiLiao: this_.form.zhiLiao
                  }, {
                    caseId: params.caseId,
                    type: 'image',
                    caseName: this_.form.caseName,
                    jieZhen: 'jieZhen',
                    zhenDuan: 'zhenDuan',
                    zhiLiao: 'zhiLiao'
                  }, {
                    caseId: params.caseId,
                    type: 'video',
                    caseName: this_.form.caseName,
                    jieZhen: 'jieZhen',
                    zhenDuan: 'zhenDuan',
                    zhiLiao: 'zhiLiao'
                  }
                )
              } else {
                console.log(responseJieZhen, responseZhenDuan, responseZhiLiao)
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
            if (caseIndex != null && caseIndex >= 0) {
              this_.list[caseIndex].caseName = this_.form.caseName
              this_.list[caseIndex].jieZhen = this_.form.jieZhen
              this_.list[caseIndex].zhenDuan = this_.form.zhenDuan
              this_.list[caseIndex].zhiLiao = this_.form.zhiLiao
            } else {
              this_.$message('无法更新本地信息 请刷新')
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
      const base_url = 'http://59.110.174.202:8080'
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
          imageUrl =  response.data.responseMap.result.consultImageUrl
        } else if (type === 'zhenDuan') {
          imageUrl = response.data.responseMap.result.diagImageUrl
        } else if (type === 'zhiLiao') {
          imageUrl = response.data.responseMap.result.therapyImageUrl
        }
        if (imageUrl !== 'NULL') {
          imageUrl = 'http://' + imageUrl
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
      this.uploadTip = '上传mp4格式please，100M以内'
      this.uploadParamName = 'video'
      const base_url = 'http://59.110.174.202:8080'
      console.log('type: ' + type)
      if (type === 'jieZhen') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/consult/video'
      } else if (type === 'zhenDuan') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/diag/video'
      } else if (type === 'zhiLiao') {
        this.postUrl = base_url + '/admin/case/' + caseId + '/therapy/video'
      }
      getInfoByIdAndType(caseId, type).then(response => {
        console.log('video response:', response)
        var videoUrl = ''
        if (type === 'jieZhen') {
          videoUrl = response.data.responseMap.result.consultVideoUrl
        } else if (type === 'zhenDuan') {
          videoUrl = response.data.responseMap.result.diagVideoUrl
        } else if (type === 'zhiLiao') {
          videoUrl = response.data.responseMap.result.therapyVideoUrl
        }
        if (videoUrl !== 'NULL') {
          this.videoUrl = 'http://' + videoUrl
        } else {
          this.videoUrl = ''
        }
        console.log('videoUrl: ' + this.videoUrl)
        console.log('postUrl: ' + this.postUrl)
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
    },
    handleUploadSuccess(res, file) {
      var url = res.responseMap.result
      if (url !== null) {
        this.videoUrl = url
        this.imageUrls = [url]
      } else {
        this.videoUrl = ''
        this.imageUrls = []
      }
    },
    handleBeforeUpload(file) {
      const fileSizeInMB = file.size / 1024 / 1024
      if (fileSizeInMB > 100) {
        this.$alert('文件大小不能超过100M')
        return false
      }
    }
  }
}
</script>
