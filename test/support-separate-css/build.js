{
  appDir: ".",
  baseUrl: ".",
  mainConfigFile: "config.js",
  dir: "out",
  fileExclusionRegExp: /(?:^build\.js$)|(?:lessc\.js$)|(?:\.less$)|(?:\.html$)|(?:vendor)/,

  siteRoot: ".",
  separateCSS: true,
  less: {
    compress: true
  },

  modules: [
    {name: "test"}
  ]
}
