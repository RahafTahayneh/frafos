export type SIPCodesTypes =
  | { code: 100; message: "trying"; color: "#b3c2bf" }
  | { code: 180; message: "ringing"; color: "#b1b5c3" }
  | { code: 183; message: "session-progress"; color: "#a3a7b0" }
  | { code: 200; message: "ok"; color: "green" }
  | { code: 300; message: "multiple-choices"; color: "#c2b3b9" }
  | { code: 301; message: "moved-permanently"; color: "#c1a5a2" }
  | { code: 302; message: "moved-temporarily"; color: "#b7c1a8" }
  | { code: 305; message: "use-proxy"; color: "#b7a6c2" }
  | { code: 400; message: "bad-request"; color: "#c3b4a6" }
  | { code: 401; message: "unauthorized"; color: "#a9c1b5" }
  | { code: 403; message: "forbidden"; color: "#c1b6a9" }
  | { code: 404; message: "not-found"; color: "#a6b9c2" }
  | { code: 408; message: "request-timeout"; color: "#c1b8a3" }
  | { code: 486; message: "busy-here"; color: "#b8c1a7" }
  | { code: 500; message: "server-internal-error"; color: "#c1a8b7" }
  | { code: 503; message: "service-unavailable"; color: "#a7b7c0" }
  | { code: 600; message: "busy-everywhere"; color: "#b9c1a5" }
  | { code: 603; message: "decline"; color: "#b5c1a9" };
