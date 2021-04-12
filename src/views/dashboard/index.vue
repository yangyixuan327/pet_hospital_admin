<template>
  <div class="dashboard-container">
<!--    <div class="dashboard-text">Hello 你今天开心吗? {{ name }}</div>-->
    <el-carousel :interval="4000" type="card" height="600px">
      <el-carousel-item v-for="item in 3" :key="item">
        <h3 class="medium"> <a href="https://sm.ms/image/TIGRwKFNqbMn5QX" target="_blank"><img src="https://i.loli.net/2021/04/12/TIGRwKFNqbMn5QX.png" ></a></h3>
      </el-carousel-item>
    </el-carousel>
    <el-row type="flex" justify="end">
      <el-col ><el-button class = "big_button" type="primary" >3D医院导览</el-button></el-col>
      <el-col ><el-button class = "big_button" type="success" >病例学习</el-button></el-col>
      <el-col ><el-button class = "big_button" type="warning" >参加考试</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name'
      ])
  }
}

</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    font-family: "微软雅黑";
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .big_button{
    height: 300px;
    width:  400px;
    margin-left: 150px;
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
