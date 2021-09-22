import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  const cdWrapperRef = ref(null)
  let entering = false
  let leaveing = false
  function enter({ done }) {
    if (leaveing) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    const animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0,0,0) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }
  function afterEnter() {
    entering = false
    animations.unregisterAnimation('move')
    cdWrapperRef.value.animation = ''
  }
  function leave({ done }) {
    if (entering) {
      afterEnter()
    }
    leaveing = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
    cdWrapperEl.addEventListener('animationend', next)
    function next() {
      cdWrapperEl.removeEventListener('animationend', next)
      done()
    }
  }
  function afterLeave() {
    leaveing = false
    const cdWrapperEl = cdWrapperRef.value
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
  }
  function getPosAndScale() {
    const targetWidth = 40 // 小唱片半径
    const paddingTop = 80 // 大唱片距离顶部距离
    const paddingBottom = 30 // 小唱片距离底部距离
    const paddingLeft = 40 // 小唱片圆心距离左边距离
    const width = window.innerWidth * 0.8 // 大唱片的宽度
    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - width / 2 - paddingTop - paddingBottom
    const scale = targetWidth / width
    return {
      x,
      y,
      scale
    }
  }
  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
