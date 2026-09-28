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
            alignItems="flex-start"
            flexDirection="column"
            gap={1}
            flexGrow={1}
            paddingY={1}
            paddingX={2}
            width='100%'
        >
            <box borderColor="white" flexGrow={1} width='100%'>
                <input id="search-box" placeholder="Search bookmarks... or press tab to add a new entry" wrapMode="char"></input>
            </box>

            <box borderColor="white" flexGrow={1} width='100%' maxHeight="50%">
                <text>details</text>
                <text>url: https://example.com</text>
                <text>description: Example website for testing.</text>
                <text>tags: example, test</text>
            </box>
        </box>
    );
}