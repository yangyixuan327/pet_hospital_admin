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
      <el-table-column label="开始时间" width="110" align="center">
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
            <el-button type="primary" icon="el-icon-reading" @click="onclick(scope.row.testOptionId, scope.$index)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

// import { getList } from '@/api/table'
import router from "@/router";
import {getTestOptionByUserId} from "@/api/test/inTest";

export default {
  data() {
    return {
      userId: this.$store.getters.token,
      list: null,
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
  },
  methods: {
    fetchData() {

      this.listLoading = true
      getTestOptionByUserId(this.userId).then(response => {
        this.list = response.data.responseMap.result
        this.listLoading = false
        console.log(this.list)
      })
    },
    onclick(exam_id, exam_index) {
      this.$router.push({
        path: '/test_user/inTest',
        query: {
          id: exam_id
        }
        /*query: {
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
