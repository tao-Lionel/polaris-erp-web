module.exports = {
  presets: [
    "@vue/app",
    [
      "@babel/preset-env",
      {
        useBuiltIns: "entry",
        corejs: 3
      }
    ]
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true
      },
      "vant"
    ]
  ]
}
