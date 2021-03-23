<template>
  <div class="app-container">
    <el-dropdown @command="handleCommand">
      <el-button type="primary">
        {{ tag }}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="keShi">科室管理</el-dropdown-item>
          <el-dropdown-item command="yaoPin">药品管理</el-dropdown-item>
          <el-dropdown-item command="shouFei">收费管理</el-dropdown-item>
          <el-dropdown-item command="huaYan">化验项目管理</el-dropdown-item>
          <el-dropdown-item command="yiMiao">疫苗管理</el-dropdown-item>
          <el-dropdown-item command="zhuYuan">住院管理</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" :label="column1">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column :label="column2">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="column3" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="success" icon="el-icon-plus"/>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.$index, scope.$index)"/>
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.$index, scope.$index)"/>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStructureInfo } from '@/api/structure'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: false,
      column1: 'column1',
      column2: 'column2',
      column3: 'column3',
      tag: '选择结构',
      form: {}
    }
  },
  created() {
    this.handleCommand('keShi')
    this.form = { 'test1': 12 }
    this.$set(this.form, 'haha', 333)
    console.log(this.form)
  },
  methods: {
    handleCommand(command) {
      // this.$message('click on item ' + command)
      if (command === 'keShi') {
        this.tag = '科室管理'
        this.column1 = '科室ID'
        this.column2 = '科室名'
        this.column3 = '功能描述'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              name: '档案室',
              description: '这是档案室'
            },
            {
              name: '免疫室',
              description: '这是免疫室'
            },
            {
              name: '化验室',
              description: '这是化验室'
            }
          ]
        })
      } else if (command === 'yaoPin') {
        this.tag = '药品管理'
        this.column1 = '药品ID'
        this.column2 = '药品名'
        this.column3 = '功能描述'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              name: '阿莫西林',
              description: '这是阿莫西林'
            },
            {
              name: '敌敌畏',
              description: '这是敌敌畏'
            },
            {
              name: '维他命',
              description: '这是维他命'
            }
          ]
        })
      } else if (command === 'shouFei') {
        this.tag = '收费管理'
        this.column1 = '收费项目ID'
        this.column2 = '收费项目名'
        this.column3 = '价格'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              name: '打针',
              description: '50'
            },
            {
              name: '验血',
              description: '25'
            },
            {
              name: 'B超',
              description: '100'
            }
          ]
        })
      } else if (command === 'huaYan') {
        this.tag = '化验项目管理'
        this.column1 = '化验项目ID'
        this.column2 = '化验项目名'
        this.column3 = '化验描述'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              name: '验血',
              description: '抽血验血'
            },
            {
              name: '尿检',
              description: '撒尿验尿'
            },
            {
              name: '尸检',
              description: '死亡验尸'
            }
          ]
        })
      } else if (command === 'yiMiao') {
        this.tag = '疫苗管理'
        this.column1 = '疫苗ID'
        this.column2 = '疫苗名'
        this.column3 = '疫苗描述'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              name: '天花疫苗',
              description: '防天花'
            },
            {
              name: '新冠疫苗',
              description: '防新冠'
            },
            {
              name: '霍乱疫苗',
              description: '防霍乱'
            }
          ]
        })
      } else if (command === 'zhuYuan') {
        this.tag = '住院管理'
        this.column1 = 'ID'
        this.column2 = '病人姓名'
        this.column3 = '病种名称'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              name: '李明',
              description: '割包皮'
            },
            {
              name: '李华',
              description: '鼻塞'
            },
            {
              name: '小红',
              description: '便秘'
            }
          ]
        })
      }
    }
  }
}
</script>
