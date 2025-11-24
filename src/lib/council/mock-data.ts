/**
 * Production-grade mock data for AI Council demo
 * Responses crafted to match top-tier consulting firm quality (BCG, McKinsey)
 */

type AgentId = "ops" | "fin" | "comp" | "it";

interface MockResponse {
  content: string;
  round: number;
  agentId: AgentId;
}

// Round 1: Initial positions
const ROUND_1: Record<AgentId, string> = {
  ops: "We need a phased rollout starting with quick wins. Prioritize energy efficiency retrofits and smart building systems—these deliver 15-20% reductions within 90 days with minimal disruption. The operational sequencing matters: establish baseline metrics first, then layer in behavioral changes, followed by capital-intensive upgrades. Critical path dependencies include securing stakeholder buy-in and ensuring data infrastructure can track granular consumption patterns.",
  
  fin: "The economics favor a blended approach. Quick wins generate £50-80k annual savings with <£30k upfront—payback in 4-6 months. Medium-term investments (solar, HVAC upgrades) require £150-200k capex but deliver £120-180k/year savings, 18-24 month payback. We should structure this as a performance contract where savings fund the next phase. Risk-adjusted ROI shows 2.3x over 3 years if we sequence correctly. The key is avoiding stranded assets by ensuring each investment enables the next.",
  
  comp: "SECR reporting mandates are tightening—non-compliance risks £50k+ fines and reputational damage. CSRD alignment requires Scope 1-3 emissions disclosure by 2025. Our current gap analysis shows we're 40% short on data granularity needed for credible reporting. We must establish audit-ready measurement protocols now, not retroactively. The regulatory tailwinds actually support our business case: early movers get better financing terms and avoid last-minute compliance scrambles that cost 3x more.",
  
  it: "Data infrastructure is the foundation. We need real-time monitoring across all consumption points with sub-metering granularity. Current systems can't disaggregate by department or activity—that's blocking accurate attribution and behavioral interventions. Integration architecture must support API-first design for future IoT expansion. Security and privacy are non-negotiable: GDPR-compliant data handling with role-based access. The platform should be cloud-native for scalability, but with edge computing for latency-critical controls. Estimated 8-week implementation timeline if we leverage existing infrastructure."
};

// Round 2: Building on each other's points
const ROUND_2: Record<AgentId, string> = {
  ops: "Building on Finance's performance contract model—we can structure the rollout to align with their payback timeline. Start with low-hanging fruit in Q1 (lighting, controls), use those savings to fund Q2-Q3 medium-term projects. IT's data platform is critical path: we can't optimize what we can't measure. I'd recommend a parallel track: deploy monitoring infrastructure while executing quick wins, so by month 3 we have both savings and visibility. Compliance's regulatory timeline actually helps us: the 2025 CSRD deadline creates urgency that accelerates internal approvals.",
  
  fin: "Operations' phased approach de-risks the capital allocation. We can fund Phase 1 from operating budget, then use verified savings to justify Phase 2 capex. The key insight from Compliance: regulatory requirements aren't just a cost—they're a forcing function that unlocks better financing. Banks are offering sustainability-linked loans with 50-75bps discount for credible carbon reduction plans. IT's 8-week timeline is aggressive but achievable if we fast-track vendor selection. I'd suggest we structure this as a managed services model: vendor assumes implementation risk, we pay from verified savings.",
  
  comp: "IT's data architecture directly addresses our SECR compliance gap. The sub-metering granularity Finance mentioned enables accurate Scope 2 attribution—critical for credible reporting. Operations' quick wins timeline aligns perfectly: we can demonstrate progress in Q1 reporting cycle, showing regulators we're not just planning but executing. The regulatory landscape is shifting toward mandatory disclosure—early adoption positions us as industry leaders rather than laggards. Finance's sustainability-linked financing is smart: it turns compliance from cost center to competitive advantage.",
  
  it: "Operations' parallel track approach is architecturally sound. We can deploy lightweight monitoring first (2 weeks), then layer in advanced analytics as data accumulates. Finance's managed services model reduces our implementation risk—vendor brings proven integration patterns. Compliance's regulatory requirements actually simplify our data model: we know exactly what metrics to capture and how to structure them for audit. The platform design should be modular: start with energy monitoring, but architecture supports expansion to water, waste, and other sustainability metrics. This future-proofs the investment."
};

