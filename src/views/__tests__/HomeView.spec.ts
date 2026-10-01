import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import App from '../../App.vue'
import HomeView from '../HomeView.vue'

describe('home route', () => {
  it('renders the chart inside a single main landmark', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: HomeView }],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router] } })

    expect(wrapper.findAll('main')).toHaveLength(1)
    expect(wrapper.text()).toContain('출생 정보 입력')
    expect(wrapper.text()).toContain('나의 만세력')
  })
})
