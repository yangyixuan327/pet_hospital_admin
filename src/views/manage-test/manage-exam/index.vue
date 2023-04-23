<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-button type="primary" style="margin-bottom: 10px;" @click="onCreateNewClicked">新建<i
          class="el-icon-plus el-icon--right"
        /></el-button>
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
      <el-table-column align="center" label="考试ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.testOptionId }}
        </template>
      </el-table-column>
      <el-table-column label="考试名称">
        <template slot-scope="scope">
          {{ scope.row.testOptionName }}
        </template>
      </el-table-column>
<!--      <el-table-column label="选择题数目" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.selectNum }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="判断题数目" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.judgeNum }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column label="简答题数目" width="110" align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.qaNum }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="开始时间" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.row.testOptionId, scope.$index)" />
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.row.testOptionId, scope.$index)" />
            <el-button type="warning" icon="el-icon-s-custom" @click="onPickClicked(scope.row.testOptionId, scope.$index)" />
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
      @close="wordsDialog.visible = false"
    >
      <el-row>
        <el-col :span="24" align="center">
          <el-radio-group v-model="examType">
            <el-radio-button label="随机生成"></el-radio-button>
            <el-radio-button label="勾选生成"></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <div style="margin-top: 5px" v-show="examType==='随机生成'">
        <el-form :model="form">
          <el-form-item label="考试名称" label-width="120px">
            <el-input v-model="examName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="选择题数目" label-width="120px">
            <el-input v-model="form.examSelectNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="判断题数目" label-width="120px">
            <el-input v-model="form.examJudgeNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="简答题数目" label-width="120px">
            <el-input v-model="form.examQaNum" autocomplete="off" />
          </el-form-item>
          <el-form-item label="时长" label-width="120px">
            <el-input v-model="form.duration" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 8px" align="center" v-show="examType==='勾选生成'">
        <el-form>
          <el-form-item label="考卷名称" label-width="120px">
            <el-select v-model="value" placeholder="请选择" :popper-append-to-body="false">
              <el-option
                v-for="item in this.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试名称" label-width="120px">
            <el-input v-model="examName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="时长" label-width="120px">
            <el-input v-model="duration" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template>
        <div class="block">
          <el-form>
            <el-form-item label="开始时间" label-width="120px">
<!--              <span class="demonstration">默认</span>-->
              <el-date-picker
                v-model="timeValue"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </template>
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
  getList,
  addPaper,
  changePaperById,
  deletePaperById,
  getAllPaper, getPaperIdByTestOptionId, getPaperNameByPaperId
} from '@/api/test/exam'

