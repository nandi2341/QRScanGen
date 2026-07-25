import React, { useEffect } from 'react';
import { useGeneratorStore } from '../../stores/useGeneratorStore';
import { GeneratorContentType } from '../../types/generator';
import { Globe, Wifi, User, Mail, MessageSquare, Phone, MapPin, Calendar, Coins, Barcode, AlignLeft } from 'lucide-react';

export const ContentTypeForm: React.FC = () => {
  const { contentType, rawContent, setContentType, setRawContent } = useGeneratorStore();

  const types: { id: GeneratorContentType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'URL', label: 'URL Link', icon: Globe },
    { id: 'TEXT', label: 'Plain Text', icon: AlignLeft },
    { id: 'WIFI', label: 'Wi-Fi', icon: Wifi },
    { id: 'VCARD', label: 'vCard Contact', icon: User },
    { id: 'EMAIL', label: 'Email', icon: Mail },
    { id: 'SMS', label: 'SMS', icon: MessageSquare },
    { id: 'PHONE', label: 'Phone', icon: Phone },
    { id: 'GEO', label: 'Geo Location', icon: MapPin },
    { id: 'EVENT', label: 'Calendar Event', icon: Calendar },
    { id: 'CRYPTO', label: 'Crypto Payment', icon: Coins },
    { id: 'BARCODE', label: 'Barcode', icon: Barcode },
  ];

  // Specific state builders for complex types
  const [wifiSsid, setWifiSsid] = React.useState('MyHomeWiFi');
  const [wifiPass, setWifiPass] = React.useState('SecretPassword123');
  const [wifiEnc, setWifiEnc] = React.useState('WPA');

  const [vFirstName, setVFirstName] = React.useState('John');
  const [vLastName, setVLastName] = React.useState('Doe');
  const [vOrg, setVOrg] = React.useState('TechCorp');
  const [vPhone, setVPhone] = React.useState('+1234567890');
  const [vEmail, setVEmail] = React.useState('john@example.com');

  useEffect(() => {
    if (contentType === 'WIFI') {
      setRawContent(`WIFI:S:${wifiSsid};T:${wifiEnc};P:${wifiPass};;`);
    } else if (contentType === 'VCARD') {
      setRawContent(`BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName}\nFN:${vFirstName} ${vLastName}\nORG:${vOrg}\nTEL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`);
    }
  }, [contentType, wifiSsid, wifiPass, wifiEnc, vFirstName, vLastName, vOrg, vPhone, vEmail, setRawContent]);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
      {/* Category selector pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {types.map((t) => {
          const Icon = t.icon;
          const isActive = contentType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setContentType(t.id)}
              className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs according to content type */}
      {contentType === 'WIFI' && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="SSID / Network Name"
            value={wifiSsid}
            onChange={(e) => setWifiSsid(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Password"
            value={wifiPass}
            onChange={(e) => setWifiPass(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <select
            value={wifiEnc}
            onChange={(e) => setWifiEnc(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="WPA">WPA / WPA2 / WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None (Open)</option>
          </select>
        </div>
      )}

      {contentType === 'VCARD' && (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="First Name"
            value={vFirstName}
            onChange={(e) => setVFirstName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={vLastName}
            onChange={(e) => setVLastName(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Organization / Company"
            value={vOrg}
            onChange={(e) => setVOrg(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={vPhone}
            onChange={(e) => setVPhone(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={vEmail}
            onChange={(e) => setVEmail(e.target.value)}
            className="col-span-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>
      )}

      {(contentType === 'URL' || contentType === 'TEXT' || contentType === 'BARCODE' || contentType === 'EMAIL' || contentType === 'SMS' || contentType === 'PHONE' || contentType === 'GEO' || contentType === 'EVENT' || contentType === 'CRYPTO') && (
        <textarea
          rows={3}
          value={rawContent}
          onChange={(e) => setRawContent(e.target.value)}
          placeholder={`Enter ${contentType} content...`}
          className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 font-mono resize-none"
        />
      )}
    </div>
  );
};
