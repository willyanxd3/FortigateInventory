// Whitelist related types
export interface WhitelistItem {
  id: number;
  name: string;
  macs: string[];
  created_at: string;
}

// API responses for whitelist operations
export interface WhitelistApiResponse {
  success: boolean;
  whitelist: WhitelistItem[];
}

export interface WhitelistOperationResponse {
  success: boolean;
  message: string;
  whitelist?: WhitelistItem;
}