function dateFormat(time) {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

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
      timeValue: '',
      form: {
        index: -1,
        examId: -1,
        examName: '',
        examSelectNum: 0,
        examJudgeNum: 0,
        examQaNum: 0,
        duration: 0
      },
      examType: "随机生成",
      options: [],
      value: '',
      paperId: -1,
      paperName: '',
      duration: 0,
      examId: -1,
      examName: '',
      index: -1,
    }
  },
  created() {
    this.fetchData()

  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.responseMap.result
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].startDate = dateFormat(this.list[i].startDate)
        }
        // console.log("hahahh" + this.list[0].startDate)
        this.listLoading = false
      })
      getAllPaper().then(response => {
        const exams = response.data.responseMap.result
        for (let i = 0; i < exams.length; i++) {
          this.options.push({
            value: exams[i].examId,
            label: exams[i].examName
          })
        }
      })
    },
    onCreateNewClicked() {
      if (this.examType === '随机生成') {
        this.wordsDialog.title = '新增考试'
        this.form.examName = ''
        // this.form.examSelectNum = 0
        // this.form.examJudgeNum = 0
        // this.form.examQaNum = 0
        // this.form.duration = 0
      } else {
        this.examName = ''
        this.value = ''
      }
      this.timeValue = ''
      this.wordsDialog.visible = true
      this.wordsDialog.changeMode = 'add'
    },
    onDeleteClicked(exam_id, exam_index) {
      this.$confirm('确认删除本场考试？此操作不可回退！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePaperById({testOptionId: exam_id}).then(response => {
          if (response.data.status === 200) {
            // console.log('delete paper success')
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.list.splice(exam_index, 1)
          } else {
            alert('删除失败')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onEditClicked(exam_id, exam_index) {
      this.examId = exam_id
      this.wordsDialog.title = '编辑考试'
      this.timeValue = this.list[exam_index].startDate
      // console.log("接收时间")
      // console.log(this.timeValue)
      // console.log(typeof this.timeValue)
      let sum = this.list[exam_index].selectNum + this.list[exam_index].judgeNum + this.list[exam_index].qaNum
      this.examType = sum > 0 ? '随机生成' : '勾选生成'
      console.log(sum)
      // console.log(this.list[paper_index].paperSelectNum)
      if (sum > 0) {
        // this.examType = '随机生成'
        this.examName = this.list[exam_index].testOptionName
        this.form.examSelectNum = this.list[exam_index].selectNum
        this.form.examJudgeNum = this.list[exam_index].judgeNum
        this.form.examQaNum = this.list[exam_index].qaNum
        this.form.examId = exam_id
        this.form.index = exam_index
        this.form.examName = this.list[exam_index].testOptionName
        // console.log(this.list[paper_index])
        this.form.duration = this.list[exam_index].duration
      } else {
        // this.examType = '勾选生成'
        this.index = exam_index
        this.examName = this.list[exam_index].testOptionName
        getPaperIdByTestOptionId(exam_id).then(response => {
          this.paperId = response.data.responseMap.result.testOptionId
          // console.log("id" + this.paperId)
          getPaperNameByPaperId(this.paperId).then(response => {
            this.paperName = response.data.responseMap.result.testOptionName
            // console.log("name" + this.paperName)
            this.value = this.paperId
            // console.log("value" + this.value)
          })
        })
        this.duration = this.list[exam_index].duration
      }
      this.wordsDialog.visible = true
      this.wordsDialog.changeMode = 'update'
    },

    onPickClicked(exam_id, exam_index) {
      this.$router.push({
        path: '/test_manage/exam_manage/pick_user',
        query: {
          exam_id: exam_id
        }
      })
    },

    wordsDialogConfirmOnClicked() {
      if (this.wordsDialog.changeMode === 'add') {
        if (this.examType === '随机生成') {
          const params = {
            testOptionName: this.form.examName,
            selectNum: this.form.examSelectNum,
            judgeNum: this.form.examJudgeNum,
            qaNum: this.form.examQaNum,
            duration: this.form.duration,
            startDate: this.timeValue
          }
          // console.log("写入时间")
          // console.log(this.timeValue)
          // console.log(typeof this.timeValue)
          addPaper(params).then(response => {
            this.list.push({
              testOptionId: response.data.responseMap.result,
              testOptionName: this.form.examName,
              // selectNum: this.form.examSelectNum,
              // judgeNum: this.form.examJudgeNum,
              // qaNum: this.form.examQaNum,
              duration: this.form.duration,
              startDate: this.timeValue
            })
          })
          // this.wordsDialog.visible = false
        } else if (this.examType === '勾选生成') {
          // for (let i = 0; i < this.options.length; i++) {
          //   if (this.options[i].value === this.value) {
          //     this.paperName = this.options[i].label
          //   }
          // }
          const params = {
            testOptionName: this.examName,
            selectNum: 0,
            judgeNum: 0,
            qaNum: 0,
            duration: this.duration,
            paperId: this.value,
            startDate: this.timeValue
          }
          addPaper(params).then(response => {
            this.list.push({
              testOptionId: response.data.responseMap.result,
              testOptionName: this.examName,
              duration: this.duration,
              startDate: this.timeValue
            })
          })
          // this.wordsDialog.visible = false
        }
        location.reload();
      } else if (this.wordsDialog.changeMode === 'update') {
        if (this.examType === '随机生成') {
          const exam_data = {
            testOptionName: this.form.examName,
            selectNum: this.form.examSelectNum,
            judgeNum: this.form.examJudgeNum,
            qaNum: this.form.examQaNum,
            duration: this.form.duration,
            startDate: this.timeValue
          }
          changePaperById(this.examId, exam_data).then(response => {
            this.list[this.form.index].testOptionName = exam_data.testOptionName
            this.list[this.form.index].duration = exam_data.duration
            this.list[this.form.index].startDate = exam_data.startDate
          })
          // this.wordsDialog.visible = false
        } else if (this.examType === '勾选生成') {
          const exam_data = {
            testOptionName: this.examName,
            selectNum: 0,
            judgeNum: 0,
            qaNum: 0,
            paperId: this.value,
            duration: this.duration,
            startDate: this.timeValue
          }
          changePaperById(this.examId, exam_data).then(response => {
            this.list[this.index].testOptionName = exam_data.testOptionName
            this.list[this.index].duration = exam_data.duration
            this.list[this.index].startDate = exam_data.startDate
          })
        }
      }
      this.wordsDialog.visible = false
    }
    // wordsDialogConfirmOnClicked() {
    //   const params = {
    //     id: this.form.paperId,
    //     index: this.form.index,
    //     name: this.form.paperName,
    //     selectNum: this.form.examSelectNum,
    //     judgeNum: this.form.examJudgeNum,
    //     qaNum: this.form.examQaNum,
    //     duration: this.form.duration,
    //     changeMode: this.wordsDialog.changeMode
    //   }
    //   submitWordsDialogResult(params).then(response => {
    //     const index = this.form.index
    //     const changeMode = this.wordsDialog.changeMode
    //     let temp = {}
    //     temp = {
    //       testOptionName: this.form.paperName,
    //       selectNum: this.form.examSelectNum,
    //       judgeNum: this.form.examJudgeNum,
    //       qaNum: this.form.examQaNum,
    //       duration: this.form.duration
    //     }
    //     if (changeMode === 'update') {
    //       if (index != null && index >= 0) {
    //         const id = this.form.examId
    //         this.list[index].testOptionName = this.form.examName
    //         this.list[index].selectNum = this.form.examSelectNum
    //         this.list[index].judgeNum = this.form.examJudgeNum
    //         this.list[index].qaNum = this.form.examQaNum
    //         this.list[index].duration = this.form.duration
    //         changePaperById(id, temp).then(response => {
    //           console.log('Updated exam' + temp)
    //         })
    //       }
    //     } else if (changeMode === 'add') {
    //       console.log('3')
    //       addPaper(temp).then(response => {
    //         console.log('Create new exam' + temp)
    //         this.list.push({
    //           testOptionId: response.data.responseMap.result,
    //           testOptionName: this.form.examName,
    //           selectNum: this.form.examSelectNum,
    //           judgeNum: this.form.examJudgeNum,
    //           qaNum: this.form.examQaNum,
    //           duration: this.form.duration
    //         })
    //       })
    //     }
    //     this.wordsDialog.visible = false
    //   })
    // }
  }
}
</script>
