/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@react-pdf/renderer' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Document: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Page: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Text: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const View: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const StyleSheet: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Svg: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Circle: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Path: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Link: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const pdf: any;
}
