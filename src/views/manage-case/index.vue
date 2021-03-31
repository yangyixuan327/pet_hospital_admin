<template>
  <div class="app-container">
    <el-button type="primary" style="margin-bottom: 10px;" @click="onCreateNewClicked">新建<i
      class="el-icon-plus el-icon--right"
    /></el-button>
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
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.$index, scope.$index)"/>
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.$index, scope.$index)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="wordsDialog.visible"
      :title="wordsDialog.title"
      width="50%"
      center
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
      @close="mediaDialog.visible = false"
    >
      <div class="case-image" :visible="mediaDialog.contentVisible">
        <el-image v-for="url in imageUrls" :key="url" :src="url" lazy>
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"/>
            </div>
          </template>
        </el-image>
      </div>
      <el-upload
        class="media-upload"
        :action="postUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" style="margin-left: auto; margin-top: 40px">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">{{ uploadTip }}</div>
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
import { fetchCaseList, deleteCaseById, getImageById, getVideoById, submitWordsDialogResult } from '@/api/case'

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
        contentVisible: true,
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
      postUrl: '',
      uploadTip: '',
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
    onDeleteClicked(case_id, case_index) {
      deleteCaseById(case_id).then(response => {
        // if (response.data.result === 200) {
        // eslint-disable-next-line no-constant-condition
        if (true) {
          console.log('delete case success')
          this.list.splice(case_index, 3)
        } else {
          // console.log('删除失败')
        }
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
      const params = {
        caseId: this.form.caseId,
        caseIndex: this.form.caseIndex,
        caseName: this.form.caseName,
        jieZhen: this.form.jieZhen,
        zhenDuan: this.form.zhenDuan,
        zhiLiao: this.form.zhiLiao,
        changeMode: this.wordsDialog.changeMode
      }
      submitWordsDialogResult(params).then(response => {
        const caseIndex = this.form.caseIndex
        const changeMode = this.wordsDialog.changeMode
        if (changeMode === 'update') {
          if (caseIndex != null && caseIndex >= 0) {
            this.list[caseIndex].caseName = this.form.caseName
            this.list[caseIndex].jieZhen = this.form.jieZhen
            this.list[caseIndex].zhenDuan = this.form.zhenDuan
            this.list[caseIndex].zhiLiao = this.form.zhiLiao
          }
        } else if (changeMode === 'add') {
          this.list.push(
            {
              caseId: 12,
              type: 'words',
              caseName: this.form.caseName,
              jieZhen: this.form.jieZhen,
              zhenDuan: this.form.zhenDuan,
              zhiLiao: this.form.zhiLiao
            }, {
              caseId: 1,
              type: 'image',
              caseName: this.form.caseName,
              jieZhen: '',
              zhenDuan: '',
              zhiLiao: ''
            }, {
              caseId: 1,
              type: 'video',
              caseName: this.form.caseName,
              jieZhen: '',
              zhenDuan: '',
              zhiLiao: ''
            }
          )
        }
        this.wordsDialog.visible = false
      })
    },
    onImageClicked(caseId, type) {
      this.mediaDialog.visible = true
      this.mediaDialog.contentVisible = true
      this.mediaDialog.title = '病例图片'
      this.uploadTip = '上传图片please，太大了不收'
      getImageById(caseId, type).then(response => {
        const imageUrl = response.data.responseMap.result.consultImageUrl
        this.imageUrls = [imageUrl]
      })
    },
    onVideoClicked(case_id, video_url) {
      this.mediaDialog.contentVisible = false
      this.mediaDialog.title = '病例视频'
      this.mediaDialog.visible = true
      this.uploadTip = '上传视频please，太大了不收'
      // getVideoById(case_id).then(response => {
      //   console.log('video open')
      // })
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
