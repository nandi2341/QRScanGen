import { ParsedResult, ParsedContentType } from '../../types/parser';

export class SmartParser {
  static parse(raw: string): ParsedResult {
    if (!raw || typeof raw !== 'string') {
      return {
        type: 'TEXT',
        label: 'Plain Text',
        rawContent: raw || '',
        displayFields: [{ label: 'Content', value: raw || '' }]
      };
    }

    const content = raw.trim();

    // 1. Wi-Fi
    if (content.startsWith('WIFI:')) {
      const wifiData = SmartParser.parseWifi(content);
      return {
        type: 'WIFI',
        label: 'Wi-Fi Network',
        rawContent: raw,
        details: wifiData,
        displayFields: [
          { label: 'SSID', value: wifiData.ssid },
          { label: 'Password', value: wifiData.password || '(None)' },
          { label: 'Security', value: wifiData.encryption },
          { label: 'Hidden', value: wifiData.hidden ? 'Yes' : 'No' }
        ]
      };
    }

    // 2. vCard
    if (content.toUpperCase().includes('BEGIN:VCARD')) {
      const vcard = SmartParser.parseVCard(content);
      const fields: { label: string; value: string; isLink?: boolean }[] = [];
      if (typeof vcard.fn === 'string') fields.push({ label: 'Full Name', value: vcard.fn });
      if (typeof vcard.org === 'string') fields.push({ label: 'Organization', value: vcard.org });
      if (typeof vcard.title === 'string') fields.push({ label: 'Title', value: vcard.title });
      if (Array.isArray(vcard.tel) && vcard.tel.length > 0) fields.push({ label: 'Phone', value: vcard.tel.join(', ') });
      if (Array.isArray(vcard.email) && vcard.email.length > 0) fields.push({ label: 'Email', value: vcard.email.join(', ') });
      if (Array.isArray(vcard.url) && vcard.url.length > 0) fields.push({ label: 'Website', value: vcard.url.join(', '), isLink: true });
      if (Array.isArray(vcard.adr) && vcard.adr.length > 0) fields.push({ label: 'Address', value: vcard.adr.join('; ') });

      return {
        type: 'VCARD',
        label: 'vCard Contact',
        rawContent: raw,
        details: vcard,
        displayFields: fields.length > 0 ? fields : [{ label: 'Raw Contact', value: content }]
      };
    }

    // 3. MeCard
    if (content.toUpperCase().startsWith('MECARD:')) {
      const mecard = SmartParser.parseMeCard(content);
      return {
        type: 'MECARD',
        label: 'MeCard Contact',
        rawContent: raw,
        details: mecard,
        displayFields: [
          { label: 'Name', value: mecard.name || 'N/A' },
          { label: 'Phone', value: mecard.tel || 'N/A' },
          { label: 'Email', value: mecard.email || 'N/A' },
          { label: 'Address', value: mecard.address || 'N/A' }
        ]
      };
    }

    // 4. Calendar Event
    if (content.toUpperCase().includes('BEGIN:VEVENT')) {
      const event = SmartParser.parseCalendar(content);
      return {
        type: 'CALENDAR',
        label: 'Calendar Event',
        rawContent: raw,
        details: event,
        displayFields: [
          { label: 'Title', value: event.summary || 'Event' },
          { label: 'Location', value: event.location || 'N/A' },
          { label: 'Start Time', value: event.dtstart || 'N/A' },
          { label: 'End Time', value: event.dtend || 'N/A' },
          { label: 'Description', value: event.description || 'N/A' }
        ]
      };
    }

    // 5. URL / Web Link
    if (/^(https?:\/\/|ftp:\/\/)[^\s/$.?#].[^\s]*$/i.test(content) || /^(www\.)[^\s/$.?#].[^\s]*$/i.test(content)) {
      const url = content.startsWith('www.') ? `https://${content}` : content;
      return {
        type: 'URL',
        label: 'Web Link / URL',
        rawContent: raw,
        displayFields: [{ label: 'URL', value: url, isLink: true }]
      };
    }

    // 6. Email (mailto: or raw email)
    if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/i.test(content) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content)) {
      const email = content.replace(/^mailto:/i, '');
      return {
        type: 'EMAIL',
        label: 'Email Address',
        rawContent: raw,
        displayFields: [{ label: 'Email', value: email, isLink: true }]
      };
    }

