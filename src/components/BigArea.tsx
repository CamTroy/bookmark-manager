import { useState, useEffect } from "react";
import type { Bookmark } from "../models/Bookmark";
import { getBookmarks } from "../filesync";
import stringWidth from "string-width";

export default function BigArea({ bookmarkList }: { bookmarkList: Bookmark[] }) {

    const [recentList, setRecentList] = useState<Bookmark[]>([])

    const sanitizeNonLatin = (text: string): string =>
        Array.from(text.normalize("NFC"), (char) =>
            /\p{Script=Latin}/u.test(char) || /^[\x00-\x7F]$/.test(char) ? char : "?"
        ).join("");

    const truncateName = (name: string, maxWidth: number): string => {
        const sanitizedName = sanitizeNonLatin(name);
        if (stringWidth(sanitizedName) <= maxWidth) {
            return sanitizedName;
        }
        return sanitizedName.slice(0, maxWidth - 3) + "...";
    };

    return (
        <box
            id="big-area-box"
            justifyContent="space-evenly"
            alignItems="flex-start"
            flexDirection="row"
            flexGrow={1}
            gap={1}
            maxWidth="100%"
        >
            <box borderColor="white" padding={1} flexDirection="column" flexGrow={1}>
                <scrollbox padding={1}>
                    <text>welcome to your bookmark manager!</text>
                    {bookmarkList.map((bookmark: Bookmark, index: number) => (
                        <text key={index}>{truncateName(bookmark.name, 40)}</text>
                    ))}
                </scrollbox>
            </box>
            <box borderColor="white" padding={1} flexDirection="column" flexGrow={1}>
                <scrollbox padding={1}>
                    <text>recents</text>
                    {recentList.map((bookmark, index) => (
                        <text key={index}>{truncateName(bookmark.name, 40)}</text>
                    ))}
                </scrollbox>
            </box>
        </box>
    );
}