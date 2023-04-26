<template>
  <div class="app-container">
    <el-button type="primary" style="margin-bottom: 10px;" @click="onCreateNewClicked">新建<i
      class="el-icon-plus el-icon--right"
    /></el-button>
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
      <el-table-column label="用户名 Username">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号 Account" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
      <el-table-column label="密码 Password" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限 Role" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Action" width="200">
        <template slot-scope="{row,$index}">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(row,$index)"/>
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(row,$index)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible="editDialog.visible"
      :title="editDialog.title"
      width="50%"
      center
      @close="editDialog.visible = false"
    >
      <el-form :model="form">
        <el-form-item label="账号Account" label-width="130px">
          <el-input v-model="form.account" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="用户名Username" label-width="130px">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="密码Password" label-width="130px">
          <el-input v-model="form.password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="管理员Admin" label-width="130px">
          <el-switch v-model="form.role"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>

import { deleteUser, newUser, submitEditDialogResult, updateUser } from '../../api/user'
import { getList } from '../../api/user'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      editDialog: {
        visible: false,
        contentVisible: true,
        title: ''
      },
      form: {
        userId: -1,
        index: -1,
        name: '',
        account: '',
        password: '',
        role: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = false
      getList().then(response => {
        console.log(response)
        this.list = response.data.responseMap.result
        this.listLoading = false
      })
    },
    onCreateNewClicked() {
      this.editDialog.visible = true
      this.editDialog.title = '新建账户'
      this.form.name = ''
      this.form.account = ''
      this.form.password = ''
      this.form.role = false
      this.editDialog.changeMode = 'add'
    },
    onEditClicked(row, index) {
      this.form.userId = row.userId
      this.form.index = index
      this.form.name = row.name
      this.form.account = row.account
      this.form.password = row.password
      if (row.role === 'admin') {
        this.form.role = true
      } else {
        this.form.role = false
      }
      this.editDialog.title = '修改账户'
      this.editDialog.visible = true
      this.editDialog.changeMode = 'update'
    },
    onDeleteClicked(row, index) {
      const temp = {
        userId: row.userId
      }
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(temp).then(response => {
          console.log(response)
          console.log(temp)
          this.list.splice(index, 1)
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败，已取消操作'
        })
      })
    },
    editDialogConfirmOnClicked(index) {
      if (this.form.role === true) {
        this.form.role = 'admin'
      } else {
        this.form.role = 'user'
      }
      const params = {
        name: this.form.name,
        account: this.form.account,
        password: this.form.password,
        role: this.form.role,
        index: this.form.index,
        changeMode: this.editDialog.changeMode
      }
      submitEditDialogResult(params).then(response => {
        const index = this.form.index
        const changeMode = this.editDialog.changeMode
        const temp = {
          name: this.form.name,
          account: this.form.account,
          password: this.form.password,
          role: this.form.role,
          userId: this.form.userId
        }
        if (changeMode === 'update') {
          if (index != null && index >= 0) {
            this.list[index].name = this.form.name
            this.list[index].account = this.form.account
            this.list[index].password = this.form.password
            this.list[index].role = this.form.role
            updateUser(temp).then(response => {
              console.log(response)
              console.log('Updated user' + temp)
            })
          }
        } else if (changeMode === 'add') {
          newUser(temp).then(response => {
            console.log('Create new user' + temp)
          })
          this.list.push({
            name: this.form.name,
            account: this.form.account,
            password: this.form.password,
            role: this.form.role }
          )
        }
        this.editDialog.visible = false
      })
    }
  }
}
</script>