    // 7. Phone (tel: or digits/phone pattern)
    if (/^tel:[+0-9\-\s()]+/i.test(content) || /^(\+[0-9]{1,3}|0)[0-9\-\s()]{7,15}$/.test(content)) {
      const phone = content.replace(/^tel:/i, '');
      return {
        type: 'PHONE',
        label: 'Phone Number',
        rawContent: raw,
        displayFields: [{ label: 'Phone', value: phone, isLink: true }]
      };
    }

    // 8. SMS (smsto: or sms:)
    if (/^(sms|smsto):[+0-9]+/i.test(content)) {
      const parts = content.split(':');
      const target = parts[1]?.split('?')[0] || '';
      const bodyParam = parts[1]?.includes('body=') ? parts[1].split('body=')[1] : '';
      return {
        type: 'SMS',
        label: 'SMS Message',
        rawContent: raw,
        displayFields: [
          { label: 'Recipient', value: target },
          { label: 'Message', value: decodeURIComponent(bodyParam) }
        ]
      };
    }

    // 9. Geo Location (geo:lat,lng)
    if (/^geo:[-+]?[0-9]*\.?[0-9]+,[-+]?[0-9]*\.?[0-9]+/i.test(content)) {
      const coords = content.replace(/^geo:/i, '').split('?')[0].split(',');
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      return {
        type: 'GEO',
        label: 'Geo Location',
        rawContent: raw,
        details: { latitude: lat, longitude: lng },
        displayFields: [
          { label: 'Latitude', value: String(lat) },
          { label: 'Longitude', value: String(lng) },
          { label: 'Maps Link', value: `https://maps.google.com/?q=${lat},${lng}`, isLink: true }
        ]
      };
    }

    // 10. Crypto - Bitcoin
    if (/^(bitcoin:)?(1[1-9A-HJ-NP-Za-km-z]{25,34}|3[1-9A-HJ-NP-Za-km-z]{25,34}|bc1[a-z0-9]{39,59})/i.test(content)) {
      return {
        type: 'CRYPTO_BITCOIN',
        label: 'Bitcoin Address',
        rawContent: raw,
        displayFields: [{ label: 'BTC Address', value: content.replace(/^bitcoin:/i, '') }]
      };
    }

    // 11. Crypto - Ethereum
    if (/^(ethereum:)?(0x[a-fA-F0-9]{40})/i.test(content)) {
      return {
        type: 'CRYPTO_ETHEREUM',
        label: 'Ethereum Address',
        rawContent: raw,
        displayFields: [{ label: 'ETH Address', value: content.replace(/^ethereum:/i, '') }]
      };
    }

    // 12. JWT (JSON Web Token)
    if (/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(content)) {
      try {
        const parts = content.split('.');
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return {
          type: 'JWT',
          label: 'JWT Token',
          rawContent: raw,
          details: { header, payload, signature: parts[2] },
          displayFields: [
            { label: 'Header', value: JSON.stringify(header, null, 2) },
            { label: 'Payload', value: JSON.stringify(payload, null, 2) }
          ]
        };
      } catch {
        // Not valid JWT JSON
      }
    }

