'use client';

import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  requiredFields: string[];
}

export default function OrderForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const templates: Template[] = [
    { id: '1', name: 'Classic Funeral Program', requiredFields: ['deceased_name', 'obituary', 'service_date'] },
    { id: '2', name: 'Elegant Prayer Card', requiredFields: ['deceased_name', 'birth_date', 'death_date'] },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);

    const file = e.target.files[0];
    const formDataPayload = new FormData();
    formDataPayload.append('file', file);
    formDataPayload.append('templateId', selectedTemplate?.id || '');

    try {
      const response = await fetch('/api/orders/extract', {
        method: 'POST',
        body: formDataPayload,
      });
      const extractedData = await response.json();
      setFormData(extractedData);
    } catch (error) {
      alert('Error extracting data from document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Create New Order</h1>

      <div className="space-y-2">
        <label className="block font-medium">Select Template</label>
        <select
          className="w-full p-2 border rounded"
          onChange={(e) => {
            const t = templates.find(item => item.id === e.target.value);
            setSelectedTemplate(t || null);
          }}
        >
          <option value="">-- Choose a template --</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <div className="space-y-4 p-4 border rounded bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Order Details</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm cursor-pointer text-blue-600 hover:underline">
                Upload Word Doc
                <input type="file" className="hidden" accept=".docx" onChange={handleFileUpload} />
              </label>
              {isUploading && <span className="text-xs text-gray-500">Extracting...</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {selectedTemplate.requiredFields.map(field => (
              <div key={field} className="space-y-1">
                <label className="block text-sm capitalize">{field.replace('_', ' ')}</label>
                <input
                  className="w-full p-2 border rounded bg-white"
                  value={formData[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={`Enter ${field.replace('_', ' ')}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        disabled={!selectedTemplate}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded font-bold disabled:bg-gray-400"
        onClick={() => alert('Order submitted for proof generation!')}
      >
        Submit for Proof
      </button>
    </div>
  );
}
