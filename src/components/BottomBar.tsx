import { useState } from "react";
import type { Bookmark } from "../models/Bookmark";

interface BottomBarProps {
    bookmark: Bookmark | null;
}

export default function BottomBar({ bookmark }: BottomBarProps) {
    const [searchMode, setSearchMode] = useState();
    const [searchQuery, setSearchQuery] = useState();

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
                <input id="search-box" placeholder="Search bookmarks... or press tab to add a new entry" wrapMode="char" />
            </box>

            <box borderColor="white" flexGrow={1} minHeight={5} alignSelf="stretch">
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
            </box>
        </box>
    );
}