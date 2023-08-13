import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
  faList,
  faXmark,
  faArrowsLeftRightToLine,
} from '@fortawesome/free-solid-svg-icons'
import { faComment, faFileLines } from '@fortawesome/free-regular-svg-icons'

import App from './App.vue'
import router from './router'

/* add icons to the library */
library.add(faList, faXmark, faComment, faArrowsLeftRightToLine, faFileLines)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
