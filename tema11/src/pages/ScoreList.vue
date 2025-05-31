<template>
  <div>
    <q-btn
      label="+ NOVA PARTITURA"
      color="primary"
      class="q-mb-md q-mt-md q-mx-md"
      @click="navigateToScoreForm"
    />

    <q-list bordered class="q-mt-md q-mx-md">
      <q-item v-for="score in scores" :key="score.idpartitura" clickable @click="openDialog(score)">
        <q-item-section>{{ score.titol }}</q-item-section>
        <q-btn-group>
          <q-btn flat round icon="edit" @click="editScore(score)" />
          <q-btn flat round icon="delete" @click="deleteScore(score)" />
        </q-btn-group>
      </q-item>
    </q-list>

    <q-dialog v-model="dialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ selectedScore.titol }}</div>
          <div>{{ selectedScore.lletraoriginal }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" @click="dialogOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref , onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PartituraService } from "src/services/PartituraService.js";


export default {
  setup() {
    const scores = ref([])
    const dialogOpen = ref(false)
    const selectedScore = ref({})
    const router = useRouter()


    const editScore = (score) => {
      router.push(`/score-form?id=${score.idpartitura}`);
    };
    const openDialog = (score) => {
      selectedScore.value = score
      dialogOpen.value = true
    }

    const navigateToScoreForm = () => {
      router.push('/score-form')
    }


    const fetchScores = async () => {
      try {
        scores.value = await PartituraService.getPartitures();
        console.log(scores.value)
      } catch (error) {
        console.error('Error al obtener las partituras:', error)
      }
    }

    onMounted(() => {
      fetchScores()
    })


    return {
      scores,
      dialogOpen,
      selectedScore,
      openDialog,
      navigateToScoreForm,
      editScore
    }
  }
}
</script>
