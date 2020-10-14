<template>
  <div>
    <header>
      <nav style="background-color:#383e56!important;" class="navbar-dark  navbar shadow navbar-expand-lg navbar-light bg-light">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div v-show="auth" >
      <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0 ">
      <li class="nav-item active">
        <a class="nav-link"  href="#">Wellcome</a>
      </li>
    </ul>
  </div>
  </div>
 <div v-show="!auth" >
    <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav mr-auto mt-2 mt-lg-0 ">
      <li class="nav-item active">
        <a class="nav-link"  href="#">Wellcome, {{Username}}</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click.prevent="goCode()" href="#">Code</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" @click.prevent="goSavedCode()" href="#">Saved Code</a>
      </li>
     
    </ul>
    <a class="nav-link btn btn-primary" @click.prevent="ketikaTombolKeluarDiKlik(),logedck()" href="#">Logout <span class="sr-only">(current)</span></a>
  </div>
 </div>
 
</nav>
    </header>
    <main role="main">
      <div style="margin:10px" class="container-fluid">
        
  
    <div  v-show="auth">  
      <app-bagian-pengguna
      @keluar="ketikaTombolResetDiKlik"
    />
    </div>
    <div v-if="code" class="card border-0 shadow">
      <div class="card-body ">
         <h3 class="card-title">Highlight Code</h3>
         <app-bagian-editor-opsi
      :input-kode="dataKode.inputKode"
      :bahasa-pemrograman-terpilih.sync="dataKode.bahasaPemrogramanTerpilih"
      :twoslash-terpilih.sync="dataKode.twoslashTerpilih"
      :nama-berkas.sync="dataKode.namaBerkas"
      :highlight.sync="dataKode.highlight"
      :hasil-highlight="hasilHighlight"
      @tersimpan="dapatkanDaftarKode"
      @reset="ketikaTombolResetDiKlik"
    />
    <hr>
    <app-bagian-editor-kode
      :input-kode.sync="dataKode.inputKode"
      :hasil-highlight="hasilHighlight"
      :bahasa-pemrograman-terpilih="dataKode.bahasaPemrogramanTerpilih"
    />
    <hr>
         </div>
         </div>
    
    <div v-if="listcode" style="" class="card border-0 shadow">
      <div class="card-body ">
         <h3 class="card-title">Saved Code</h3>
          <div v-if="$store.state.pengguna.idPengguna">
      <app-bagian-opsi-daftar-kode
        :halaman.sync="filter.halaman"
        :banyak-data.sync="filter.banyakData"
        :urutkan-berdasarkan.sync="filter.urutkanBerdasarkan"
        :urutkan.sync="filter.urutkan"
        :apakah-highlight-menyala.sync="filter.apakahHighlightMenyala"
      />
      <hr>
      <app-bagian-daftar-kode
        :apakah-highlight-menyala="filter.apakahHighlightMenyala"
        :dapatkan-daftar-kode="dapatkanDaftarKode"
      />
    </div>
         </div>
         </div>
   
    <app-notifikasi />
    <app-proses />
   
      </div>
    
  </main>
   <footer  style="bottom:0;left: 0;bottom: 0;width: 100%;text-align: center;" class="footer">
     <div class="container" >
       <p>By Rakhmadi</p>
     </div>
    </footer>
  </div>
</template>

<script>
import { stringifyUrl } from 'query-string'
import debounce from 'debounce-fn'
import cleanDeep from 'clean-deep'

import AppBagianPengguna from './components/bagian/AppBagianPengguna'
import AppBagianEditorOpsi from './components/bagian/AppBagianEditorOpsi'
import AppBagianEditorKode from './components/bagian/AppBagianEditorKode'
import AppBagianOpsiDaftarKode from './components/bagian/AppBagianOpsiDaftarKode'
import AppBagianDaftarKode from './components/bagian/AppBagianDaftarKode'

import AppNotifikasi from './components/AppNotifikasi'
import AppProses from './components/AppProses'

import { dapatkanOpsi, kirimData, unduhKode } from './utils'
import { URL_API, OPSI_STRINGIFY } from './constants'

