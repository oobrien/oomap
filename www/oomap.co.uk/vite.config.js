import inject from '@rollup/plugin-inject';



export default {
  plugins: [
    inject({

      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  server: {
    proxy: {
      "/php": "https://oomap.dna-software.co.uk",
      "/wmm": "https://oomap.dna-software.co.uk",
      "/tile": "https://oomap.dna-software.co.uk",
      "/render": "https://oomap.dna-software.co.uk"
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      //input: {
       // main: 'index.html',
      //  test: 'index2.html',
      //},
      output: {
           globals: {

           }
       },
      external: [
        "lib/ol.css",

      ]
    }
  }
}
