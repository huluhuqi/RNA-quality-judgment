import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'


export default defineConfig({

  base: '/RNA-quality-judgment/',

  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id){
          if(id.includes('node_modules')){
            if(id.includes('element-plus')) return 'element'
            if(id.includes('echarts')) return 'echarts'
            if(id.includes('exceljs')) return 'excel'
            if(id.includes('vue') || id.includes('vue-router')) return 'vue'
          }
        }
      }
    }
  }

})
