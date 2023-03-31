<template>
  <div class="app-container">
    <div style="margin: 0 auto; text-align: center; height: 80px">
      <span style="font-size: 40px"><b>配置试卷题目</b></span>
    </div>
    <el-row style="margin-bottom: 10px">
      <el-col :span="6">
        <el-dropdown style="margin-bottom: 8px" @command="handleCommand">
          <el-button type="primary">
            {{ dropdownTitle }}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="all">全部</el-dropdown-item>
            <el-dropdown-item command="select">选择题</el-dropdown-item>
            <el-dropdown-item command="judge">判断题</el-dropdown-item>
            <el-dropdown-item command="qa">问答题</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="6" :offset="12">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-input v-model="searchText" />
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="onSearchClicked">搜索</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" prop="created_at" label="勾选" width="80">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.selected" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID" width="60">
        <template slot-scope="scope">
          {{ scope.row.quesId }}
        </template>
      </el-table-column>
      <el-table-column label="题型" width="95">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="题目">
        <template slot-scope="scope">
          {{ scope.row.descrip }}
        </template>
      </el-table-column>
      <el-table-column label="标签" width="95">
        <template slot-scope="scope">
          {{ scope.row.tag }}
        </template>
      </el-table-column>
      <el-table-column label="分数" width="50">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
      <el-table-column label="答案" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.answer }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div align="center" style="margin-top: 30px; margin-bottom: 20px">
      <el-button type="primary" @click="onSaveClicked">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import {
  getQuestionList
} from '@/api/test/question'
import {
  getPaperQuestionsById,
  addQuestionToPaper, fetchQuesByUnionSearch
} from '@/api/test/paper'

function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  )
}

export default {
  data() {
    return {
      list: [],
      listLoading: false,
      paperId: -1,
      searchText: '',
      dropdownTitle: '选择病例类别',
      command: '',
      quesListIsSelected: []
    }
  },
  created() {
    this.paperId = this.$route.query.paperId
    this.fetchData()
    sleep(200).then(() => {
      this.handleCommand('all')
    })
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.back, false)
    }
  },
  destroyed() {
    window.removeEventListener('popstate', this.back, false)
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getQuestionList().then(response => {
        const responseResult = response.data.responseMap.result
        for (let i = 0; i < responseResult.length; i++) {
          this.quesListIsSelected.push({
            quesId: responseResult[i].quesId,
            selected: false
          })
          this.list.push({
            quesId: responseResult[i].quesId,
            type: responseResult[i].type,
            tag: responseResult[i].tag,
            descrip: responseResult[i].descrip,
            score: responseResult[i].score,
            answer: responseResult[i].answer,
            selected: false
          })
        }
        this.listLoading = false
      })
      sleep(200).then(() => {
        getPaperQuestionsById(this.paperId).then(response => {
          const responseResult = response.data.responseMap.questions
          for (let i = 0; i < responseResult.length; i++) {
            for (let j = 0; j < this.list.length; j++) {
              if (responseResult[i].quesId === this.list[j].quesId) {
                this.quesListIsSelected[j].selected = true
                this.list[j].selected = true
              }
            }
          }
        })
      })
    },
    back() {
      this.$confirm('修改尚未保存，直接退出页面将不会作任何修改！是否确认退出？', '注意', {
        confirmButtonText: '保存并退出',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        center: true
      }).then(() => {
        const quesIds = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].selected === true) {
            quesIds.push(this.list[i].quesId)
          }
        }
        addQuestionToPaper(this.paperId, quesIds).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push('/test_manage/paper_manage')
        })
      }).catch(() => {
        if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL)
          window.addEventListener('popstate', this.back, false)
        }
      })
    },
    onSaveClicked() {
      this.$confirm('确认保存试卷配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const quesIds = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].selected === true) {
            quesIds.push(this.list[i].quesId)
          }
        }
        addQuestionToPaper(this.paperId, quesIds).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push('/test_manage/paper_manage')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存'
        })
      })
    },
    setSelectedList() {
      for (let i = 0; i < this.list.length; i++) {
        for (let j = 0; j < this.quesListIsSelected.length; j++) {
          if (this.quesListIsSelected[j].quesId === this.list[i].quesId) {
            this.quesListIsSelected[j].selected = this.list[i].selected
          }
        }
      }
    },
    onSearchClicked() {
      if (this.command === 'all' && this.searchText !== '') {
        const params = {
          search: this.searchText
        }
        this.setSelectedList()
        this.unionSearch(params)
        this.setIfSelected()
      } else if (this.command !== 'all' && this.searchText !== '') {
        const params = {
          type: this.command,
          search: this.searchText
        }
        this.setSelectedList()
        this.unionSearch(params)
        this.setIfSelected()
      } else if (this.command !== 'all' && this.searchText === '') {
        const params = {
          type: this.command
        }
        this.setSelectedList()
        this.unionSearch(params)
        this.setIfSelected()
      }
    },
    unionSearch(params) {
      fetchQuesByUnionSearch(params).then(response => {
        const responseResult = response.data.responseMap.result
        this.list = []
        for (let i = 0; i < responseResult.length; i++) {
          this.list.push({
            quesId: responseResult[i].quesId,
            type: responseResult[i].type,
            tag: responseResult[i].tag,
            descrip: responseResult[i].descrip,
            score: responseResult[i].score,
            answer: responseResult[i].answer,
            selected: false
          })
        }
      })
    },
    setParamsAndUnionSearch(command) {
      if (this.searchText === '') {
        const params = {
          type: command
        }
        this.unionSearch(params)
      } else {
        const params = {
          type: command,
          search: this.searchText
        }
        this.unionSearch(params)
      }
    },
    setIfSelected() {
      sleep(200).then(() => {
        for (let i = 0; i < this.list.length; i++) {
          for (let j = 0; j < this.quesListIsSelected.length; j++) {
            if (this.quesListIsSelected[j].quesId === this.list[i].quesId) {
              this.list[i].selected = this.quesListIsSelected[j].selected
            }
          }
        }
      })
    },
    handleCommand(command) {
      this.command = command
      this.setSelectedList()
      if (command === 'select') {
        this.dropdownTitle = '选择题'
        this.setParamsAndUnionSearch(command)
        this.setIfSelected()
      } else if (command === 'judge') {
        this.dropdownTitle = '判断题'
        this.setParamsAndUnionSearch(command)
        this.setIfSelected()
      } else if (command === 'qa') {
        this.dropdownTitle = '问答题'
        this.setParamsAndUnionSearch(command)
        this.setIfSelected()
      } else if (command === 'all') {
        this.dropdownTitle = '全部'
        getQuestionList().then(response => {
          const responseResult = response.data.responseMap.result
          this.list = []
          for (let i = 0; i < responseResult.length; i++) {
            this.list.push({
              quesId: responseResult[i].quesId,
              type: responseResult[i].type,
              tag: responseResult[i].tag,
              descrip: responseResult[i].descrip,
              score: responseResult[i].score,
              answer: responseResult[i].answer,
              selected: false
            })
          }
        })
        this.setIfSelected()
      }
    }
  }
}
</script>
