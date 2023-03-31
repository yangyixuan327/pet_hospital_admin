<template>
  <div class="app-container">
    <div style="margin: 0 auto; text-align: center; height: 80px">
      <span style="font-size: 40px"><b>配置考试人员</b></span>
    </div>
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
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="账号" >
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
    </el-table>
    <div align="center" style="margin-top: 30px; margin-bottom: 20px">
      <el-button type="primary" @click="onSaveClicked">保存配置</el-button>
    </div>
  </div>
</template>

<script>


import {addUserToOption, getAllUser, pickUserBytestOptionId} from "@/api/test/exam";

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
      examId: -1
    }
  },
  created() {
    this.examId = this.$route.query.exam_id
    this.fetchData()
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
      getAllUser().then(response => {
        const responseResult = response.data.responseMap.result
        for (let i = 0; i < responseResult.length; i++) {
          this.list.push({
            userId: responseResult[i].userId,
            account: responseResult[i].account,
            name: responseResult[i].name,
            selected: false
          })
        }
        this.listLoading = false
      })
      sleep(200).then(() => {
        pickUserBytestOptionId(this.examId).then(response => {
          const responseResult = response.data.responseMap.result
          for (let i = 0; i < responseResult.length; i++) {
            for (let j = 0; j < this.list.length; j++) {
              if (responseResult[i].userId === this.list[j].userId) {
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
        const userIds = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].selected === true) {
            userIds.push(this.list[i].userId)
          }
        }
        addUserToOption(this.examId, userIds).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push('/test_manage/exam_manage')
        })
      }).catch(() => {
        if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL)
          window.addEventListener('popstate', this.back, false)
        }
      })
    },
    onSaveClicked() {
      this.$confirm('确认保存考试配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const userIds = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].selected === true) {
            userIds.push(this.list[i].userId)
          }
        }
        addUserToOption(this.examId, userIds).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push('/test_manage/exam_manage')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存'
        })
      })
    }
  }
}
</script>
