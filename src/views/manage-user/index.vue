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
      <el-table-column align="center" label="ID" width="100">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="UserName">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Account" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="Password" width="200" align="center">
        <template slot-scope="scope">
          <el-input v-show="scope.row.edit" size="small" v-model="scope.row.password"></el-input>
          <span v-show="!scope.row.edit">{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="400">
        <template slot-scope="{row}">
          <el-button v-show='!row.edit' type="primary" @click='cancelEdit(row);row.edit=true;' icon="edit">修改密码</el-button>
          <el-button v-show='row.edit' type="success" @click='confirmEdit(row);row.edit=false;' icon="check">修改完成</el-button>
          <el-button type="danger" @click="deleteUser">删除账户</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserList } from '@/api/user'

export default {
  data() {
    return {
      list: [{
        index: '0',
        name: '我是超级账号！',
        account: 'admin',
        password: '111111',
        edit: true
      }],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  methods: {
    cancelEdit(row) {
      row.title = row.originalTitle
      row.edit = false
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      row.originalTitle = row.title
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    },
    deleteUser(){
      this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
  /* created() {
    this.fetchData()
  },
  methods: {
  async getList() {
        this.listLoading = true
        const { data } = await fetchList(this.listQuery)
        const items = data.items
        this.list = items.map(v => {
          this.$set(v, 'edit', false) //
          v.originalTitle = v.title //  will be used when user click the cancel botton
          return v
        })
        this.listLoading = false
      },
    fetchData() {
      this.listLoading = true
      getUserList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }*/
}
</script>
