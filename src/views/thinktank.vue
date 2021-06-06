<!--  -->
<template>
  <div class="container">
   <div class="report">
     <EpidemicReport />
   </div>
  </div>
</template>

<script>
  import EpidemicReport from "./EpidemicReport";
export default {
  data() {
   return {

   }
  },
  methods:{

  },
  mounted() {

  },
  components:{
    EpidemicReport
  }
};
</script>
<style scoped>
  @import '../../public/css/thinktank.css';
.report{
  padding-top: 100px;
  width: 30%;
  margin: 0 auto;
}
</style>
