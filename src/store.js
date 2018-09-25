import Vue from 'vue';
import Vuex from 'vuex';
import Eos from 'eosjs';
import { getTokenPrice, getMyBalancesByContract } from './blockchain';
import { network } from './config';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    scatter: null,
    identity: null,
    eos: null,
    balance: {
      eos: '0.0000 EOS',
      kbyy: '0.0000 KBYY',
    },
    tokenPrice: '0.0000 EOS',
  },
  getters: {
    account: ({ scatter }) => {
      if (!scatter) { return null; }
      const { identity } = scatter;
      return identity ? identity.accounts.find(({ blockchain }) => blockchain === 'eos') : null;
    },
  },
  mutations: {
    setScatter(state, scatter) {
      state.scatter = scatter;
      state.eos = scatter.eos(network, Eos, {});
      state.identity = scatter.identity;
    },
    setIdentity(state, identity) {
      state.identity = identity;
    },
    setTokenPrice(state, price) {
      state.tokenPrice = `${price} EOS`;
    },
    setBalance(state, { symbol, balance }) {
      state.balance[symbol] = balance || `0.0000 ${symbol.toUpperCase()}`;
    },
  },
  actions: {
    initScatter({ commit, dispatch }, scatter) {
      commit('setScatter', scatter);
      dispatch('updatePrice')
      dispatch('updateBalance')
    },
    async updatePrice({ commit }) {
      const price = await getTokenPrice()
      commit('setTokenPrice', price);
    },
    updateBalance({ commit }) {
      getMyBalancesByContract({ symbol: 'eos' })
        .then(price => { 
          commit('setBalance', { symbol: 'eos', balance: price[0] }); 
        });
      getMyBalancesByContract({ symbol: 'kbyy', tokenContract: 'dacincubator' })
        .then(price => { 
          commit('setBalance', { symbol: 'kbyy', balance: price[0] }); 
        });
    },
    setIdentity({ commit }, identity) {
      commit('setIdentity', identity);
      dispatch('updateBalance');
    },
  },
});
