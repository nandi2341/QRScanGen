import { CodeFormat } from './database';

export type GeneratorContentType =
  | 'TEXT'
  | 'URL'
  | 'WIFI'
  | 'VCARD'
  | 'EMAIL'
  | 'SMS'
  | 'PHONE'
  | 'GEO'
  | 'EVENT'
  | 'CRYPTO'
  | 'BARCODE';

export interface QRCodeStyleConfig {
  width: number;
  height: number;
  margin: number;
  dotsColor: string;
  dotsType: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
  backgroundColor: string;
  cornersSquareColor: string;
  cornersSquareType: 'square' | 'dot' | 'extra-rounded';
  cornersDotColor: string;
  cornersDotType: 'square' | 'dot';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  logoUrl?: string;
  logoMargin?: number;
  logoSize?: number;
}

export interface BarcodeStyleConfig {
  format: 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39' | 'ITF' | 'MSI' | 'PHARMACODE';
  lineColor: string;
  background: string;
  width: number;
  height: number;
  displayValue: boolean;
  fontSize: number;
  margin: number;
}
