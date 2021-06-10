import { createLocalVue, mount } from '@vue/test-utils'

import { Account } from '@/util/constants'
import AccountBusinessType from '@/components/auth/common/AccountBusinessType.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import can from '@/directives/can'

Vue.use(Vuetify)
Vue.use(VueRouter)

document.body.setAttribute('data-app', 'true')

describe('AccountBusinessType.vue', () => {
  let orgModule: any
  let wrapper: any
  let store: any
  const localVue = createLocalVue()
  localVue.directive('can', can)
  localVue.use(Vuex)
  const vuetify = new Vuetify({})

  beforeEach(() => {
    orgModule = {
      namespaced: true,
      state: {
        currentOrganization: {
          name: '',
          orgType: Account.BASIC
        }
      }
    }
    store = new Vuex.Store({
      state: {},
      strict: false,
      modules: {
        org: orgModule
      }
    })
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('is a Vue instance', () => {
    const $t = () => ''
    wrapper = mount(AccountBusinessType, {
      store,
      localVue,
      vuetify,
      propsData: {
        govmAccount: false
      },
      mocks: { $t
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('individual account type rendering', () => {
    const $t = () => ''
    wrapper = mount(AccountBusinessType, {
      store,
      localVue,
      vuetify,
      propsData: {
        govmAccount: false
      },
      mocks: { $t
      }
    })

    expect(wrapper.find("[data-test='account-name']").exists()).toBeTruthy()
    expect(wrapper.find("[data-test='branch-detail']").exists()).toBeFalsy()
    expect(wrapper.find("[data-test='business-account-type-details']").exists()).toBeFalsy()
  })

  it('business account type rendering', () => {
    const $t = () => ''
    wrapper = mount(AccountBusinessType, {
      store,
      localVue,
      vuetify,
      propsData: {
        govmAccount: false
      },
      mocks: { $t
      }
    })

    wrapper.find("[data-test='radio-business-account-type']").trigger('click')
    expect(wrapper.find("[data-test='branch-detail']").exists()).toBeTruthy()
    expect(wrapper.find("[data-test='business-account-type-details']").exists()).toBeTruthy()
  })
})