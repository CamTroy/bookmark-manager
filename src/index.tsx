import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "@opentui/react/runtime-plugin-support";
import BottomBar from "./components/BottomBar";
import BigArea from "./components/BigArea";
import { useState } from "react";
import type { Bookmark } from "./models/Bookmark";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { getBookmarks } from "./filesync";
import { logger } from "./debug/logger";

mkdirSync(join(homedir(), ".bmanager"), { recursive: true });

export const activeView = {
  BOTTOM_BAR: "BOTTOM_BAR",
  BIG_AREA: "BIG_AREA"
}

function App() {

  const [focusedBookmark, setFocusedBookmark] = useState<Bookmark | null>(null);
  const [bookmarkList, setBookmarkList] = useState<Bookmark[]>(getBookmarks());
  const [focusedView, setFocusedView] = useState(activeView.BOTTOM_BAR);

  const handleBookmarkAdded = (bookmark: Bookmark) => {
    setBookmarkList(current => [...current, bookmark]);
  }

  const handleSwitchViews = (newView: any) => {
    setFocusedView(newView);
    logger(`Focused view: ${newView}`)
  }

  return (
    <box justifyContent="center" alignItems="center" alignSelf="center" flexDirection="column" flexGrow={1} minWidth={40} minHeight={20} maxHeight={40}>
      {/* <ascii-font id="title" text="bookmark manager" font="shade" /> */}
      <BigArea isFocused={focusedView === activeView.BIG_AREA} bookmarkList={bookmarkList} onSwitchToBottomBar={handleSwitchViews} />
      <BottomBar isFocused={focusedView == activeView.BOTTOM_BAR} bookmark={focusedBookmark} onBookmarkAdded={handleBookmarkAdded} onSwitchToBigArea={handleSwitchViews} />
      {/* Debug code */}
      {/* <text id="test-debug">current focusedBookmark: {focusedBookmark?.id || 'null'}</text> */}
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);