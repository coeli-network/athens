import { Hono } from "hono";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props?: { title?: string }): Response;
  }
}

declare module "urbit-ob" {
  export function isValidPatp(name: string): boolean;
  export function patp2dec(name: string): string;
  export function dec2patp(num: string | number): string;
  export function clan(name: string): string;
  export function sein(name: string): string;
}
