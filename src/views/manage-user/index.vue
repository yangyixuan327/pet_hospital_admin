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
          <span>{{ scope.row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Type" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
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
    >
      <el-form :model="form">
        <el-form-item label="账号" label-width="120px">
          <el-input v-model="form.account" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="form.password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="账号类型" label-width="120px">
          <el-input v-model="form.type" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer >
        <span class="dialog-footer">
          <el-button @click="editDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>

import {submitEditDialogResult} from "../../api/user";
import {getList} from "../../api/user";

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
          type: ''
      },
    }
  },
    created() {
        this.fetchData()
    },
  methods: {
    fetchData() {
        this.listLoading = false
        getList().then(response => {
            const data = [{
                userId: 1,
                name: 'LYX',
                account: 'admin123',
                password: '111111',
                type: 'admin',
            }, {
                userId: 2,
                name: 'GXW',
                account: 'admin456',
                password: '222222',
                type: 'admin',
            },{
                userId: 3,
                name: 'YFF',
                account: 'user123',
                password: '333333',
                type: 'user',
            }]
            this.list = data
            this.listLoading = false
        })
    },
      onCreateNewClicked() {
          this.editDialog.visible = true
          this.editDialog.title = '新建账户'
          this.form.name = ''
          this.form.account = ''
          this.form.password = ''
          this.form.type = ''
          this.editDialog.changeMode = 'add'
      },
      onEditClicked(row, index) {
          this.form.index = index
          this.form.name = row.name
          this.form.account = row.account
          this.form.password = row.password
          this.form.type = row.type
          this.editDialog.title = '修改账户'
          this.editDialog.visible = true
          this.editDialog.changeMode = 'update'
      },
      onDeleteClicked(row, index) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.list.splice(index, 1)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
      editDialogConfirmOnClicked(index) {
        const params = {
          name: this.form.name,
          account: this.form.account,
          password: this.form.password,
          type: this.form.type,
          index: this.form.index,
          changeMode: this.editDialog.changeMode
        }
        submitEditDialogResult(params).then(response => {
          const index = this.form.index
          const changeMode = this.editDialog.changeMode
          if (changeMode === 'update') {
            if (index != null && index >= 0) {
              this.list[index].name = this.form.name
              this.list[index].account = this.form.account
              this.list[index].password = this.form.password
              this.list[index].type = this.form.type
            }
          } else if (changeMode === 'add') {
            this.list.push({
                name: this.form.name,
                account: this.form.account,
                password: this.form.password,
                type: this.form.type
              }
            )
          }
          this.editDialog.visible = false
        })
      }
  // async getList() {
  //       this.listLoading = true
  //       const { data } = await fetchList(this.listQuery)
  //       const items = data.items
  //       this.list = items.map(v => {
  //         this.$set(v, 'edit', false) //
  //         v.originalTitle = v.title //  will be used when user click the cancel botton
  //         return v
  //       })
  //       this.listLoading = false
  //     },
  //   fetchData() {
  //     this.listLoading = true
  //     getUserList().then(response => {
  //       this.list = response.data.items
  //       this.listLoading = false
  //     })
  //   }
  }
}
</script>
