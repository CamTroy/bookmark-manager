import { useState, useEffect, useRef } from "react";
import type { Bookmark } from "../models/Bookmark";
import stringWidth from "string-width";
import { log } from "../debug/logger";
import { exec } from "node:child_process";
import { useKeyboard } from "@opentui/react";
import { activeView } from "..";
import { ScrollBox } from "@opentui/core";

const CategoryType = {
  SEARCHED: "SEARCHED",
  RECENTS: "RECENTS",
  NONE: "NONE",
};

interface BigAreaProps {
  isFocused: boolean;
  bookmarkList: Bookmark[];
  searchList: Bookmark[];
  onSwitchToBottomBar: (newView: any) => void;
  clipboardService: any;
  deleteBookmark: (bookmark: Bookmark) => void;
}

interface CategoryState {
  name: (typeof CategoryType)[keyof typeof CategoryType];
  list: any[];
}

export default function BigArea({
  isFocused,
  bookmarkList,
  searchList,
  onSwitchToBottomBar,
  clipboardService,
  deleteBookmark,
}: BigAreaProps) {
  const [recentList, setRecentList] = useState<Bookmark[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const prevSelectedIndex = useRef(selectedIndex);
  const searchScrollRef = useRef<any>(null);
  const recentScrollRef = useRef<any>(null);
  const [selectedCategory, setSelectedCategory] = useState(CategoryType.NONE);
  const [categoryState, setCategoryState] = useState<CategoryState>({
    name: CategoryType.NONE,
    list: [],
  });
  const [amountScrollState, setAmountScrollState] = useState(0);

  useEffect(() => {
    if (!isFocused) {
      handleSwitchAwayFromBigArea();
      return;
    }
    if (selectedCategory === CategoryType.NONE && isFocused) {
      handleSwitchToBigArea();
    }
  }, [isFocused, selectedCategory]);

  useEffect(() => {
    if (prevSelectedIndex.current < selectedIndex) {
      setAmountScrollState(amountScrollState + 1);
    } else if (prevSelectedIndex.current > selectedIndex) {
      setAmountScrollState(amountScrollState - 1);
    }
    if (amountScrollState > 3) {
      setAmountScrollState(3);
      if (selectedCategory == CategoryType.SEARCHED) scrollDownByOne(searchScrollRef.current);
    } else if (amountScrollState < 0) {
      setAmountScrollState(0);
       if (selectedCategory == CategoryType.SEARCHED) scrollUpByOne(searchScrollRef.current);
    }
    prevSelectedIndex.current = selectedIndex;
  }, [selectedIndex, amountScrollState]);

  useKeyboard((key) => {
    if (!isFocused) return;

    switch (key.name) {
      case "tab":
        key.preventDefault();
        onSwitchToBottomBar(activeView.BOTTOM_BAR);
        break;
      case "return":
        key.preventDefault();
        openBrowser(categoryState.list[selectedIndex]);
        break;
      case "space":
        key.preventDefault();
        copyLink(categoryState.list[selectedIndex]);
        break;
      case "delete":
        key.preventDefault();
        deleteBookmark(categoryState.list[selectedIndex]);
        break;
      case "left":
        key.preventDefault();
        handleChangeCategory(CategoryType.SEARCHED);
        break;
      case "right":
        key.preventDefault();
        handleChangeCategory(CategoryType.RECENTS);
        break;
      case "up":
        key.preventDefault();
        handleChangeIndex(selectedIndex - 1, categoryState.list);
        break;
      case "down":
        key.preventDefault();
        handleChangeIndex(selectedIndex + 1, categoryState.list);
        break;
      default:
        return;
    }
  });

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

  const openBrowser = (bookmark: Bookmark): void => {
    const platform = process.platform;
    const uri = bookmark.uri;
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
        log(`Failed to open browser: ${error.message}`);
      }
    });
    addToRecents(bookmark);
  };

  const copyLink = async (bookmark: Bookmark): Promise<void> => {
    const uri = bookmark.uri;
    try {
      await clipboardService.writeText(uri, {
        destination: "best-available",
      });
      log(`${uri} copied to clipboard!`);
      addToRecents(bookmark);
    } catch (e) {
      log(`Failed to copy link using OpenTUI service: ${e}`);
    }
  };

  const handleClick = (event: any, bookmark: Bookmark): void => {
    const uri = bookmark.uri;
    log(`link clicked: ${uri}`);
    openBrowser(bookmark);
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

    log(`recents: ${recentList.map((b) => b.name).join(", ")}`);
  };

  const handleSwitchToBigArea = (): void => {
    handleChangeCategory(CategoryType.SEARCHED);
  };

  const handleSwitchAwayFromBigArea = (): void => {
    setSelectedCategory(CategoryType.NONE);
    setSelectedIndex(-1);
  };

  const handleChangeIndex = (newIndex: number, array: any[]): void => {
    if (newIndex < 0) return;
    if (newIndex > array.length - 1) return;

    setSelectedIndex(newIndex);
  };

  const handleChangeCategory = (newCategory: any): void => {
    if (newCategory == CategoryType.RECENTS && recentList.length < 1) return;
    if (newCategory == CategoryType.SEARCHED && bookmarkList.length < 1) return;

    setAmountScrollState(0);
    setSelectedCategory(newCategory);
    if (newCategory == CategoryType.RECENTS) {
      setCategoryState({
        name: CategoryType.RECENTS,
        list: recentList,
      });
      scrollToTop(recentScrollRef.current);
    } else if (newCategory == CategoryType.SEARCHED) {
      setCategoryState({
        name: CategoryType.SEARCHED,
        list: searchList,
      });
      scrollToTop(searchScrollRef.current);
    }
    setSelectedIndex(0);
  };

  const scrollDownByOne = (scrollBox: any) => {
    scrollBox.scrollBy(1);
    log("SCROLLING DOWN");
  };

  const scrollUpByOne = (scrollBox: any) => {
    scrollBox.scrollBy(-1);
    log("SCROLLING UP");
  };

  const scrollToTop = (scrollBox: any) => {
    scrollBox.scrollTo(0);
    log("SCROLLING TO TOP");
  }

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
      <box
        borderColor="white"
        padding={1}
        flexDirection="column"
        flexGrow={1}
        maxHeight={"100%"}
      >
        <scrollbox
          padding={1}
          focused={selectedCategory == CategoryType.SEARCHED}
          ref={searchScrollRef}
        >
          <text>
            welcome to your bookmark manager!
            <br />
          </text>
          {searchList.map((bookmark: Bookmark, index: number) => (
            <text key={bookmark.id} onMouseUp={(e) => handleClick(e, bookmark)}>
              {index == selectedIndex &&
              selectedCategory == CategoryType.SEARCHED ? (
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
      <box
        borderColor="white"
        padding={1}
        flexDirection="column"
        flexGrow={1}
        maxHeight={"100%"}
      >
        <scrollbox
          padding={1}
          focused={selectedCategory == CategoryType.RECENTS}
          ref={recentScrollRef}
        >
          <text>
            recents
            <br />
          </text>
          {recentList.map((bookmark: Bookmark, index: number) => (
            <text key={bookmark.id} onMouseUp={(e) => handleClick(e, bookmark)}>
              {index == selectedIndex &&
              selectedCategory == CategoryType.RECENTS ? (
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
