import { createCliRenderer, TextAttributes,  createClipboard,
createHostClipboard,
createRendererClipboardAdapter } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "@opentui/react/runtime-plugin-support";
import BottomBar from "./components/BottomBar";
import BigArea from "./components/BigArea";
import { useEffect, useState } from "react";
import type { Bookmark } from "./models/Bookmark";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { getBookmarks, deleteBookmark } from "./filesync";
import { log, cleanupLogs } from "./debug/logger";

mkdirSync(join(homedir(), ".bmanager"), { recursive: true });

export const activeView = {
  BOTTOM_BAR: "BOTTOM_BAR",
  BIG_AREA: "BIG_AREA"
}

function App() {

  useEffect(() => {
    cleanupLogs();
  }, [])

  const [focusedBookmark, setFocusedBookmark] = useState<Bookmark | null>(null);
  const [bookmarkList, setBookmarkList] = useState<Bookmark[]>(getBookmarks());
  const [focusedView, setFocusedView] = useState(activeView.BOTTOM_BAR);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchList, setSearchList] = useState(bookmarkList);

  useEffect(() => {
    let filteredList = bookmarkList;
    // Handle search logic
    if (searchQuery.trim().length === 0) {
      setSearchList(bookmarkList);
    } else {
      filteredList = bookmarkList.filter(bookmark =>
        bookmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.uri.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setSearchList(filteredList);
  }, [searchQuery, bookmarkList]);

  const handleBookmarkAdded = (bookmark: Bookmark) => {
    setBookmarkList(current => [...current, bookmark]);
    }

  const handleSwitchViews = (newView: any) => {
    setFocusedView(newView);
    log(`Focused view: ${newView}`)
  }

  const handleQueryChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  }

  const clipboard = createClipboard({
    host: createHostClipboard(),
    terminal: createRendererClipboardAdapter(renderer),
  });

  const handleDeleteBookmark = (bookmark: Bookmark) => {
    try {
      deleteBookmark(bookmark);
      setBookmarkList(getBookmarks());
      log(`${bookmark.name} with ${bookmark.uri} has successfully been deleted!`);
    } catch (e) {
      log(`deleting bookmark failed with error ${e}`);
    }
  }

  return (
    <box justifyContent="center" alignItems="center" alignSelf="center" flexDirection="column" flexGrow={1} minWidth={40} minHeight={20} maxHeight={40}>
      {/* <ascii-font id="title" text="bookmark manager" font="shade" /> */}
      <BigArea isFocused={focusedView === activeView.BIG_AREA} bookmarkList={bookmarkList} searchList={searchList} onSwitchToBottomBar={handleSwitchViews} clipboardService={clipboard} deleteBookmark={handleDeleteBookmark} />
      <BottomBar isFocused={focusedView == activeView.BOTTOM_BAR} bookmark={focusedBookmark} onBookmarkAdded={handleBookmarkAdded} onSwitchToBigArea={handleSwitchViews} onQueryChange={handleQueryChange} />
      {/* Debug code */}
      {/* <text id="test-debug">current focusedBookmark: {focusedBookmark?.id || 'null'}</text> */}
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);