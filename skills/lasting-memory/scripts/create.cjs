#!/usr/bin/env node

/**
 * 创建新记忆
 * Usage: node create.cjs --category <类别> --title <标题> --content <内容> [--keywords <关键词1,关键词2>] [--storage-path <存储路径>]
 *
 * storage-path: 可选参数，不指定时自动检测：
 *   - Claude Code: .claude/memories
 *   - Qoder: .qoder/memories
 *   - Cursor: .cursor/memories
 *   - Continue: .continue/memories
 *   - 未知工具: .ai-memories
 */

const fs = require('fs');
const path = require('path');
const { detectStoragePath } = require('./detect-storage-path.cjs');

function getMemoryFile(storagePath, category) {
    return path.join(storagePath, `${category}.json`);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
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

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
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
    ensureDir(storagePath);
    const filePath = getMemoryFile(storagePath, category);
    fs.writeFileSync(filePath, JSON.stringify(memories, null, 2), 'utf-8');
}

function main() {
    const params = parseArgs();

    // 验证必填参数
    if (!params.category || !params.title || !params.content) {
        console.error('错误：缺少必填参数');
        console.error('Usage: node create.cjs --category <类别> --title <标题> --content <内容> [--keywords <关键词>] [--storage-path <存储路径>]');
        process.exit(1);
    }

    // 自动检测存储路径（可通过参数覆盖）
    const storagePath = params['storage-path'] || detectStoragePath();

    const memory = {
        id: generateId(),
        category: params.category,
        title: params.title,
        content: params.content,
        keywords: params.keywords ? params.keywords.split(',').map(k => k.trim()) : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const memories = readMemories(storagePath, params.category);
    memories.push(memory);
    writeMemories(storagePath, params.category, memories);

    console.log(JSON.stringify({
        success: true,
        message: '记忆创建成功',
        storagePath: storagePath,
        memory: memory
    }, null, 2));
}

main();
