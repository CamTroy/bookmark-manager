import { useState, useEffect } from "react";
import type { Bookmark } from "../models/Bookmark";
import { getBookmarks } from "../filesync";
import stringWidth from "string-width";
import { logger } from "../debug/logger";
import { exec } from "node:child_process";
import { useKeyboard } from "@opentui/react";
import { activeView } from "..";

const categoryType = {
  SEARCHED: "SEARCHED",
  RECENTS: "RECENTS",
  NONE: "NONE",
};

interface BigAreaProps {
  isFocused: boolean;
  bookmarkList: Bookmark[];
  onSwitchToBottomBar: (newView: any) => void;
}

export default function BigArea({
  isFocused,
  bookmarkList,
  onSwitchToBottomBar
}: BigAreaProps) {
  useEffect(() => {
    if (!isFocused) {
      handleSwitchAwayFromBigArea();
      return;
    }

    handleSwitchToBigArea();
  }), [isFocused]
  
  useKeyboard((key) => {
    if (!isFocused) return;

    if (key.name == 'tab') {
      key.preventDefault();
      onSwitchToBottomBar(activeView.BOTTOM_BAR);
    }
  })
  
  const [recentList, setRecentList] = useState<Bookmark[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState(categoryType.NONE);
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
      const filtered = prevList.filter((b: Bookmark) => b.id !== bookmark.id);
      let newArray = [bookmark, ...filtered];
      if (newArray.length > 10) {
        newArray = newArray.slice(0, 10);
      }
      return newArray;
    });

    logger(`recents: ${recentList.map((b) => b.name).join(", ")}`);
  };

  const handleSwitchToBigArea = (): void => {
    handleChangeCategory(categoryType.SEARCHED);
  };

  const handleSwitchAwayFromBigArea = (): void => {
    setSelectedCategory(categoryType.NONE);
    setSelectedIndex(-1);
  }

  const handleChangeIndex = (
    currentIndex: number,
    newIndex: number,
    array: any[],
  ): void => {
    if (newIndex < 0) return;
    if (newIndex > array.length - 1) return;
  };

  const handleChangeCategory = (newCategory: any): void => {
    if (newCategory == categoryType.RECENTS && recentList.length < 1) return;
    if (newCategory == categoryType.SEARCHED && bookmarkList.length < 1) return;

    setSelectedCategory(newCategory);
    setSelectedIndex(0);
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
              {index == selectedIndex && selectedCategory == categoryType.SEARCHED ? (
                <u>
                  <a href={bookmark.uri}>{truncateName(bookmark.name, 40)}</a>
                </u>
              ) : (
                <a href={bookmark.uri}>{truncateName(bookmark.name, 40)}</a>
              )}
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
          {recentList.map((bookmark: Bookmark, index: number) => (
            <text key={bookmark.id} onMouseUp={(e) => handleClick(e, bookmark)}>
              {index == selectedIndex && selectedCategory == categoryType.RECENTS ? (
                <u>
                  <a href={bookmark.uri}>{truncateName(bookmark.name, 40)}</a>
                </u>
              ) : (
                <a href={bookmark.uri}>{truncateName(bookmark.name, 40)}</a>
              )}
            </text>
          ))}
        </scrollbox>
      </box>
    </box>
  );
}
