#!/usr/bin/env node

/**
 * 读取记忆
 * Usage:
 *   node read.cjs [--category <类别>] [--id <ID>] [--keywords <关键词1,关键词2>] [--storage-path <存储路径>]
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

function main() {
    const params = parseArgs();

    // 自动检测存储路径（可通过参数覆盖）
    const storagePath = params['storage-path'] || detectStoragePath();
    let results = [];

    // 如果指定了类别，只读取该类别文件
    if (params.category) {
        results = readMemoriesFromFile(getMemoryFile(storagePath, params.category));
    } else {
        // 否则读取所有类别
        results = readAllMemories(storagePath);
    }

    // 按 ID 过滤
    if (params.id) {
        results = results.filter(m => m.id === params.id);
    }

    // 按关键词过滤（任一关键词匹配即可）
    if (params.keywords) {
        const searchKeywords = params.keywords.split(',').map(k => k.trim().toLowerCase());
        results = results.filter(m => {
            return searchKeywords.some(sk =>
                m.keywords.some(mk => mk.toLowerCase().includes(sk)) ||
                m.title.toLowerCase().includes(sk) ||
                m.content.toLowerCase().includes(sk)
            );
        });
    }

    // 按更新时间倒序
    results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    console.log(JSON.stringify({
        success: true,
        storagePath: storagePath,
        count: results.length,
        memories: results
    }, null, 2));
}

main();
