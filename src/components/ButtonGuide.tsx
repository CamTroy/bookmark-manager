export default function ButtonGuide({ bottomMode }: { bottomMode: boolean }) {
  return (
    <box
      flexDirection="row"
      flexGrow={1}
      justifyContent="space-evenly"
      alignItems="flex-start"
    >
      {/* I eventually want to replace the whole blocking user from using the "navKeys" with two modes the user can switch between, perhaps by pressing 'up' while in the search box and 'ctrl+space' while browsing bookmarks to go back to search mode. bottomMode sounds funnier so that's why I am keeping it. */}
      {bottomMode ?
        <></>
        :
        <></>
      }
    </box>
  );
}
