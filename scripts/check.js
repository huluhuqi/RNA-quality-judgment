/**
 * 代码检查脚本
 * 
 * 功能：
 * 1. 检查未引用文件
 * 2. 检查 console.log
 * 3. 检查 TODO/FIXME 标记
 * 4. 检查大文件（>1000行）
 * 
 * 运行：node scripts/check.js
 */

import fs from 'fs';
import path from 'path';

const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname)).replace(/^\/([A-Za-z]):\//, '$1:/');
const srcDir = path.join(__dirname, '../src');

// 检查结果
const results = {
    consoleLogs: [],
    todos: [],
    largeFiles: [],
    unusedFiles: []
};

/**
 * 扫描目录
 */
function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            scanDirectory(filePath);
        } else if (file.endsWith('.js') || file.endsWith('.vue')) {
            checkFile(filePath);
        }
    });
}

/**
 * 检查单个文件
 */
function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(srcDir, filePath);
    
    // 检查 console.log
    if (content.includes('console.log')) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('console.log')) {
                results.consoleLogs.push({
                    file: relativePath,
                    line: index + 1,
                    content: line.trim().substring(0, 80)
                });
            }
        });
    }
    
    // 检查 TODO/FIXME
    if (content.includes('TODO') || content.includes('FIXME')) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('TODO') || line.includes('FIXME')) {
                results.todos.push({
                    file: relativePath,
                    line: index + 1,
                    content: line.trim().substring(0, 80)
                });
            }
        });
    }
    
    // 检查大文件（>1000行）
    const lines = content.split('\n').length;
    if (lines > 1000) {
        results.largeFiles.push({
            file: relativePath,
            lines: lines
        });
    }
}

/**
 * 检查未引用文件（简化版）
 */
function checkUnusedFiles() {
    // 获取所有源文件
    const allFiles = [];
    collectFiles(srcDir, allFiles);
    
    // 检查每个文件是否被其他文件引用
    allFiles.forEach(filePath => {
        const fileName = path.basename(filePath);
        const relativePath = path.relative(srcDir, filePath);
        
        // 跳过某些文件
        if (fileName === 'main.js' || fileName === 'App.vue') return;
        if (relativePath.startsWith('assets/')) return;
        
        let isReferenced = false;
        
        allFiles.forEach(otherFilePath => {
            if (filePath === otherFilePath) return;
            
            const content = fs.readFileSync(otherFilePath, 'utf8');
            if (content.includes(fileName) || content.includes(relativePath.replace(/\\/g, '/'))) {
                isReferenced = true;
            }
        });
        
        if (!isReferenced) {
            results.unusedFiles.push(relativePath);
        }
    });
}

/**
 * 收集所有文件
 */
function collectFiles(dir, fileList) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            collectFiles(filePath, fileList);
        } else if (file.endsWith('.js') || file.endsWith('.vue')) {
            fileList.push(filePath);
        }
    });
}

/**
 * 输出检查结果
 */
function printResults() {
    console.log('\n========== RNA质量检测工具 - 代码检查报告 ==========\n');
    
    // console.log 检查
    if (results.consoleLogs.length > 0) {
        console.log(`\n⚠️  发现 ${results.consoleLogs.length} 处 console.log:`);
        results.consoleLogs.forEach((log, index) => {
            console.log(`  ${index + 1}. ${log.file}:${log.line}`);
            console.log(`     ${log.content}`);
        });
    } else {
        console.log('✅  未发现 console.log');
    }
    
    // TODO/FIXME 检查
    if (results.todos.length > 0) {
        console.log(`\n⚠️  发现 ${results.todos.length} 处 TODO/FIXME:`);
        results.todos.forEach((todo, index) => {
            console.log(`  ${index + 1}. ${todo.file}:${todo.line}`);
            console.log(`     ${todo.content}`);
        });
    } else {
        console.log('✅  未发现 TODO/FIXME');
    }
    
    // 大文件检查
    if (results.largeFiles.length > 0) {
        console.log(`\n⚠️  发现 ${results.largeFiles.length} 个大文件（>1000行）:`);
        results.largeFiles.forEach(file => {
            console.log(`  ${file.file}: ${file.lines} 行`);
        });
    } else {
        console.log('✅  无大文件');
    }
    
    // 未引用文件检查
    if (results.unusedFiles.length > 0) {
        console.log(`\n⚠️  发现 ${results.unusedFiles.length} 个可能未引用的文件:`);
        results.unusedFiles.forEach(file => {
            console.log(`  ${file}`);
        });
    } else {
        console.log('✅  所有文件均被引用');
    }
    
    // 汇总
    const totalIssues = results.consoleLogs.length + results.todos.length + 
                        results.largeFiles.length + results.unusedFiles.length;
    
    console.log(`\n========== 检查完成 ==========`);
    console.log(`总问题数: ${totalIssues}`);
    
    if (totalIssues === 0) {
        console.log('🎉 代码质量检查通过！');
    } else {
        console.log('⚠️  存在待修复问题，请检查上述列表');
        process.exit(1);
    }
}

// 执行检查
console.log('开始代码检查...');
scanDirectory(srcDir);
checkUnusedFiles();
printResults();