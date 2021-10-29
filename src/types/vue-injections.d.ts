// noinspection ES6UnusedImports

/**
 * Augment the typings of Vue.js
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
        readonly $successToast: (string) => void
        readonly $failToast: (string) => void
    }
}
