<template>
  <div class="app-container">
    <el-dropdown @command="handleCommand">
      <el-button type="primary">
        {{ tag }}<i class="el-icon-arrow-down el-icon--right" />
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
      <el-table-column v-if="tag==='科室管理' || tag==='收费管理' || tag==='住院管理'" :label="column4" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description2 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tag==='科室管理' || tag==='住院管理'" :label="column5" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description3 }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tag==='科室管理'" :label="column6" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="onImageClicked(scope.row.id, )">图片</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="onEditClicked(scope.row.id, scope.$index)" />
            <el-button type="danger" icon="el-icon-delete" @click="onDeleteClicked(scope.row, scope.$index)" />
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="addSectionDialog.visible"
      :title="addSectionDialog.title"
      width="50%"
      center
      @close="addSectionDialog.visible = false"
    >
      <el-form :model="addSectionForm">
        <el-form-item label="科室名" label-width="120px">
          <el-input v-model="addSectionForm.secName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addSectionDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="addSectionDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="sectionWordsDialog.visible"
      :title="sectionWordsDialog.title"
      width="50%"
      center
      @close="sectionWordsDialog.visible = false"
    >
      <el-form :model="secForm">
        <el-form-item label="科室名" label-width="120px">
          <el-input v-model="secForm.sectionName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="前台功能描述" label-width="120px">
          <el-input v-model="secForm.recDesc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="医助功能描述" label-width="120px">
          <el-input v-model="secForm.assissDesc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="医师功能描述" label-width="120px">
          <el-input v-model="secForm.docDesc" autocomplete="off" />
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
      :visible="sectionImageDialog.visible"
      :title="sectionImageDialog.title"
      width="50%"
      center
      @close="sectionImageDialog.visible = false"
    >
      <div class="case-image" :visible="sectionImageDialog.contentVisible">
        <el-image v-for="url in imageUrls" :key="url" :src="url" lazy>
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </template>
        </el-image>
      </div>
      <el-upload
        class="media-upload"
        :action="postUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        multiple
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <el-button size="small" type="primary" style="margin-left: auto; margin-top: 40px">点击上传</el-button>
        <template #tip>
          <div class="el-upload__tip">{{ uploadTip }}</div>
        </template>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sectionImageDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="sectionImageDialog.visible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="medicineDialog.visible"
      :title="medicineDialog.title"
      width="50%"
      center
      @close="medicineDialog.visible = false"
    >
      <el-form :model="medForm">
        <el-form-item label="药品名" label-width="120px">
          <el-input v-model="medForm.medName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="功能描述" label-width="120px">
          <el-input v-model="medForm.medDesc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="medicineDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="medicineDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="feeDialog.visible"
      :title="feeDialog.title"
      width="50%"
      center
      @close="feeDialog.visible = false"
    >
      <el-form :model="feeForm">
        <el-form-item label="收费项目名" label-width="120px">
          <el-input v-model="feeForm.feeName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="价格" label-width="120px">
          <el-input v-model="feeForm.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收费描述" label-width="120px">
          <el-input v-model="feeForm.feeDesc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="feeDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="feeDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="examDialog.visible"
      :title="examDialog.title"
      width="50%"
      center
      @close="examDialog.visible = false"
    >
      <el-form :model="examForm">
        <el-form-item label="化验项目名" label-width="120px">
          <el-input v-model="examForm.examName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="化验描述" label-width="120px">
          <el-input v-model="examForm.examDesc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="examDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="examDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="vacDialog.visible"
      :title="vacDialog.title"
      width="50%"
      center
      @close="vacDialog.visible = false"
    >
      <el-form :model="vacForm">
        <el-form-item label="疫苗名" label-width="120px">
          <el-input v-model="vacForm.vacName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="疫苗描述" label-width="120px">
          <el-input v-model="vacForm.vacDesc" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="vacDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="vacDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="addHosDialog.visible"
      :title="addHosDialog.title"
      width="50%"
      center
      @close="addHosDialog.visible = false"
    >
      <el-form :model="addHosForm">
        <el-form-item label="动物名" label-width="120px">
          <el-input v-model="addHosForm.hosAnimalName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="病名" label-width="120px">
          <el-input v-model="addHosForm.disease" autocomplete="off" />
        </el-form-item>
        <el-form-item label="入院日期" label-width="120px">
          <el-input v-model="addHosForm.inDate" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addHosDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="addHosDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible="hosDialog.visible"
      :title="hosDialog.title"
      width="50%"
      center
      @close="hosDialog.visible = false"
    >
      <el-form :model="hosForm">
        <el-form-item label="动物名" label-width="120px">
          <el-input v-model="hosForm.hosAnimalName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="病名" label-width="120px">
          <el-input v-model="hosForm.disease" autocomplete="off" />
        </el-form-item>
        <el-form-item label="入院日期" label-width="120px">
          <el-input v-model="hosForm.inDate" autocomplete="off" />
        </el-form-item>
        <el-form-item label="出院日期" label-width="120px">
          <el-input v-model="hosForm.outDate" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="hosDialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="hosDialogConfirmOnClicked">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStructureInfo,
  getImageById,
  submitSectionWordsDialogResult,
  deleteSectionById,
  deleteMedicineById,
  submitMedicineDialogResult,
  deleteFeeById,
  submitFeeDialogResult,
  deleteExamById,
  submitExamDialogResult,
  deleteVacById,
  submitVacDialogResult,
  deleteHosById,
  submitHosDialogResult,
  updateSection,
  updateExam,
  updateFee,
  updateHospitalize,
  updateMedicine,
  updateVaccine,
  newSection,
  newMedicine,
  newFee,
  newExam,
  newVaccine,
  newHospitalize
} from '@/api/structure'

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
      addSectionDialog: {
        visible: false,
        title: ''
      },
      addSectionForm: {
        secName: ''
      },
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
        docDesc: '',
        sectionImageUrl: ''
      },
      sectionImageDialog: {
        visible: false,
        contentVisible: true,
        title: ''
      },
      imageUrls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
      ],
      postUrl: '',
      uploadTip: '',
      fileList: [],
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
      },
      feeDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      feeForm: {
        feeId: -1,
        feeIndex: -1,
        feeName: '',
        price: 10.00,
        feeDesc: ''
      },
      examDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      examForm: {
        examId: -1,
        examIndex: -1,
        examName: '',
        examDesc: ''
      },
      vacDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      vacForm: {
        vacId: -1,
        vacIndex: -1,
        vacName: '',
        vacDesc: ''
      },
      addHosForm: {
        hosAnimalName: '',
        disease: '',
        inDate: ''
      },
      addHosDialog: {
        visible: false,
        title: ''
      },
      hosDialog: {
        visible: false,
        title: '',
        changeMode: 'add'
      },
      hosForm: {
        hosId: -1,
        hosIndex: -1,
        hosAnimalName: '',
        disease: '',
        inDate: '',
        outDate: ''
      }
    }
  },
  created() {
    this.handleCommand('section')
  },
  methods: {
    onCreateNewClicked() {
      if (this.tag === '科室管理') {
        this.addSectionDialog.visible = true
        this.addSectionDialog.title = '创建科室'
        this.addSectionForm.secName = ''
      } else if (this.tag === '药品管理') {
        this.medicineDialog.visible = true
        this.medicineDialog.title = '创建药品'
        this.medForm.medName = ''
        this.medForm.medDesc = ''
        this.medicineDialog.changeMode = 'add'
      } else if (this.tag === '收费管理') {
        this.feeDialog.visible = true
        this.feeDialog.title = '创建收费项目'
        this.feeForm.feeName = ''
        this.feeForm.price = 0.00
        this.feeForm.feeDesc = ''
        this.feeDialog.changeMode = 'add'
      } else if (this.tag === '化验项目管理') {
        this.examDialog.visible = true
        this.examDialog.title = '创建化验项目'
        this.examForm.examName = ''
        this.examForm.examDesc = ''
        this.examDialog.changeMode = 'add'
      } else if (this.tag === '疫苗管理') {
        this.vacDialog.visible = true
        this.vacDialog.title = '创建疫苗'
        this.vacForm.vacName = ''
        this.vacForm.vacDesc = ''
        this.vacDialog.changeMode = 'add'
      } else if (this.tag === '住院管理') {
        this.addHosDialog.visible = true
        this.addHosDialog.title = '创建住院'
        this.addHosForm.hosAnimalName = ''
        this.addHosForm.disease = ''
        this.addHosForm.inDate = ''
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
        this.secForm.sectionImageUrl = this.list[edit_index].description4
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
        this.feeDialog.visible = true
        this.feeDialog.title = '编辑收费项目'
        this.feeForm.feeId = edit_id
        this.feeForm.feeIndex = edit_index
        this.feeForm.feeName = this.list[edit_index].name
        this.feeForm.price = this.list[edit_index].description1
        this.feeForm.feeDesc = this.list[edit_index].description2
        this.feeDialog.changeMode = 'update'
      } else if (this.tag === '化验项目管理') {
        this.examDialog.visible = true
        this.examDialog.title = '编辑药品'
        this.examForm.examId = edit_id
        this.examForm.examIndex = edit_index
        this.examForm.examName = this.list[edit_index].name
        this.examForm.examDesc = this.list[edit_index].description1
        this.examDialog.changeMode = 'update'
      } else if (this.tag === '疫苗管理') {
        this.vacDialog.visible = true
        this.vacDialog.title = '编辑疫苗'
        this.vacForm.vacId = edit_id
        this.vacForm.vacIndex = edit_index
        this.vacForm.vacName = this.list[edit_index].name
        this.vacForm.vacDesc = this.list[edit_index].description1
        this.vacDialog.changeMode = 'update'
      } else if (this.tag === '住院管理') {
        this.hosDialog.visible = true
        this.hosDialog.title = '编辑住院信息'
        this.hosForm.hosId = edit_id
        this.hosForm.hosIndex = edit_index
        this.hosForm.hosAnimalName = this.list[edit_index].name
        this.hosForm.disease = this.list[edit_index].description1
        this.hosForm.inDate = this.list[edit_index].description2
        this.hosForm.outDate = this.list[edit_index].description3
        this.hosDialog.changeMode = 'update'
      }
    },
    onDeleteClicked(row, del_index) {
      console.log(del_index)
      this.$confirm('此操作将永久删除此记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.tag === '科室管理') {
          const params = {
            sectionId: row.id
          }
          deleteSectionById(params).then(response => {
            console.log(response)
            console.log(params)
            this.list.splice(del_index, 1)
          })
        } else if (this.tag === '药品管理') {
          const params = {
            medId: row.id
          }
          deleteMedicineById(params).then(response => {
            console.log(response)
            console.log(params)
            this.list.splice(del_index, 1)
          })
        } else if (this.tag === '收费管理') {
          const params = {
            feeId: row.id
          }
          deleteFeeById(params).then(response => {
            console.log(response)
            console.log(params)
            this.list.splice(del_index, 1)
          })
        } else if (this.tag === '化验项目管理') {
          const params = {
            examId: row.id
          }
          deleteExamById(params).then(response => {
            console.log(response)
            console.log(params)
            this.list.splice(del_index, 1)
          })
        } else if (this.tag === '疫苗管理') {
          const params = {
            vacId: row.id
          }
          deleteVacById(params).then(response => {
            console.log(response)
            console.log(params)
            this.list.splice(del_index, 1)
          })
        } else if (this.tag === '住院管理') {
          const params = {
            hosId: row.id
          }
          deleteHosById(params).then(response => {
            console.log(response)
            console.log(params)
            this.list.splice(del_index, 1)
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onImageClicked(case_id, image_urls) {
      this.sectionImageDialog.visible = true
      this.sectionImageDialog.contentVisible = true
      this.sectionImageDialog.title = '科室图片'
      this.uploadTip = '上传图片'
      console.log('case_id: ' + case_id)
      console.log('image_urls: ' + image_urls)
      getImageById(case_id).then(response => {
        console.log('image open')
      })
    },
    addSectionDialogConfirmOnClicked() {
      const params = {
        sectionName: this.addSectionForm.secName
      }
      newSection(params).then(response => {
        console.log('created new section' + params.sectionName)
        console.log(response.data.responseMap.result)
        this.list.push({
          id: response.data.responseMap.result,
          name: params.sectionName,
          description1: '',
          description2: '',
          description3: '',
          description4: ''
        })
      })
      this.addSectionDialog.visible = false
    },
    sectionWordsDialogConfirmOnClicked() {
      const params = {
        sectionId: this.secForm.sectionId,
        sectionName: this.secForm.sectionName,
        recDescrip: this.secForm.recDesc,
        docDescrip: this.secForm.docDesc,
        assisDescrip: this.secForm.assissDesc,
        sectionImageUrl: this.secForm.sectionImageUrl,
        changeMode: this.sectionWordsDialog.changeMode
      }
      submitSectionWordsDialogResult(params).then(response => {
        const sectionIndex = this.secForm.sectionIndex
        const changeMode = this.sectionWordsDialog.changeMode
        if (changeMode === 'update') {
          if (sectionIndex != null && sectionIndex >= 0) {
            this.list[sectionIndex].name = this.secForm.sectionName
            this.list[sectionIndex].description1 = this.secForm.recDesc
            this.list[sectionIndex].description2 = this.secForm.assissDesc
            this.list[sectionIndex].description3 = this.secForm.docDesc
            this.list[sectionIndex].description4 = this.secForm.sectionImageUrl
            const sectionId = params.sectionId
            const temp = {
              sectionId: this.secForm.sectionId,
              sectionName: this.secForm.sectionName,
              recDescrip: this.secForm.recDesc,
              docDescrip: this.secForm.docDesc,
              assisDescrip: this.secForm.assissDesc,
              sectionImageUrl: this.secForm.sectionImageUrl
            }
            console.log(temp)
            updateSection(sectionId, temp).then(response => {
              console.log('updated section' + temp)
            })
          }
        }
        this.sectionWordsDialog.visible = false
      })
    },
    medicineDialogConfirmOnClicked() {
      const params = {
        medId: this.medForm.medId,
        medIndex: this.medForm.medIndex,
        medName: this.medForm.medName,
        medDesc: this.medForm.medDesc,
        changeMode: this.medicineDialog.changeMode
      }
      submitMedicineDialogResult(params).then(response => {
        const medicineIndex = this.medForm.medIndex
        const changeMode = this.medicineDialog.changeMode
        const medId = this.medForm.medId
        if (changeMode === 'update') {
          if (medicineIndex != null && medicineIndex >= 0) {
            const temp = {
              medId: this.medForm.medId,
              medName: this.medForm.medName,
              medDescrip: this.medForm.medDesc
            }
            updateMedicine(medId, temp).then(response => {
              console.log('updated medicine' + temp)
            })
            this.list[medicineIndex].name = this.medForm.medName
            this.list[medicineIndex].description1 = this.medForm.medDesc
          }
        } else if (changeMode === 'add') {
          const medName = this.medForm.medName
          const medDescrip = this.medForm.medDesc
          console.log(medName + medDescrip)
          newMedicine(medName, medDescrip).then(response => {
            console.log('created new medicine' + medName + medDescrip)
            this.list.push({
              id: response.data.responseMap.result,
              name: medName,
              description1: medDescrip
            })
          })
        }
        this.medicineDialog.visible = false
      })
    },
    feeDialogConfirmOnClicked() {
      const params = {
        feeId: this.feeForm.feeId,
        feeIndex: this.feeForm.feeIndex,
        feeName: this.feeForm.feeName,
        price: this.feeForm.price,
        feeDesc: this.feeForm.feeDesc,
        changeMode: this.medicineDialog.changeMode
      }
      submitFeeDialogResult(params).then(response => {
        const feeIndex = this.feeForm.feeIndex
        const changeMode = this.feeDialog.changeMode
        const feeId = this.feeForm.feeId
        const temp = {
          feeId: this.feeForm.feeId,
          feeName: this.feeForm.feeName,
          feePrice: this.feeForm.price,
          feeDescrip: this.feeForm.feeDesc
        }
        if (changeMode === 'update') {
          if (feeIndex != null && feeIndex >= 0) {
            this.list[feeIndex].name = this.feeForm.feeName
            this.list[feeIndex].description1 = this.feeForm.price
            this.list[feeIndex].description2 = this.feeForm.feeDesc
            updateFee(feeId, temp).then(response => {
              console.log('updated fee' + temp)
            })
          }
        } else if (changeMode === 'add') {
          const feeName = this.feeForm.feeName
          const feePrice = this.feeForm.price
          const feeDescrip = this.feeForm.feeDesc
          console.log(feeName + feePrice + feeDescrip)
          newFee(feeName, feePrice, feeDescrip).then(response => {
            console.log('created new fee' + feeName + feePrice + feeDescrip)
            this.list.push({
              id: response.data.responseMap.result,
              name: feeName,
              description1: feePrice,
              description2: feeDescrip
            })
          })
        }
        this.feeDialog.visible = false
      })
    },
    examDialogConfirmOnClicked() {
      const params = {
        examId: this.examForm.examId,
        examIndex: this.examForm.examIndex,
        examName: this.examForm.examName,
        examDesc: this.examForm.examDesc,
        changeMode: this.examDialog.changeMode
      }
      submitExamDialogResult(params).then(response => {
        const examIndex = this.examForm.examIndex
        const changeMode = this.examDialog.changeMode
        const examId = this.examForm.examId
        const temp = {
          examId: this.examForm.examId,
          examName: this.examForm.examName,
          examDescrip: this.examForm.examDesc
        }
        if (changeMode === 'update') {
          if (examIndex != null && examIndex >= 0) {
            this.list[examIndex].name = this.examForm.examName
            this.list[examIndex].description1 = this.examForm.examDesc
            updateExam(examId, temp).then(response => {
              console.log('updated examination' + temp)
            })
          }
        } else if (changeMode === 'add') {
          const examName = this.examForm.examName
          const examDescrip = this.examForm.examDesc
          newExam(examName, examDescrip).then(response => {
            console.log('created new exam' + examName + examDescrip)
            this.list.push({
              id: response.data.responseMap.result,
              name: examName,
              description1: examDescrip
            })
          })
        }
        this.examDialog.visible = false
      })
    },
    vacDialogConfirmOnClicked() {
      const params = {
        vacId: this.vacForm.vacId,
        vacIndex: this.vacForm.vacIndex,
        vacName: this.vacForm.vacName,
        vacDesc: this.vacForm.vacDesc,
        changeMode: this.vacDialog.changeMode
      }
      submitVacDialogResult(params).then(response => {
        const vacIndex = this.vacForm.vacIndex
        const changeMode = this.vacDialog.changeMode
        const vacId = this.vacForm.vacId
        const temp = {
          vacId: this.vacForm.vacId,
          vacName: this.vacForm.vacName,
          vacDescrip: this.vacForm.vacDesc
        }
        if (changeMode === 'update') {
          if (vacIndex != null && vacIndex >= 0) {
            this.list[vacIndex].name = this.vacForm.vacName
            this.list[vacIndex].description1 = this.vacForm.vacDesc
            updateVaccine(vacId, temp).then(response => {
              console.log('updated vaccine' + temp)
            })
          }
        } else if (changeMode === 'add') {
          const vacName = this.vacForm.vacName
          const vacDescrip = this.vacForm.vacDesc
          newVaccine(vacName, vacDescrip).then(response => {
            console.log('created new vaccine' + vacName + vacDescrip)
            this.list.push({
              id: response.data.responseMap.result,
              name: vacName,
              description1: vacDescrip
            })
          })
        }
        this.vacDialog.visible = false
      })
    },
    addHosDialogConfirmOnClicked() {
      const hosAnimalName = this.addHosForm.hosAnimalName
      const disease = this.addHosForm.disease
      const inDate = dateFormat(this.addHosForm.inDate)
      newHospitalize(hosAnimalName, disease, inDate).then(response => {
        console.log('created new hospitalize' + hosAnimalName + disease + inDate)
        this.list.push({
          id: response.data.responseMap.result,
          name: hosAnimalName,
          description1: disease,
          description2: inDate,
          description3: ''
        })
      })
      this.addHosDialog.visible = false
    },
    hosDialogConfirmOnClicked() {
      const params = {
        hosId: this.hosForm.hosId,
        hosIndex: this.hosForm.hosIndex,
        hosAnimalName: this.hosForm.hosAnimalName,
        disease: this.hosForm.disease,
        inDate: this.hosForm.inDate,
        outDate: this.hosForm.outDate,
        changeMode: this.hosDialog.changeMode
      }
      submitHosDialogResult(params).then(response => {
        const hosIndex = this.hosForm.hosIndex
        const changeMode = this.hosDialog.changeMode
        const hosId = this.hosForm.hosId
        const temp = {
          hosId: this.hosForm.hosId,
          hosAnimalName: this.hosForm.hosAnimalName,
          disease: this.hosForm.disease,
          inDate: dateFormat(this.hosForm.inDate),
          outDate: dateFormat(this.hosForm.outDate)
        }
        console.log(temp)
        if (changeMode === 'update') {
          if (hosIndex != null && hosIndex >= 0) {
            this.list[hosIndex].name = this.hosForm.hosAnimalName
            this.list[hosIndex].description1 = this.hosForm.disease
            this.list[hosIndex].description2 = dateFormat(this.hosForm.inDate)
            this.list[hosIndex].description3 = dateFormat(this.hosForm.outDate)
            updateHospitalize(hosId, temp).then(response => {
              console.log(temp)
            })
          }
        }
        this.hosDialog.visible = false
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
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
          const resultList = response.data.responseMap.result
          console.log(resultList)
          const tempList = []
          for (let i = 0; i < resultList.length; i++) {
            tempList.push({
              id: resultList[i].sectionId,
              name: resultList[i].sectionName,
              description1: resultList[i].recDescrip != null ? resultList[i].recDescrip : '',
              description2: resultList[i].assisDescrip != null ? resultList[i].assisDescrip : '',
              description3: resultList[i].docDescrip != null ? resultList[i].docDescrip : '',
              description4: resultList[i].sectionImageUrl != null ? resultList[i].sectionImageUrl : ''
            })
          }
          this.list = tempList
          console.log(this.list)
        })
      } else if (command === 'medicine') {
        this.tag = '药品管理'
        this.column1 = '药品ID'
        this.column2 = '药品名'
        this.column3 = '功能描述'
        getStructureInfo(command).then(response => {
          const resultList = response.data.responseMap.result
          console.log(resultList)
          const tempList = []
          for (let i = 0; i < resultList.length; i++) {
            tempList.push({
              id: resultList[i].medId,
              name: resultList[i].medName,
              description1: resultList[i].medDescrip
            })
          }
          this.list = tempList
        })
      } else if (command === 'fee') {
        this.tag = '收费管理'
        this.column1 = '收费项目ID'
        this.column2 = '收费项目名'
        this.column3 = '价格'
        this.column4 = '收费描述'
        getStructureInfo(command).then(response => {
          const resultList = response.data.responseMap.result
          console.log(resultList)
          const tempList = []
          for (let i = 0; i < resultList.length; i++) {
            tempList.push({
              id: resultList[i].feeId,
              name: resultList[i].feeName,
              description1: resultList[i].feePrice,
              description2: resultList[i].feeDescrip
            })
          }
          this.list = tempList
        })
      } else if (command === 'examination') {
        this.tag = '化验项目管理'
        this.column1 = '化验项目ID'
        this.column2 = '化验项目名'
        this.column3 = '化验描述'
        getStructureInfo(command).then(response => {
          const resultList = response.data.responseMap.result
          console.log(resultList)
          const tempList = []
          for (let i = 0; i < resultList.length; i++) {
            tempList.push({
              id: resultList[i].examId,
              name: resultList[i].examName,
              description1: resultList[i].examDescrip
            })
          }
          this.list = tempList
        })
      } else if (command === 'vaccine') {
        this.tag = '疫苗管理'
        this.column1 = '疫苗ID'
        this.column2 = '疫苗名'
        this.column3 = '疫苗描述'
        getStructureInfo(command).then(response => {
          const resultList = response.data.responseMap.result
          console.log(resultList)
          const tempList = []
          for (let i = 0; i < resultList.length; i++) {
            tempList.push({
              id: resultList[i].vacId,
              name: resultList[i].vacName,
              description1: resultList[i].vacDescrip
            })
          }
          this.list = tempList
        })
      } else if (command === 'hospitalize') {
        this.tag = '住院管理'
        this.column1 = 'ID'
        this.column2 = '动物名字'
        this.column3 = '病名'
        this.column4 = '入院日期'
        this.column5 = '出院日期'
        getStructureInfo(command).then(response => {
          const resultList = response.data.responseMap.result
          console.log(resultList)
          const tempList = []
          for (let i = 0; i < resultList.length; i++) {
            tempList.push({
              id: resultList[i].hosId,
              name: resultList[i].hosAnimalName,
              description1: resultList[i].disease,
              description2: dateFormat(resultList[i].inDate),
              description3: dateFormat(resultList[i].outDate)
            })
          }
          this.list = tempList
        })
      }
    }
  }
}
</script>
