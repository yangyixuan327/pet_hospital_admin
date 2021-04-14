<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">
            <div v-for="(test, index) in tests" :key="index">
              <p>{{ index + 1 }}.{{ test.title }}</p>
              <el-radio-group v-if="test.type === 'select'" v-model="test.answer">
                <!-- label绑定答案的值,可以绑定索引index,也可以绑定答案内容option -->
                <el-radio
                  v-for="(option,index) in choiceOption"
                  :key="index"
                  :label="index"
                >{{ option }}</el-radio>
              </el-radio-group>
              <el-radio-group v-else-if="test.type === 'judge'" v-model="test.answer">
                <el-radio
                  v-for="(option,index) in judgeOption"
                  :key="index"
                  :label="index"
                >{{ option }}</el-radio>
              </el-radio-group>
              <div v-else-if="test.type === 'qa'">
                <el-input v-model="test.answer" type="textarea" :rows="2" placeholder="请输入内容" />
              </div>
            </div>
          </div>
          <br>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" icon="el-icon-check" @click="onSubmitClicked">提交试卷</el-button>
      </el-row>
    </el-main>
    <el-dialog
      :visible="submitAnswerDialog.visible"
      :title="submitAnswerDialog.title"
      width="50%"
      center
      @close="submitAnswerDialog.visible = false"
    >
      <div style="margin: 0 auto; text-align: center">
        <span>确认提交？<br>该操作不可回退！</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitAnswerDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import {
  getQuestionList,
  submitAnswer
} from '@/api/test/inTest'

export default {
  data() {
    return {
      tests: null,
      judgeOption: ['True', 'False'],
      choiceOption: ['A', 'B', 'C', 'D'],
      submitAnswerDialog: {
        visible: false,
        title: ''
      },
      testId: -1
    }
  },
  created() {
    // this.testId = this.$route.query.id
    console.log(this.testId)
    getQuestionList(7, 6).then(response => {
      console.log(response)
      if (response.data.status === 400) {
        this.$message('你已经进行过该考试！请更换考试！')
      } else if (response.data.status === 200) {
        let resultList = []
        resultList = response.data.responseMap.result
        this.testId = response.data.responseMap.testId
        console.log(resultList)
        const questionList = []
        for (let i = 0; i < resultList.length; i++) {
          questionList.push({
            id: resultList[i].quesId != null ? resultList[i].quesId : 0,
            title: resultList[i].descrip != null ? resultList[i].descrip : '',
            type: resultList[i].type != null ? resultList[i].type : '',
            rightAnswer: resultList[i].answer != null ? resultList[i].answer : '',
            score: resultList[i].score != null ? resultList[i].score : '',
            tag: resultList[i].tag != null ? resultList[i].tag : '',
            image: '',
            answer: ''
          })
        }
        this.tests = questionList
      } else {
        this.$message('Something Went Wrong...')
      }
    })
  },
  methods: {
    onSubmitClicked() {
      this.submitAnswerDialog.title = '提示'
      this.submitAnswerDialog.visible = true
    },
    submitAnswerDialogConfirmOnClicked() {
      const result = []
      const tempList = this.tests
      for (let i = 0; i < tempList.length; i++) {
        result.push({
          quesId: tempList[i].quesId,
          answer: tempList[i].answer
        })
      }
      submitAnswer(this.testId, result).then(response => {
        console.log(response)
        if (response.data.status === '200') {
          this.$message({
            type: 'success',
            message: '提交成功！分数为：'
          })
        }
      })
    }
  }
}

</script>
