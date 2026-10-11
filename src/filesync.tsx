import { readFileSync, writeFileSync } from 'fs';
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Bookmark } from './models/Bookmark';

const BOOKMARKS_DIR = join(homedir(), '.bmanager');
const BOOKMARKS_PATH = join(BOOKMARKS_DIR, 'bookmarks.json');

export function getBookmarks(): Bookmark[] {
    try {
        const data = readFileSync(BOOKMARKS_PATH, 'utf-8');
        return JSON.parse(data) as Bookmark[];
    } catch (error) {
        console.error('Error reading bookmarks:', error);
        return [];
    }
}

function saveBookmarks(bookmarks: Bookmark[]): void {
    try {
        writeFileSync(BOOKMARKS_PATH, JSON.stringify(bookmarks, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving bookmarks:', error);
    }
}

export function addBookmark(bookmark: Bookmark): void {
    const bookmarks = getBookmarks();
    bookmarks.push(bookmark);
    saveBookmarks(bookmarks);
}

export function deleteBookmark(bookmarkId: string): void {
    const bookmarks = getBookmarks();
    const updatedBookmarks = bookmarks.filter(b => b.id !== bookmarkId);
    saveBookmarks(updatedBookmarks);
}