export default {
  name: 'App',
  components: {
    AppBagianPengguna,
    AppBagianEditorOpsi,
    AppBagianEditorKode,
    AppBagianOpsiDaftarKode,
    AppBagianDaftarKode,

    AppNotifikasi,
    AppProses
  },
  data() {
    return {
      dataKode: {
        inputKode: null,
        bahasaPemrogramanTerpilih: null,
        namaBerkas: null,
        highlight: null,
        twoslashTerpilih: null,
      },
      filter: {
        halaman: 1,
        banyakData: 6,
        urutkanBerdasarkan: 'createdAt',
        urutkan: 'DESC',
        apakahHighlightMenyala: 1
      },
      hasilHighlight: '',
      daftarBahasaPemrograman: [],
      auth:true,
      Username:"",
      code:false,
      listcode:false

    }
  },
  watch: {
    '$store.state.pengguna.idPengguna'(idPengguna) {
      if (idPengguna) {
        this.dapatkanDaftarKode()
      }
    },
    dataKode: {
      handler: debounce(function(dataKode) {
        this.hasilHighlight = ''
        this.highlighter(dataKode.inputKode)
      }, { wait: 500 }),
      deep: true
    },
    filter: {
      handler: debounce(function() {
        this.dapatkanDaftarKode()
      }, { wait: 500 }),
      deep: true
    }
  },
  async created() {
    await this.dapatkanDaftarBahasaPemrograman()
    await this.dapatkanDaftarKode()
     this.$root.$on('logedck', this.logedck)
   
    
  },
  mounted() {
    
  },
  
  methods: {
    LogOutsClear(){
        this.code = false
        this.listcode = false
        this.auth = true      
    },
    logedck(){
      if (localStorage.getItem("isloged") == "true") {
         this.code = true
            this.auth = false,
            this.listcode = false,
           
            this.Username = localStorage.getItem("name")
      } else {
            this.auth = true      
      }
    },
    goCode(){
       this.listcode = false
         this.code = true
      
    },
    goSavedCode(){
      this.code = false
      this.listcode = true
       
    }, 
    ketikaTombolKeluarDiKlik() {
          this.$store.dispatch('pengguna/keluar').then(()=> this.LogOutsClear())
    },

    
    ketikaTombolResetDiKlik() {
      this.dataKode = {
        inputKode: null,
        bahasaPemrogramanTerpilih: 'typescript',
        namaBerkas: null,
        highlight: null,
        twoslashTerpilih: null,
      }
    },
    async dapatkanDaftarKode() {
      await this.$store.dispatch('kode/dapatkanSemuaKode', {
        idPengguna: this.$store.state.pengguna.idPengguna,
        filter: {
          halaman: this.filter.halaman,
          banyakData: this.filter.banyakData,
          urutkanBerdasarkan: this.filter.urutkanBerdasarkan,
          urutkan: this.filter.urutkan,
          apakahHighlightMenyala: this.filter.apakahHighlightMenyala
        }
      })
    },
    async ketikaTombolUnduhDiKlik() {
      try {
        this.$store.dispatch('proses/tampilkanProses', null)
        const objekUrl = {
          url: URL_API,
          query: {
            lang: this.dataKode.bahasaPemrogramanTerpilih,
            fileName: this.dataKode.namaBerkas,
            highlight: this.dataKode.highlight,
            twoslash: this.dataKode.twoslashTerpilih,
            download: 1
          }
        }
        const url = stringifyUrl(objekUrl, OPSI_STRINGIFY)
        await unduhKode(url, {
          code: this.dataKode.inputKode
        })
      } catch (error) {
        const dataNotifikasiGalat = {
          apakahTampil: true,
          pesan: error.message || 'Gagal mengunduh'
        }
        this.$store.dispatch('notifikasi/tampilkanNotifikasi', dataNotifikasiGalat)
        console.log(error)
      } finally {
        this.$store.dispatch('proses/hilangkanProses', null)
      }
    },
    async ketikaTombolSimpanDiKlik() {
      try {
        const konten = cleanDeep({
          kode: this.dataKode.inputKode,
          bahasaPemrograman: this.dataKode.bahasaPemrogramanTerpilih,
          highlight: this.dataKode.highlight,
          namaBerkas: this.dataKode.namaBerkas,
          twoslash: this.dataKode.twoslashTerpilih
        })
        await this.$store.dispatch('kode/simpanKode', {
          idPengguna: this.$store.state.pengguna.idPengguna,
          konten: konten
        })
        await this.dapatkanDaftarKode()
      } catch (error) {
        const dataNotifikasiGalat = {
          apakahTampil: true,
          pesan: error.message || 'Gagal menyimpan'
        }
        this.$store.dispatch('notifikasi/tampilkanNotifikasi', dataNotifikasiGalat)
        console.log(error)
      }
    },
    async dapatkanDaftarBahasaPemrograman() {
      try {
        const respon = await dapatkanOpsi()
        if (respon.success && !respon.error) {
          this.daftarBahasaPemrograman = respon.data.languages
        }
      } catch (error) {
        const dataNotifikasiGalat = {
          apakahTampil: true,
          pesan: error.message
        }
        this.$store.dispatch('notifikasi/tampilkanNotifikasi', dataNotifikasiGalat)
        console.log(error)
      }
    },
    async highlighter(inputKode, download) {
      try {
        this.$store.dispatch('proses/tampilkanProses', null)
        const objekUrl = {
          url: URL_API,
          query: {
            lang: this.dataKode.bahasaPemrogramanTerpilih,
            fileName: this.dataKode.namaBerkas,
            highlight: this.dataKode.highlight,
            twoslash: this.dataKode.twoslashTerpilih,
            download
          }
        }
        const url = stringifyUrl(objekUrl, OPSI_STRINGIFY)

        const respon = await kirimData(url, {
          code: inputKode
        })

        if (respon.success && !respon.error) {
          this.hasilHighlight = respon.data
        } else {
          throw new Error(respon.message)
        }
      } catch (error) {
        const dataNotifikasiGalat = {
          apakahTampil: true,
          pesan: error.message || 'Bahasa Pemrograman dan Kode wajib diisi'
        }
        this.$store.dispatch('notifikasi/tampilkanNotifikasi', dataNotifikasiGalat)
        console.log(error)
      } finally {
        this.$store.dispatch('proses/hilangkanProses', null)
      }
    }
  }
}
</script>
