<template>
  <div class="dashboard-container" style="padding-bottom: 10px">
    <el-carousel :interval="4000" arrow="always" :height="height">
      <el-carousel-item >
        <h3 class="medium">
          <a>
            <img class="img" src="https://www.2008php.com/2012_Website_appreciate/2012-11-22/20121122205942cq2f4cq2f4.jpg" >
          </a>
        </h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium">
          <a>
            <img class="img" src="https://img0.baidu.com/it/u=63193626,2047757943&fm=253&fmt=auto&app=138&f=JPEG?w=700&h=438" >
          </a>
        </h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium">
          <a>
            <img class="img" src="https://img1.baidu.com/it/u=2470838980,1872593584&fm=253&fmt=auto&app=120&f=JPEG?w=888&h=500" >
          </a>
        </h3>
      </el-carousel-item>
    </el-carousel>

    <template v-if="this.roles === 'admin'">
      <el-row type="flex" :gutter="20" justify="end" style="padding-bottom: 10px">
        <el-col><el-button class= "big_button" style="background-color: #2775B6; color: white" @click="$router.push({name:'UserManageIndex'})">用户管理</el-button></el-col>
        <el-col><el-button class= "big_button" style="background-color: #5698C3; color: white" @click="$router.push({name:'QuestionManage'})">测试管理</el-button></el-col>
        <el-col><el-button class= "big_button" style="background-color: #93B5CF; color: white" @click="$router.push({name:'CaseManageIndex'})">病例管理</el-button></el-col>
        <el-col><el-button class= "big_button" style="background-color: #D0DFE6; color: #2775B6" @click="$router.push({name:'StructureManageIndex'})">结构管理</el-button></el-col>
      </el-row>
    </template>

    <template v-if="this.roles === 'user'">
      <el-row  type="flex" :gutter="20" justify="end" style="padding-bottom: 10px">
        <el-col ><el-button class = "big_button" style="background-color: #2775B6; color: white" @click="$router.push({name:'HospitalNavigation'})">3D医院导览</el-button></el-col>
        <el-col ><el-button class = "big_button" style="background-color: #5698C3; color: white" @click="$router.push({name:'CaseFrontInner'})">病例学习</el-button></el-col>
        <el-col ><el-button class = "big_button" style="background-color: #93B5CF; color: white" @click="$router.push({name:'TakeTest'})">参加考试</el-button></el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  beforeMount: function() {
    this.height = $(window).width() * 664 / 1920 + 'px'
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin:2%;
    font-family: "微软雅黑";
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .img{
    width:  800px;
  }
  .big_button{
    height: 400%;
    width:  100%;
    font-size: 20px;
    font-weight:bold;
    border:3px solid snow;
    box-shadow: darkgrey 10px 10px 30px 5px ;
    bottom: 10px;
  }
  .el-carousel{
    margin-bottom: 5%;
  }
  .el-carousel__item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .carousel-image {
      max-width: 100%;
      max-height: 100%;
    }

    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
  }
</style>
