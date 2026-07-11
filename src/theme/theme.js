const KEY =
"RNA_QC_THEME"

export function getTheme(){
    return localStorage.getItem(KEY)
    ||
    "light"
}

export function setTheme(theme){
    localStorage.setItem(
        KEY,
        theme
    )
    document.documentElement
    .setAttribute(
        "data-theme",
        theme
    )
}

export function initTheme(){
    const theme =
    getTheme()
    document.documentElement
    .setAttribute(
        "data-theme",
        theme
    )
}