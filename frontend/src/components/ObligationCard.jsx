import React from 'react';
import { DollarSign, CheckSquare, Ban, BellRing, AlertOctagon, Calendar, ShieldAlert } from 'lucide-react';

export default function ObligationCard({ obligations }) {
  if (!obligations) return null;

  const categories = [
    {
      title: 'What You Need to Pay',
      subtitle: 'Fees, security deposits, utility charges, or deductions',
      items: obligations.what_you_need_to_pay || [],
      icon: DollarSign,
      color: 'from-emerald-500/20 to-emerald-950/30',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-950/40 text-emerald-300',
    },
    {
      title: 'What You Need to Do',
      subtitle: 'Mandatory responsibilities, shifts, and document submissions',
      items: obligations.what_you_need_to_do || [],
      icon: CheckSquare,
      color: 'from-violet-500/20 to-violet-950/30',
      borderColor: 'border-violet-500/30',
      iconColor: 'text-violet-400',
      badgeBg: 'bg-violet-950/40 text-violet-300',
    },
    {
      title: 'What You Cannot Do',
      subtitle: 'Strict prohibitions, IP surrender, confidentiality & non-competes',
      items: obligations.what_you_cannot_do || [],
      icon: Ban,
      color: 'from-rose-500/20 to-rose-950/30',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-950/40 text-rose-300',
    },
    {
      title: 'When You Need to Give Notice',
      subtitle: 'Required written advance warning before resigning or vacating',
      items: obligations.when_you_need_to_give_notice || [],
      icon: BellRing,
      color: 'from-amber-500/20 to-amber-950/30',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-950/40 text-amber-300',
    },
    {
      title: 'If You Cancel / Leave Early',
      subtitle: 'Lock-in periods, penalty clauses, and deposit forfeiture risks',
      items: obligations.what_happens_if_you_cancel_or_leave_early || [],
      icon: AlertOctagon,
      color: 'from-purple-500/20 to-purple-950/30',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
      badgeBg: 'bg-purple-950/40 text-purple-300',
    },
    {
      title: 'Important Deadlines',
      subtitle: 'Payment dates, joining certificates, and clearance timeframes',
      items: obligations.important_deadlines || [],
      icon: Calendar,
      color: 'from-cyan-500/20 to-cyan-950/30',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/40 text-cyan-300',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-xl bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Your Obligations Dashboard</h3>
          <p className="text-xs text-gray-400">
            A targeted breakdown of your student obligations and restrictions before signing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const hasItems = cat.items && cat.items.length > 0;
          return (
            <div
              key={cat.title}
              className={`rounded-2xl p-5 border bg-gradient-to-b ${cat.color} ${cat.borderColor} flex flex-col justify-between transition-all hover:scale-[1.01]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-xl bg-black/40 border ${cat.borderColor}`}>
                      <Icon className={`w-4 h-4 ${cat.iconColor}`} />
                    </div>
                    <h4 className="text-sm font-semibold text-white tracking-tight">{cat.title}</h4>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${cat.badgeBg}`}>
                    {hasItems ? `${cat.items.length} items` : 'None'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mb-4">{cat.subtitle}</p>

                {/* Items */}
                {hasItems ? (
                  <ul className="space-y-2.5">
                    {cat.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-200 bg-black/30 p-2.5 rounded-xl border border-white/5 leading-relaxed"
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-gray-400 italic">Not mentioned in the agreement.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
