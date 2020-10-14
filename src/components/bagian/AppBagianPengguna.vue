<template>
  <section class="pengguna">
    <div style="margin: 0 auto;float: none;margin-bottom: 10px; width:400px" class="card border-0 shadow">
      <div class="card-body">
         <a href="#" @click.prevent="Masuk()" class="card-link">Masuk</a>
         <a href="#" @click.prevent="Daftar()" class="card-link">Daftar</a>
         <br>
         <br>
         <div v-show="a">
            <span class="display-4">Masuk</span>
           <br>
            <br>
            <app-formulir-input
                  v-model="namaPenggunaMasuk"
                  nama="masuk"
                  label="Nama"
                  class="margin-bottom"
                >
                  <template #aksi="">
                    <app-tombol
                     style="margin-top:10px"
                      nama="masuk"
                      label="Masuk"
                      class="margin-left"
                      @klik="ketikaTombolMasukDiKlik"
                    />
                  </template>
                </app-formulir-input>
         </div>
         <div v-show="b">
           <span class="display-4">Daftar</span>
           <br>
            <br>
           <app-formulir-input
      v-model="namaPenggunaDaftar"
      nama="daftar"
      label="Nama"
      class="margin-bottom"
    >
    
      <template #aksi="">
        
        <app-tombol style="margin-top:10px"
          nama="daftar"
          label="Daftar"
          class="margin-left"
          @klik="ketikaTombolDaftarDiKlik"
        />
      </template>
    </app-formulir-input>   
         </div>
        
         
      </div>
    </div>
   
  </section>
</template>

<script>
export default {
  name:"app-bagian-pengguna",
  data() {
    return {
      namaPenggunaMasuk: 'jhonyjoestar',
      namaPenggunaDaftar: null,
      a:true,
      b:false,
    }
  },
  methods: {
    Masuk(){
      this.a = true
      this.b = false
    },
    Daftar(){
      this.a = false
      this.b = true
    },
    ketikaTombolMasukDiKlik() {
      this.$store.dispatch('pengguna/masuk', {
        namaPengguna: this.namaPenggunaMasuk
      }).then(() =>  this.$root.$emit('logedck'))
     
      
    },
    ketikaTombolDaftarDiKlik() {
      this.$store.dispatch('pengguna/daftar', {
        namaPengguna: this.namaPenggunaDaftar
      })
    },
    ketikaTombolKeluarDiKlik() {
      this.$store.dispatch('pengguna/keluar')
      this.$emit('keluar')
    }
  }
}
</script>