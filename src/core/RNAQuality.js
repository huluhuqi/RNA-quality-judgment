/**
 * 兼容入口
 *
 * 核心逻辑已拆分至 src/core/quality/：
 *   - qualityJudge.js    质量评级
 *   - pollutionJudge.js  污染判断
 *   - suggestionBuilder  建议生成
 *   - constants.js       判断标准
 *
 * 本文件保留以兼容旧 import：
 *   import { analyzeRNA } from '../core/RNAQuality'
 */
import { analyzeRNA } from "./quality";

export { analyzeRNA };
export default analyzeRNA;
