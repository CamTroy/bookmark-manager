import { useState, useEffect } from "react";
import type { Bookmark } from "../models/Bookmark";

export default function BigArea({ bookmarks, recents }: { bookmarks?: Bookmark[], recents?: Bookmark[] }) {

    const [ bookmarkList, setBookmarkList ] = useState<Bookmark[]>([])
    const [ recentList, setRecentList ] = useState<Bookmark[]>([])

    useEffect(() => {
        if (bookmarks) {
            setBookmarkList(bookmarks);
        }
    }, [bookmarks]);

    useEffect(() => {
        if (recents) {
            setRecentList(recents);
        }
    }, [recents]);

    return (
        <box
            id="big-area-box"
            justifyContent="space-evenly"
            alignItems="flex-start"
            flexDirection="row"
            flexGrow={1}
            gap={1}
            maxWidth={90}
        >
            <box borderColor="white" padding={1} flexDirection="column" flexGrow={1} minWidth={20}>
                <scrollbox padding={1}>
                    <text>welcome to your bookmark manager!</text>
                        {bookmarkList.map((bookmark: Bookmark, index: number) => (
                        <text key={index}>{bookmark.id}</text>
                    ))}
                </scrollbox>
            </box>
            <box borderColor="white" padding={1} flexDirection="column" flexGrow={1} minWidth={20}>
                <scrollbox padding={1}>
                    <text>recents</text>
                    {recentList.map((bookmark, index) => (
                        <text key={index}>{bookmark.id}</text>
                    ))}
                </scrollbox>
            </box>
        </box>
    );
}