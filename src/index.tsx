import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "@opentui/react/runtime-plugin-support";
import BottomBar from "./components/BottomBar";
import BigArea from "./components/BigArea";

function App() {

  return (
    <box justifyContent="center" alignItems="center" alignSelf="center" flexDirection="column" flexGrow={1} maxHeight="100%" width={100}>
      <ascii-font id="title" text="bookmark manager" font="shade" />
      <BigArea />
      <BottomBar />
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
