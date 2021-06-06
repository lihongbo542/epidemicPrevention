<template>
  <div>
    <domestic v-if="show" changeMap="changeMap" />
    <overseas v-else />
  </div>

</template>

<script>
  import overseas from "./overseas";
  import domestic from "./domestic";
export default {
  data() {
   return {
     show:true,
   }
  },
  methods:{
    changeMap(){
      this.show=!this.show
    }
  },
  components:{
    overseas,
    domestic
  }
};
</script>

<style scoped>





</style>
