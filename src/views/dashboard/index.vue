<template>
  <div class="dashboard-container">
    <el-carousel :interval="4000" arrow="always" :height="height">
      <el-carousel-item >
        <h3 class="medium">
          <a>
            <img class="img" src="https://ae01.alicdn.com/kf/Uabd8e2ec440a413b9deb564ccadb1b93S.jpg" >
          </a>
        </h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium">
          <a>
            <img class="img" src="https://ae01.alicdn.com/kf/U78cfc24f729149199861a254e690d7210.jpg" >
          </a>
        </h3>
      </el-carousel-item>
      <el-carousel-item >
        <h3 class="medium">
          <a>
            <img class="img" src="https://ae01.alicdn.com/kf/U237cdae570764ebdbb861bf33506cb8d1.jpg" >
          </a>
        </h3>
      </el-carousel-item>
    </el-carousel>

  <template v-if="roles === 'admin'">
    <el-row  type="flex" :gutter="20" justify="end" >
      <el-col ><el-button class = "big_button" type="primary" @click="$router.push({name:'UserManageIndex'})">用户管理</el-button></el-col>
      <el-col ><el-button class = "big_button" type="success" @click="$router.push({name:'QuestionManage'})">测试管理</el-button></el-col>
      <el-col ><el-button class = "big_button" type="warning" @click="$router.push({name:'CaseManageIndex'})">病例管理</el-button></el-col>
      <el-col ><el-button class = "big_button" type="danger" @click="$router.push({name:'StructureManageIndex'})">结构管理</el-button></el-col>
    </el-row>
  </template>

    <template v-if="roles === 'user'">
      <el-row  type="flex" :gutter="20" justify="end" >
        <el-col ><el-button class = "big_button" type="primary" @click="$router.push({name:'HospitalNavigation'})">3D医院导览</el-button></el-col>
        <el-col ><el-button class = "big_button" type="success" @click="$router.push({name:'CaseFrontInner'})">病例学习</el-button></el-col>
        <el-col ><el-button class = "big_button" type="warning" @click="$router.push({name:'TakeTest'})">参加考试</el-button></el-col>
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
    beforeMount:function(){
        this.height = $(window).width()*664/1920 + 'px';
    },
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
    height: 600%;
    width:  100%;
    font-size: 20px;
    font-weight:bold;
    border:3px solid snow;
    box-shadow: darkgrey 10px 10px 30px 5px ;
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
