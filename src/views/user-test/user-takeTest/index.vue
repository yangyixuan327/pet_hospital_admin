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
      <el-table-column label="开始时间" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.startDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.duration }}
        </template>
      </el-table-column>
      <el-table-column label="总分" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.totalScore }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="进入考试" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-reading" :disabled="scope.row.isButtonDisabled" @click="onclick(scope.row.testOptionId, scope.$index)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

// import { getList } from '@/api/table'
import { getTestOptionByUserId } from '@/api/test/inTest'
import { getTestList } from '@/api/test/checkResult'

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

function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  )
}

export default {
  data() {
    return {
      userId: this.$store.getters.token,
      list: [],
      listLoading: true,
      wordsDialog: {
        visible: false,
        title: '',
        changeMode: 'add' // has two value: 'add' and 'update'
      },
      form: {
        examName: '',
        startTime: null,
        duration: 0,
        totalScore: 0
      }
    }
  },
  created() {
    this.fetchData()
    sleep(200).then(() => {
      this.changeButtonMode()
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTestOptionByUserId(this.userId).then(response => {
        const tempList = response.data.responseMap.result
        for (let i = 0; i < tempList.length; i++) {
          this.list.push({
            testOptionId: tempList[i].testOptionId,
            testOptionName: tempList[i].testOptionName,
            startDate: dateFormat(tempList[i].startDate),
            duration: tempList[i].duration,
            totalScore: tempList[i].totalScore,
            isButtonDisabled: false
          })
        }
      })
      this.listLoading = false
    },
    changeButtonMode() {
      getTestList(this.userId).then(response => {
        let tempList = []
        tempList = response.data.responseMap.result
        for (let i = 0; i < tempList.length; i++) {
          for (let j = 0; j < this.list.length; j++) {
            if (this.list[j].testOptionId === tempList[i].testOptionId) {
              console.log('disabled: ' + this.list[j].testOptionId + ' successfully')
              this.list[j].isButtonDisabled = true
            }
          }
        }
      })
    },
    onclick(exam_id, exam_index) {
      this.$router.push({
        path: '/test_user/inTest',
        query: {
          id: exam_id
        }
        /* query: {
            key: 'key',
            msgKey: this.msg
        }*/
      })
    }
  }
}
</script>

<style scoped>

</style>
