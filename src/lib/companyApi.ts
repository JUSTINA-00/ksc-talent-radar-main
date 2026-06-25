import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";
import {
  normalizeCompanyProfile,
  normalizeCompanySummary,
  normalizeDashboardSkills,
  type CompanyProfile,
  type CompanySummary,
  type DashboardSkill,
} from "./companyData";

export interface CompanySkillsData {
  skills: DashboardSkill[];
  topics: Record<number, string[]>;
}

export interface CompanyProfileData {
  summary: CompanySummary;
  profile: CompanyProfile;
}

export function useCompanies(): UseQueryResult<CompanySummary[], Error> {
  return useQuery<CompanySummary[], Error>({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_json")
        .select("company_id, short_json");

      if (error) throw error;
      if (!data) return [];

      return data.map((row: { company_id: number; short_json: Record<string, unknown> }) =>
        normalizeCompanySummary(row.short_json, row.company_id)
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useCompanyProfile(companyId: number | undefined): UseQueryResult<CompanyProfileData | null, Error> {
  return useQuery<CompanyProfileData | null, Error>({
    queryKey: ["company", companyId],
    queryFn: async () => {
      if (companyId === undefined) return null;
      const { data, error } = await supabase
        .from("company_json")
        .select("company_id, short_json, full_json")
        .eq("company_id", companyId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        summary: normalizeCompanySummary(data.short_json, data.company_id),
        profile: normalizeCompanyProfile(data.full_json, data.short_json),
      };
    },
    enabled: companyId !== undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

export function useCompanySkills(companyId: number | undefined): UseQueryResult<CompanySkillsData, Error> {
  return useQuery<CompanySkillsData, Error>({
    queryKey: ["company-skills", companyId],
    queryFn: async () => {
      if (companyId === undefined) return { skills: [], topics: {} };

      const { data: levels, error: levelsError } = await supabase
        .from("company_skill_levels")
        .select("company_id, skill_set_id, required_level, required_proficiency_level_id")
        .eq("company_id", companyId);

      if (levelsError) throw levelsError;
      if (!levels || levels.length === 0) return { skills: [], topics: {} };

      const skillSetIds = Array.from(new Set(levels.map((row: any) => row.skill_set_id)));

      const [{ data: topics, error: topicsError }, { data: proficiencies, error: proficiencyError }, { data: skillSets, error: skillSetError }] =
        await Promise.all([
          supabase
            .from("skill_set_topics")
            .select("skill_set_id, level_number, topics")
            .in("skill_set_id", skillSetIds),
          supabase
            .from("proficiency_levels")
            .select("proficiency_level_id, proficiency_name, proficiency_code"),
          supabase
            .from("skill_set_master")
            .select("skill_set_id, skill_set_name, short_name")
            .in("skill_set_id", skillSetIds),
        ]);

      if (topicsError) throw topicsError;
      if (proficiencyError) throw proficiencyError;
      if (skillSetError) throw skillSetError;

      const proficiencyMap = Object.fromEntries(
        (proficiencies ?? []).map((row: any) => [row.proficiency_level_id, row.proficiency_name])
      );

      const skillSetMap = Object.fromEntries(
        (skillSets ?? []).map((row: any) => [row.skill_set_id, row])
      );

      const topicMap = (topics ?? []).reduce<Record<number, string[]>>((acc, row: any) => {
        const skillSetId = Number(row.skill_set_id);
        if (!acc[skillSetId]) acc[skillSetId] = [];
        const topicsValue = row.topics;
        if (Array.isArray(topicsValue)) {
          acc[skillSetId][row.level_number - 1] = topicsValue.join(", ");
        } else if (typeof topicsValue === "string") {
          acc[skillSetId][row.level_number - 1] = topicsValue;
        }
        return acc;
      }, {});

      const normalizedSkills = normalizeDashboardSkills(
        levels.map((row: any) => ({
          skill_set_id: row.skill_set_id,
          skill_set_name:
            skillSetMap[row.skill_set_id]?.skill_set_name ??
            skillSetMap[row.skill_set_id]?.short_name ??
            `Skill ${row.skill_set_id}`,
          required_level: row.required_level,
          required_proficiency: proficiencyMap[row.required_proficiency_level_id] ?? "",
        }))
      );

      return {
        skills: normalizedSkills,
        topics: topicMap,
      };
    },
    enabled: companyId !== undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}
