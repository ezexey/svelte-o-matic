import { Adapter } from '@sveltejs/kit';

export interface AdapterOptions {
  /**
   * Build output directory
   * @default '.svelte-kit/platformatic'
   */
  out?: string;
  
  /**
   * Service ID for Platformatic Runtime
   * @default 'sveltekit-app'
   */
  serviceId?: string;
  
  /**
   * Generate platformatic.sveltekit.json config file
   * @default true
   */
  includeConfig?: boolean;
  
  /**
   * Path for generated config file
   * @default 'platformatic.sveltekit.json'
   */
  configPath?: string;
}

export default function plugin(options?: AdapterOptions): Adapter;