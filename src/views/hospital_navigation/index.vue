<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-aside style= "margin-top: 20px" width="800px" height="650px">
          <el-card  class="box-card">
            <iframe width="768px" height="600px" allowfullscreen frameborder="0" src="https://orbix360.com/t/W9GePKp52ZUPWPGPtuKEKFpz1P03/4539399484211200/pthost3d#"></iframe>
          </el-card>
        </el-aside>
        <el-main>
          <template>
            <el-card class="box-card">
              <div style="line-height:20px; text-align: left; font-size: 22px ; font-weight:bold">
                职能描述:
              </div>
              <div style="text-align: left">
                <el-divider></el-divider>
                {{ description_by_characters }}
                <el-divider></el-divider>
                <el-image
                  v-if="img_url !== 'http://NULL'"
                  :src="img_url"></el-image>
              </div>
            </el-card>
          </template>
        </el-main>
      </el-container>
      <el-footer>
        <el-row type="flex" :gutter="20" justify="end">
          <el-col :span="3">
            <el-select v-model="character" @change=characterChange placeholder="请选择角色" size="medium">
              <el-option
                v-for="character in characters"
                :key="character.character_value"
                :label="character.character_label"
                :value="character.character_value"
              >
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="section" @change=sectionChange placeholder="请选择地点" size="medium">
              <el-option
                v-for="section in sections"
                :key="section.sectionId"
                :label="section.sectionName"
                :value="section.sectionId"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { getSectionInfo, getSectionsInfo } from '../../api/3D_navigation'

export default {
  data() {
    return {
      description_by_characters: '青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪',
      characters: [{
        character_value: 'rec',
        character_label: '前台'
      }, {
        character_value: 'doc',
        character_label: '医师'
      }, {
        character_value: 'assis',
        character_label: '医师助理'
      }],
      character: '前台',
      sections: [],
      section: '大厅', // 默认大厅
      sectionId: 1,
      img_url:""
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    characterChange(val) {
      let obj = {}
      obj = this.characters.find((character) => {
        return character.character_value === val
      })
      this.character = obj.character_value

      let obj2 = {}
      obj2 = this.sections.find((section) => {
        return section.sectionId === this.sectionId
      })

      let description
      if (this.character === 'rec') {
        description = obj2.recDescrip
      } else if (this.character === 'doc') {
        description = obj2.docDescrip
      } else if (this.character === 'assis') {
        description = obj2.assisDescrip
      } else {
        description = obj2.recDescrip // 默认前台
      }
      if (description === 'NULL') {
        this.description_by_characters = '当前角色在该科室无职责，请选择其他科室或切换角色。'
      } else {
        this.description_by_characters = description
      }
      this.$forceUpdate()
    },
    sectionChange(val) {
      let obj = {}
      obj = this.sections.find((section) => {
        return section.sectionId === val
      })
      this.section = obj.sectionName
      this.sectionId = obj.sectionId
      const base_url = 'http://'
      this.img_url = base_url + obj.sectionImageUrl
      console.log(this.img_url)
      let description
      if (this.character === 'rec') {
        description = obj.recDescrip
      } else if (this.character === 'doc') {
        description = obj.docDescrip
      } else if (this.character === 'assis') {
        description = obj.assisDescrip
      } else {
        description = obj.recDescrip // 默认前台
      }
      if (description === 'NULL') {
        this.description_by_characters = '当前角色在该科室无职责，请选择其他科室或切换角色。'
      } else {
        this.description_by_characters = description
      }
      this.$forceUpdate()
    },
    fetchData() {
      getSectionsInfo().then(response => {
        this.sections = response.data.responseMap.result
        console.log(this.sections)
      })
      this.description_by_characters = '请选择角色或者地点进行职能学习'
    }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-main {
  /*background-color: #E9EEF3;*/
  color: #333;
  text-align: center;
  line-height: 100px;
}
.el-aside {
  margin-bottom: 2%;
}
.box-card{
  min-height: 100%;
  height: 100%;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}


</style>

