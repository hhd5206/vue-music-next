import { useStore } from 'vuex'
import { watch, computed, ref } from 'vue'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)

  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async newSong => {
    if (!newSong.id || !newSong.url) return
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 防止连续切换 请求未完成  只走最后一次逻辑
    if (currentSong.value.lyric !== lyric) return
    currentLyric.value = new Lyric(lyric, handleLyric)
    // 保证异步顺序下歌词能同步
    if (songReady.value) {
      playLyric()
    }
  })

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({ lineNum }) {
    currentLineNum.value = lineNum
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) return false
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    playLyric,
    stopLyric,
    lyricScrollRef,
    lyricListRef
  }
}
