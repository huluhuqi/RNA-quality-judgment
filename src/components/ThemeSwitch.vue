<template>

<el-button

circle

@click="change"

>

{{theme==='light'?'🌙':'☀️'}}

</el-button>

</template>

<script setup>

import {

ref

}

from 'vue'

import {

getTheme,

setTheme

}

from '../theme/theme'

const theme=

ref(
getTheme()
)

function change(){

theme.value=

theme.value==='light'

?

'dark'

:

'light'

setTheme(

theme.value

)

}

</script>