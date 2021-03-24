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
          <el-dropdown-item command="section">科室管理</el-dropdown-item>
          <el-dropdown-item command="medicine">药品管理</el-dropdown-item>
          <el-dropdown-item command="fee">收费管理</el-dropdown-item>
          <el-dropdown-item command="examination">化验项目管理</el-dropdown-item>
          <el-dropdown-item command="vaccine">疫苗管理</el-dropdown-item>
          <el-dropdown-item command="hospitalize">住院管理</el-dropdown-item>
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
          <el-button type="primary" @click="onImageClicked(scope.row.caseId, scope.row.jieZhen)">图片</el-button>
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
    <el-dialog
      :visible="sectionWordsDialog.visible"
      :title="sectionWordsDialog.title"
      width="50%"
      center
    >
      <el-form :model="secForm">
        <el-form-item label="科室名" label-width="120px">
          <el-input v-model="secForm.sectionName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="前台功能描述" label-width="120px">
          <el-input v-model="secForm.recDesc" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="医助功能描述" label-width="120px">
          <el-input v-model="secForm.assissDesc" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="医师功能描述" label-width="120px">
          <el-input v-model="secForm.docDesc" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sectionWordsDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="sectionWordsDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="medicineDialog.visible"
      :title="medicineDialog.title"
      width="50%"
      center
    >
      <el-form :model="medForm">
        <el-form-item label="药品名" label-width="120px">
          <el-input v-model="medForm.medName" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="功能描述" label-width="120px">
          <el-input v-model="medForm.medDesc" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="medicineDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="medicineDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getStructureInfo, submitSectionWordsDialogResult, deleteSectionById } from '@/api/structure'

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
      tag: '选择结构',
      sectionWordsDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      secForm: {
        sectionId: -1,
        sectionIndex: -1,
        sectionName: '',
        recDesc: '',
        assissDesc: '',
        docDesc: ''
      },
      medicineDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      medForm: {
        medId: -1,
        medIndex: -1,
        medName: '',
        medDesc: ''
      }
    }
  },
  created() {
    this.handleCommand('section')
  },
  methods: {
    onCreateNewClicked() {
      if (this.tag === '科室管理') {
        this.sectionWordsDialog.visible = true
        this.sectionWordsDialog.title = '创建科室'
        this.secForm.sectionName = ''
        this.secForm.recDesc = ''
        this.secForm.assissDesc = ''
        this.secForm.docDesc = ''
        this.sectionWordsDialog.changeMode = 'add'
      } else if (this.tag === '药品管理') {
        this.medicineDialog.visible = true
        this.medicineDialog.title = '创建药品'
        this.medForm.medName = ''
        this.medForm.medDesc = ''
        this.medicineDialog.changeMode = 'add'
      } else if (this.tag === '收费管理') {
        // add fee
      } else if (this.tag === '化验项目管理') {
        // add exam
      } else if (this.tag === '疫苗管理') {
        // add vac
      } else if (this.tag === '住院管理') {
        // add hos
      }
    },
    onEditClicked(edit_id, edit_index) {
      if (this.tag === '科室管理') {
        this.sectionWordsDialog.title = '编辑科室'
        this.secForm.sectionId = edit_id
        this.secForm.sectionIndex = edit_index
        this.secForm.sectionName = this.list[edit_index].name
        this.secForm.recDesc = this.list[edit_index].description1
        this.secForm.assissDesc = this.list[edit_index].description2
        this.secForm.docDesc = this.list[edit_index].description3
        this.sectionWordsDialog.changeMode = 'update'
        this.sectionWordsDialog.visible = true
      } else if (this.tag === '药品管理') {
        this.medicineDialog.visible = true
        this.medicineDialog.title = '编辑药品'
        this.medForm.medId = edit_id
        this.medForm.medIndex = edit_index
        this.medForm.medName = this.list[edit_index].name
        this.medForm.medDesc = this.list[edit_index].description1
        this.medicineDialog.changeMode = 'update'
      } else if (this.tag === '收费管理') {
        // edit fee
      } else if (this.tag === '化验项目管理') {
        // edit exam
      } else if (this.tag === '疫苗管理') {
        // edit vac
      } else if (this.tag === '住院管理') {
        // edit hos
      }
    },
    onDeleteClicked(del_id, del_index) {
      if (this.tag === '科室管理') {
        deleteSectionById(del_id).then(response => {
          // if (response.data.result === 200) {
          // eslint-disable-next-line no-constant-condition
          if (true) {
            console.log(this.list)
            this.list.splice(del_index, 1)
          } else {
            // console.log('删除失败')
          }
        })
      } else if (this.tag === '药品管理') {
        // delete med
      } else if (this.tag === '收费管理') {
        // delete fee
      } else if (this.tag === '化验项目管理') {
        // delete exam
      } else if (this.tag === '疫苗管理') {
        // delete vac
      } else if (this.tag === '住院管理') {
        // delete hos
      }
    },
    sectionWordsDialogConfirmOnClicked() {
      const params = {
        sectionId: this.secForm.sectionId,
        sectionIndex: this.secForm.sectionIndex,
        sectionName: this.secForm.sectionName,
        recDesc: this.secForm.recDesc,
        docDesc: this.secForm.docDesc,
        assissDesc: this.secForm.assissDesc,
        changeMode: this.sectionWordsDialog.changeMode
      }
      submitSectionWordsDialogResult(params).then(response => {
        const sectionIndex = this.secForm.sectionIndex
        const changeMode = this.sectionWordsDialog.changeMode
        if (changeMode === 'update') {
          if (sectionIndex != null && sectionIndex >= 0) {
            this.list[sectionIndex].name = this.secForm.sectionName
            this.list[sectionIndex].description1 = this.secForm.recDesc
            this.list[sectionIndex].description3 = this.secForm.docDesc
            this.list[sectionIndex].description2 = this.secForm.assissDesc
          }
        } else if (changeMode === 'add') {
          this.list.push(
            {
              id: 55,
              name: this.secForm.sectionName,
              description1: this.secForm.recDesc,
              description2: this.secForm.assissDesc,
              description3: this.secForm.docDesc,
              description4: ''
            }
          )
        }
        this.sectionWordsDialog.visible = false
      })
    },
    handleCommand(command) {
      // this.$message('click on item ' + command)
      if (command === 'section') {
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
      } else if (command === 'medicine') {
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
      } else if (command === 'fee') {
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
      } else if (command === 'examination') {
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
      } else if (command === 'vaccine') {
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
      } else if (command === 'hospitalize') {
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
