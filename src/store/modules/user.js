import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import da from "element-ui/src/locale/lang/da"

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: ''
  }
}
import Vue from 'vue'
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    // state.token = token
    Vue.set(state,"token",token)
  },
  SET_NAME: (state, name) => {
    // state.name = name
    Vue.set(state,"name",name)
  },
  SET_AVATAR: (state, avatar) => {
    // state.avatar = avatar
    Vue.set(state,"avatar",avatar)
  },
  SET_ROLE: (state, role) => {
    // state.roles = role
    Vue.set(state,"roles",role)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const {userName, password} = userInfo
    return new Promise((resolve, reject) => {
      login({userName : userName.trim() , password:password}).then(response => {
        const { data } = response
        if (data.status === 404) {
          reject('failed')
          console.log(data.status)
          return data.status
        } else {
          data.token = data.responseMap.result// 临时先设置token为id
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          console.log(data)
          resolve()
        }
      }).catch(error => {
        reject(error)
        return 404
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.token === null) {
        return reject('Verification failed, please Login again.')
      }
      getInfo({userId:state.token}).then(response => {
        const { data } = response
        if (!data || response.status === 400) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar , role } = data.responseMap.result
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        console.log("GetInfo:")
        console.log(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