// Round 3: Deep dive - challenging assumptions and proposing alternatives
const ROUND_3: Record<AgentId, string> = {
  ops: "I want to push back slightly on Finance's managed services model. While it reduces risk, we lose operational control and flexibility. What happens when we need to pivot quickly based on data insights? I'd prefer a hybrid: vendor handles infrastructure deployment, but we own the optimization logic. Also, Compliance mentioned the 2025 deadline—that's 18 months away. Are we being too conservative with our timeline? We could compress Phase 1 to 60 days if we're willing to accept slightly higher implementation risk.",
  
  fin: "Operations raises a valid point about control, but let's quantify the trade-off. Managed services typically cost 15-20% more annually, but they eliminate 80% of our technical risk. The question is: can we afford to have IT resources tied up in maintenance when they should be building competitive advantages? I'm also concerned about Operations' compressed timeline—rushing Phase 1 could create technical debt that costs us 2-3x more to fix later. What if we structure it as a 90-day pilot with an option to insource after proof of concept?",
  
  comp: "I need to challenge both of you on timeline assumptions. The 2025 CSRD deadline isn't a finish line—it's when reporting becomes mandatory. But we need to demonstrate credible progress in our 2024 reports, which means we need measurement infrastructure operational by Q3 2024. That's only 9 months. Finance's 90-day pilot works, but we can't afford a 'wait and see' approach. We need commitment now, with clear milestones. Also, Operations' concern about control is valid—we need audit trails that we can defend, not vendor black boxes.",
  
  it: "I'm hearing tension between speed and control, which is exactly why we need to architect for both. We can build a platform that gives Operations real-time control while Finance gets the risk mitigation they want. The key is API-first design: vendor provides infrastructure, we build the optimization layer on top. Compliance's audit trail requirement is non-negotiable—we'll design immutable logs from day one. But I agree with Finance: we shouldn't compress timelines recklessly. 8 weeks is already aggressive. Let's commit to quality over speed, but with clear weekly milestones."
};

// Round 4: Synthesis - finding common ground and addressing concerns
const ROUND_4: Record<AgentId, string> = {
  ops: "Okay, I'm hearing consensus on the hybrid model—vendor infrastructure, our optimization logic. That gives us the control we need while de-risking implementation. Finance's 90-day pilot with insource option is smart—it lets us prove value before committing long-term. Compliance's Q3 2024 deadline is actually helpful: it creates a hard milestone that forces discipline. My revised recommendation: 60-day Phase 1 quick wins, parallel 8-week data platform deployment, with weekly governance checkpoints. This gives us both speed and quality gates.",
  
  fin: "Operations' revised timeline works if we structure the financing correctly. I propose we fund Phase 1 from OpEx with a clear success metric: if we hit 15% reduction and £50k savings by day 60, we unlock Phase 2 capex automatically. This creates accountability without bureaucracy. Compliance's audit trail requirement is actually a feature, not a bug—it gives us the data integrity Finance needs for sustainability-linked loans. IT's API-first approach solves the control vs. risk tension elegantly. I'm comfortable with this hybrid model if we can lock in vendor pricing now.",
  
  comp: "I appreciate Operations and Finance finding middle ground. The hybrid model with our audit requirements actually strengthens the business case—we get both operational flexibility and regulatory defensibility. Finance's success metric approach is brilliant: it turns our compliance deadline into a forcing function for value delivery. One clarification: when I said Q3 2024, I meant we need measurement infrastructure live by then, not just started. So IT's 8-week timeline starting now gets us there with buffer. But we need to commit to weekly governance—no exceptions.",
  
  it: "The hybrid model aligns perfectly with our technical architecture. We can deliver vendor-managed infrastructure with our optimization layer in 8 weeks, with weekly milestones that Finance and Compliance can audit. Operations' 60-day quick wins timeline is achievable if we start data platform deployment in parallel—not sequential. The key is Week 1-2: vendor infrastructure setup; Week 3-4: our API integration layer; Week 5-6: data pipeline and analytics; Week 7-8: testing and go-live. This gives Operations their control, Finance their risk mitigation, and Compliance their audit trail—all by Q3 2024."
};

