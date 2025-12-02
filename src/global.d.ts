import type Echo from "laravel-echo";

declare global {
  interface Window {
    Echo: Echo;
  }
}

declare module 'dayjs-plugin-utc' {
  import { PluginFunc } from 'dayjs';
  const plugin: PluginFunc;
  export default plugin;
}