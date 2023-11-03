module.exports={
    fallback:{stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    crypto: require.resolve("crypto-browserify"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http") ,
    
  }
}