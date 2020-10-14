<template>
  <div>
    <label :for="nama">
      {{ label }}
    </label>
    <br/>
    <textarea 
      rows="9"
      :value="value"
      :id="nama"
      class="form-control"
      @input="ketikaNilaiBerubah"
    ></textarea>
  </div>
</template>

<script>
import { formulir } from '../mixins'

export default {
  name: 'AppFormulirAreaTeks',
  mixins: [formulir],
  methods: {
    ketikaNilaiBerubah(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
