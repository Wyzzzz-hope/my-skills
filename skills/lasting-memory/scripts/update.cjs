#!/usr/bin/env node

/**
 * 更新记忆
 * Usage: node update.js --storage-path <存储路径> --category <类别> --id <ID> [--title <新标题>] [--content <新内容>] [--keywords <新关键词>]
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

function readMemories(storagePath, category) {
    const filePath = getMemoryFile(storagePath, category);
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

function writeMemories(storagePath, category, memories) {
    const filePath = getMemoryFile(storagePath, category);
    fs.writeFileSync(filePath, JSON.stringify(memories, null, 2), 'utf-8');
}

function main() {
    const params = parseArgs();

    if (!params['storage-path'] || !params.category || !params.id) {
        console.error('错误：缺少必填参数');
        console.error('Usage: node update.js --storage-path <存储路径> --category <类别> --id <ID> [--title <新标题>] [--content <新内容>] [--keywords <新关键词>]');
        process.exit(1);
    }

    const storagePath = params['storage-path'];
    const memories = readMemories(storagePath, params.category);
    const index = memories.findIndex(m => m.id === params.id);

    if (index === -1) {
        console.error(JSON.stringify({
            success: false,
            message: `未在类别 ${params.category} 中找到 ID 为 ${params.id} 的记忆`
        }, null, 2));
        process.exit(1);
    }

    // 更新字段
    if (params.title) memories[index].title = params.title;
    if (params.content) memories[index].content = params.content;
    if (params.keywords) {
        memories[index].keywords = params.keywords.split(',').map(k => k.trim());
    }
    memories[index].updatedAt = new Date().toISOString();

    writeMemories(storagePath, params.category, memories);

    console.log(JSON.stringify({
        success: true,
        message: '记忆更新成功',
        storagePath: storagePath,
        memory: memories[index]
    }, null, 2));
}

main();
