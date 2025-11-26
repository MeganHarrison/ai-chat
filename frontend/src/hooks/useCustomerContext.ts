import { useCallback, useEffect, useState } from "react";

import { SUPPORT_PROFILE_URL, SUPPORT_RECOMMEND_PLAN_URL } from "../lib/config";

export type NutritionProfile = {
  id: string;
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  primary_goal?: string | null;
  cooking_preference?: boolean | null;
  eating_habits?: string | null;
  emotional_why?: string | null;
  support_level?: number | null;
  objection?: string | null;
  recommended_plan?: string | null;
  returning_user?: boolean;
  last_seen?: string | null;
};

export type PlanRecommendation = {
  program: string;
  variant: string;
  recommended_plan: string;
};

type ProfileResponse = {
  profile: NutritionProfile;
  plan?: PlanRecommendation;
};

const withThread = (url: string, threadId: string | null) =>
  threadId ? `${url}?thread_id=${encodeURIComponent(threadId)}` : url;

export function useCustomerContext(threadId: string | null) {
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(withThread(SUPPORT_PROFILE_URL, threadId), {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Failed to load profile (${response.status})`);
      }
      const payload = (await response.json()) as ProfileResponse;
      setProfile(payload.profile ?? null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  const saveProfile = useCallback(
    async (patch: Partial<NutritionProfile>) => {
      setSaving(true);
      setError(null);
      try {
        const response = await fetch(withThread(SUPPORT_PROFILE_URL, threadId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(patch),
        });
        if (!response.ok) {
          throw new Error(`Failed to update profile (${response.status})`);
        }
        const payload = (await response.json()) as ProfileResponse;
        setProfile(payload.profile ?? null);
        return payload.profile;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [threadId],
  );

  const recommendPlan = useCallback(
    async (patch: Partial<NutritionProfile> = {}) => {
      setSaving(true);
      setError(null);
      try {
        const response = await fetch(withThread(SUPPORT_RECOMMEND_PLAN_URL, threadId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(patch),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch recommendation (${response.status})`);
        }
        const payload = (await response.json()) as ProfileResponse;
        setProfile(payload.profile ?? null);
        return payload.plan;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [threadId],
  );

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, saving, error, refresh: fetchProfile, saveProfile, recommendPlan };
}
