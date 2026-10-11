import { useEffect, useState } from "react";
import type { Bookmark } from "../models/Bookmark";
import { addBookmark, deleteBookmark as deleteBookmarkFromFile, getBookmarks } from "../filesync";
import type { KeyEvent } from "@opentui/core";
import { logger } from "../debug/logger";
import { load } from "cheerio";

interface BottomBarProps {
    bookmark: Bookmark | null;
}

function fetchWebsiteTitle(url: string): Promise<string> {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            const $ = load(html);
            const title = $("title").text();
            return title || "No title found";
        })
        .catch(error => {
            console.error("Error fetching website title:", error);
            return "Error fetching title";
        });
}

export default function BottomBar({ bookmark }: BottomBarProps) {
    const [searchMode, setSearchMode] = useState("SEARCH");
    const [searchQuery, setSearchQuery] = useState("");
    const [newUri, setNewUri] = useState("");

    // useEffect(() => {

    // }, [searchQuery]);

    const handleKeyPressSearch = (event: KeyEvent): void => {
        logger(`Key pressed: ${event.name}`);

        if (event.name !== "tab") return;

        event.preventDefault();

        if (searchMode === "SEARCH") {
            setSearchMode("ADD");
        } else {
            setSearchMode("SEARCH");
        }
    };

    const handleKeyPressAdd = (event: KeyEvent): void => {
        handleKeyPressSearch(event);

        if (event.name !== "return") return;
        if (searchMode !== "ADD") return;

        event.preventDefault();

        if (newUri.trim() === "") {
            logger("New URI is empty. Not adding bookmark.");
            return;
        }

        fetchWebsiteTitle(newUri)
            .then(title => {
                const newBookmark: Bookmark = {
                    id: Date.now().toString(),
                    name: title,
                    uri: newUri,
                    tags: null,
                    description: null
                };

                return addBookmark(newBookmark);
            })
            .catch(error => {
                logger(`Could not fetch title or add bookmark: ${String(error)}`);
            });

        setNewUri("");
        setSearchMode("SEARCH");
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
                        <input id="search-box" placeholder={searchMode === "SEARCH" ? "Search bookmarks..." : "Enter bookmark url..."} wrapMode="char" onKeyDown={handleKeyPressSearch} value={searchQuery} onInput={handleQueryChange} flexGrow={1} />
                    ) : (
                        <input id="search-box" placeholder={searchMode === "SEARCH" ? "Search bookmarks..." : "Enter bookmark url..."} wrapMode="char" onKeyDown={handleKeyPressAdd} value={newUri} onInput={handleNewUriChange} flexGrow={1} />
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