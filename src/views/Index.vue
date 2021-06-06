<template>
  <div class="add">
    <ClHeader class="tops"></ClHeader>
    <div class="mains">
      <el-scrollbar style="height:100%;width: 100%">
        <router-view></router-view>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import ClHeader from "@/components/ClHeader";
export default {
  components: {
    ClHeader,
  },
};
</script>

<style scoped>
.add {
  width: 100%;
  height: 100%;
}
.tops {
  width: 100%;
  height: 14%;
  /* background-color: red; */
}
.mains {
  width: 100%;
  height: 86%;
  /* margin-top: %; */
  /* background-color: red; */
}
</style>

