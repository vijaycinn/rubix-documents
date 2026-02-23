/**
 * Generates public/priority-items.json from static seed data.
 * Run via: pnpm generate-priority-json
 * Called automatically as part of the build pipeline.
 */
import fs from 'fs';
import path from 'path';

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

// [item_number, recommendation, pillar, effort, cost_impact, business_value,
//  priority_level, category, technical_category, description,
//  implementation_steps, dependencies, technical_notes, related_services, compliance_notes]
const seedRows: (string | number | null)[][] = [
  [
    1, 'Implement Managed Identities', 'Security', '2-3 weeks', '$0', '⭐⭐⭐⭐⭐ Eliminate credentials, reduce breach risk', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Security',
    'Replace connection strings and API keys stored in Azure Key Vault with Azure Managed Identities for passwordless authentication. Managed Identities provide automatically managed identities in Azure AD for Azure resources to authenticate to Azure services without storing credentials in code or configuration.',
    '1. Enable system-assigned managed identities on App Services and Azure Functions\n2. Configure SQL Database to accept Azure AD authentication\n3. Grant managed identity appropriate SQL roles (db_datareader, db_datawriter)\n4. Update connection strings to use DefaultAzureCredential\n5. Remove secrets from Key Vault\n6. Test authentication flow\n7. Update deployment pipelines',
    'Azure AD tenant, App Services running on premium tier or higher, SQL Database configured for Azure AD authentication',
    'Eliminates the need to rotate credentials and reduces the attack surface. Uses the Azure Instance Metadata Service (IMDS) endpoint to acquire access tokens. Consider using user-assigned managed identities for shared identities across multiple resources.',
    'Azure App Service, Azure Functions, Azure SQL Database, Azure AD, Azure Key Vault',
    'CJIS compliance requires secure credential management. Managed identities meet this requirement by eliminating stored credentials and providing audit logs of authentication attempts.'
  ],
  [
    2, 'SQL TDE with Customer-Managed Keys', 'Security', '2 weeks', '$200/mo', '⭐⭐⭐⭐⭐ CJIS compliance requirement', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Data',
    'Enable Transparent Data Encryption (TDE) on Azure SQL Database using customer-managed keys stored in Azure Key Vault Premium. This provides encryption at rest with keys under your complete control, meeting CJIS requirements for encryption key management.',
    '1. Provision Azure Key Vault Premium (required for HSM-backed keys)\n2. Create or import RSA 2048+ key in Key Vault\n3. Grant SQL Server managed identity Key Vault Crypto Service Encryption User role\n4. Enable TDE on SQL Database with customer-managed key\n5. Configure automatic key rotation policy\n6. Set up key backup and recovery procedures\n7. Document key management procedures',
    'Azure Key Vault Premium tier, SQL Database, Managed Identity configured on SQL Server',
    'Key Vault Premium provides HSM-backed keys required for CJIS. Monitor key access via Key Vault diagnostic logs. Plan for key rotation every 90 days per best practices. Ensure backup procedures include key backup.',
    'Azure SQL Database, Azure Key Vault Premium, Azure Monitor',
    'CJIS Security Policy 5.10.1 requires encryption of CJI data at rest using FIPS 140-2 validated encryption. Customer-managed keys in Key Vault Premium (FIPS 140-2 Level 2) meet this requirement and provide proof of key control.'
  ],
  [
    3, 'Configure Distributed Tracing', 'Operations', '1 week', '$150/mo', '⭐⭐⭐⭐⭐ Faster troubleshooting', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Apps & AI',
    'Implement end-to-end distributed tracing using Application Insights to track requests across multiple services (Front Door → APIM → App Services → Functions → SQL). This provides complete visibility into request flows and performance bottlenecks.',
    '1. Enable Application Insights on all App Services and Functions\n2. Configure Application Insights connection string via Key Vault reference\n3. Implement correlation ID propagation across service boundaries\n4. Add custom events and dependencies for SignalR and Service Bus\n5. Create Application Map in Application Insights\n6. Configure sampling to 100% for critical paths, 25% for others\n7. Set up transaction diagnostics\n8. Create Workbooks for common troubleshooting scenarios',
    'Application Insights instance, App Services with Application Insights SDK, Managed identities for authentication',
    'Use OpenTelemetry for future-proof instrumentation. Correlation ID should flow through APIM policies using set-header. Consider adaptive sampling to control costs while maintaining visibility. Enable SQL dependency tracking.',
    'Azure Application Insights, Azure Front Door, Azure API Management, App Services, Azure Functions',
    null
  ],
  [
    4, 'Define & Document DR Strategy', 'Reliability', '1 week', '$0', '⭐⭐⭐⭐⭐ Business continuity', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Security',
    'Create and document a comprehensive disaster recovery (DR) strategy defining Recovery Time Objective (RTO) and Recovery Point Objective (RPO) for the CJN RMS system. Document failover procedures, recovery runbooks, and testing schedules.',
    '1. Define RTO (target: < 4 hours) and RPO (target: < 15 minutes) with stakeholders\n2. Document current architecture and dependencies\n3. Create failover procedures for manual failover scenarios\n4. Define data backup and restore procedures\n5. Create runbooks for common failure scenarios\n6. Document communication plan and escalation procedures\n7. Schedule quarterly DR tests\n8. Create DR test report template',
    'Architecture documentation, stakeholder approval, Azure account with appropriate permissions',
    'Consider automated failover for critical components. Document dependencies between services. Include external integrations (MNCIS, Citation systems) in DR plan. Ensure Key Vault keys and secrets are replicated.',
    'Azure Site Recovery, Azure Backup, Azure SQL geo-replication, Azure Front Door',
    'CJIS requires documented business continuity plans. DR procedures must account for encryption key availability and secure failover processes.'
  ],
  [
    5, 'Enable SQL Geo-Replication', 'Reliability', '2 weeks', '+15-25%', '⭐⭐⭐⭐⭐ Data protection', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Data',
    'Configure active geo-replication for Azure SQL Database to a secondary region (e.g., Central US → East US 2). This provides near-instantaneous failover capability and protects against regional outages affecting law enforcement operations.',
    '1. Provision secondary SQL Database in paired region (East US 2)\n2. Configure active geo-replication from primary to secondary\n3. Set up same TDE configuration on secondary (customer-managed keys)\n4. Configure read-only connection string for secondary (reporting workloads)\n5. Test failover process end-to-end\n6. Update application configuration to support read replicas\n7. Configure automatic failover groups\n8. Set up monitoring and alerts for replication lag',
    'SQL TDE with customer-managed keys, secondary Key Vault in paired region, Premium or Business Critical SQL tier',
    'Geo-replication provides RPO of < 5 seconds and RTO of < 30 seconds with automatic failover groups. Ensure Key Vault is replicated to secondary region. Consider using read replicas for reporting to reduce primary load.',
    'Azure SQL Database, Azure SQL Failover Groups, Azure DNS for connection redirection',
    null
  ],
  [
    6, 'Set Up Cost Budgets & Alerts', 'Cost', '1 week', '$0', '⭐⭐⭐⭐ Prevent overruns', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Security',
    'Implement Azure Cost Management budgets and alerts to proactively monitor and control cloud spending. Set up monthly budgets by resource group and service category with multi-level alert thresholds.',
    '1. Analyze current spending patterns and trends\n2. Define monthly budgets by resource group (RMS, Routing, Search, Core)\n3. Set up alerts at 50%, 75%, 90%, and 100% thresholds\n4. Configure action groups for budget notifications (email, Teams, ServiceNow)\n5. Create cost anomaly detection alerts\n6. Set up reserved instance recommendations review\n7. Implement tagging strategy for cost allocation\n8. Create Power BI cost dashboard',
    'Azure subscription with Owner or Contributor role, Monitoring Reader access',
    'Budget alerts do not prevent spending - they only notify. Consider Azure Policy to enforce spending limits. Review reserved instances for predictable workloads (SQL, App Services). Enable cost recommendations.',
    'Azure Cost Management, Azure Monitor, Azure Policy, Power BI',
    'CJIS requires financial accountability for systems handling CJI. Budget alerts support compliance with financial controls and audit requirements.'
  ],
  [
    7, 'SQL Audit Logging to Immutable Storage', 'Security', '1 week', '$100/mo', '⭐⭐⭐⭐⭐ CJIS compliance', 'Critical', 'CRITICAL PRIORITY (0-30 Days)',
    'Data',
    'Configure SQL Database auditing to write audit logs to Azure Blob Storage with time-based retention and immutability policies. This ensures tamper-proof audit logs required for CJIS compliance and forensic investigations.',
    '1. Create dedicated Storage Account with blob versioning and soft delete enabled\n2. Configure legal hold or time-based retention policy (7 years for CJIS)\n3. Enable SQL Database auditing at server and database level\n4. Configure audit destinations to Blob Storage and Log Analytics\n5. Define audit action groups (BATCH_COMPLETED_GROUP, SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP, FAILED_DATABASE_AUTHENTICATION_GROUP)\n6. Set up Azure Monitor alerts for suspicious activities\n7. Configure log retention and archival to cool/archive storage tiers\n8. Test audit log retrieval and analysis procedures',
    'Storage Account with Premium Blob or V2 tier, SQL Database auditing permissions, Azure Monitor workspace',
    'Immutability policies cannot be removed once set. Use time-based retention first before legal hold. Audit logs grow quickly - plan for 50-100GB per month. Route critical audit events to Log Analytics for real-time alerting.',
    'Azure SQL Database, Azure Blob Storage, Azure Monitor Log Analytics, Azure Sentinel',
    'CJIS Security Policy 5.4 requires audit and accountability. Immutable storage ensures audit logs cannot be altered, meeting tamper-proofing requirements. Retention period must align with state-specific requirements (typically 7 years).'
  ],
  [
    8, 'Implement Private Link for PaaS', 'Security', '3-4 weeks', '+10%', '⭐⭐⭐⭐ Enhanced security posture', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Security',
    'Replace public endpoints for Azure PaaS services (SQL, Key Vault, Storage, Service Bus) with Azure Private Link endpoints. This removes public internet exposure and forces traffic through the virtual network.',
    '1. Create private endpoints subnet in CJN RMS VNet (minimum /28)\n2. Disable public access on SQL Database, Key Vault, Storage Accounts\n3. Create private endpoints for each PaaS service\n4. Configure private DNS zones for name resolution (privatelink.database.windows.net, etc.)\n5. Update application connection strings if needed\n6. Verify connectivity from App Services through VNet integration\n7. Test access from on-premises via VPN/ExpressRoute\n8. Update NSG rules and firewall policies',
    'VNet with available address space, App Services with VNet integration enabled, Premium tier for App Services and Functions',
    'Private endpoints require Premium tier for App Services. Each private endpoint incurs $7.30/month cost. DNS resolution is critical - use Azure Private DNS zones. Existing public endpoint connections will break once disabled.',
    'Azure Private Link, Azure Virtual Network, Azure Private DNS, App Services VNet Integration',
    'CJIS requires network isolation for CJI systems. Private Link meets Security Policy 5.5.4 by eliminating public internet exposure and enforcing network segmentation.'
  ],
  [
    9, 'Health Endpoints & Probes', 'Reliability', '1 week', '$0', '⭐⭐⭐⭐ Proactive monitoring', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Infrastructure',
    'Implement standardized health check endpoints across all App Services and Functions following the Health Endpoint Monitoring pattern. Configure Application Gateway backend health probes to automatically remove unhealthy instances.',
    '1. Create /health endpoint standard in all App Services and Functions\n2. Implement shallow health check (API responds)\n3. Implement deep health checks (database connectivity, dependencies)\n4. Return standard health check responses (200 OK, 503 Service Unavailable)\n5. Configure APIM health probes with appropriate intervals (30 seconds)\n6. Set up Azure Front Door health probes for backend pools\n7. Configure App Service/Functions health check feature\n8. Create availability tests in Application Insights',
    'App Services, Azure Functions, API Management, Front Door configuration access',
    'Health endpoints should not check downstream API dependencies (causes cascade failures). Use circuit breaker pattern. Consider liveness vs readiness probes. Health check interval affects failover speed vs resource usage.',
    'App Services, Azure Functions, Azure Application Gateway, Azure Front Door, API Management',
    null
  ],
  [
    10, 'Implement Retry Policies', 'Reliability', '2 weeks', '$0', '⭐⭐⭐⭐ Resilience', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Infrastructure',
    'Implement exponential backoff retry policies for all external calls (SQL, Service Bus, external APIs) using Polly or similar resilience library. This improves system reliability during transient failures.',
    '1. Add Polly NuGet package to all .NET projects\n2. Implement exponential backoff for database calls (max 3 retries, 2^n seconds)\n3. Implement exponential backoff for Service Bus (max 5 retries)\n4. Add retry logic for HTTP calls to external systems with circuit breaker\n5. Configure APIM retry policies for upstream services\n6. Add telemetry to track retry attempts\n7. Create alerts for excessive retry patterns\n8. Document retry behaviors and timeouts',
    'Polly library, Application Insights for telemetry, understanding of transient vs permanent failures',
    'Do not retry on authentication failures (401) or bad requests (400). Use circuit breaker to fail fast after repeated failures. Consider idempotency for retry safety. SQL connection resiliency is built-in with EF Core.',
    'Polly resilience library, Azure Service Bus, Azure SQL Database, Azure API Management',
    null
  ],
  [
    11, 'Azure Cache for Redis', 'Performance', '2 weeks', '$300-500/mo', '⭐⭐⭐⭐ Improved response times', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Data',
    'Implement Azure Cache for Redis to cache frequently accessed reference data (officer info, codes tables, lookup values) and reduce database load. This significantly improves API response times for read-heavy operations.',
    '1. Provision Azure Cache for Redis (Standard C1 or Premium P1)\n2. Enable data persistence (AOF or RDB) on Premium tier\n3. Implement cache-aside pattern for reference data\n4. Add StackExchange.Redis NuGet package\n5. Configure connection multiplexing and timeout policies\n6. Implement cache invalidation strategy (time-based and event-based)\n7. Add cache hit/miss metrics to Application Insights\n8. Load test to verify performance improvements',
    'App Services, design decisions on cache invalidation strategy, understanding of data access patterns',
    'Use Premium tier for production (SLA, persistence, geo-replication). Cache sensitive data with appropriate expiration. Monitor memory usage and eviction. Consider Redis Cluster for > 53GB data. Use Redis Streams for real-time updates.',
    'Azure Cache for Redis, StackExchange.Redis library, App Services',
    null
  ],
  [
    12, 'Create Azure Monitor Workbooks', 'Operations', '2 weeks', '$0', '⭐⭐⭐⭐ Operational visibility', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Apps & AI',
    'Create custom Azure Monitor Workbooks with interactive dashboards for operational insights. Include system health, performance metrics, error tracking, and cost analysis in role-based dashboards.',
    '1. Create Platform Health workbook (VM metrics, App Service health, SQL DTU usage)\n2. Create Application Performance workbook (response times, dependency calls, failure rates)\n3. Create Security workbook (failed auth attempts, suspicious activities, Key Vault access)\n4. Create Cost Analysis workbook (spending trends, budget utilization, recommendations)\n5. Add parameter controls for time range, resource group, environment filters\n6. Create scheduled exports to email and Teams\n7. Share workbooks with operations team\n8. Document workbook usage in runbooks',
    'Azure Monitor workspace with data, appropriate RBAC permissions, sample KQL queries',
    'Workbooks use Kusto Query Language (KQL). Pre-aggregate heavy queries using Log Analytics rules. Cache workbook data for better performance. Consider Azure Dashboards for real-time monitoring walls.',
    'Azure Monitor, Azure Log Analytics, Kusto Query Language (KQL), Azure Dashboards',
    null
  ],
  [
    13, 'Always Encrypted for PII', 'Security', '3 weeks', '$0', '⭐⭐⭐⭐⭐ CJIS compliance', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Data',
    'Implement SQL Always Encrypted for columns containing PII (names, addresses, SSN, DOB) to ensure data remains encrypted in-memory on the client side. Only authorized applications can decrypt sensitive data.',
    '1. Identify PII columns in database schema\n2. Create Column Master Key in Azure Key Vault\n3. Create Column Encryption Keys for each encrypted column\n4. Enable Always Encrypted on identified columns (deterministic for joins, randomized for high security)\n5. Update application code to use SqlClient with column encryption enabled\n6. Grant applications Key Vault Crypto User role\n7. Test queries and performance impact\n8. Update backup/restore procedures',
    'Azure SQL Database, Azure Key Vault, application code changes, testing of all affected queries',
    'Always Encrypted encrypts data on the client, SQL Server never sees plaintext. Deterministic encryption allows equality searches but is less secure. Randomized encryption prevents any operations. Performance impact 2-5x for encrypted columns.',
    'Azure SQL Database, Azure Key Vault, SqlClient library with Always Encrypted support',
    'CJIS Security Policy 5.10 requires encryption of CJI at rest and in transit. Always Encrypted provides end-to-end encryption meeting "application-level encryption" requirements for maximum data protection.'
  ],
  [
    14, 'Resource Tagging Strategy', 'Cost', '1 week', '$0', '⭐⭐⭐ Cost allocation', 'High', 'HIGH PRIORITY (30-60 Days)',
    'Infrastructure',
    'Implement comprehensive Azure resource tagging strategy for cost allocation, ownership tracking, and automated governance. Enforce tagging through Azure Policy.',
    '1. Define required tags: Environment, Application, CostCenter, Owner, Criticality, DataClassification, DR-Tier\n2. Create Azure Policy to require tags on resource creation\n3. Tag all existing resources using PowerShell or Azure CLI scripts\n4. Create cost allocation reports by tag in Cost Management\n5. Set up alerts for untagged resources\n6. Document tagging standards in wiki/SharePoint\n7. Configure RBAC based on tags for least privilege access\n8. Automate tagging in deployment pipelines',
    'Azure Policy contributor access, resource group contributor access for bulk tagging',
    'Tags are case-sensitive and limited to 512 characters. Use lowercase for consistency. Apply tags at resource group level for inheritance. Some resources like NICs do not inherit tags. Automate tagging in ARM/Bicep templates.',
    'Azure Policy, Azure Resource Manager, Azure Cost Management, PowerShell/Azure CLI',
    null
  ],
  [
    15, 'Microsoft Sentinel Setup', 'Security', '3-4 weeks', '$500-1000/mo', '⭐⭐⭐⭐ Threat detection', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Security',
    'Deploy Microsoft Sentinel as Security Information and Event Management (SIEM) solution for threat detection, security analytics, and incident response for CJI systems. Integrate with all Azure resources and external systems.',
    '1. Create Log Analytics workspace sized for Sentinel (Commitment Tier)\n2. Enable Microsoft Sentinel on workspace\n3. Configure data connectors (Azure AD, Azure Activity, Azure SQL, Office 365)\n4. Enable threat intelligence feeds\n5. Create custom analytics rules for CJI access patterns\n6. Configure automated response playbooks using Logic Apps\n7. Set up security incidents and investigation procedures\n8. Integrate with SOC ticketing system\n9. Train security team on Sentinel',
    'Log Analytics workspace, Security Admin permissions, SOC procedures, incident response plan',
    'Sentinel costs based on data ingestion (GB/day). Start with Commitment Tier to reduce costs. Use data retention policies. Focus analytics rules on high-fidelity detections. Use UEBA for anomalous user behavior detection.',
    'Microsoft Sentinel, Azure Log Analytics, Azure Logic Apps, Azure AD, Microsoft Threat Intelligence',
    'CJIS requires Security Incident Response (SIR) capabilities. Sentinel provides audit, correlation, and incident response meeting Security Policy 5.4.1 security information and event management requirements.'
  ],
  [
    16, 'Storage Lifecycle Management', 'Cost', '1 week', '-20-30% storage', '⭐⭐⭐ Cost savings', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Data',
    'Implement Azure Blob Storage lifecycle management policies to automatically tier data from hot to cool to archive storage based on access patterns and retention requirements.',
    '1. Analyze blob access patterns using Storage Analytics logs\n2. Create lifecycle policies to move blobs to cool after 30 days\n3. Move to archive storage after 180 days\n4. Configure automatic deletion after retention period (varies by data type)\n5. Set up separate policies for audit logs (7 year retention to archive)\n6. Test blob rehydration from archive for legal holds\n7. Monitor cost savings in Cost Management\n8. Document storage tier SLAs',
    'Storage accounts with blob data, understanding of data retention requirements',
    'Archive tier has lowest cost but retrieval takes hours. Cool tier for infrequent access (< 1x/month). Use version-level tiering for granular control. Consider LRS vs GRS based on criticality.',
    'Azure Blob Storage, Azure Storage Lifecycle Management',
    null
  ],
  [
    17, 'Auto-Scaling Configuration', 'Performance', '2 weeks', 'Variable', '⭐⭐⭐ Performance + cost optimization', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Infrastructure',
    'Configure horizontal auto-scaling for App Services and Azure Functions based on CPU, memory, and custom metrics (queue depth, HTTP requests). This optimizes cost during low usage while ensuring performance during peak hours.',
    '1. Enable auto-scale on App Service Plans (requires Standard tier or higher)\n2. Configure scale-out rules: CPU > 70% for 10 minutes → add 1 instance\n3. Configure scale-in rules: CPU < 30% for 15 minutes → remove 1 instance\n4. Set minimum instances (2) and maximum instances (10)\n5. Create custom metric scaling for Service Bus queue depth\n6. Configure Functions consumption plan for event-driven scaling\n7. Load test scaling behavior\n8. Set up alerts for max instances reached',
    'App Service Standard tier or higher, understanding of usage patterns, load testing tools',
    'Auto-scale has 5-15 minute lag. Predictive scaling available with Azure monitor autoscale. Avoid scale-in/out flapping with cooldown periods. Always maintain minimum 2 instances for availability.',
    'Azure App Service, Azure Monitor Autoscale, Azure Functions',
    null
  ],
  [
    18, 'API Versioning Strategy', 'Operations', '2 weeks', '$0', '⭐⭐⭐ Future flexibility', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Infrastructure',
    'Implement consistent API versioning strategy to support backward compatibility and API evolution. Use versioning in API Management to route requests to appropriate backend versions.',
    '1. Choose versioning scheme (URL path, query string, or header - recommend URL path)\n2. Update APIM to support versioning via version sets\n3. Create v1 version set for all existing APIs\n4. Document versioning policy in API documentation\n5. Implement version negotiation logic\n6. Create deprecation policy (minimum 12 months notice)\n7. Add version to all OpenAPI/Swagger definitions\n8. Update client SDKs and documentation',
    'API Management configuration access, backend API modifications, client communication plan',
    'URL path versioning (/api/v1/records) most discoverable. Header versioning cleaner but less visible. Support N-1 versions minimum. Use semantic versioning. APIM can route by version to different backends.',
    'Azure API Management, OpenAPI/Swagger specifications',
    null
  ],
  [
    19, 'Deployment Slots & Blue-Green', 'Operations', '2 weeks', '+10%', '⭐⭐⭐ Zero-downtime deployments', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Infrastructure',
    'Implement blue-green deployment pattern using App Service deployment slots to enable zero-downtime deployments with instant rollback capability.',
    '1. Create staging slots for all production App Services (Standard tier required)\n2. Configure slot settings vs shared settings (connection strings, app settings)\n3. Implement automated deployment to staging slot via Azure DevOps/GitHub Actions\n4. Add automated testing in staging slot (smoke tests, integration tests)\n5. Configure traffic routing rules (start with 5% to staging, gradually increase)\n6. Implement automatic slot swap on successful tests\n7. Create rollback runbook (swap back to previous slot)\n8. Monitor application performance after swap',
    'App Service Standard tier or higher, CI/CD pipeline, automated test suite',
    'Deployment slots cost the same as additional instances but provide staging isolation. Slot swaps are instant (< 1 second). Auto-swap after successful tests. Share slots across environments to reduce costs.',
    'Azure App Service Deployment Slots, Azure DevOps, Application Insights',
    null
  ],
  [
    20, 'Query Performance Optimization', 'Performance', '3 weeks', '$0', '⭐⭐⭐ Better response times', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Data',
    'Perform comprehensive SQL query performance tuning using Query Performance Insights and Index Advisor. Optimize slow queries, add missing indexes, and refactor problematic stored procedures.',
    '1. Enable Query Performance Insights on SQL Database\n2. Identify top 10 resource-consuming queries\n3. Analyze query execution plans using SQL Server Management Studio\n4. Implement recommended indexes from Index Advisor\n5. Refactor N+1 query patterns with joins or eager loading\n6. Add appropriate WHERE clause indexes\n7. Update statistics on large tables\n8. Consider columnstore indexes for analytical queries\n9. Monitor before/after DTU usage',
    'SQL Database Query Store enabled, SQL optimization knowledge, test data for validation',
    'Query Store provides historical performance data. Always test in lower environments first. Some indexes may negatively impact write performance. Use filtered indexes for large tables. Set up query performance alerts.',
    'Azure SQL Database, Query Performance Insight, Index Tuning Advisor, SQL Query Store',
    null
  ],
  [
    21, 'Front Door Multi-Region Config', 'Reliability', '2 weeks', '+25%', '⭐⭐⭐⭐ Geographic redundancy', 'Medium', 'MEDIUM PRIORITY (60-90 Days)',
    'Infrastructure',
    'Configure Azure Front Door with multi-region backend pools to provide automatic failover and improved latency through geographic proximity routing.',
    '1. Deploy secondary App Services in paired region (East US 2)\n2. Configure SQL geo-replica for secondary region (prerequisite)\n3. Add secondary region to Front Door backend pool\n4. Configure health probes on both regions (HTTP/HTTPS to /health)\n5. Set up priority-based routing (Primary: 1, Secondary: 10)\n6. Configure session affinity if needed\n7. Test automatic failover by stopping primary backend\n8. Measure latency improvements for different geographic locations',
    'SQL geo-replication configured, secondary region App Services deployed, Front Door Premium for Private Link',
    'Front Door Standard is sufficient for public endpoints. Premium required for Private Link backends. Priority routing used for active/passive. Weight routing for active/active. Monitor backend health status.',
    'Azure Front Door, App Services in multiple regions, Azure SQL geo-replication',
    null
  ],
  [
    22, 'Azure AI Search Implementation', 'Innovation', '6-8 weeks', '$500-1000/mo', '⭐⭐⭐⭐⭐ Officer productivity', 'Low', 'STRATEGIC (90+ Days)',
    'Apps & AI',
    'Implement Azure AI Search (formerly Cognitive Search) to enable natural language search across records, reports, and documents with AI-powered ranking and semantic understanding.',
    '1. Provision Azure AI Search service (Standard tier with semantic search)\n2. Create search indexes for records, reports, documents\n3. Configure indexers with SQL Database data source\n4. Enable AI enrichment (key phrase extraction, entity recognition, OCR for scanned docs)\n5. Implement semantic search with vector embeddings\n6. Create custom scoring profiles for relevance tuning\n7. Build search UI with facets, filters, autocomplete\n8. Integrate with User Identity for security trimming\n9. Monitor search analytics and optimize',
    'Azure AI Search service, Cognitive Services for enrichment, clean structured data, UI development resources',
    'Standard tier supports semantic search (neural ranking). Use incremental enrichment to reduce costs. Security trimming ensures users only see authorized results. Consider Azure OpenAI for search chat.',
    'Azure AI Search, Azure Cognitive Services, Azure OpenAI (optional), Azure SQL Database',
    null
  ],
  [
    23, 'Document Intelligence POC', 'Innovation', '4-6 weeks', '$200-400/mo', '⭐⭐⭐⭐ Reduce manual entry', 'Low', 'STRATEGIC (90+ Days)',
    'Apps & AI',
    'Proof of concept using Azure Document Intelligence (Form Recognizer) to automatically extract structured data from citation forms, crash reports, and incident reports.',
    '1. Collect sample documents (100+ examples per form type)\n2. Create custom models for citation forms using Document Intelligence Studio\n3. Train models on sample documents with labeled fields\n4. Test model accuracy (target > 95% field extraction accuracy)\n5. Build API integration to process uploaded documents\n6. Implement human-in-the-loop validation workflow\n7. Store extracted data in SQL database\n8. Measure time savings vs manual entry\n9. Calculate ROI for full implementation',
    'Sample documents in consistent formats, Azure Document Intelligence service, validation workflow design',
    'Prebuilt models available for invoices, receipts, IDs. Custom models required for specific forms. Training requires 5-50 labeled examples. Model accuracy improves with more training data. Consider Azure Logic Apps for workflow.',
    'Azure Document Intelligence (Form Recognizer), Azure Blob Storage, Azure Logic Apps',
    null
  ],
  [
    24, 'Event Sourcing for Audit Trail', 'Reliability', '8-12 weeks', '+15%', '⭐⭐⭐⭐⭐ Complete audit history', 'Low', 'STRATEGIC (90+ Days)',
    'Data',
    'Implement event sourcing pattern using Azure Event Store to maintain immutable audit trail of all state changes in the system. This provides complete historical reconstruction and forensics capability.',
    '1. Design domain events for all state changes (record created, updated, status changed)\n2. Implement event store using Azure Cosmos DB or Event Store DB\n3. Create event publishers in application services\n4. Build event projections to maintain current state (CQRS)\n5. Implement event replay for historical reconstruction\n6. Add event versioning strategy for schema evolution\n7. Create audit report builders from event stream\n8. Test performance at scale (1M+ events)',
    'Architecture decision on event store technology, CQRS understanding, significant application re-architecture',
    'Event sourcing provides perfect audit trail but adds complexity. Eventual consistency requires careful handling. Snapshots improve replay performance. Consider Event Hubs or Cosmos DB change feed.',
    'Azure Cosmos DB, Azure Event Hubs, Event Store DB, CQRS implementation',
    'CJIS requires comprehensive audit logs. Event sourcing provides complete, tamper-proof history of all system changes meeting audit and accountability requirements at the application level.'
  ],
  [
    25, 'CQRS Pattern Implementation', 'Performance', '10-12 weeks', '+20%', '⭐⭐⭐⭐ Read/write optimization', 'Low', 'STRATEGIC (90+ Days)',
    'Data',
    'Implement Command Query Responsibility Segregation (CQRS) pattern to separate read and write operations. This enables optimization of each path independently and supports event sourcing.',
    '1. Identify bounded contexts for CQRS implementation (record management, search)\n2. Separate read models (query) from write models (command)\n3. Implement command handlers for all write operations\n4. Build read model projections from events\n5. Use Azure Cache for Redis for read model materialization\n6. Implement eventual consistency handling in UI\n7. Add command validation and authorization\n8. Performance test read and write paths independently',
    'Event sourcing implementation (recommended), architectural understanding of CQRS, eventual consistency handling',
    'CQRS pairs well with event sourcing. Read models can use different storage (SQL, Cosmos, Redis). Eventual consistency requires UI feedback ("processing..."). Adds complexity - use only where needed.',
    'Azure SQL Database for writes, Azure Cosmos DB or Redis for reads, Azure Service Bus for commands',
    null
  ],
  [
    26, 'Premium Service Bus (Geo-DR)', 'Reliability', '2 weeks', '+50% SB cost', '⭐⭐⭐⭐ Message durability', 'Low', 'STRATEGIC (90+ Days)',
    'Infrastructure',
    'Upgrade to Azure Service Bus Premium tier with geo-disaster recovery to ensure message durability during regional outages. Premium tier provides dedicated resources and automatic failover.',
    '1. Create Premium Service Bus namespace in primary region\n2. Create secondary namespace in paired region\n3. Configure geo-disaster recovery pairing\n4. Migrate existing queues and topics to Premium namespace\n5. Update application connection strings with failover connection string\n6. Test message durability during failover\n7. Configure Premium tier features (message batching, partitioning)\n8. Monitor message throughput and latency',
    'Current Service Bus Standard tier, secondary namespace deployment, application testing',
    'Premium tier provides 1 TB messaging, dedicated resources, and predictable performance. Geo-DR provides metadata failover (queues, topics) but not messages in flight. Consider message replication pattern for zero data loss.',
    'Azure Service Bus Premium tier, paired Azure regions',
    null
  ],
  [
    27, 'Azure OpenAI Integration', 'Innovation', '8-10 weeks', '$1000-2000/mo', '⭐⭐⭐⭐ AI-assisted workflows', 'Low', 'STRATEGIC (90+ Days)',
    'Apps & AI',
    'Integrate Azure OpenAI Service to provide AI-assisted report writing, intelligent summarization of incidents, and natural language query capabilities for officers.',
    '1. Apply for Azure OpenAI Service access\n2. Deploy GPT-4 model in Azure OpenAI\n3. Implement responsible AI content filters\n4. Build report writing assistant (guided prompts for narrative sections)\n5. Create summarization API for incident reports\n6. Implement natural language to SQL query translation\n7. Add chat-based search interface using AI Search + OpenAI\n8. Build evaluation framework for AI quality\n9. Document AI transparency and accountability',
    'Azure OpenAI access approval, responsible AI review, GPT-4 use case validation, budget for token usage',
    'Monitor token usage costs closely (input + output tokens). Implement prompt caching for common queries. Use GPT-3.5-turbo for cost-effective scenarios. Add human review for critical content. Follow NIST AI Risk Management Framework.',
    'Azure OpenAI Service, Azure AI Search, Azure Content Safety, Azure Cosmos DB for vector storage',
    'CJIS requires human accountability for AI-generated content. Implement human-in-the-loop validation. Document AI decision-making processes. Ensure no CJI data used in model training.'
  ],
  [
    28, 'Chaos Engineering Setup', 'Reliability', '4-6 weeks', '$0', '⭐⭐⭐ Resilience validation', 'Low', 'STRATEGIC (90+ Days)',
    'Infrastructure',
    'Implement chaos engineering using Azure Chaos Studio to proactively test system resilience by injecting controlled failures and validating recovery procedures.',
    '1. Create Azure Chaos Studio workspace\n2. Define chaos experiments for common failure scenarios (VM restart, network latency, SQL throttling)\n3. Start with non-production environments\n4. Test auto-scaling behavior under load\n5. Validate circuit breaker and retry policies\n6. Test geo-failover procedures\n7. Measure blast radius of failures\n8. Document failure modes and recovery times\n9. Schedule quarterly chaos engineering Game Days',
    'Non-production environment, monitoring and alerting configured, incident response team availability',
    'Start small with read-only experiments. Use Azure Chaos Studio or open-source tools (Chaos Monkey). Run during business hours with team on standby. Document findings and improve resilience. Target MTTR < 30 minutes.',
    'Azure Chaos Studio, Azure Monitor, Application Insights, incident response procedures',
    null
  ],
];

const items: PriorityItem[] = seedRows.map((row, index) => ({
  id: index + 1,
  item_number: row[0] as number,
  recommendation: row[1] as string,
  pillar: row[2] as string,
  effort: row[3] as string,
  cost_impact: row[4] as string,
  business_value: row[5] as string,
  priority_level: row[6] as string,
  category: row[7] as string,
  technical_category: row[8] as string,
  description: row[9] as string | null,
  implementation_steps: row[10] as string | null,
  dependencies: row[11] as string | null,
  technical_notes: row[12] as string | null,
  related_services: row[13] as string | null,
  compliance_notes: row[14] as string | null,
  is_checked: 0,
}));

const outputPath = path.join(process.cwd(), 'public', 'priority-items.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf-8');
console.log(`Generated ${items.length} priority items → ${outputPath}`);
