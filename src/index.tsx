import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot } from "@opentui/react";
import "@opentui/react/runtime-plugin-support";
import LeftSideBar from "./components/LeftSideBar";

function App() {

  return (
    <box justifyContent="space-evenly" alignItems="center" flexDirection="row" flexGrow={1}>
      <LeftSideBar />
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
