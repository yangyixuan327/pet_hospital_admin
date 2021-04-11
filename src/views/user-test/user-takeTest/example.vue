<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col>
          <div class="grid-content bg-purple">
            <div v-for="(test, index) in tests" :key="index">
              <p>{{index + 1}}.{{test.title}}</p>
              <el-radio-group v-if="test.type == 'choice'" v-model="test.answer">
                <!-- label绑定答案的值,可以绑定索引index,也可以绑定答案内容option -->
                <el-radio
                  v-for="(option,index) in choiceOption"
                  :label="index"
                  :key="index"
                >{{ option }}</el-radio>
              </el-radio-group>
              <el-radio-group v-else-if="test.type == 'judge'" v-model="test.answer">
                <el-radio
                  v-for="(option,index) in judgeOption"
                  :label="index"
                  :key="index"
                >{{ option }}</el-radio>
              </el-radio-group>
              <div v-else>
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="test.answer"></el-input>
              </div>
            </div>
          </div>
          <br/>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      tests: [
        {
          title: 'this is choice 1:A.aaa  B.bbb  C.ccc   D,ddd',
          type: 'choice',
          answer: ''
        },
        {
          title: 'this is choice 2:A.aaa  B.bbb  C.ccc   D,ddd',
          type: 'choice',
          answer: ''
        },
        {
          title: 'this is judge 3',
          type: 'judge',
          answer: ''
        },
        {
          title: 'this is choice 4:A.aaa  B.bbb  C.ccc   D,ddd',
          type: 'choice',
          answer: ''
        },
        {
          title: 'this is Q&A 5: answer me please!',
          type: 'QNA',
          answer: ''
        },
        {
          title: 'this is judge 6',
          type: 'judge',
          answer: ''
        }
      ],
      judgeOption: ['True', 'False'],
      choiceOption: ['A', 'B', 'C', 'D']
    }
  }
}
</script>

<style scoped>

</style>
