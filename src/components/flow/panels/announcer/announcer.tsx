import { useFlowStore } from "@store/flowStore";
import { useEffect, useRef } from "react";

/**
 * SR-only live announcer. Reads messages queued in store.
 */
export default function Announcer() {
  const messages = useFlowStore((s) => s.announcer);
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // render messages automatically via React mapping
  }, [messages]);

  return (
    <>
      <div
        ref={politeRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {messages
          .filter((m) => m.politeness !== "assertive")
          .map((m) => (
            <div key={m.id}>{m.text}</div>
          ))}
      </div>
      <div
        ref={assertiveRef}
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      >
        {messages
          .filter((m) => m.politeness === "assertive")
          .map((m) => (
            <div key={m.id}>{m.text}</div>
          ))}
      </div>
    </>
  );
}
