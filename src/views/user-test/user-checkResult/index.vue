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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="考试名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.beginDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.endDate }}
        </template>
      </el-table-column>
      <el-table-column label="总分" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.score }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {
  getTestList,
  getTestOption
} from '@/api/test/checkResult'
import store from '@/store'

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
      list: [],
      listLoading: false,
      userId: store.getters.token
    }
  },
  created() {
    console.log(this.userId)
    this.fetchData()
  },
  methods: {
    fetchData() {
      getTestList(this.userId).then(response => {
        let tempList = []
        tempList = response.data.responseMap.result
        for (let i = 0; i < tempList.length; i++) {
          this.list.push({
            id: tempList[i].testId,
            name: '',
            beginDate: dateFormat(tempList[i].beginDate),
            endDate: dateFormat(tempList[i].endDate),
            score: tempList[i].score,
            testOptionId: tempList[i].testOptionId
          })
        }
      })
      getTestOption(this.userId).then(response => {
        let tempList = []
        tempList = response.data.responseMap.result
        for (let i = 0; i < tempList.length; i++) {
          for (let j = 0; j < this.list.length; j++) {
            if (this.list[j].testOptionId === tempList[i].testOptionId) {
              this.list[j].name = tempList[i].testOptionName
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
