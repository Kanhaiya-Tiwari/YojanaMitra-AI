export type Profile = {
  name?: string;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  occupation?: string;
  income?: number;
  education?: string;
  category?: string;
  is_farmer?: boolean;
  is_student?: boolean;
  is_business_owner?: boolean;
  is_job_seeker?: boolean;
  land_ownership?: boolean;
  land_acres?: number;
  disability_status?: boolean;
  location_rural?: boolean;
};

const KEY_PROFILE = "ym_profile_v1";
const KEY_LANG = "ym_lang_v1";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY_PROFILE) || "{}");
  } catch {
    return {};
  }
}

export function saveProfile(profile: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
}

export function loadLang(): "en" | "hi" {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(KEY_LANG);
  return v === "hi" ? "hi" : "en";
}

export function saveLang(lang: "en" | "hi") {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_LANG, lang);
}

