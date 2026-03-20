import { reactive } from 'vue'

interface UserCenterState {
  title: string
  subtitle: string
}

const state = reactive<UserCenterState>({
  title: '',
  subtitle: '',
})

export const userCenterStore = {
  state,
  setHeader(title: string, subtitle: string) {
    state.title = title
    state.subtitle = subtitle
  },
}

