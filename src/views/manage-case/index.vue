<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
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
      :visible="wordsDialogVisible"
      :title="wordsDialogTitle"
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
          <el-button @click="wordsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="wordsDialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="mediaDialogVisible"
      :title="mediaDialogTitle"
      width="50%"
      center
    >
      <div class="demo-image">
        <el-image
          style="width: 300px; height: 300px; margin-left: auto"
          :src="imageUrl"
          :visible="mediaContentVisible"
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"/>
            </div>
          </template>
        </el-image>
      </div>
      <el-upload
        class="upload-demo"
        :action="postUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" style="margin-left: auto">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="mediaDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="mediaDialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getList } from '@/api/table'
import { deleteCaseById, getImageById, getVideoById } from '@/api/case'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      wordsDialogVisible: false,
      mediaDialogVisible: false,
      mediaContentVisible: true,
      wordsDialogTitle: '',
      mediaDialogTitle: '',
      form: {
        caseName: '',
        caseDescribe: ''
      },
      imageUrl: '',
      postUrl: ''
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
    onEditClicked(case_id, case_index) {
      this.wordsDialogTitle = '编辑病例'
      this.form.caseName = this.list[case_index].author
      this.form.caseDescribe = this.list[case_index].title
      this.wordsDialogVisible = true
    },
    onImageClicked(case_id, case_index) {
      this.mediaDialogVisible = true
      this.mediaContentVisible = true
      this.mediaDialogTitle = '病例图片'
      getImageById(case_id).then(response => {
        console.log('image open')
      })
    },
    onVideoClicked(case_id, case_index) {
      this.mediaContentVisible = false
      this.mediaDialogTitle = '病例视频'
      this.mediaDialogVisible = true
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
