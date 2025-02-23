module.exports = {
  webpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser"),
        "path": require.resolve("path-browserify")
      }
    }
  }
};
