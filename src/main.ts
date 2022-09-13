import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { apolloDefaultClient } from '@/plugins/apollo/vue-apollo'
import { ApolloClients } from '@vue/apollo-composable'
import '@/styles/styles.scss'

// load modules
createApp(App)
  .provide(ApolloClients, {
    default: apolloDefaultClient,
  })
  .use(vuetify)
  .mount('#app')
