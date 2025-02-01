export interface MenuItem {
    title: string;
    url?: string;
    icon: React.ComponentType;
    action?: () => void;
  }
  