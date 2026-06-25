import type { ComponentType } from "react";
import {
  Building2, Eye, Users, DollarSign, Globe, Package, Cpu, Handshake, Swords,
  Target, Heart, Coffee, Newspaper, BarChart3, Shield, MapPin, Activity,
  GraduationCap, Star, Gift, Smartphone, Phone,
} from "lucide-react";

export interface FieldDef {
  key: string;
  label: string;
}
export interface SectionDef {
  id: string;
  title: string;
  Icon: ComponentType<{ className?: string }>;
  fields: FieldDef[];
}

const F = (key: string, label: string): FieldDef => ({ key, label });

export function buildIntelligenceSections(_profile?: Record<string, unknown>): SectionDef[] {
  return [
    { id: "identity", title: "Company Identity", Icon: Building2, fields: [
      F("name", "Name"), F("short_name", "Short Name"), F("category", "Category"),
      F("incorporation_year", "Incorporated"), F("nature_of_company", "Nature"),
    ]},
    { id: "overview", title: "Overview & Vision", Icon: Eye, fields: [
      F("overview_text", "Overview"), F("vision_statement", "Vision"),
      F("mission_statement", "Mission"), F("core_values", "Core Values"),
      F("history_timeline", "History"),
    ]},
    { id: "leadership", title: "Leadership", Icon: Users, fields: [
      F("ceo_name", "CEO"), F("ceo_linkedin_url", "CEO LinkedIn"),
      F("key_leaders", "Key Leaders"), F("board_members", "Board Members"),
      F("warm_intro_pathways", "Intro Pathways"), F("decision_maker_access", "Decision-Maker Access"),
    ]},
    { id: "funding", title: "Funding & Financials", Icon: DollarSign, fields: [
      F("annual_revenue", "Annual Revenue"), F("annual_profit", "Annual Profit"),
      F("revenue_mix", "Revenue Mix"), F("valuation", "Valuation"),
      F("yoy_growth_rate", "YoY Growth"), F("profitability_status", "Profitability"),
      F("key_investors", "Investors"), F("recent_funding_rounds", "Recent Funding"),
      F("total_capital_raised", "Capital Raised"),
    ]},
    { id: "presence", title: "Global Presence", Icon: Globe, fields: [
      F("headquarters_address", "Headquarters"), F("operating_countries", "Countries"),
      F("office_count", "Office Count"), F("office_locations", "Offices"),
      F("employee_size", "Employees"),
    ]},
    { id: "products", title: "Products & Services", Icon: Package, fields: [
      F("offerings_description", "Offerings"), F("focus_sectors", "Focus Sectors"),
      F("pain_points_addressed", "Pain Points Solved"), F("top_customers", "Top Customers"),
      F("case_studies", "Case Studies"), F("product_pipeline", "Pipeline"),
    ]},
    { id: "tech", title: "Technology Stack", Icon: Cpu, fields: [
      F("tech_stack", "Tech Stack"), F("ai_ml_adoption_level", "AI/ML Adoption"),
      F("cybersecurity_posture", "Cybersecurity"), F("intellectual_property", "IP"),
      F("r_and_d_investment", "R&D Spend"), F("tech_adoption_rating", "Tech Rating"),
    ]},
    { id: "partners", title: "Partnerships & Ecosystem", Icon: Handshake, fields: [
      F("partnership_ecosystem", "Partners"), F("technology_partners", "Tech Partners"),
      F("industry_associations", "Associations"),
    ]},
    { id: "competition", title: "Competitive Landscape", Icon: Swords, fields: [
      F("key_competitors", "Competitors"), F("market_share_percentage", "Market Share"),
      F("benchmark_vs_peers", "Vs Peers"), F("competitive_advantages", "Advantages"),
      F("weaknesses_gaps", "Weaknesses"),
    ]},
    { id: "market", title: "Market Opportunity", Icon: Target, fields: [
      F("tam", "TAM"), F("sam", "SAM"), F("som", "SOM"),
      F("future_projections", "Projections"), F("strategic_priorities", "Strategic Priorities"),
      F("innovation_roadmap", "Innovation Roadmap"), F("go_to_market_strategy", "GTM"),
    ]},
    { id: "value", title: "Core Value Proposition & ESG", Icon: Heart, fields: [
      F("core_value_proposition", "Value Proposition"),
      F("unique_differentiators", "Differentiators"),
      F("esg_ratings", "ESG"), F("sustainability_csr", "Sustainability & CSR"),
      F("carbon_footprint", "Carbon Footprint"), F("ethical_sourcing", "Ethical Sourcing"),
    ]},
    { id: "culture", title: "Culture & Work Life", Icon: Coffee, fields: [
      F("work_culture_summary", "Culture"), F("manager_quality", "Managers"),
      F("psychological_safety", "Psych Safety"), F("feedback_culture", "Feedback"),
      F("diversity_inclusion_score", "D&I"), F("ethical_standards", "Ethics"),
      F("burnout_risk", "Burnout"), F("mission_clarity", "Mission Clarity"),
    ]},
    { id: "news", title: "Recent News & Milestones", Icon: Newspaper, fields: [
      F("recent_news", "News"), F("awards_recognitions", "Awards"),
      F("event_participation", "Events"),
    ]},
    { id: "sales", title: "Sales & Customer Metrics", Icon: BarChart3, fields: [
      F("sales_motion", "Sales Motion"), F("customer_acquisition_cost", "CAC"),
      F("customer_lifetime_value", "LTV"), F("cac_ltv_ratio", "CAC/LTV"),
      F("churn_rate", "Churn"), F("net_promoter_score", "NPS"),
      F("customer_concentration_risk", "Concentration Risk"),
    ]},
    { id: "risk", title: "Risk & Compliance", Icon: Shield, fields: [
      F("regulatory_status", "Regulatory"), F("legal_issues", "Legal"),
      F("supply_chain_dependencies", "Supply Chain"),
      F("geopolitical_risks", "Geopolitical"), F("macro_risks", "Macro"),
      F("layoff_history", "Layoffs"), F("crisis_behavior", "Crisis Behavior"),
    ]},
    { id: "location", title: "Work Location & Commute", Icon: MapPin, fields: [
      F("remote_policy_details", "Remote Policy"), F("flexibility_level", "Flexibility"),
      F("typical_hours", "Hours"), F("overtime_expectations", "Overtime"),
      F("weekend_work", "Weekends"), F("location_centrality", "Location"),
      F("public_transport_access", "Transport"), F("cab_policy", "Cab Policy"),
      F("airport_commute_time", "Airport Commute"), F("office_zone_type", "Zone"),
    ]},
    { id: "safety", title: "Safety & Wellbeing", Icon: Activity, fields: [
      F("area_safety", "Area Safety"), F("safety_policies", "Safety Policies"),
      F("infrastructure_safety", "Infrastructure"), F("emergency_preparedness", "Emergency Prep"),
      F("health_support", "Health Support"),
    ]},
    { id: "career", title: "Career Growth & Learning", Icon: GraduationCap, fields: [
      F("training_spend", "Training Spend"), F("onboarding_quality", "Onboarding"),
      F("learning_culture", "Learning"), F("mentorship_availability", "Mentorship"),
      F("internal_mobility", "Internal Mobility"), F("promotion_clarity", "Promotions"),
      F("role_clarity", "Role Clarity"), F("early_ownership", "Early Ownership"),
      F("work_impact", "Work Impact"), F("cross_functional_exposure", "Cross-functional"),
      F("exit_opportunities", "Exits"), F("skill_relevance", "Skill Relevance"),
      F("global_exposure", "Global Exposure"),
    ]},
    { id: "brand", title: "Brand & Reputation", Icon: Star, fields: [
      F("brand_value", "Brand"), F("brand_sentiment_score", "Sentiment"),
      F("external_recognition", "Recognition"), F("client_quality", "Clients"),
      F("network_strength", "Network"), F("customer_testimonials", "Testimonials"),
    ]},
    { id: "compensation", title: "Compensation & Benefits", Icon: Gift, fields: [
      F("leave_policy", "Leave"), F("family_health_insurance", "Family Insurance"),
      F("esops_incentives", "ESOPs"), F("relocation_support", "Relocation"),
      F("lifestyle_benefits", "Lifestyle"),
    ]},
    { id: "digital", title: "Digital Presence & Ratings", Icon: Smartphone, fields: [
      F("website_url", "Website"), F("linkedin_url", "LinkedIn"),
      F("twitter_handle", "Twitter"), F("facebook_url", "Facebook"),
      F("instagram_url", "Instagram"), F("marketing_video_url", "Marketing Video"),
      F("website_quality", "Website Quality"), F("website_traffic_rank", "Traffic Rank"),
      F("social_media_followers", "Followers"),
      F("glassdoor_rating", "Glassdoor"), F("indeed_rating", "Indeed"), F("google_rating", "Google"),
    ]},
    { id: "contact", title: "Contact Information", Icon: Phone, fields: [
      F("primary_contact_email", "Email"), F("primary_phone_number", "Phone"),
      F("contact_person_name", "Contact Name"), F("contact_person_title", "Contact Title"),
      F("contact_person_email", "Contact Email"), F("contact_person_phone", "Contact Phone"),
    ]},
  ];
}
