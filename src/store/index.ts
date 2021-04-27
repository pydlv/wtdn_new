import Vue from 'vue'
import Vuex from 'vuex'
import AuthModule from "@/store/auth";

Vue.use(Vuex)

export const store = new Vuex.Store({});

export const authModule = new AuthModule({store, name: "authModule"});