// Round 5: Refinement - addressing edge cases and final tweaks
const ROUND_5: Record<AgentId, string> = {
  ops: "One edge case we haven't discussed: what if quick wins underperform? Finance's success metric is 15% reduction, but what if we only hit 10%? Do we still unlock Phase 2, or do we need to adjust? I'd suggest a tiered approach: 12% reduction unlocks Phase 2 at reduced scale, 15% unlocks full scale, 18%+ unlocks accelerated Phase 3. This gives us flexibility without killing momentum. Also, IT's 8-week timeline assumes no major integration surprises—we should build in a 2-week buffer for unknowns.",
  
  fin: "Operations' tiered success metric is exactly the kind of risk management we need. I'd structure it as: 12% = £40k savings unlocks £120k Phase 2, 15% = £60k savings unlocks £180k Phase 2, 18%+ = £80k+ savings unlocks £200k Phase 2 plus early Phase 3 consideration. This protects capital while rewarding performance. IT's buffer concern is valid—let's make the 8-week timeline 'best case' and budget for 10 weeks. The key is we start now, not wait for perfect conditions. Also, we should lock in vendor pricing this week before they realize how urgent this is.",
  
  comp: "I like the tiered approach—it creates accountability without being punitive. But we need to ensure that even at 12% reduction, we're still meeting our regulatory reporting requirements. The SECR threshold isn't about percentage reduction, it's about demonstrating credible action. So even if we 'only' hit 12%, we can still show regulators we're executing a comprehensive plan. IT's buffer is smart, but let's not use it as an excuse for scope creep. Weekly governance will catch delays early. One more thing: we need to document this tiered model in our compliance framework so it's audit-ready.",
  
  it: "The tiered model works technically—we can build the monitoring platform to track these thresholds in real-time and trigger automatic phase unlocks. Finance's vendor pricing lock is critical: we should negotiate this week with a 30-day decision window. Operations' buffer concern is valid, but I'd frame it differently: we have 8 weeks of development work, plus 2 weeks of contingency for integration surprises. The key is we don't add new features during those 8 weeks—scope discipline is how we hit timelines. Compliance's audit documentation requirement is actually helpful: it forces us to design the system with reporting in mind from day one."
};

// Round 6: Consensus building - final alignment and preparation for decision
const ROUND_6: Record<AgentId, string> = {
  ops: "I think we've reached alignment. The hybrid model with tiered success metrics gives us the right balance of speed, control, and risk management. My final recommendation: execute 60-day Phase 1 quick wins starting immediately, deploy data platform in parallel over 8-10 weeks, with weekly governance checkpoints. If we hit 15% reduction and £60k savings, we unlock full Phase 2. The key success factor is starting now—not waiting for perfect conditions. We have stakeholder buy-in, we have financing structure, we have technical architecture. Let's execute.",
  
  fin: "I'm aligned. The financial structure is sound: OpEx-funded Phase 1 with performance-gated Phase 2 capex. Risk-adjusted ROI of 2.3x over 3 years, with sustainability-linked financing reducing our cost of capital. The tiered success metrics protect our downside while rewarding upside. My final recommendation: lock vendor pricing this week, start Phase 1 immediately, establish weekly governance, and prepare Phase 2 financing package now so it's ready when we hit the 15% threshold. The economics work, the risk is manageable, and the opportunity cost of delay is significant. Let's move.",
  
  comp: "I'm aligned. The plan addresses all regulatory requirements: SECR compliance through credible action, CSRD readiness through audit-ready data infrastructure, and early-mover advantage through sustainability-linked financing. My final recommendation: document this entire framework in our compliance system this week, establish the governance structure, and ensure weekly checkpoints include regulatory milestone tracking. The 2025 deadline isn't a constraint—it's an enabler that accelerates value delivery. We have a defensible, executable plan that turns compliance into competitive advantage. I'm ready to proceed.",
  
  it: "I'm aligned. The technical architecture is sound: vendor-managed infrastructure with our optimization layer, API-first design for flexibility, immutable audit trails for compliance, and modular expansion for future metrics. My final recommendation: finalize vendor selection this week, kick off infrastructure deployment Week 1, integrate our optimization layer Weeks 3-4, complete data pipeline Weeks 5-6, and go-live Weeks 7-8 with 2-week buffer. The platform will support Operations' real-time control, Finance's performance metrics, and Compliance's audit requirements. We have the technical foundation for a world-class sustainability program. Let's build it."
};

