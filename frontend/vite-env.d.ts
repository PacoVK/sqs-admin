/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
