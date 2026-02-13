'use client';

import { useState, useEffect } from 'react';
import { FileText, Table, Network, TrendingUp, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { AuditItem, auditDataService } from '@/lib/audit-data';

export default function Home() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await auditDataService.loadData();
        const allItems = auditDataService.getAllData();
        setItems(allItems);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = {
    totalRegulations: items.length,
    totalCategories: new Set(items.map(item => item.mevzuat)).size,
    lastUpdate: new Date().toLocaleDateString('tr-TR'),
  };

  const quickAccessLinks = [
    {
      title: 'Basit Liste',
      description: 'Gelişmiş arama ve filtreleme ile denetim maddelerini inceleyin',
      href: '/basit-liste',
      icon: FileText,
      color: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Tüm Veri',
      description: 'Detaylı tablo görünümü ile tüm verilere erişin',
      href: '/tum-veri',
      icon: Table,
      color: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
    },
    {
      title: 'Gelişmiş Analiz',
      description: 'Mevzuat ilişkilerini network grafiği ile görselleştirin',
      href: '/gelismis-mevzuat-analizi',
      icon: Network,
      color: 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Denetim ve mevzuat referans sisteminize hoş geldiniz
        </p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Toplam Mevzuat
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {stats.totalRegulations}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Denetim maddesi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Kategori Sayısı
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {stats.totalCategories}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Farklı mevzuat kategorisi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Durum
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              Aktif
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Sistem çalışıyor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Son Güncelleme
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Bugün
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {stats.lastUpdate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Hızlı Erişim
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${link.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{link.title}</CardTitle>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {link.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sistem Bilgileri</CardTitle>
          <CardDescription>
            AuditRef platformu hakkında önemli bilgiler
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <Badge variant="outline" className="mt-0.5">v1.0</Badge>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Versiyon 1.0 Yayında
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tüm temel özellikler aktif ve kullanıma hazır
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Badge variant="outline" className="mt-0.5 bg-green-50 text-green-700 border-green-200">
              Yeni
            </Badge>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Gelişmiş Mevzuat Analizi
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Network görselleştirmesi ile mevzuat ilişkilerini keşfedin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
