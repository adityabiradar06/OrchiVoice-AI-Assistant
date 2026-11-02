export default {
  server: {
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${process.env.ORCHID_API_PORT || 8789}`,
        changeOrigin: true,
      },
    },
  },
};
