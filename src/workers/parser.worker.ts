import { SmartParser } from '../services/parser/smartParser';

self.onmessage = (event: MessageEvent<{ id: string; action: 'PARSE'; raw: string }>) => {
  const { id, action, raw } = event.data;
  if (action === 'PARSE') {
    const result = SmartParser.parse(raw);
    self.postMessage({ id, result });
  }
};
