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
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.$index, scope.$index)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.$index, scope.$index)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="wordsDialogVisible"
      :title="dialogSettings.title"
      width="30%"
      center
      append-to-body
    >
      <span>{{ dialogSettings.content }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="wordsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="wordsDialogVisible = false">确 定</el-button>
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
      dialogSettings: {
        title: 'test title',
        content: 'test content'
      }
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
      this.dialogSettings.title = 'title from edit'
      this.dialogSettings.content = 'content from edit'
      this.wordsDialogVisible = true
    },
    onImageClicked(case_id, case_index) {
      getImageById(case_id).then(response => {
        console.log('image open')
      })
    },
    onVideoClicked(case_id, case_index) {
      getVideoById(case_id).then(response => {
        console.log('image open')
      })
    }
  }
}
</script>
