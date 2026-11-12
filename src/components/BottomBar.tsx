import { useEffect, useState } from "react";
import type { Bookmark } from "../models/Bookmark";
import {
  addBookmark,
} from "../filesync";
import type { KeyEvent } from "@opentui/core";
import { log } from "../debug/logger";
import { load } from "cheerio";
import { activeView } from "..";

interface BottomBarProps {
  isFocused: boolean;
  bookmark: Bookmark | null;
  onBookmarkAdded: (bookmark: Bookmark) => void;
  onSwitchToBigArea: (newView: any) => void;
  onQueryChange: (newQuery: string) => void;
}

function fetchWebsiteTitle(url: string): Promise<string> {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const $ = load(html);
      const title = $("title").text();
      return title || "No title found";
    })
    .catch((error) => {
      console.error("Error fetching website title:", error);
      return "Error fetching title";
    });
}

export default function BottomBar({
  isFocused,
  bookmark,
  onBookmarkAdded,
  onSwitchToBigArea,
  onQueryChange
}: BottomBarProps) {
  const [searchMode, setSearchMode] = useState("SEARCH");
  const [searchQuery, setSearchQuery] = useState("");
  const [newUri, setNewUri] = useState("");

  // These keys are reserved for other parts of the app
  const navKeys = ["up", "left", "right", "down", "delete"];

  // Prevent arrow keys and other important keys from doing normal behavior so they can be used in other parts of the app
  const handleNavKeyPress = (event: KeyEvent): void => {
    if (!isFocused) {
      event.preventDefault();
      return;
    }

    if (event.name === "up" && isFocused) {
      onSwitchToBigArea(activeView.BIG_AREA);
    }
  };

  const handleKeyPressSearch = (event: KeyEvent): void => {
    log(`Key pressed: ${event.name}`);

    if (navKeys.includes(event.name)) handleNavKeyPress(event);
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

    if (navKeys.includes(event.name)) handleNavKeyPress(event);
    if (event.name !== "return") return;
    if (searchMode !== "ADD") return;

    event.preventDefault();

    if (newUri.trim() === "") {
      log("New URI is empty. Not adding bookmark.");
      return;
    }

    fetchWebsiteTitle(newUri)
      .then((title) => {
        const newBookmark: Bookmark = {
          id: Date.now().toString(),
          name: title,
          uri: newUri,
          tags: null,
          description: null,
        };

        addBookmark(newBookmark);
        onBookmarkAdded(newBookmark);
      })
      .catch((error) => {
        log(`Could not fetch title or add bookmark: ${String(error)}`);
      });

    setNewUri("");
    setSearchMode("SEARCH");
  };

  const handleQueryChange = (value: string): void => {
    if (!isFocused) return;

    log(`Search query changed: ${value}`);
    setSearchQuery(value);
    onQueryChange(value);
  };

  const handleNewUriChange = (value: string): void => {
    if (!isFocused) return;

    log(`New URI changed: ${value}`);
    setNewUri(value);
  };

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
        {isFocused ? (
          searchMode === "SEARCH" ? (
            <input
              focused={isFocused}
              id="search-box"
              placeholder={
                searchMode === "SEARCH"
                  ? "Search bookmarks..."
                  : "Enter bookmark url..."
              }
              wrapMode="char"
              onKeyDown={handleKeyPressSearch}
              value={searchQuery}
              onInput={handleQueryChange}
              flexGrow={1}
            />
          ) : (
            <input
              focused={isFocused}
              id="search-box"
              placeholder={
                searchMode === "SEARCH"
                  ? "Search bookmarks..."
                  : "Enter bookmark url..."
              }
              wrapMode="char"
              onKeyDown={handleKeyPressAdd}
              value={newUri}
              onInput={handleNewUriChange}
              flexGrow={1}
            />
          )
        ) : null}
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
