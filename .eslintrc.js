module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        "plugin:vue/essential"
    ],
    rules: {
        // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
        'no-console':  'off',//在webpack已经去掉，无需再次提示
        'no-debugger': 'off'//在webpack已经去掉，无需再次提示
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}