import { useState, useEffect } from "react";
import type { Bookmark } from "../models/Bookmark";
import { getBookmarks } from "../filesync";
import stringWidth from "string-width";
import { logger } from "../debug/logger";
import { exec } from "node:child_process";

export default function BigArea({
  bookmarkList,
}: {
  bookmarkList: Bookmark[];
}) {
  const [recentList, setRecentList] = useState<Bookmark[]>([]);
  const sanitizeNonLatin = (text: string): string =>
    Array.from(text.normalize("NFC"), (char) =>
      /\p{Script=Latin}/u.test(char) || /^[\x00-\x7F]$/.test(char) ? char : "?",
    ).join("");

  const truncateName = (name: string, maxWidth: number): string => {
    const sanitizedName = sanitizeNonLatin(name);
    if (stringWidth(sanitizedName) <= maxWidth) {
      return sanitizedName;
    }
    return sanitizedName.slice(0, maxWidth - 3) + "...";
  };

  const openBrowser = (uri: string): void => {
    const platform = process.platform;
    let command = "";
    if (platform === "win32") {
      command = `start "" "${uri}"`;
    } else if (platform === "darwin") {
      command = `open "${uri}"`;
    } else {
      command = `xdg-open "${uri}"`;
    }
    exec(command, (error) => {
      if (error) {
        logger(`Failed to open browser: ${error.message}`);
      }
    });
  };

  const handleClick = (event: any, bookmark: Bookmark): void => {
    const uri = bookmark.uri;
    logger(`link clicked: ${uri}`);
    openBrowser(uri);
    addToRecents(bookmark);
  };

  const addToRecents = (bookmark: Bookmark): void => {
    setRecentList((prevList) => {
      const filtered = prevList.filter(
        (b: Bookmark) => b.id !== bookmark.id,
      );
      let newArray = [bookmark, ...filtered];
      if (newArray.length > 10) {
        newArray = newArray.slice(0, 10);
      }
      return newArray;
    });

    logger(`recents: ${recentList.map((b) => b.name).join(", ")}`);
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
          <text>
            welcome to your bookmark manager!
            <br />
          </text>
          {bookmarkList.map((bookmark: Bookmark, index: number) => (
            <text key={bookmark.id} onMouseUp={(e) => handleClick(e, bookmark)}>
              <a href={bookmark.uri}>{truncateName(bookmark.name, 40)}</a>
            </text>
          ))}
        </scrollbox>
      </box>
      <box borderColor="white" padding={1} flexDirection="column" flexGrow={1}>
        <scrollbox padding={1}>
          <text>
            recents
            <br />
          </text>
          {/* Why is there nothing here bruh */}
          {recentList.map((bookmark: Bookmark, index: number) => (
            <text key={bookmark.id} onMouseUp={(e) => handleClick(e, bookmark)}>
              <a href={bookmark.uri}>{truncateName(bookmark.name, 40)}</a>
            </text>
          ))}
        </scrollbox>
      </box>
    </box>
  );
}
