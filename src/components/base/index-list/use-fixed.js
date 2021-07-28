import { computed, nextTick, ref, watch } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeight = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })
  // 监听数据变化计算整个列表的区间高度
  watch(
    () => props.data,
    async () => {
      await nextTick() // 等dom渲染完成再计算
      calculate()
    }
  )
  // 监听scrollY的实时变化  判断在哪个当前区间
  watch(scrollY, newY => {
    const listHeightVal = listHeight.value
    for (let i = 0; i < listHeightVal.length - 1; i++) {
      const heightTop = listHeightVal[i]
      const heightBottom = listHeightVal[i + 1]
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })
  // 计算区间数组
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
  function onScroll(pos) {
    scrollY.value = -pos.y
  }
  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
