import { useEffect, useState } from "react";
import type { Bookmark } from "../models/Bookmark";
import { addBookmark, deleteBookmark as deleteBookmarkFromFile, getBookmarks } from "../filesync";
import type { KeyEvent } from "@opentui/core";
import { logger } from "../debug/logger";

interface BottomBarProps {
    bookmark: Bookmark | null;
}

export default function BottomBar({ bookmark }: BottomBarProps) {
    const [searchMode, setSearchMode] = useState("SEARCH");
    const [searchQuery, setSearchQuery] = useState("");
    const [newUri, setNewUri] = useState("");

    // useEffect(() => {

    // }, [searchQuery]);

    const handleKeyPress = (event: KeyEvent): void => {
        logger(`Key pressed: ${event.name}`);

        if (event.name !== "tab") return;

        event.preventDefault();

        if (searchMode === "SEARCH") {
            setSearchMode("ADD");
        } else {
            setSearchMode("SEARCH");
        }
    };

    const handleQueryChange = (value: string): void => {
        logger(`Search query changed: ${value}`);
        setSearchQuery(value);
    }

    const handleNewUriChange = (value: string): void => {
        logger(`New URI changed: ${value}`);
        setNewUri(value);
    }

    return (
        <box
            id="bottom-bar-box"
            justifyContent="space-evenly"
            alignItems="stretch"
            alignSelf="stretch"
            flexDirection="column"
            gap={1}
            paddingY={1}
            flexGrow={1}
            minHeight={10}
        >
            <box borderColor="white" flexGrow={1} minHeight={5} alignSelf="stretch">
                {
                    searchMode === "SEARCH" ? (
                        <input id="search-box" placeholder={searchMode === "SEARCH" ? "Search bookmarks..." : "Enter bookmark url..."} wrapMode="char" onKeyDown={handleKeyPress} value={searchQuery} onInput={handleQueryChange} />
                    ) : (
                        <input id="search-box" placeholder={searchMode === "SEARCH" ? "Search bookmarks..." : "Enter bookmark url..."} wrapMode="char" onKeyDown={handleKeyPress} value={newUri} onInput={handleNewUriChange} />
                    )
                }
            </box>

            {/* <box borderColor="white" flexGrow={1} minHeight={5} alignSelf="stretch">
                {bookmark?.id ? (
                    <>
                        <text>url: {bookmark.uri}</text>
                        <text>description: {bookmark.description}</text>
                        <box flexDirection="row">
                            <text>tags:</text>
                            {bookmark.tags.map((tag: string, index: number) => (
                                <text key={`${tag}-${index}`}>{tag}</text>
                            ))}
                        </box>
                    </>
                ) : null}
            </box> */}
        </box>
    );
}