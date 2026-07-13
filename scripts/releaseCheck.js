/**
 * 发布前自动检查脚本
 *
 * 检查项：
 * 1. 构建是否通过
 * 2. console.log 是否清理
 * 3. 硬编码颜色检查
 * 4. 版本信息一致性
 * 5. 大文件检查
 * 
 * 运行：npm run release-check
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const __dirname = decodeURIComponent(path.dirname(new URL(import.meta.url).pathname)).replace(/^\/([A-Za-z]):\//, '$1:/');
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

let hasErrors = false;
let hasWarnings = false;

const results = {
    errors: [],
    warnings: [],
    passed: []
};

function check(name, condition, message, isWarning = false) {
    if (condition) {
        results.passed.push(`✅ ${name}`);
    } else if (isWarning) {
        results.warnings.push(`⚠️  ${name}: ${message}`);
        hasWarnings = true;
    } else {
        results.errors.push(`❌ ${name}: ${message}`);
        hasErrors = true;
    }
}

// ==================== 1. 版本信息检查 ====================
function checkVersion() {
    console.log('\n📦 检查版本信息...');
    
    // version.json
    const versionPath = path.join(projectRoot, 'version.json');
    check('version.json 存在', fs.existsSync(versionPath), 'version.json 不存在');
    
    if (fs.existsSync(versionPath)) {
        const version = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
        check('版本号为 1.0.0', version.version === '1.0.0', `当前版本: ${version.version}`);
        check('构建版本为 RC1', version.build === 'RC1', `当前构建: ${version.build}`);
    }
    
    // package.json
    const pkgPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        check('package.json 版本一致', pkg.version === '1.0.0', `package.json 版本: ${pkg.version}`);
    }
    
    // CHANGELOG.md
    check('CHANGELOG.md 存在', fs.existsSync(path.join(projectRoot, 'CHANGELOG.md')), 'CHANGELOG.md 不存在');
}

// ==================== 2. 构建检查 ====================
function checkBuild() {
    console.log('\n🔨 检查构建...');
    
    try {
        execSync('npm run build', { cwd: projectRoot, stdio: 'pipe' });
        check('构建成功', true, '');
        
        // 检查 dist 目录
        const distPath = path.join(projectRoot, 'dist');
        check('dist 目录存在', fs.existsSync(distPath), 'dist 目录不存在');
        check('dist/index.html 存在', fs.existsSync(path.join(distPath, 'index.html')), 'dist/index.html 不存在');
        check('dist/assets 存在', fs.existsSync(path.join(distPath, 'assets')), 'dist/assets 不存在');
    } catch (e) {
        check('构建成功', false, e.message?.substring(0, 200));
    }
}

// ==================== 3. console.log 检查 ====================
function checkConsoleLogs() {
    console.log('\n📝 检查 console.log...');
    
    const offenders = [];
    
    function scan(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                scan(filePath);
            } else if (file.endsWith('.js') || file.endsWith('.vue')) {
                // 跳过 logger.js 本身
                if (file === 'logger.js') return;
                
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n');
                lines.forEach((line, i) => {
                    if (line.includes('console.log') && !line.trim().startsWith('*')) {
                        offenders.push(`${path.relative(projectRoot, filePath)}:${i + 1}`);
                    }
                });
            }
        });
    }
    
    scan(srcDir);
    check('无 console.log', offenders.length === 0, `发现 ${offenders.length} 处: ${offenders.slice(0, 5).join(', ')}...`, true);
}

// ==================== 4. 硬编码颜色检查 ====================
function checkHardcodedColors() {
    console.log('\n🎨 检查硬编码颜色...');
    
    const offenders = [];
    const pattern = /(?:color|background|border-color)\s*:\s*(?:#fff|#000|#FFFFFF|#ffffff|#000000|white|black)\s*[;(!]/;
    
    function scan(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                scan(filePath);
            } else if (file.endsWith('.vue')) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n');
                lines.forEach((line, i) => {
                    // 跳过 CSS 变量回退值（如 var(--card-bg, #ffffff)）
                    if (pattern.test(line) && !line.includes('var(') && !line.includes('//') && !line.includes('/*')) {
                        offenders.push(`${path.relative(projectRoot, filePath)}:${i + 1}: ${line.trim()}`);
                    }
                });
            }
        });
    }
    
    scan(path.join(srcDir, 'components'));
    check('无硬编码颜色', offenders.length === 0, `发现 ${offenders.length} 处:\n${offenders.join('\n')}`, true);
}

// ==================== 5. 大文件检查 ====================
function checkLargeFiles() {
    console.log('\n📊 检查大文件...');
    
    const offenders = [];
    
    function scan(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                scan(filePath);
            } else if (file.endsWith('.js') || file.endsWith('.vue')) {
                const content = fs.readFileSync(filePath, 'utf8');
                const lines = content.split('\n').length;
                if (lines > 800) {
                    offenders.push(`${path.relative(projectRoot, filePath)}: ${lines} 行`);
                }
            }
        });
    }
    
    scan(srcDir);
    check('无大文件（>800行）', offenders.length === 0, `发现 ${offenders.length} 个:\n${offenders.join('\n')}`, true);
}

// ==================== 6. 关键文件存在检查 ====================
function checkCriticalFiles() {
    console.log('\n📁 检查关键文件...');
    
    const criticalFiles = [
        'src/main.js',
        'src/App.vue',
        'src/config/appConfig.js',
        'src/config/qualityConfig.js',
        'src/config/qualityLevel.js',
        'src/core/index.js',
        'src/core/quality/qualityJudge.js',
        'src/core/pollution/pollutionAnalyzer.js',
        'src/core/analyzer/sampleAnalyzer.js',
        'src/core/chart/chartManager.js',
        'src/core/export/excelExporter.js',
        'src/core/export/pdfExporter.js',
        'src/store/sampleStore.js',
        'src/utils/logger.js',
        'src/utils/performance.js',
        'src/utils/debounce.js'
    ];
    
    criticalFiles.forEach(file => {
        check(`${file} 存在`, fs.existsSync(path.join(projectRoot, file)), `${file} 不存在`);
    });
}

// ==================== 7. 依赖检查 ====================
function checkDependencies() {
    console.log('\n📦 检查依赖...');
    
    const pkgPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = pkg.dependencies || {};
        
        check('vue 依赖', 'vue' in deps, '缺少 vue 依赖');
        check('echarts 依赖', 'echarts' in deps, '缺少 echarts 依赖');
        check('exceljs 依赖', 'exceljs' in deps, '缺少 exceljs 依赖');
        check('jspdf 依赖', 'jspdf' in deps, '缺少 jspdf 依赖');
    }
}

// ==================== 输出报告 ====================
function printReport() {
    console.log('\n========================================');
    console.log('  RNA质量检测工具 v1.0.0 - 发布检查报告');
    console.log('========================================\n');
    
    // 通过项
    results.passed.forEach(item => console.log(item));
    
    // 警告项
    if (results.warnings.length > 0) {
        console.log('\n--- 警告 ---');
        results.warnings.forEach(item => console.log(item));
    }
    
    // 错误项
    if (results.errors.length > 0) {
        console.log('\n--- 错误 ---');
        results.errors.forEach(item => console.log(item));
    }
    
    // 汇总
    console.log('\n========================================');
    console.log(`  通过: ${results.passed.length}  警告: ${results.warnings.length}  错误: ${results.errors.length}`);
    
    if (hasErrors) {
        console.log('  ❌ 发布检查未通过 - 存在错误');
        process.exit(1);
    } else if (hasWarnings) {
        console.log('  ⚠️  发布检查通过（有警告）');
    } else {
        console.log('  ✅ 发布检查全部通过！');
    }
    console.log('========================================\n');
}

// ==================== 执行检查 ====================
console.log('开始发布前检查...');

checkCriticalFiles();
checkVersion();
checkDependencies();
checkConsoleLogs();
checkHardcodedColors();
checkLargeFiles();
checkBuild();

printReport();