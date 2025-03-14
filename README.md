## trobs 2.0

`-----------------------PC端----------------------------- `

1，需要移动 el-dialog，使用 v-resize-dialog 指令

2,使用 el-input 框文本处理指令：;
(a) 去掉前后空格 v-search-input-trim
(b) 去掉前后空格、中间空格替换成逗号 v-search-input

使用 avue-crud 表格中自带 input，可在表头配置文件中配置：
(a)默认为去掉前后控制，中间空格替换为逗号
(b)若表头文件中配置：onlyTrim:true，则只去掉前后空格,如：src\const\crud\product\prdarchives.js

使用 avue-crud-input：
(a)默认为去掉前后控制，中间空格替换为逗号
(b)直接在元素中添加属性，如:<avue-crud-input :onlyTrim="true" ...></avue-crud-input>

3,table 的 header 去掉头部悬浮：`默认悬浮`
(a) avue-crud 中 table 配置不悬浮，在配置文件中设置，cancelFixedTop:true;
(b) 非 avue-crud，即直接使用 el-table，须设置 class="cancelFixedTop";

    `注`：dialog中的任何table都不能悬浮头部




`-----------------------移动端-----------------------------  `

1,因在使用 vant 的组件时，采用按需加载，而新版 babel-plugin-import 往后不再支持 `::v-deep` 的写法，若是需要修改组件 css，可以采用后代选择器进行修改

2，新建移动端页面动态路由时，文件的目录 `必须` 严格参考 PC 端 `路由`
--例如--：请购单 页面 ，url 为：http://trobs.aukeyit.com/#/purchase/porequisiton，则以 /purchase/porequisiton 为准，
目录为:src/views/mobile/views/`${purchase/porequisiton}`/index.vue

    *** 新建静态路由，可在 \src\views\mobile\router\index.js下配置即可



