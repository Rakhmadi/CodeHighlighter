<template>
  <section class="">
    <div class="card border-0 shadow">
     
      <div class="card-body ">
         <h3 class="card-title">Editor</h3>
         <div class="row">
      <div class="col-md">
         <app-formulir-area-teks
      :value="inputKode"
      nama="input-kode"
      label="Input Kode"
      @input="$emit('update:inputKode', $event)"
    />
      </div>
       <div class="col-md">
    <app-kode
      :kode="hasilHighlight"
      :bahasa-pemrograman="bahasaPemrogramanTerpilih"
      class="tampilan-kode--kustom"
    />
    </div>
    </div>
        </div>
      </div>
    
  </section>
</template>

<script>
import AppKode from '../AppKode'

import { validator } from '../../utils'

export default {
  components: {
    AppKode
  },
  props: {
    inputKode: {
      default: '',
      required: true,
      validator
    },
    hasilHighlight: {
      type: String,
      default: '',
      required: true
    },
    bahasaPemrogramanTerpilih: {
      default: '',
      required: true,
      validator
    }
  }
}
</script>