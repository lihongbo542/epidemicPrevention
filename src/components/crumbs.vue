<!--  -->
<template>
  <div class="crumbs">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="asdq"
        v-for="(item, index) in datasa"
        :key="index"
        @click.native="shanhcs(item, index)"
        >{{ item.names }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    shanhcs(value, index) {
      var dat = [];
      let pathaaa = this.$route.path;
      if (pathaaa != value.paths) {
        let datasaa = sessionStorage.getItem("arrs");
        let datass = JSON.parse(datasaa);
        for (let i = 0; i <= index; i++) {
          dat.push(datass[i]);
        }
        // console.log(dat,'22222');
        this.$router.push(value.paths);
        sessionStorage.setItem("arrs", JSON.stringify(dat));
      } else {
      }
    },
  },
  computed: {
    datasa() {
      let datasaa = sessionStorage.getItem("arrs");
      let datass = JSON.parse(datasaa);
      return datass;
    },
  },
  mounted() {},
  created() {},
};
</script>
<style scoped>
.asdq{
  cursor:pointer;
}
.crumbs {
  width: 100%;
}
</style>
