<template>

<el-dropdown @command="change">

<el-button>

🎨 主题

</el-button>

<template #dropdown>

<el-dropdown-menu>

<el-dropdown-item

v-for="(name,key) in themes"

:key="key"

:command="key"

>

{{ name }}

</el-dropdown-item>

</el-dropdown-menu>

</template>

</el-dropdown>

</template>

<script setup>

import {

themes,

setTheme

}

from "../theme/theme"

function change(theme){
    setTheme(theme)
}

</script>
