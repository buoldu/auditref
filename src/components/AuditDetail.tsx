'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, CheckCircle } from 'lucide-react';
import { AuditItem } from '@/lib/audit-data';
import { cn } from '@/lib/utils';

interface AuditDetailProps {
  item: AuditItem | null;
  className?: string;
}

export function AuditDetail({ item, className }: AuditDetailProps) {
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);

  if (!item) {
    return (
      <div className={cn("flex items-center justify-center h-full bg-slate-50", className)}>
        <div className="text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 text-lg">Lütfen soldan bir madde seçin</p>
        </div>
      </div>
    );
  }

  const procedureList = item.prosedür
    .split(/[-•·]\s*/)
    .filter(step => step.trim().length > 0)
    .map(step => step.replace(/^\s*[-•·]\s*/, '').trim());

  return (
    <div className={cn("h-full bg-white overflow-y-auto", className)}>
      <div className="p-6">
        {item.rehberRef && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-4">
            <CheckCircle className="h-4 w-4 mr-2" />
            {item.rehberRef}
          </div>
        )}

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {item.soru}
        </h2>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">Açıklama ve Gerekçe</h3>
          <p className="text-slate-700 leading-relaxed">
            {item.aciklama}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Denetim Testi</h3>
          <div className="space-y-2">
            {procedureList.length > 0 ? (
              procedureList.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed flex-1">
                    {step}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-700 leading-relaxed">
                {item.prosedür}
              </p>
            )}
          </div>
        </div>

        {item.kanit && (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsEvidenceExpanded(!isEvidenceExpanded)}
              className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 flex items-center justify-between"
            >
              <h3 className="font-semibold text-slate-900">Gerekli Kanıtlar</h3>
              {isEvidenceExpanded ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </button>
            
            {isEvidenceExpanded && (
              <div className="p-4 bg-white border-t border-slate-200">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">
                    {item.kanit}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
