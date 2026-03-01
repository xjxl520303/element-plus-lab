import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import PortalVue from 'portal-vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(PortalVue)
app.mount('#app')
