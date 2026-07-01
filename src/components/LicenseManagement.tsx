import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Download, 
  Clock, 
  RefreshCw, 
  ShieldAlert, 
  FileJson, 
  Lock, 
  CheckCircle, 
  X, 
  Copy, 
  Sliders 
} from 'lucide-react';
import { License, LicenseType, Company } from '../types';

interface LicenseProps {
  licenses: License[];
  companies: Company[];
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>;
  logAudit: (action: string, module: string) => void;
}

export default function LicenseManagement({ 
  licenses, 
  companies, 
  setLicenses,
  logAudit 
}: LicenseProps) {
  
  // State for License Form Modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [newLicense, setNewLicense] = useState({
    companyName: '',
    type: 'Monthly' as LicenseType,
    userLimit: 10,
    deviceLimit: 5,
    days: 30
  });

  // State for showing exported raw certificate
  const [selectedExportLicense, setSelectedExportLicense] = useState<License | null>(null);

  // Helper to generate a dummy RSA signature
  const generateSignature = (company: string, type: string) => {
    const rawData = `${company}:${type}:${Date.now()}`;
    // Simple hash-like representation of an RSA-2048 private key signature
    let hash = 0;
    for (let i = 0; i < rawData.length; i++) {
      hash = (hash << 5) - hash + rawData.charCodeAt(i);
      hash |= 0;
    }
    return `SIG_RSA2048_AES256_${Math.abs(hash).toString(16).toUpperCase()}_${Math.floor(100000 + Math.random() * 900000)}`;
  };

  // Generate License action
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLicense.companyName) return;

    const activation = new Date();
    const expiry = new Date();
    
    // Set expiry based on days/type
    let actualDays = Number(newLicense.days);
    if (newLicense.type === 'Trial') actualDays = 2; // Strict 2 days Trial limit
    expiry.setDate(activation.getDate() + actualDays);

    const generatedId = 'LIC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const signature = generateSignature(newLicense.companyName, newLicense.type);

    const item: License = {
      id: generatedId,
      companyName: newLicense.companyName,
      type: newLicense.type,
      activationDate: activation.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      deviceLimit: Number(newLicense.deviceLimit),
      userLimit: Number(newLicense.userLimit),
      digitalSignature: signature,
      status: 'Active'
    };

    setLicenses(prev => [item, ...prev]);
    logAudit(`Generated secure ${newLicense.type} License for "${newLicense.companyName}" with Signature. ID: ${generatedId}`, 'Licenses');
    setShowGenModal(false);
  };

  // Renew License Action
  const renewLicense = (id: string, type: LicenseType) => {
    const renewDays = type === 'Trial' ? 2 : type === 'Monthly' ? 30 : type === 'Yearly' ? 365 : 9999;
    
    setLicenses(prev => prev.map(l => {
      if (l.id === id) {
        const currentExp = new Date(l.expiryDate);
        currentExp.setDate(currentExp.getDate() + renewDays);
        return {
          ...l,
          expiryDate: currentExp.toISOString().split('T')[0],
          status: 'Active',
          digitalSignature: generateSignature(l.companyName, type) // Update signature too
        };
      }
      return l;
    }));

    const lName = licenses.find(l => l.id === id)?.companyName || id;
    logAudit(`Renewed License: ${id} (${lName}) for an additional period`, 'Licenses');
    alert(`License ${id} successfully renewed with a secure cryptographic key update.`);
  };

  // Suspend License Action
  const suspendLicense = (id: string) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'Suspended' } : l));
    const lName = licenses.find(l => l.id === id)?.companyName || id;
    logAudit(`Suspended license access for company: ${lName} (${id})`, 'Licenses');
  };

  // Revoke License Action
  const revokeLicense = (id: string) => {
    setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'Revoked' } : l));
    const lName = licenses.find(l => l.id === id)?.companyName || id;
    logAudit(`Permanently REVOKED license signature key: ${lName} (${id})`, 'Licenses');
  };

  // Export File (Simulation helper)
  const getEncryptedLicFormat = (lic: License) => {
    return JSON.stringify({
      DISTROHUB_LICENSE_ID: lic.id,
      COMPANY_NAME: lic.companyName,
      LICENSE_TYPE: lic.type,
      ISSUED_AT: lic.activationDate,
      EXPIRES_AT: lic.expiryDate,
      DEVICE_LIMIT: lic.deviceLimit,
      USER_LIMIT: lic.userLimit,
      RSA_SIGNATURE: lic.digitalSignature,
      SERVER_AES_KEY_HASH: "09A1F8813CBE0E2A1237A99B99E8F3C8821B2F9",
      APP_COMPLIANCE_CHECKS: [
        "VERIFY_SIGNATURE_OK",
        "HW_UUID_COMPLIANT_YES",
        "IMMEDIATE_REVOKE_VERIFY"
      ]
    }, null, 2);
  };

  // Save/Download LIC File
  const handleDownloadFile = (lic: License) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(getEncryptedLicFormat(lic));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `distrohub_${lic.companyName.toLowerCase().replace(/ /g, '_')}_${lic.id}.lic`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logAudit(`Exported encrypted physical .LIC file for: ${lic.companyName}`, 'Licenses');
  };

  return (
    <div className="space-y-6" id="licenses-manager">
      {/* Header and Add Action */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Cryptographic License Management
            </h3>
            <p className="text-xs text-slate-500">
              Generate fully signed offline license certificate payloads (.LIC format) bound to distribution hardware and user caps.
            </p>
          </div>
          <button 
            onClick={() => {
              setNewLicense(prev => ({ ...prev, companyName: companies[0]?.name || '' }));
              setShowGenModal(true);
            }}
            className="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5 self-start shadow-xs"
          >
            <Plus className="h-4 w-4" /> Issue New ERP License
          </button>
        </div>
      </div>

      {/* Licenses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="licenses-grid">
        {licenses.map(lic => (
          <div 
            key={lic.id}
            className={`bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all ${
              lic.status === 'Active' 
                ? 'border-slate-100 hover:border-emerald-200' 
                : lic.status === 'Suspended' 
                ? 'border-amber-200 bg-amber-50/10' 
                : 'border-rose-200 bg-rose-50/10'
            }`}
          >
            {/* Upper part */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${
                  lic.type === 'Lifetime' 
                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                    : lic.type === 'Yearly' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : lic.type === 'Monthly' 
                    ? 'bg-blue-50 text-blue-700 border-blue-100' 
                    : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {lic.type} License
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  lic.status === 'Active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : lic.status === 'Suspended' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {lic.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-base">{lic.companyName}</h4>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-slate-400 font-bold">
                  <Lock className="h-3.5 w-3.5 text-blue-500" />
                  ID: {lic.id}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Device Limit</span>
                  <span className="font-bold text-slate-700">{lic.deviceLimit} Devices</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">User Limit</span>
                  <span className="font-bold text-slate-700">{lic.userLimit} Users</span>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issued On:</span>
                  <span className="font-bold text-slate-700 font-mono">{lic.activationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expires On:</span>
                  <span className={`font-bold font-mono ${lic.status === 'Expired' ? 'text-rose-600' : 'text-slate-700'}`}>
                    {lic.expiryDate}
                  </span>
                </div>
              </div>

              {/* Micro-cryptography block */}
              <div className="bg-slate-900 text-[10px] text-slate-300 font-mono p-2.5 rounded border border-slate-800 break-all leading-normal overflow-hidden h-14 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end justify-center pb-1 font-bold text-[8px] tracking-wider text-teal-400 uppercase opacity-100 group-hover:opacity-0 transition-all pointer-events-none">
                  RSA SIGNATURE VALID
                </div>
                {lic.digitalSignature}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-2">
              <div className="flex gap-1">
                <button 
                  onClick={() => handleDownloadFile(lic)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-all"
                  title="Download .LIC File"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setSelectedExportLicense(lic)}
                  className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-all"
                  title="Inspect Raw JSON"
                >
                  <FileJson className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-1.5 text-xs font-bold">
                {lic.status === 'Active' && (
                  <button 
                    onClick={() => suspendLicense(lic.id)}
                    className="text-amber-700 hover:text-amber-800 px-2.5 py-1.5 rounded-lg hover:bg-amber-50"
                  >
                    Suspend
                  </button>
                )}
                {lic.status !== 'Revoked' ? (
                  <>
                    <button 
                      onClick={() => renewLicense(lic.id, lic.type)}
                      className="text-emerald-700 hover:text-emerald-800 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Renew
                    </button>
                    <button 
                      onClick={() => revokeLicense(lic.id)}
                      className="text-rose-700 hover:text-rose-800 px-2.5 py-1.5 rounded-lg hover:bg-rose-50"
                    >
                      Revoke
                    </button>
                  </>
                ) : (
                  <span className="text-slate-400 py-1 px-2">Revoked permanently</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LICENSE GENERATOR MODAL */}
      {showGenModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">Issue Secure Distribution License</h4>
              <button onClick={() => setShowGenModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              {/* Distribution Target */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1 font-sans">Target Distribution Company</label>
                <select 
                  value={newLicense.companyName}
                  onChange={e => setNewLicense(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none"
                  required
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* License Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">License Duration Type</label>
                  <select 
                    value={newLicense.type}
                    onChange={e => {
                      const val = e.target.value as LicenseType;
                      const dVal = val === 'Trial' ? 2 : val === 'Monthly' ? 30 : val === 'Yearly' ? 365 : 9999;
                      setNewLicense(prev => ({ ...prev, type: val, days: dVal }));
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                  >
                    <option value="Trial">Trial (2 Days)</option>
                    <option value="Monthly">Monthly Pack</option>
                    <option value="Yearly">Yearly Pack</option>
                    <option value="Lifetime">Lifetime Unlimited</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Days Validation</label>
                  <input 
                    type="number" 
                    value={newLicense.days}
                    disabled={newLicense.type === 'Trial'} // Trial is strictly locked to 2 days
                    onChange={e => setNewLicense(prev => ({ ...prev, days: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                    min={1}
                  />
                </div>
              </div>

              {/* Devices and Users limit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Device Binding Limit</label>
                  <input 
                    type="number" 
                    value={newLicense.deviceLimit}
                    onChange={e => setNewLicense(prev => ({ ...prev, deviceLimit: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Max Central Users</label>
                  <input 
                    type="number" 
                    value={newLicense.userLimit}
                    onChange={e => setNewLicense(prev => ({ ...prev, userLimit: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:outline-none"
                    min={1}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 text-blue-900 rounded-xl p-3.5 text-xs flex items-start gap-2.5">
                <Sliders className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Compliance Digital Signature Check</span>
                  We will auto-sign this license block using the server's Private Cryptographic RSA-2048 credential.
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowGenModal(false)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                  Discard
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Generate Signed Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT ENCRYPTED JSON EXPORT MODAL */}
      {selectedExportLicense && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-xl w-full overflow-hidden">
            <div className="bg-slate-950 p-4 text-white flex justify-between items-center">
              <h4 className="font-bold text-sm">Offline License Configuration Payload ({selectedExportLicense.id})</h4>
              <button onClick={() => setSelectedExportLicense(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                This signed configuration block is saved in standard **.LIC** structures, and parsed securely by connected SFA/Desktop client frameworks.
              </p>

              <div className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl border border-slate-800 overflow-y-auto max-h-80 relative">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(getEncryptedLicFormat(selectedExportLicense));
                    alert("License string copied to clipboard!");
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-slate-800 text-slate-300 rounded hover:text-white hover:bg-slate-750 transition-all flex items-center gap-1 text-[10px] border border-slate-700"
                >
                  <Copy className="h-3 w-3" /> Copy Base64
                </button>
                <pre className="whitespace-pre-wrap">{getEncryptedLicFormat(selectedExportLicense)}</pre>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setSelectedExportLicense(null)}
                  className="bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
