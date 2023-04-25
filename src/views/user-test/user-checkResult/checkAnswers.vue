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
      <el-table-column align="center" label="题目ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.quesId }}
        </template>
      </el-table-column>
      <el-table-column label="题目描述">
        <template slot-scope="scope">
          {{ scope.row.descrip }}
        </template>
      </el-table-column>
      <el-table-column label="题目答案">
        <template slot-scope="scope">
          {{ scope.row.answer }}
        </template>
      </el-table-column>
      <el-table-column label="题目分值" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { getPaperQuestionsById } from "@/api/test/paper";
import {getExamListByTestOptionId} from "@/api/test/exam";

export default {
  data() {
    return {
      list: [],
      listLoading: true,
      testOptionId: -1,
      examId: -1,
      form: {
        index: -1,
        questionId: -1,
        questionDescription: '',
        questionAnswer: '',
        questionTag: '',
        questionScore: 0,
        questionType: 'select'
      },
      selectValue: ''
    }
  },
  created() {
    this.testOptionId = this.$route.params.testOptionId
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getExamListByTestOptionId(this.testOptionId).then(response => {
        const len = response.data.responseMap.result.length
        this.examId = response.data.responseMap.result[len - 1].examId
        getPaperQuestionsById(this.examId).then(res => {
          const l = res.data.responseMap.result.length
          const qIdList = []
          const questions = res.data.responseMap.result
          for (let i = 0; i < l; i++) {
            if (qIdList.some(item => item === questions[i].quesId)) {
              continue
            }
            qIdList.push(questions[i].quesId)
            if (questions[i].answer === '1') {
              questions[i].answer = '对'
            } else if (questions[i].answer === '0') {
              questions[i].answer = '错'
            }
            this.list.push(questions[i])
          }
          this.listLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
