'use client'

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaRegCircle, FaChartLine } from 'react-icons/fa';
import { LuChevronDown, LuChevronRight, LuShield, LuServer, LuDatabase, LuBrain } from 'react-icons/lu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PriorityItem {
  id: number;
  item_number: number;
  recommendation: string;
  pillar: string;
  effort: string;
  cost_impact: string;
  business_value: string;
  priority_level: string;
  category: string;
  technical_category: string;
  description: string | null;
  implementation_steps: string | null;
  dependencies: string | null;
  technical_notes: string | null;
  related_services: string | null;
  compliance_notes: string | null;
  is_checked: number;
}

const LS_KEY = 'priority-items-checked';

function loadCheckedIds(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveCheckedIds(ids: Set<number>) {
  localStorage.setItem(LS_KEY, JSON.stringify(Array.from(ids)));
}

export default function PriorityMatrixClient() {
  const [items, setItems] = useState<PriorityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/priority-items.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load priority items');
        return res.json() as Promise<PriorityItem[]>;
      })
      .then(data => {
        const checkedIds = loadCheckedIds();
        setItems(data.map(item => ({
          ...item,
          is_checked: checkedIds.has(item.id) ? 1 : 0,
        })));
      })
      .catch(err => setError(err instanceof Error ? err.message : 'An error occurred'))
      .finally(() => setLoading(false));
  }, []);

  const toggleItem = (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    setItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, is_checked: newStatus } : item
      );
      const checkedIds = new Set(updated.filter(i => i.is_checked === 1).map(i => i.id));
      saveCheckedIds(checkedIds);
      return updated;
    });
  };

  const getTechnicalCategoryConfig = (category: string) => {
    const configs = {
      'Infrastructure': {
        icon: <LuServer className="h-3 w-3" />,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
      },
      'Data': {
        icon: <LuDatabase className="h-3 w-3" />,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
      },
      'Apps & AI': {
        icon: <LuBrain className="h-3 w-3" />,
        color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
      },
      'Security': {
        icon: <LuShield className="h-3 w-3" />,
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      },
    };
    return configs[category as keyof typeof configs] || configs['Infrastructure'];
  };

  const getPriorityConfig = (level: string) => {
    const configs = {
      'Critical': { icon: '🔴' },
      'High': { icon: '🟠' },
      'Medium': { icon: '🟡' },
      'Low': { icon: '🟢' },
    };
    return configs[level as keyof typeof configs] || configs['Medium'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading priority items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6">
        <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Items</h3>
        <p className="text-sm text-destructive/80">{error}</p>
      </div>
    );
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PriorityItem[]>);

  const getCategoryColor = (category: string) => {
    if (category.includes('CRITICAL')) return 'border-l-red-500';
    if (category.includes('HIGH')) return 'border-l-orange-500';
    if (category.includes('MEDIUM')) return 'border-l-yellow-500';
    if (category.includes('LOW') || category.includes('STRATEGIC')) return 'border-l-green-500';
    return 'border-l-gray-500';
  };

  // Calculate overall progress
  const totalItems = items.length;
  const completedItems = items.filter(i => i.is_checked).length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Overall Progress Card */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Overall Progress</h2>
            <p className="text-muted-foreground mt-1">Track your implementation milestones</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{progressPercentage}%</div>
            <p className="text-sm text-muted-foreground">{completedItems} of {totalItems} complete</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Category Tables */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => {
        const completed = categoryItems.filter(i => i.is_checked).length;
        const total = categoryItems.length;
        const categoryProgress = Math.round((completed / total) * 100);

        return (
          <div
            key={category}
            className={`border-l-4 ${getCategoryColor(category)} bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="bg-gradient-to-r from-muted/50 to-background px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-3">
                    <span>{category}</span>
                  </h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FaCheckCircle className="h-4 w-4" />
                      {completed} /  {total} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <FaChartLine className="h-4 w-4" />
                      {categoryProgress}% progress
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{categoryProgress}%</div>
                </div>
              </div>
              <div className="w-full bg-background/50 rounded-full h-2 mt-4 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${categoryProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-y border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12">
                      Done
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Recommendation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Pillar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Effort
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Business Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categoryItems.map((item) => {
                    const config = getPriorityConfig(item.priority_level);
                    const techConfig = getTechnicalCategoryConfig(item.technical_category);
                    const isExpanded = expandedId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          item.is_checked === 1 ? 'bg-muted/10' : ''
                        }`}
                      >
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleItem(item.id, item.is_checked)}
                            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                            aria-label={item.is_checked ? 'Mark as incomplete' : 'Mark as complete'}
                          >
                            {item.is_checked === 1 ? (
                              <FaCheckCircle className="h-5 w-5 text-primary transition-transform hover:scale-110" />
                            ) : (
                              <FaRegCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-muted-foreground">
                            {item.item_number}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <Collapsible
                            open={isExpanded}
                            onOpenChange={(open) => setExpandedId(open ? item.id : null)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CollapsibleTrigger asChild>
                                  <button className="flex-shrink-0 p-1 hover:bg-muted rounded transition-colors">
                                    {isExpanded ? (
                                      <LuChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <LuChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </button>
                                </CollapsibleTrigger>
                                <div className="flex-1 flex items-center gap-2 flex-wrap">
                                  <span className={`text-sm font-medium ${
                                    item.is_checked === 1
                                      ? 'line-through text-muted-foreground'
                                      : 'text-foreground'
                                  }`}>
                                    {item.recommendation}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${techConfig.color}`}>
                                    {techConfig.icon}
                                    <span>{item.technical_category}</span>
                                  </span>
                                </div>
                              </div>

                              <CollapsibleContent className="CollapsibleContent">
                                <div className="mt-3 pl-7 space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                                  {item.description && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Description</h4>
                                      <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
                                    </div>
                                  )}

                                  {item.implementation_steps && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Implementation Steps</h4>
                                      <div className="text-sm text-muted-foreground whitespace-pre-line">{item.implementation_steps}</div>
                                    </div>
                                  )}

                                  {item.dependencies && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Dependencies</h4>
                                      <p className="text-sm text-muted-foreground">{item.dependencies}</p>
                                    </div>
                                  )}

                                  {item.technical_notes && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Technical Notes</h4>
                                      <p className="text-sm text-muted-foreground whitespace-pre-line">{item.technical_notes}</p>
                                    </div>
                                  )}

                                  {item.related_services && (
                                    <div>
                                      <h4 className="text-sm font-semibold text-foreground mb-1">Related Azure Services</h4>
                                      <p className="text-sm text-muted-foreground">{item.related_services}</p>
                                    </div>
                                  )}

                                  {item.compliance_notes && (
                                    <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-md border border-red-200 dark:border-red-800">
                                      <div className="flex items-start gap-2">
                                        <LuShield className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                          <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">CJIS Compliance</h4>
                                          <p className="text-sm text-red-700 dark:text-red-300">{item.compliance_notes}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </div>
                          </Collapsible>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.pillar === 'Security' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200' :
                            item.pillar === 'Reliability' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                            item.pillar === 'Performance' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                            item.pillar === 'Operations' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' :
                            item.pillar === 'Cost' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                            'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200'
                          }`}>
                            {item.pillar}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {item.effort}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-muted-foreground max-w-md">
                            {item.business_value}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
