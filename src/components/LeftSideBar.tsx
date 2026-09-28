export default function SideBar() {

    const minWidth = 30;
    const maxWidth = 50;

    return (
        // The outer box acts as the overall container boundary
        <box
            id="left-sidebar-box"
            justifyContent="space-evenly"
            alignItems="flex-start"
            flexDirection="column"
            gap={1}
            minWidth={minWidth}
            maxWidth={maxWidth}
        >
            <box borderColor="white" padding={1} flexDirection="column" width='100%'>
                <input id="search-box" placeholder="Search bookmarks..."></input>
            </box>

            <box borderColor="white" padding={1} flexDirection="column" width='100%'>
                <scrollbox height={10} padding={1}>
                    <text>Welcome to Bookmark manager!</text>
                </scrollbox>
            </box>

            <box borderColor="white" padding={1} flexDirection="column" width='100%'>
                <text>Bookmarks</text>
            </box>
        </box>
    );
}