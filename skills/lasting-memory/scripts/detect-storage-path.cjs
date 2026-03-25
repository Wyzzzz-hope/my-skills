/**
 * 自动检测记忆存储路径
 *
 * 根据当前工作目录下存在的工具目录，自动确定存储路径：
 * - Claude Code: .claude/memories
 * - Qoder: .qoder/memories
 * - Cursor: .cursor/memories
 * - Continue: .continue/memories
 * - 未知工具: .ai-memories
 */

const fs = require('fs');
const path = require('path');

/**
 * 检测当前工具类型并返回存储路径
 * @param {string} cwd - 当前工作目录，默认为 process.cwd()
 * @returns {string} 存储路径
 */
function detectStoragePath(cwd = process.cwd()) {
    // 工具类型检测顺序和对应的存储路径
    const toolConfigs = [
        { dir: '.claude', storagePath: '.claude/memories' },
        { dir: '.qoder', storagePath: '.qoder/memories' },
        { dir: '.cursor', storagePath: '.cursor/memories' },
        { dir: '.continue', storagePath: '.continue/memories' },
    ];

    // 按顺序检测
    for (const config of toolConfigs) {
        const toolDir = path.join(cwd, config.dir);
        if (fs.existsSync(toolDir)) {
            return path.join(cwd, config.storagePath);
        }
    }

    // 未检测到任何工具目录，使用通用目录
    return path.join(cwd, '.ai-memories');
}

module.exports = { detectStoragePath };
