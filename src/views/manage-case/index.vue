<template>
  <div class="app-container">
    <el-button type="primary" @click="onCreateNewClicked">新建<i class="el-icon-plus el-icon--right"/></el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="病例ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="病例描述">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="病例名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="多媒体" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" @click="onImageClicked(scope.$index, scope.$index)">图片</el-button>
            <el-button type="primary" @click="onVideoClicked(scope.$index, scope.$index)">视频</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.$index, scope.$index)" />
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.$index, scope.$index)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="wordsDialog.visible"
      :title="wordsDialog.title"
      width="50%"
      center
    >
      <el-form :model="form">
        <el-form-item label="病例名称" label-width="120px">
          <el-input v-model="form.caseName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="病例描述" label-width="120px">
          <el-input v-model="form.caseDescribe" autocomplete="off" />
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
import { getList } from '@/api/table'
import { deleteCaseById, getImageById, getVideoById, submitWordsDialogResult } from '@/api/case'

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
        caseName: '',
        caseDescribe: ''
      },
      imageUrls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
        'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
        'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
        'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
        'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      ],
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
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    onDeleteClicked(case_id, case_index) {
      deleteCaseById(case_id).then(response => {
        // if (response.data.result === 200) {
        // eslint-disable-next-line no-constant-condition
        if (true) {
          console.log('delete case success')
          this.list.splice(case_index, 1)
        } else {
          // console.log('删除失败')
        }
      })
    },
    onCreateNewClicked() {
      this.wordsDialog.visible = true
      this.wordsDialog.title = '创建病例'
      this.wordsDialog.changeMode = 'add'
    },
    onEditClicked(case_id, case_index) {
      this.wordsDialog.title = '编辑病例'
      this.form.caseName = this.list[case_index].author
      this.form.caseDescribe = this.list[case_index].title
      this.wordsDialog.visible = true
      this.wordsDialog.changeMode = 'update'
    },
    wordsDialogConfirmOnClicked() {
      const params = {
        caseName: this.form.caseName,
        caseDescribe: this.form.caseDescribe,
        changeMode: this.wordsDialog.changeMode
      }
      submitWordsDialogResult(params).then(response => {
        console.log('上传完成')
        this.wordsDialog.visible = false
      })
    },
    onImageClicked(case_id, case_index) {
      this.mediaDialog.visible = true
      this.mediaDialog.contentVisible = true
      this.mediaDialog.title = '病例图片'
      this.uploadTip = '上传图片please，太大了不收'
      getImageById(case_id).then(response => {
        console.log('image open')
      })
    },
    onVideoClicked(case_id, case_index) {
      this.mediaDialog.contentVisible = false
      this.mediaDialog.title = '病例视频'
      this.mediaDialog.visible = true
      this.uploadTip = '上传视频please，太大了不收'
      getVideoById(case_id).then(response => {
        console.log('video open')
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
