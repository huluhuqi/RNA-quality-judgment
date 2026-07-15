import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'


import { cloudflare } from "@cloudflare/vite-plugin";


export default defineConfig({

  // 使用相对路径，同时兼容 GitHub Pages（/RNA-quality-judgment/）和 EdgeOne Pages（/）
  base: './',

  plugins: [vue(), AutoImport({
    resolvers: [ElementPlusResolver()]
  }), Components({
    resolvers: [ElementPlusResolver()]
  }), cloudflare()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    target: 'es2018',
    chunkSizeWarningLimit: 1500,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id){
          if(id.includes('node_modules')){
            if(id.includes('element-plus')) return 'element'
            if(id.includes('echarts')) return 'echarts'
            if(id.includes('exceljs') || id.includes('xlsx')) return 'excel'
            if(id.includes('vue') || id.includes('vue-router')) return 'vue'
            if(id.includes('jspdf') || id.includes('html2canvas')) return 'pdf'
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },

  optimizeDeps: {
    include: ['vue', 'element-plus', 'echarts'],
    exclude: []
  }

})