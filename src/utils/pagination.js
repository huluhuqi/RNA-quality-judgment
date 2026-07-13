/**
 * 分页工具
 *
 * 用于大数据量的分页显示和虚拟滚动支持
 */

/**
 * 计算分页数据
 * 
 * @param {Array} data 完整数据数组
 * @param {number} page 当前页码（从1开始）
 * @param {number} size 每页大小
 * @returns {Object} { list, total, page, size, totalPages, hasNext, hasPrev }
 */
export function paginate(data, page = 1, size = 200) {
    const total = data.length;
    const totalPages = Math.ceil(total / size);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const start = (currentPage - 1) * size;
    const end = start + size;
    
    return {
        list: data.slice(start, end),
        total,
        page: currentPage,
        size,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        start: start + 1,
        end: Math.min(end, total)
    };
}

/**
 * 分页状态管理类
 */
export class PaginationState {
    constructor(data = [], size = 200) {
        this.data = data;
        this.size = size;
        this.page = 1;
    }
    
    /**
     * 获取当前页数据
     */
    getCurrentPage() {
        return paginate(this.data, this.page, this.size);
    }
    
    /**
     * 设置数据
     */
    setData(data) {
        this.data = data;
        this.page = 1;
    }
    
    /**
     * 设置每页大小
     */
    setSize(size) {
        this.size = size;
        this.page = 1;
    }
    
    /**
     * 下一页
     */
    nextPage() {
        const totalPages = Math.ceil(this.data.length / this.size);
        if (this.page < totalPages) {
            this.page++;
            return true;
        }
        return false;
    }
    
    /**
     * 上一页
     */
    prevPage() {
        if (this.page > 1) {
            this.page--;
            return true;
        }
        return false;
    }
    
    /**
     * 跳转到指定页
     */
    goTo(page) {
        const totalPages = Math.ceil(this.data.length / this.size);
        this.page = Math.max(1, Math.min(page, totalPages || 1));
    }
    
    /**
     * 获取总页数
     */
    getTotalPages() {
        return Math.ceil(this.data.length / this.size);
    }
}

/**
 * 虚拟滚动辅助函数
 * 
 * @param {Object} options 配置项
 * @param {number} options.itemHeight 单项高度
 * @param {number} options.containerHeight 容器高度
 * @param {number} options.scrollTop 滚动位置
 * @param {number} options.total 总数据量
 * @param {number} options.buffer 缓冲数量（默认5）
 * @returns {Object} { startIndex, endIndex, visibleCount, offsetY }
 */
export function calculateVirtualScroll(options) {
    const {
        itemHeight,
        containerHeight,
        scrollTop,
        total,
        buffer = 5
    } = options;
    
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + visibleCount;
    
    const startIndex = Math.max(0, start - buffer);
    const endIndex = Math.min(total, end + buffer);
    const offsetY = startIndex * itemHeight;
    
    return {
        startIndex,
        endIndex,
        visibleCount,
        offsetY,
        totalHeight: total * itemHeight
    };
}