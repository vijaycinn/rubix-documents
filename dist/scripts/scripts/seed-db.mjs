import Database from 'better-sqlite3';
import path from 'path';
const dbPath = path.join(process.cwd(), 'db', 'cjn-dakota.db');
const db = new Database(dbPath);
// Priority Matrix data parsed from the markdown file
const priorityItems = [
    // CRITICAL PRIORITY (0-30 Days)
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'Implement Managed Identities',
        description: 'Security | 2-3 weeks | $0 | ⭐⭐⭐⭐⭐ Eliminate credentials, reduce breach risk',
        priority_level: 'Critical'
    },
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'SQL TDE with Customer-Managed Keys',
        description: 'Security | 2 weeks | $200/mo | ⭐⭐⭐⭐⭐ CJIS compliance requirement',
        priority_level: 'Critical'
    },
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'Configure Distributed Tracing',
        description: 'Operations | 1 week | $150/mo | ⭐⭐⭐⭐⭐ Faster troubleshooting',
        priority_level: 'Critical'
    },
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'Define & Document DR Strategy',
        description: 'Reliability | 1 week | $0 | ⭐⭐⭐⭐⭐ Business continuity',
        priority_level: 'Critical'
    },
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'Enable SQL Geo-Replication',
        description: 'Reliability | 2 weeks | +15-25% | ⭐⭐⭐⭐⭐ Data protection',
        priority_level: 'Critical'
    },
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'Set Up Cost Budgets & Alerts',
        description: 'Cost | 1 week | $0 | ⭐⭐⭐⭐ Prevent overruns',
        priority_level: 'Critical'
    },
    {
        category: '🔴 CRITICAL PRIORITY (0-30 Days)',
        item_text: 'SQL Audit Logging to Immutable Storage',
        description: 'Security | 1 week | $100/mo | ⭐⭐⭐⭐⭐ CJIS compliance',
        priority_level: 'Critical'
    },
    // HIGH PRIORITY (30-60 Days)
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Implement Private Link for PaaS',
        description: 'Security | 3-4 weeks | +10% | ⭐⭐⭐⭐ Enhanced security posture',
        priority_level: 'High'
    },
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Health Endpoints & Probes',
        description: 'Reliability | 1 week | $0 | ⭐⭐⭐⭐ Proactive monitoring',
        priority_level: 'High'
    },
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Implement Retry Policies',
        description: 'Reliability | 2 weeks | $0 | ⭐⭐⭐⭐ Resilience',
        priority_level: 'High'
    },
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Azure Cache for Redis',
        description: 'Performance | 2 weeks | $300-500/mo | ⭐⭐⭐⭐ Improved response times',
        priority_level: 'High'
    },
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Create Azure Monitor Workbooks',
        description: 'Operations | 2 weeks | $0 | ⭐⭐⭐⭐ Operational visibility',
        priority_level: 'High'
    },
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Always Encrypted for PII',
        description: 'Security | 3 weeks | $0 | ⭐⭐⭐⭐⭐ CJIS compliance',
        priority_level: 'High'
    },
    {
        category: '🟠 HIGH PRIORITY (30-60 Days)',
        item_text: 'Resource Tagging Strategy',
        description: 'Cost | 1 week | $0 | ⭐⭐⭐ Cost allocation',
        priority_level: 'High'
    },
    // MEDIUM PRIORITY (60-90 Days)
    {
        category: '🟡 MEDIUM PRIORITY (60-90 Days)',
        item_text: 'Microsoft Sentinel Setup',
        description: 'Security | 3-4 weeks | $500-1000/mo | ⭐⭐⭐⭐ Threat detection',
        priority_level: 'Medium'
    },
    {
        category: '🟡 MEDIUM PRIORITY (60-90 Days)',
        item_text: 'Storage Lifecycle Management',
        description: 'Cost | 1 week | -20-30% storage | ⭐⭐⭐ Cost savings',
        priority_level: 'Medium'
    },
    {
        category: '🟡 MEDIUM PRIORITY (60-90 Days)',
        item_text: 'Auto-Scaling Configuration',
        description: 'Performance | 2 weeks | Variable | ⭐⭐⭐ Performance + cost optimization',
        priority_level: 'Medium'
    },
    {
        category: '🟡 MEDIUM PRIORITY (60-90 Days)',
        item_text: 'Azure Front Door Implementation',
        description: 'Performance | 3 weeks | $500-800/mo | ⭐⭐⭐⭐ Global performance',
        priority_level: 'Medium'
    },
    {
        category: '🟡 MEDIUM PRIORITY (60-90 Days)',
        item_text: 'Reserved Instance Planning',
        description: 'Cost | 2 weeks | -40-60% compute | ⭐⭐⭐⭐ Significant savings',
        priority_level: 'Medium'
    },
    // LOW PRIORITY (90+ Days)
    {
        category: '🟢 LOW PRIORITY (90+ Days)',
        item_text: 'Chaos Engineering Implementation',
        description: 'Reliability | 4 weeks | $0 | ⭐⭐⭐ Resilience testing',
        priority_level: 'Low'
    },
    {
        category: '🟢 LOW PRIORITY (90+ Days)',
        item_text: 'Azure Spot Instances Evaluation',
        description: 'Cost | 2 weeks | -70-90% for suitable workloads | ⭐⭐⭐ Cost optimization',
        priority_level: 'Low'
    },
    {
        category: '🟢 LOW PRIORITY (90+ Days)',
        item_text: 'Azure Arc for Hybrid Management',
        description: 'Operations | 4 weeks | $100-200/mo | ⭐⭐⭐ Unified management',
        priority_level: 'Low'
    }
];
// Seed the database
console.log('Seeding priority items...');
const insertStmt = db.prepare(`
  INSERT INTO priority_items (category, item_text, description, priority_level, is_checked)
  VALUES (?, ?, ?, ?, 0)
`);
const insertMany = db.transaction((items) => {
    for (const item of items) {
        insertStmt.run(item.category, item.item_text, item.description, item.priority_level);
    }
});
try {
    insertMany(priorityItems);
    console.log(`Successfully seeded ${priorityItems.length} priority items!`);
}
catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
}
db.close();
