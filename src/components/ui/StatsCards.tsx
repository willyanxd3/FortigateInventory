import React from 'react';
import { Monitor, Wifi, WifiOff, Shield, ShieldAlert } from 'lucide-react';
import { DeviceStats } from '../../types';

interface StatsCardsProps {
  stats: DeviceStats;
}

/**
 * Statistics cards component
 */
export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Devices',
      value: stats.total,
      icon: Monitor,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      title: 'Online',
      value: stats.online,
      icon: Wifi,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20'
    },
    {
      title: 'Offline',
      value: stats.offline,
      icon: WifiOff,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20'
    },
    {
      title: 'Authorized',
      value: stats.authorized,
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      title: 'Unauthorized',
      value: stats.unauthorized,
      icon: ShieldAlert,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`${card.bgColor} ${card.borderColor} border backdrop-blur-sm rounded-xl p-6 hover:scale-105 transition-transform duration-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}