// Helper to get mock response based on agent, round, and context
export function getMockCouncilResponse(
  agentId: AgentId,
  round: number,
  transcript: Array<{ agentId: string; content: string }>
): string {
  // Round 1: Initial positions
  if (round === 1) {
    return ROUND_1[agentId];
  }
  
  // Round 2: Build on others' points
  if (round === 2) {
    return ROUND_2[agentId];
  }
  
  // Round 3: Deep dive - challenge assumptions
  if (round === 3) {
    return ROUND_3[agentId];
  }
  
  // Round 4: Synthesis - find common ground
  if (round === 4) {
    return ROUND_4[agentId];
  }
  
  // Round 5: Refinement - edge cases
  if (round === 5) {
    return ROUND_5[agentId];
  }
  
  // Round 6: Consensus building
  if (round === 6) {
    return ROUND_6[agentId];
  }
  
  // Fallback for rounds beyond 6 (shouldn't happen, but safe)
  return ROUND_6[agentId];
}

// Mock decision for final synthesis
export const MOCK_DECISION = {
  title: "Phased Sustainability Transformation: Data-Driven Performance Contract Model",
  rationale: "The council recommends a three-phase approach combining quick operational wins with strategic capital investments, funded through a performance contract structure. This model de-risks capital allocation, accelerates time-to-value, and positions the organization for regulatory compliance while generating measurable ROI. The critical success factor is parallel-track execution: deploying data infrastructure alongside quick wins to enable continuous optimization.",
  actions: [
    {
      title: "Deploy Real-Time Energy Monitoring Platform",
      owner: "Data/IT",
      effort: "M",
      impact: "H",
      costRange: "£45k–£65k",
      timeline: "<90d",
      notes: "Foundation for all optimization efforts. Enables granular attribution, behavioral interventions, and audit-ready reporting. Cloud-native architecture with edge computing for controls."
    },
    {
      title: "Execute Quick-Win Efficiency Retrofits",
      owner: "Operations",
      effort: "S",
      impact: "M",
      costRange: "£25k–£35k",
      timeline: "<90d",
      notes: "Lighting upgrades, smart controls, HVAC optimization. Generates £50-80k annual savings with 4-6 month payback. Funds subsequent phases."
    },
    {
      title: "Establish SECR/CSRD Compliance Framework",
      owner: "Compliance",
      effort: "M",
      impact: "H",
      costRange: "£15k–£25k",
      timeline: "Quarter",
      notes: "Audit-ready measurement protocols, data governance, reporting automation. Positions organization for sustainability-linked financing and regulatory leadership."
    },
    {
      title: "Structure Performance Contract Financing",
      owner: "Finance",
      effort: "M",
      impact: "H",
      costRange: "£150k–£200k",
      timeline: "Quarter",
      notes: "Medium-term investments (solar, HVAC upgrades) funded through verified savings. 18-24 month payback, 2.3x risk-adjusted ROI over 3 years. Leverages sustainability-linked loan structures."
    }
  ],
  risks: [
    "Data platform implementation delays could block optimization efforts and compliance reporting",
    "Stakeholder buy-in challenges may slow quick-win execution and reduce savings velocity",
    "Vendor selection and integration complexity could extend timelines beyond 8-week target",
    "Regulatory requirements may evolve faster than implementation, creating compliance gaps"
  ],
  metrics: [
    "15-20% energy reduction within 90 days (quick wins)",
    "£50-80k annual savings from Phase 1 (4-6 month payback)",
    "100% SECR/CSRD compliance readiness by Q2 2025",
    "2.3x risk-adjusted ROI over 3-year horizon",
    "Real-time monitoring coverage across all consumption points",
    "Zero compliance fines or regulatory penalties"
  ]
};

