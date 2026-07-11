// 历史管理 - 支持Ctrl+Z撤销
// 保存新增、删除、修改、忽略操作的快照

const stack = []
const MAX = 50

export function saveHistory(data){

    stack.push(
        JSON.parse(
            JSON.stringify(data)
        )
    )

    if(stack.length > MAX){
        stack.shift()
    }

}

export function undo(){

    return stack.pop()

}

export function canUndo(){

    return stack.length > 0

}

export function clearHistory(){

    stack.length = 0

}
