<template>
<div style=" border-left:2px !important;" class="border-left card border-0 shadow proses"
    v-if="$store.state.proses.apakahProsesTampil"
    
  >
    Sedang berkomunikasi dengan server...
  </div>
</template>

<script>
export default {
  name: 'AppProses',
}
</script>

<style>
.proses {

  position: fixed;
  right: 50px;
  bottom: 50px;
  width: 300px;
  height: auto;
  padding: 10px;
}
</style>
