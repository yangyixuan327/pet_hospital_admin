<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">
            <div v-for="(test, index) in tests" :key="index">
              <p>{{ index + 1 }}.{{ test.title }}</p>
              <el-radio-group v-if="test.type == '选择题'" v-model="test.answer">
                <!-- label绑定答案的值,可以绑定索引index,也可以绑定答案内容option -->
                <el-radio
                  v-for="(option,index) in choiceOption"
                  :key="index"
                  :label="index"
                >{{ option }}</el-radio>
              </el-radio-group>
              <el-radio-group v-else-if="test.type == '判断题'" v-model="test.answer">
                <el-radio
                  v-for="(option,index) in judgeOption"
                  :key="index"
                  :label="index"
                >{{ option }}</el-radio>
              </el-radio-group>
              <div v-else-if="test.type == '简答题'">
                <el-input v-model="test.answer" type="textarea" :rows="2" placeholder="请输入内容" />
              </div>
            </div>
          </div>
          <br>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" icon="el-icon-check" @click="onSubmitClicked">提交试卷</el-button>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import {
  getQuestionList
} from '@/api/test/inTest'

export default {
  data() {
    return {
      tests: null,
      judgeOption: ['True', 'False'],
      choiceOption: ['A', 'B', 'C', 'D']
    }
  },
  created() {
    getQuestionList().then(response => {
      const resultList = response.data.responseMap.result
      console.log(resultList)
      const questionList = []
      for (let i = 0; i < resultList.length; i++) {
        questionList.push({
          title: resultList[i].descrip != null ? resultList[i].descrip : '',
          type: resultList[i].type != null ? resultList[i].type : '',
          answer: resultList[i].answer != null ? resultList[i].answer : ''
        })
      }
      this.tests = questionList
    })
  },
  methods: {
    onSubmitClicked() {
    //  to do
    }
  }
}

</script>
