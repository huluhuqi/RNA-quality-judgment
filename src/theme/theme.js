import { saveTheme, loadTheme } from '../storage/settingStorage'

export const themes = {
    blue: "科研蓝",
    green: "生命绿",
    orange: "活力橙",
    purple: "实验紫",
    dark: "暗夜黑"
}

export function getTheme(){
    return loadTheme()
}

export function setTheme(theme){
    saveTheme(theme)

    document.documentElement
    .setAttribute(
        "data-theme",
        theme
    )

    // 添加切换动画
    document.documentElement
    .classList.add(
        "theme-transition"
    )

    setTimeout(()=>{
        document.documentElement
        .classList.remove(
            "theme-transition"
        )
    }, 500)

    // 页面轻微淡化动画
    document.body.animate(
        [
            { opacity: 0.7 },
            { opacity: 1 }
        ],
        {
            duration: 400
        }
    )

    // 通知图表组件刷新
    window.dispatchEvent(
        new Event('theme-change')
    )
}

export function initTheme(){
    const theme = getTheme()
    document.documentElement
    .setAttribute(
        "data-theme",
        theme
    )
}
