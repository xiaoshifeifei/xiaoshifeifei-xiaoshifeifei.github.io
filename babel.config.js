module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: process.env.NODE_ENV === 'development' ? ['dynamic-import-node'] : [], // 新增配置
}
