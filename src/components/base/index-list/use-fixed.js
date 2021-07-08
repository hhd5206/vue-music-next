import { nextTick, ref, watch } from 'vue'

export default function useFixed(props) {
  const groupRef = ref(null)
  const listHeight = ref([])
  watch(
    () => props.data,
    async () => {
      await nextTick()
      calculate()
    }
  )
  function calculate() {
    const list = groupRef.value.children
    const listHeightVal = listHeight.value
    let height = 0
    listHeightVal.length = 0
    listHeightVal.push(height)
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightVal.push(height)
    }
  }
  return {
    groupRef
  }
}
