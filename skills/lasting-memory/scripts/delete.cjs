#!/usr/bin/env node

/**
 * 删除记忆
 * Usage: node delete.cjs --category <类别> --id <ID> [--storage-path <存储路径>]
 *
 * storage-path: 可选参数，不指定时自动检测
 */

const fs = require('fs');
const path = require('path');
const { detectStoragePath } = require('./detect-storage-path.cjs');

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

    if (!params.category || !params.id) {
        console.error('错误：缺少必填参数');
        console.error('Usage: node delete.cjs --category <类别> --id <ID> [--storage-path <存储路径>]');
        process.exit(1);
    }

    // 自动检测存储路径（可通过参数覆盖）
    const storagePath = params['storage-path'] || detectStoragePath();
    const memories = readMemories(storagePath, params.category);
    const initialLength = memories.length;
    const filteredMemories = memories.filter(m => m.id !== params.id);

    if (filteredMemories.length === initialLength) {
        console.error(JSON.stringify({
            success: false,
            message: `未在类别 ${params.category} 中找到 ID 为 ${params.id} 的记忆`
        }, null, 2));
        process.exit(1);
    }

    writeMemories(storagePath, params.category, filteredMemories);

    console.log(JSON.stringify({
        success: true,
        message: '记忆删除成功',
        storagePath: storagePath,
        deletedId: params.id
    }, null, 2));
}

main();
