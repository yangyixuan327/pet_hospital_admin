<template>
  <div>
    <el-container>
      <el-aside style="text-align: center">
        <el-card shadow="hover" style="margin-top: 50px; height: 390px; text-align: center">
          <div style="position: relative; text-align: center">
            <p style="text-align: center; color: darkred; font-size: 20px; margin-top: 50px"><b>剩余时间</b></p>
            <el-progress type="circle" :percentage="timeLeftPercentage" :show-text="false" style="position: absolute; top: 110px; left: 70px">
              <template>
                <span>当前进度</span>
              </template>
            </el-progress>
            <p style="position: absolute; top: 148px; left: 100px; text-align: center">{{ timeLeft }}</p>
          </div>
        </el-card>
      </el-aside>
      <el-container>
        <el-header style="margin-top: 50px; font-size: 40px; text-align: center">
          <el-card shadow="always">
            <b>{{ paperName }}</b>
          </el-card>
        </el-header>
        <el-main>
          <el-card shadow="hover" style="height: 300px; margin-top: 10px">
            <template #header>
              <div style="text-align: center">
                <span>第  {{ questionIndex + 1 }}  题  ({{ tests[questionIndex].score }}  分)</span>
              </div>
            </template>
            <p>{{ tests[questionIndex].title }}</p>
            <div v-if="tests[questionIndex].type === 'select'" style="text-align: center; height: 40px">
              <el-radio-group v-model="tests[questionIndex].answer">
                <el-radio
                  v-for="(option,index) in choiceOption"
                  :key="index"
                  :label="index"
                >{{ option }}</el-radio>
              </el-radio-group>
            </div>
            <div v-else-if="tests[questionIndex].type === 'judge'" style="text-align: center; height: 40px">
              <el-radio-group v-model="tests[questionIndex].answer">
                <el-radio
                  v-for="(option,index) in judgeOption"
                  :key="index"
                  :label="index"
                >{{ option }}</el-radio>
              </el-radio-group>
            </div>
            <div v-else-if="tests[questionIndex].type === 'qa'" style="height: 70px">
              <el-input v-model="tests[questionIndex].answer" type="textarea" :rows="2" placeholder="请输入你的回答"/>
            </div>
            <div style="text-align: center">
              <el-button-group>
                <el-button type="primary" icon="el-icon-arrow-left" :disabled="isPreDisabled" @click="onPreQuestionClicked">上一题</el-button>
                <el-button type="primary" :disabled="isNextDisabled" @click="onNextQuestionClicked">下一题<i class="el-icon-arrow-right el-icon--right" /></el-button>
              </el-button-group>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
    <el-card shadow="hover">
      <el-steps :active="questionIndex">
        <el-step
          v-for="(test, index) in tests"
          :key="index"
          :label="index"
          @click.native="onQuesClicked(test)"
        />
      </el-steps>
    </el-card>
    <div align="center" style="margin-top: 30px; margin-bottom: 20px">
      <el-button type="primary" icon="el-icon-check" @click="onSubmitClicked">提交试卷</el-button>
    </div>
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
      isErrorIn: true,
      interval: setInterval(null, null, null),
      tests: null,
      secondsLeftTotal: 0,
      timeLeftPercentage: 100,
      haveDoneQuestionNumber: 1,
      timeLeft: '00:00:00',
      duration: 0,
      hourLeft: 1,
      minuteLeft: 1,
      secondLeft: 0,
      startTime: '',
      questionIndex: 0,
      judgeOption: ['True', 'False'],
      choiceOption: ['A', 'B', 'C', 'D'],
      submitAnswerDialog: {
        visible: false,
        title: ''
      },
      testId: -1,
      testOptionId: -1,
      paperId: -1,
      isPreDisabled: false,
      isNextDisabled: false,
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
    this.duration = this.$route.query.duration
    this.startTime = this.$route.query.startTime
    this.isPreDisabled = true
    this.setTimeLeft()
    this.fetchData()
  },
  mounted() {
    sleep(1500).then(() => {
      if (this.isErrorIn === false) {
        if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL)
          window.addEventListener('popstate', this.back, false)
        }
        window.addEventListener('beforeunload', this.refresh)
      }
    })
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
        if (totalNum === 0) {
          this.isRandom = false
        } else {
          this.isRandom = true
        }
      })
      sleep(200).then(() => {
        if (this.isRandom === false) {
          sleep(200).then(() => {
            getPaperById(this.paperId).then(response => {
              this.paperName = response.data.responseMap.result.paperName
            })
          })
        } else {
          this.paperName = '随机测验'
        }
      })
      sleep(200).then(() => {
        getQuestionList(this.testOptionId, this.userId).then(response => {
          if (response.data.status === 400) {
            this.isErrorIn = true
            this.$message('你已经进行过该考试！请更换考试！')
          } else if (response.data.status === 200) {
            this.isErrorIn = false
            let resultList = []
            resultList = response.data.responseMap.result
            this.testId = response.data.responseMap.testId
            const questionList = []
            for (let i = 0; i < resultList.length; i++) {
              questionList.push({
                id: resultList[i].quesId != null ? resultList[i].quesId : 0,
                title: resultList[i].descrip != null ? resultList[i].descrip : '',
                type: resultList[i].type != null ? resultList[i].type : '',
                score: resultList[i].score != null ? resultList[i].score : '',
                tag: resultList[i].tag != null ? resultList[i].tag : '',
                image: '',
                answer: '',
                quesIndex: i
              })
            }
            this.tests = questionList
          } else if (response.data.status === 500) {
            this.isErrorIn = true
            this.$message('考试时间已结束或未到考试时间！')
          }
        })
      })
    },
    onQuesClicked(test) {
      this.questionIndex = test.quesIndex
    },
    setTimeLeft() {
      this.hourLeft = Math.floor(this.duration / 60)
      this.minuteLeft = Math.floor(this.duration % 60)
      this.secondsLeftTotal = (this.hourLeft * 3600) + (this.minuteLeft * 60) + this.secondLeft
      this.timeLeftPercentage = 100 * ((this.secondsLeftTotal / 60) / this.duration)
      let hours = this.hourLeft < 10 ? '0' + this.hourLeft : this.hourLeft
      let minutes = this.minuteLeft < 10 ? '0' + this.minuteLeft : this.minuteLeft
      let seconds = this.secondLeft < 10 ? '0' + this.secondLeft : this.secondLeft
      this.timeLeft = hours + ':' + minutes + ':' + seconds
      this.interval = setInterval(() => {
        if (this.secondLeft === 0) {
          if (this.minuteLeft === 0) {
            if (this.hourLeft === 0) {
              clearInterval(this.interval)
              this.$alert('已自动为您交卷！', '考试时间结束', {
                confirmButtonText: '确定',
                callback: action => {
                  this.isMidPointSubmitted = true
                  this.submitAnswerDialogConfirmOnClicked()
                  this.$router.push('/test_user/take_test')
                }
              })
            } else {
              this.hourLeft -= 1
              this.minuteLeft = 59
              this.secondLeft = 59
            }
          } else {
            this.minuteLeft -= 1
            this.secondLeft = 59
          }
        } else {
          this.secondLeft -= 1
        }
        this.secondsLeftTotal = (this.hourLeft * 3600) + (this.minuteLeft * 60) + this.secondLeft
        this.timeLeftPercentage = 100 * ((this.secondsLeftTotal / 60) / this.duration)
        hours = this.hourLeft < 10 ? '0' + this.hourLeft : this.hourLeft
        minutes = this.minuteLeft < 10 ? '0' + this.minuteLeft : this.minuteLeft
        seconds = this.secondLeft < 10 ? '0' + this.secondLeft : this.secondLeft
        this.timeLeft = hours + ':' + minutes + ':' + seconds
      }, 1000)
    },
    onPreQuestionClicked() {
      this.questionIndex = this.questionIndex - 1
      this.isNextDisabled = false
      if (this.questionIndex === 0) {
        this.isPreDisabled = true
      }
    },
    onNextQuestionClicked() {
      this.questionIndex = this.questionIndex + 1
      this.isPreDisabled = false
      if (this.questionIndex === (this.tests.length - 1)) {
        this.isNextDisabled = true
      }
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
          clearInterval(this.interval)
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
      clearInterval(this.interval)
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
