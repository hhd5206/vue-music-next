import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'

export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          if (
            cached &&
            (cached.mid || cached.id + '') === this.$route.params.id
          ) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      if (!this.computedData) {
        const path = this.$route.matched[0].path
        this.$router.push({ path })
        return
      }
      const result = await fetch(this.computedData)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
