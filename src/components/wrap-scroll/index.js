import { h, mergeProps, withCtx, renderSlot, ref, computed, watch, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(Scroll,
      mergeProps(ctx.$props, {
        ref: 'scrollRef',
        onScroll: (e) => {
          ctx.$emit('scroll', e)
        }
      }),
      {
        default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const store = useStore()
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)
    const playlist = computed(() => store.state.playlist)
    watch(playlist, async() => {
      await nextTick()
      scroll.value.refresh()
    })
    return {
      scrollRef,
      scroll
    }
  }
}
