---
aside: false
---

# A. Proposal and Requirements

<script setup>
import { withBase } from 'vitepress'
import DocumentReader from '../.vitepress/theme/DocumentReader.vue'
</script>

<details class="source-reader">
<summary>View LaTeX source</summary>

<a :href="withBase('/submission-a/main.tex')" download>Download main.tex</a>

<<< @/public/submission-a/main.tex{latex}

<<< @/public/submission-a/paper.tex{latex}

</details>

<DocumentReader file="/submission-a/proposal.pdf" title="Proposal and Requirements" :page-count="3" />

