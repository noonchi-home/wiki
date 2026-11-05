<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ file: string; title: string; pageCount: number }>()
</script>

<template>
  <p>
    <a :href="withBase(file)" download>Download PDF</a>
  </p>
  <div class="pdf-reader" role="group" :aria-label="title + ' PDF preview'">
    <img
      v-for="page in pageCount"
      :key="page"
      :src="withBase(file.replace(/\.pdf$/, '') + '/page-' + page + '.webp')"
      :alt="title + ', page ' + page + ' of ' + pageCount"
      :loading="page === 1 ? 'eager' : 'lazy'"
      decoding="async"
      width="1191"
      height="1684"
    >
  </div>
</template>

<style scoped>
.pdf-reader {
  display: grid;
  gap: 12px;
  margin-block: 20px;
}

.pdf-reader img {
  width: 100%;
  height: auto;
  background: white;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}
</style>