    // 13. UUID
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(content)) {
      return {
        type: 'UUID',
        label: 'UUID Identifier',
        rawContent: raw,
        displayFields: [{ label: 'UUID', value: content }]
      };
    }

    // 14. JSON
    if ((content.startsWith('{') && content.endsWith('}')) || (content.startsWith('[') && content.endsWith(']'))) {
      try {
        const parsedJson = JSON.parse(content);
        return {
          type: 'JSON',
          label: 'JSON Data',
          rawContent: raw,
          details: { json: parsedJson },
          displayFields: [{ label: 'Formatted JSON', value: JSON.stringify(parsedJson, null, 2) }]
        };
      } catch {
        // Fallback
      }
    }

    // 15. XML
    if (content.startsWith('<') && content.endsWith('>') && /<[a-z][\s\S]*>/i.test(content)) {
      return {
        type: 'XML',
        label: 'XML Document',
        rawContent: raw,
        displayFields: [{ label: 'XML Content', value: content }]
      };
    }

    // 16. Hexadecimal
    if (/^(0x)?[0-9a-fA-F]{8,}$/.test(content) && content.length % 2 === 0) {
      return {
        type: 'HEXADECIMAL',
        label: 'Hexadecimal String',
        rawContent: raw,
        displayFields: [{ label: 'Hex', value: content }]
      };
    }

    // 17. Binary
    if (/^[01\s]{8,}$/.test(content) && content.replace(/\s+/g, '').length % 8 === 0) {
      return {
        type: 'BINARY',
        label: 'Binary Code',
        rawContent: raw,
        displayFields: [{ label: 'Binary', value: content }]
      };
    }

    // 18. Base64
    if (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(content) && content.length > 12) {
      try {
        const decoded = atob(content);
        if (/^[\x20-\x7E\s]*$/.test(decoded)) {
          return {
            type: 'BASE64',
            label: 'Base64 Encoded Text',
            rawContent: raw,
            displayFields: [
              { label: 'Decoded Value', value: decoded }
            ]
          };
        }
      } catch {
        // Fallback
      }
    }

    // 19. Plain Text
    return {
      type: 'TEXT',
      label: 'Plain Text',
      rawContent: raw,
      displayFields: [{ label: 'Text Content', value: content }]
    };
  }

  private static parseWifi(content: string) {
    const ssidMatch = content.match(/S:([^;]+)/);
    const passMatch = content.match(/P:([^;]+)/);
    const typeMatch = content.match(/T:([^;]+)/);
    const hiddenMatch = content.match(/H:(true|false)/i);
    return {
      ssid: ssidMatch ? ssidMatch[1] : '',
      password: passMatch ? passMatch[1] : '',
      encryption: typeMatch ? typeMatch[1] : 'WPA',
      hidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === 'true' : false
    };
  }

  private static parseVCard(content: string) {
    const lines = content.split(/\r?\n/);
    const result: Record<string, string | string[]> = {};
    for (const line of lines) {
      if (line.startsWith('FN:')) result.fn = line.substring(3);
      if (line.startsWith('N:')) result.n = line.substring(2);
      if (line.startsWith('ORG:')) result.org = line.substring(4);
      if (line.startsWith('TITLE:')) result.title = line.substring(6);
      if (line.includes('TEL:')) {
        const val = line.split('TEL:')[1] || line.split('TEL;')[1]?.split(':')[1] || '';
        if (!result.tel) result.tel = [];
        (result.tel as string[]).push(val);
      }
      if (line.includes('EMAIL:')) {
        const val = line.split('EMAIL:')[1] || line.split('EMAIL;')[1]?.split(':')[1] || '';
        if (!result.email) result.email = [];
        (result.email as string[]).push(val);
      }
      if (line.includes('URL:')) {
        const val = line.split('URL:')[1] || '';
        if (!result.url) result.url = [];
        (result.url as string[]).push(val);
      }
      if (line.includes('ADR:')) {
        const val = line.split('ADR:')[1] || '';
        if (!result.adr) result.adr = [];
        (result.adr as string[]).push(val);
      }
    }
    return result;
  }

  private static parseMeCard(content: string) {
    const body = content.replace(/^MECARD:/i, '');
    const fields = body.split(';');
    const res: Record<string, string> = {};
    for (const f of fields) {
      if (f.startsWith('N:')) res.name = f.substring(2);
      if (f.startsWith('TEL:')) res.tel = f.substring(4);
      if (f.startsWith('EMAIL:')) res.email = f.substring(6);
      if (f.startsWith('URL:')) res.url = f.substring(4);
      if (f.startsWith('ADR:')) res.address = f.substring(4);
    }
    return res;
  }

  private static parseCalendar(content: string) {
    const lines = content.split(/\r?\n/);
    const res: Record<string, string> = {};
    for (const l of lines) {
      if (l.startsWith('SUMMARY:')) res.summary = l.substring(8);
      if (l.startsWith('DESCRIPTION:')) res.description = l.substring(12);
      if (l.startsWith('LOCATION:')) res.location = l.substring(9);
      if (l.startsWith('DTSTART:')) res.dtstart = l.substring(8);
      if (l.startsWith('DTEND:')) res.dtend = l.substring(6);
    }
    return res;
  }
}
