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

mkdirSync(join(homedir(), ".bmanager"), { recursive: true });

function App() {

  const dummyBookmark: Bookmark = {
    id: "1",
    name: "bruh",
    uri: "butt.com",
    tags: ["hmm", "hmm"],
    description: "Bruhhhhhhhhhhhhh"
  }

  const [focusedBookmark, setFocusedBookmark] = useState<Bookmark | null>(null);

  return (
    <box justifyContent="center" alignItems="center" alignSelf="center" flexDirection="column" flexGrow={1} minWidth={40} minHeight={20} maxHeight={40}>
      {/* <ascii-font id="title" text="bookmark manager" font="shade" /> */}
      <BigArea />
      <BottomBar bookmark={focusedBookmark} />
      {/* Debug code */}
      {/* <text id="test-debug">current focusedBookmark: {focusedBookmark?.id || 'null'}</text> */}
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);