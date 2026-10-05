import { useState } from "react";

export default function BottomBar() {
    const [searchMode, setSearchMode] = useState();
    const [searchQuery, setSearchQuery] = useState();
    const [uri, setUri] = useState();
    const [description, setDescription] = useState();
    const [tags, setTags] = useState();

    return (
        <box
            id="bottom-bar-box"
            justifyContent="space-evenly"
            alignItems="stretch"
            alignSelf="stretch"
            flexDirection="column"
            gap={1}
            flexGrow={1}
            paddingY={1}
            minHeight={10}
        >
            <box borderColor="white" flexGrow={1} minHeight={5} alignSelf="stretch">
                <input id="search-box" placeholder="Search bookmarks... or press tab to add a new entry" wrapMode="char"></input>
            </box>

            <box borderColor="white" flexGrow={1} minHeight={5}alignSelf="stretch">
                <text>details</text>
                <text>url: https://example.com</text>
                <text>description: Example website for testing.</text>
                <text>tags: example, test</text>
            </box>
        </box>
    );
}