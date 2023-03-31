<template>
  <div class="app-container">
    <el-button type="primary" style="margin-bottom: 10px;" @click="onCreateNewClicked">新建<i
      class="el-icon-plus el-icon--right"
    /></el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="试卷ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.paperId }}
        </template>
      </el-table-column>
      <el-table-column label="试卷名称">
        <template slot-scope="scope">
          {{ scope.row.paperName }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.row.paperId, scope.$index)" />
            <el-button type="warning" icon="el-icon-document-checked" @click="onSelectQuestionClicked(scope.row.paperId)" />
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.row.paperId, scope.$index)" />
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
        <el-form-item label="试卷名称" label-width="120px">
          <el-input v-model="form.paperName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="wordsDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="wordsDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllPapers,
  addNewPaper,
  changePaperName,
  deletePaperById
} from '@/api/test/paper'

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      wordsDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      form: {
        paperName: '',
        paperId: 0,
        paperIndex: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAllPapers().then(response => {
        const responseResult = response.data.responseMap.result
        for (let i = 0; i < responseResult.length; i++) {
          this.list.push({
            paperId: responseResult[i].paperId,
            paperName: responseResult[i].paperName
          })
        }
      })
      this.listLoading = false
    },
    onCreateNewClicked() {
      this.wordsDialog.title = '新增试卷'
      this.form.paperName = ''
      this.wordsDialog.visible = true
      this.wordsDialog.changeMode = 'add'
    },
    onSelectQuestionClicked(paperId) {
      this.$router.push({
        path: '/test_manage/select_questions',
        query: {
          paperId: paperId
        }
      })
    },
    onDeleteClicked(paperId, paperIndex) {
      this.$confirm('确认删除此试卷？此操作不可回退！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          paperId: paperId
        }
        deletePaperById(params).then(response => {
          this.list.splice(paperIndex, 1)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onEditClicked(paperId, paperIndex) {
      this.wordsDialog.title = '编辑试卷'
      this.form.paperName = this.list[paperIndex].paperName
      this.form.paperId = paperId
      this.form.paperIndex = paperIndex
      this.wordsDialog.visible = true
      this.wordsDialog.changeMode = 'update'
    },
    wordsDialogConfirmOnClicked() {
      if (this.wordsDialog.changeMode === 'add') {
        const paperName = {
          paperName: this.form.paperName
        }
        addNewPaper(paperName).then(response => {
          this.list.push({
            paperId: response.data.responseMap.result,
            paperName: this.form.paperName
          })
        })
        this.wordsDialog.visible = false
      } else if (this.wordsDialog.changeMode === 'update') {
        const paperName = {
          paperName: this.form.paperName
        }
        changePaperName(this.form.paperId, paperName).then(response => {
          this.list[this.form.paperIndex].paperName = paperName.paperName
        })
        this.wordsDialog.visible = false
      }
    }
  }
}
</script>
