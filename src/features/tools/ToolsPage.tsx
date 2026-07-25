import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Lock, Unlock, Hash, Code, GitCompare, ArrowRightLeft, Copy, Check } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'encode' | 'crypto' | 'compare'>('encode');

  // Encoders/Decoders State
  const [encodeInput, setEncodeInput] = useState('Hello QR Scanner Pro');
  const [encodeMode, setEncodeMode] = useState<'base64' | 'url' | 'hex' | 'binary' | 'html'>('base64');
  const [encodeOutput, setEncodeOutput] = useState('');

  // Crypto State
  const [cryptoInput, setCryptoInput] = useState('Secret Data');
  const [cryptoKey, setCryptoKey] = useState('MyPassphrase123');
  const [aesOutput, setAesOutput] = useState('');
  const [hashOutput, setHashOutput] = useState({ sha256: '', sha512: '', md5: '' });

  // Compare State
  const [compareA, setCompareA] = useState('https://example.com/qr1');
  const [compareB, setCompareB] = useState('https://example.com/qr2');

  const [copied, setCopied] = useState(false);

  // Encode / Decode Execution
  const handleEncode = () => {
    try {
      if (encodeMode === 'base64') setEncodeOutput(btoa(encodeInput));
      else if (encodeMode === 'url') setEncodeOutput(encodeURIComponent(encodeInput));
      else if (encodeMode === 'hex') setEncodeOutput(CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(encodeInput)));
      else if (encodeMode === 'binary') setEncodeOutput(encodeInput.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '));
      else if (encodeMode === 'html') setEncodeOutput(encodeInput.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';'));
    } catch {
      setEncodeOutput('Encoding error');
    }
  };

  const handleDecode = () => {
    try {
      if (encodeMode === 'base64') setEncodeOutput(atob(encodeInput));
      else if (encodeMode === 'url') setEncodeOutput(decodeURIComponent(encodeInput));
      else if (encodeMode === 'hex') setEncodeOutput(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(encodeInput)));
      else if (encodeMode === 'binary') setEncodeOutput(encodeInput.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join(''));
      else if (encodeMode === 'html') setEncodeOutput(encodeInput);
    } catch {
      setEncodeOutput('Decoding error');
    }
  };

  // Encrypt / Decrypt
  const handleEncryptAES = () => {
    if (!cryptoInput || !cryptoKey) return;
    const encrypted = CryptoJS.AES.encrypt(cryptoInput, cryptoKey).toString();
    setAesOutput(encrypted);
  };

  const handleDecryptAES = () => {
    if (!cryptoInput || !cryptoKey) return;
    try {
      const bytes = CryptoJS.AES.decrypt(cryptoInput, cryptoKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      setAesOutput(decrypted || 'Invalid key or payload');
    } catch {
      setAesOutput('Decryption failed');
    }
  };

  const handleGenerateHashes = () => {
    if (!cryptoInput) return;
    setHashOutput({
      sha256: CryptoJS.SHA256(cryptoInput).toString(),
      sha512: CryptoJS.SHA512(cryptoInput).toString(),
      md5: CryptoJS.MD5(cryptoInput).toString()
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compare diff logic
  const isIdentical = compareA === compareB;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex gap-2 p-1.5 glass-panel rounded-2xl border border-slate-800 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('encode')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'encode' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" /> Encoders
        </button>

        <button
          onClick={() => setActiveTab('crypto')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'crypto' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" /> Encryption & Hashes
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'compare' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitCompare className="w-4 h-4" /> QR Compare
        </button>
      </div>

      {/* Tab 1: Encoders/Decoders */}
      {activeTab === 'encode' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" /> Data Encoders & Decoders
            </h3>
            <select
              value={encodeMode}
              onChange={(e) => setEncodeMode(e.target.value as unknown as typeof encodeMode)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="base64">Base64</option>
              <option value="url">URL Encoding</option>
              <option value="hex">Hexadecimal</option>
              <option value="binary">Binary</option>
              <option value="html">HTML Entities</option>
            </select>
          </div>

          <textarea
            rows={3}
            value={encodeInput}
            onChange={(e) => setEncodeInput(e.target.value)}
            placeholder="Enter input text..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none font-mono"
          />

          <div className="flex gap-2">
            <button
              onClick={handleEncode}
              className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Encode
            </button>
            <button
              onClick={handleDecode}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
            >
              Decode
            </button>
          </div>

          {encodeOutput && (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Result ({encodeMode.toUpperCase()})</span>
                <button onClick={() => copyToClipboard(encodeOutput)} className="text-cyan-400 hover:text-cyan-300">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-200 font-mono break-all">{encodeOutput}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AES & Hashes */}
      {activeTab === 'crypto' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" /> Web Crypto API & Hashing Tools
          </h3>

          <textarea
            rows={2}
            value={cryptoInput}
            onChange={(e) => setCryptoInput(e.target.value)}
            placeholder="Input text payload..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none font-mono"
          />

          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Encryption Key / Passphrase"
              value={cryptoKey}
              onChange={(e) => setCryptoKey(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none font-mono"
            />
            <button
              onClick={handleEncryptAES}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" /> Encrypt AES
            </button>
            <button
              onClick={handleDecryptAES}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1"
            >
              <Unlock className="w-3.5 h-3.5" /> Decrypt AES
            </button>
          </div>

          {aesOutput && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase">AES Output</span>
              <p className="text-xs text-slate-200 font-mono break-all">{aesOutput}</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <button
              onClick={handleGenerateHashes}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
            >
              <Hash className="w-4 h-4 text-cyan-400" /> Calculate SHA-256 / SHA-512 / MD5 Hashes
            </button>

            {hashOutput.sha256 && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">SHA-256</span>
                  <p className="text-slate-200 break-all">{hashOutput.sha256}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">MD5</span>
                  <p className="text-slate-200 break-all">{hashOutput.md5}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: QR Compare Tool */}
      {activeTab === 'compare' && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-cyan-400" /> QR Code Side-by-Side Comparator
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Entry A</label>
              <textarea
                rows={4}
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">Entry B</label>
              <textarea
                rows={4}
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-center font-bold text-sm flex items-center justify-center gap-2 ${
            isIdentical ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <ArrowRightLeft className="w-5 h-5" />
            <span>{isIdentical ? 'Identical Data Match' : 'Difference Detected Between Entries'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
