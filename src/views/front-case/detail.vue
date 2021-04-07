<template>
  <div class="app-container">
    <span>{{ caseId }}</span>
    <span>hello world</span>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      caseId: -1
    }
  },
  created() {
    this.caseId = this.$route.params.caseId
    console.log(this.caseId)
  }
}
</script>

<style scoped>

</style>
