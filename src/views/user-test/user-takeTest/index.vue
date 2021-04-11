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
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="考试名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.pageviews }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时长" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>
      <el-table-column label="总分" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-reading" @click="onclick(scope.$index, scope.$index)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { getList } from '@/api/table'
import router from "@/router";

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
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    onclick(exam_id, exam_index) {
      this.$router.push({
        path: '/test_user/inTest',
        // name: '要跳转的路径的 name,在 router 文件夹下的 index.js 文件内找',
        params: {
          key: 'key',
          msgKey: this.msg
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
