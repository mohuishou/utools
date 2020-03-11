import { Feature } from "./feature";

export interface Plugin {
  pluginName: string;
  description: string;
  version: string;
  preload: string;
  author: string;
  homepage: string;
  logo: string;
  output: string;
  features: Feature[];
}
