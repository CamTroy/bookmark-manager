export default function ButtonGuide({ bottomMode }: { bottomMode: boolean }) {
  return (
    <>
      {bottomMode ? (
        <box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="space-between"
          flexWrap="wrap"
        >
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              TAB
            </text>
            <text> Add/Search </text>
          </box>
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              RETURN
            </text>
            <text> Save </text>
          </box>
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              UP
            </text>
            <text> Browse </text>
          </box>
        </box>
      ) : (
        <box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="space-between"
          flexWrap="wrap"
        >
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              TAB
            </text>
            <text> Add/Search </text>
          </box>
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              RETURN
            </text>
            <text> Open in default browser </text>
          </box>
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              SPACE
            </text>
            <text> Copy bookmark link </text>
          </box>
          <box flexDirection="row" paddingX={3}>
            <text bg={"white"} fg={"black"}>
              Arrow keys
            </text>
            <text> Navigate </text>
          </box>
        </box>
      )}
    </>
  );
}
