<template>
  <div class="app-container">
    <el-dropdown @command="handleCommand">
      <el-button type="primary">
        {{ tag }}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-button type="primary" style="margin-bottom: 10px;" align="right" @click="onCreateNewClicked">新建<i
        class="el-icon-plus el-icon--right"
      /></el-button>
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
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column :label="column2">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column :label="column3" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description1 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tag==='科室管理' || tag==='收费管理'" :label="column4" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description2 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tag==='科室管理'" :label="column5" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description3 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tag==='科室管理'" :label="column6" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.description4==='image'" type="primary" @click="onImageClicked(scope.row.caseId, scope.row.jieZhen)">图片</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
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
      column4: 'column4',
      column5: 'column5',
      column6: 'column6',
      tag: '选择结构'
    }
  },
  created() {
    this.handleCommand('keShi')
  },
  methods: {
    handleCommand(command) {
      // this.$message('click on item ' + command)
      if (command === 'keShi') {
        this.tag = '科室管理'
        this.column1 = '科室ID'
        this.column2 = '科室名'
        this.column3 = '前台功能描述'
        this.column4 = '医助功能描述'
        this.column5 = '医师功能描述'
        this.column6 = '科室图片'
        getStructureInfo(command).then(response => {
          this.list = [
            {
              id: 1,
              name: '档案室',
              description1: '前台的档案室',
              description2: '医助的档案室',
              description3: '医师的档案室',
              description4: 'image'
            },
            {
              id: 2,
              name: '免疫室',
              description1: '前台的免疫室',
              description2: '医助的免疫室',
              description3: '医师的免疫室',
              description4: 'image'
            },
            {
              id: 3,
              name: '化验室',
              description1: '前台的化验室',
              description2: '医助的化验室',
              description3: '医师的化验室',
              description4: 'image'
            }
          ]
        })
      } else if (command === 'yaoPin') {
        this.tag = '药品管理'
        this.column1 = '药品ID'
        this.column2 = '药品名'
        this.column3 = '功能描述'
        this.column5 = ''
        this.column6 = ''
        getStructureInfo(command).then(response => {
          this.list = [
            {
              id: 1,
              name: '阿莫西林',
              description1: '这是阿莫西林',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 2,
              name: '敌敌畏',
              description1: '这是敌敌畏',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 3,
              name: '维他命',
              description1: '这是维他命',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            }
          ]
        })
      } else if (command === 'shouFei') {
        this.tag = '收费管理'
        this.column1 = '收费项目ID'
        this.column2 = '收费项目名'
        this.column3 = '价格'
        this.column4 = '收费描述'
        this.column5 = ''
        this.column6 = ''
        getStructureInfo(command).then(response => {
          this.list = [
            {
              id: 1,
              name: '打针',
              description1: '50',
              description2: '打针描述',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 2,
              name: '验血',
              description1: '25',
              description2: '验血描述',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 3,
              name: 'B超',
              description1: '100',
              description2: 'B超描述',
              description3: 'null',
              description4: 'null'
            }
          ]
        })
      } else if (command === 'huaYan') {
        this.tag = '化验项目管理'
        this.column1 = '化验项目ID'
        this.column2 = '化验项目名'
        this.column3 = '化验描述'
        this.column4 = ''
        this.column5 = ''
        this.column6 = ''
        getStructureInfo(command).then(response => {
          this.list = [
            {
              id: 1,
              name: '验血',
              description1: '抽血验血',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 2,
              name: '尿检',
              description1: '撒尿验尿',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 3,
              name: '尸检',
              description1: '死亡验尸',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            }
          ]
        })
      } else if (command === 'yiMiao') {
        this.tag = '疫苗管理'
        this.column1 = '疫苗ID'
        this.column2 = '疫苗名'
        this.column3 = '疫苗描述'
        this.column4 = ''
        this.column5 = ''
        this.column6 = ''
        getStructureInfo(command).then(response => {
          this.list = [
            {
              id: 1,
              name: '天花疫苗',
              description1: '防天花',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 2,
              name: '新冠疫苗',
              description1: '防新冠',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 3,
              name: '霍乱疫苗',
              description1: '防霍乱',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            }
          ]
        })
      } else if (command === 'zhuYuan') {
        this.tag = '住院管理'
        this.column1 = 'ID'
        this.column2 = '动物名字'
        this.column3 = '病名'
        this.column4 = ''
        this.column5 = ''
        this.column6 = ''
        getStructureInfo(command).then(response => {
          this.list = [
            {
              id: 1,
              name: '李明',
              description1: '割包皮',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 2,
              name: '李华',
              description1: '鼻塞',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            },
            {
              id: 3,
              name: '小红',
              description1: '便秘',
              description2: 'null',
              description3: 'null',
              description4: 'null'
            }
          ]
        })
      }
    }
  }
}
</script>
