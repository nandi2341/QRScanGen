export type ParsedContentType =
  | 'URL'
  | 'EMAIL'
  | 'PHONE'
  | 'SMS'
  | 'WIFI'
  | 'GEO'
  | 'VCARD'
  | 'MECARD'
  | 'CALENDAR'
  | 'JSON'
  | 'XML'
  | 'BASE64'
  | 'ASCII'
  | 'BINARY'
  | 'HEXADECIMAL'
  | 'JWT'
  | 'UUID'
  | 'CRYPTO_BITCOIN'
  | 'CRYPTO_ETHEREUM'
  | 'TEXT';

export interface WifiParsedDetails {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass' | string;
  hidden?: boolean;
}

export interface VCardParsedDetails {
  fn?: string;
  n?: string;
  org?: string;
  title?: string;
  tel?: string[];
  email?: string[];
  url?: string[];
  adr?: string[];
  note?: string;
}

export interface MeCardParsedDetails {
  name?: string;
  tel?: string;
  email?: string;
  url?: string;
  address?: string;
  memo?: string;
}

export interface CalendarEventParsedDetails {
  summary?: string;
  description?: string;
  location?: string;
  dtstart?: string;
  dtend?: string;
}

export interface GeoParsedDetails {
  latitude: number;
  longitude: number;
  altitude?: number;
  query?: string;
}

export interface EmailParsedDetails {
  to: string;
  subject?: string;
  body?: string;
}

export interface SmsParsedDetails {
  phoneNumber: string;
  message?: string;
}

export interface JwtParsedHeaderPayload {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export interface ParsedResult {
  type: ParsedContentType;
  label: string;
  rawContent: string;
  details?: Record<string, unknown>;
  displayFields?: { label: string; value: string; isLink?: boolean }[];
}
