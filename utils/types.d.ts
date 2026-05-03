// MCreator 类型定义

export interface SiteConfig {
  site: {
    name: string;
    domain?: string;
    language?: string;
  };
  storage: {
    primary?: string;
    backup?: string;
    local?: string;
  };
  cdn?: {
    provider: 'oss' | 'aws' | 'custom';
    bucket?: string;
    region?: string;
    prefix?: string;
  };
  fonts: {
    strategy?: 'A' | 'B' | 'C';
    family?: string;
    subsets?: string[];
  };
  features?: string[];
  _warning?: string;
}

export interface Component {
  type: 'global' | 'cn';
  name: string;
  render(): void;
}

export interface FallbackImageOptions {
  fallback1?: string;
  fallback2?: string;
  fallback3?: string;
  lazy?: boolean;
  priority?: 'high' | 'low';
}

export interface DebounceOptions {
  delay: number;
  immediate?: boolean;
}

export interface ThrottleOptions {
  limit: number;
}
