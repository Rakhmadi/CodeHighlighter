<template>
  <div style=" border-left:2px !important;" class="border-left card border-0 shadow notifikasi"
    v-if="$store.state.notifikasi.apakahTampil"
  >
    {{ $store.state.notifikasi.pesan }}
  </div>
</template>

<script>
export default {
  name: 'AppNotifikasi',
}
</script>

<style>
.notifikasi {
  position: fixed;
  right: 50px;
  top: 50px;
  width: 300px;
  height: auto;
  padding: 10px;
}
</style>
