import { ASCIIFont } from "@opentui/core";

export default function BigArea() {

    return (
        <box
            id="big-area-box"
            justifyContent="space-evenly"
            alignItems="flex-start"
            flexDirection="row"
            flexGrow={1}
            gap={1}
            maxHeight="60%"
        >
            <box borderColor="white" padding={1}  flexDirection="column" flexGrow={1} width='48%'>
                <scrollbox padding={1}>
                    <text>welcome to your bookmark manager!</text>
                </scrollbox>
            </box>
            <box borderColor="white" padding={1} flexDirection="column" flexGrow={1} width='48%'>
                <scrollbox padding={1}>
                    <text>recents</text>
                    <text>recent bookmark 1</text>
                    <text>recent bookmark 2</text>
                    <text>recent bookmark 3</text>
                </scrollbox>
            </box>
        </box>
    );
}