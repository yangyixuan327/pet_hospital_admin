<template>
  <div>
    <el-container>
      <el-header style="margin-top: 50px; font-size: 40px; text-align: center">
        <b>{{ paperName }}</b>
      </el-header>
      <el-main>
        <el-row style="margin-left: 30px">
          <el-col>
            <div class="grid-content bg-purple">
              <div v-for="(test, index) in tests" :key="index">
                <p style="height: 35px">{{ index + 1 }}.{{ test.title }}</p>
                <el-radio-group v-if="test.type === 'select'" v-model="test.answer" style="height: 35px">
                  <!-- label绑定答案的值,可以绑定索引index,也可以绑定答案内容option -->
                  <el-radio
                    v-for="(option,index) in choiceOption"
                    :key="index"
                    :label="index"
                  >{{ option }}</el-radio>
                </el-radio-group>
                <el-radio-group v-else-if="test.type === 'judge'" v-model="test.answer" style="height: 35px">
                  <el-radio
                    v-for="(option,index) in judgeOption"
                    :key="index"
                    :label="index"
                  >{{ option }}</el-radio>
                </el-radio-group>
                <div v-else-if="test.type === 'qa'">
                  <el-input v-model="test.answer" type="textarea" :rows="2" placeholder="请输入你的回答" style="height: 70px" />
                </div>
              </div>
            </div>
            <br>
          </el-col>
        </el-row>
        <div align="center" style="margin-top: 30px; margin-bottom: 20px">
          <el-button type="primary" icon="el-icon-check" @click="onSubmitClicked">提交试卷</el-button>
        </div>
      </el-main>
    </el-container>
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
          <el-button @click="submitAnswerDialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submitAnswerDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="showScoreDialog.visible"
      :title="showScoreDialog.title"
      width="50%"
      center
      @close="showScoreDialogConfirmOnClicked"
    >
      <div style="margin: 0 auto; text-align: center">
        <span>提交成功！<br>请前往查看结果页面查看成绩</span>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="showScoreDialogConfirmOnClicked">查 看 结 果</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQuestionList,
  submitAnswer,
  deleteTest,
  getTestOptionById,
  getPaperById
} from '@/api/test/inTest'
import store from '@/store'

function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  )
}

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
      testId: -1,
      testOptionId: -1,
      paperId: -1,
      isRandom: false,
      paperName: '',
      userId: store.getters.token,
      showScoreDialog: {
        visible: false,
        title: ''
      },
      resultScore: 0,
      isMidPointSubmitted: false
    }
  },
  created() {
    this.testOptionId = this.$route.query.id
    this.fetchData()
  },
  mounted() {
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.back, false)
    }
    window.addEventListener('beforeunload', this.refresh)
  },
  destroyed() {
    window.removeEventListener('popstate', this.back, false)
    window.removeEventListener('beforeunload', this.refresh)
  },
  methods: {
    fetchData() {
      getTestOptionById(this.testOptionId).then(response => {
        this.paperId = response.data.responseMap.result.paperId
        const totalNum = response.data.responseMap.result.selectNum + response.data.responseMap.result.judgeNum + response.data.responseMap.result.qaNum
        console.log('totalNum = ' + totalNum)
        if (totalNum === 0) {
          this.isRandom = false
        } else {
          this.isRandom = true
        }
        console.log(this.isRandom)
        console.log(response.data)
      })
      sleep(150).then(() => {
        if (this.isRandom === false) {
          sleep(150).then(() => {
            getPaperById(this.paperId).then(response => {
              this.paperName = response.data.responseMap.result.paperName
            })
          })
        } else {
          this.paperName = '随机测验'
        }
      })
      sleep(150).then(() => {
        getQuestionList(this.testOptionId, this.userId).then(response => {
          if (response.data.status === 400) {
            this.$message('你已经进行过该考试！请更换考试！')
          } else if (response.data.status === 200) {
            let resultList = []
            resultList = response.data.responseMap.result
            this.testId = response.data.responseMap.testId
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
          } else if (response.data.status === 500) {
            this.$message('考试时间已结束或未到考试时间！')
          }
        })
      })
    },
    back() {
      this.$confirm('试卷尚未提交，退出页面将视作提交试卷答案！是否确认退出？', '注意', {
        showClose: false,
        confirmButtonText: '继续答题',
        cancelButtonText: '确认离开'
      }).then(() => {
        if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL)
          window.addEventListener('popstate', this.back, false)
        }
      }).catch(() => {
        this.isMidPointSubmitted = true
        this.submitAnswerDialogConfirmOnClicked()
        this.$router.push('/test_user/take_test')
      })
    },
    refresh(e) {
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
        const testId = {
          testId: this.testId
        }
        deleteTest(testId).then(response => {
        })
      }
      return '关闭'
    },
    onSubmitClicked() {
      this.submitAnswerDialog.title = '提示'
      this.submitAnswerDialog.visible = true
    },
    submitAnswerDialogConfirmOnClicked() {
      const result = []
      const tempList = this.tests
      let tempId = -1
      let tempAnswer = -1
      let resultAnswer = ''
      let tempType = ''
      for (let i = 0; i < tempList.length; i++) {
        tempId = tempList[i].id
        result.push(tempId.toString())
        tempAnswer = tempList[i].answer
        tempType = tempList[i].type
        if (tempType === 'select') {
          if (tempAnswer === 0) {
            resultAnswer = 'A'
          } else if (tempAnswer === 1) {
            resultAnswer = 'B'
          } else if (tempAnswer === 2) {
            resultAnswer = 'C'
          } else if (tempAnswer === 3) {
            resultAnswer = 'D'
          } else {
            resultAnswer = ''
          }
        } else if (tempType === 'judge') {
          if (tempAnswer === 0) {
            resultAnswer = '1'
          } else if (tempAnswer === 1) {
            resultAnswer = '0'
          } else {
            resultAnswer = '-1'
          }
        } else if (tempType === 'qa') {
          resultAnswer = tempList[i].answer
        } else {
          resultAnswer = ''
        }
        result.push(resultAnswer)
      }
      submitAnswer(this.testId, result).then(response => {
        const tempScore = response.data.responseMap.result
        if (response.data.status === '200') {
          this.resultScore = tempScore
        }
      })
      this.submitAnswerDialog.visible = false
      if (this.isMidPointSubmitted === false) {
        this.showScoreDialog.visible = true
      } else {
        this.showScoreDialog.visible = false
      }
    },
    showScoreDialogConfirmOnClicked() {
      this.$router.push('/test_user/check_result')
    }
  }
}

</script>
