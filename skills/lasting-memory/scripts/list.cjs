#!/usr/bin/env node

/**
 * 列出所有记忆
 * Usage: node list.js --storage-path <存储路径> [--category <类别>]
 * 
 * storage-path: 记忆存储目录路径（必填），由调用方根据工具类型设置
 *   - Qoder: 项目目录下的 .qoder/memories
 */

const fs = require('fs');
const path = require('path');

function getMemoryFile(storagePath, category) {
    return path.join(storagePath, `${category}.json`);
}

function parseArgs() {
    const args = process.argv.slice(2);
    const params = {};

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : '';
            params[key] = value;
            if (value) i++;
        }
    }

    return params;
}

function readMemoriesFromFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function readAllMemories(storagePath) {
    if (!fs.existsSync(storagePath)) {
        return [];
    }
    const files = fs.readdirSync(storagePath).filter(f => f.endsWith('.json'));
    let allMemories = [];
    for (const file of files) {
        const filePath = path.join(storagePath, file);
        const memories = readMemoriesFromFile(filePath);
        allMemories = allMemories.concat(memories);
    }
    return allMemories;
}

function getCategoryStats(storagePath) {
    if (!fs.existsSync(storagePath)) {
        return {};
    }
    const files = fs.readdirSync(storagePath).filter(f => f.endsWith('.json'));
    const stats = {};
    for (const file of files) {
        const category = path.basename(file, '.json');
        const filePath = path.join(storagePath, file);
        const memories = readMemoriesFromFile(filePath);
        stats[category] = memories.length;
    }
    return stats;
}

function main() {
    const params = parseArgs();

    // 验证必填参数
    if (!params['storage-path']) {
        console.error('错误：缺少必填参数 --storage-path');
        console.error('Usage: node list.js --storage-path <存储路径> [--category <类别>]');
        process.exit(1);
    }

    const storagePath = params['storage-path'];
    let memories = [];

    // 如果指定了类别，只读取该类别文件
    if (params.category) {
        memories = readMemoriesFromFile(getMemoryFile(storagePath, params.category));
    } else {
        // 否则读取所有类别
        memories = readAllMemories(storagePath);
    }

    // 按更新时间倒序
    memories.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // 统计各类别数量
    const categoryStats = getCategoryStats(storagePath);
    const totalCount = Object.values(categoryStats).reduce((sum, count) => sum + count, 0);

    console.log(JSON.stringify({
        success: true,
        storagePath: storagePath,
        totalCount: totalCount,
        filteredCount: memories.length,
        categoryStats: categoryStats,
        memories: memories.map(m => ({
            id: m.id,
            category: m.category,
            title: m.title,
            keywords: m.keywords,
            updatedAt: m.updatedAt
        }))
    }, null, 2));
}

main();
