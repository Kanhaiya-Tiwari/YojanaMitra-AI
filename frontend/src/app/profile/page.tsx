"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { loadLang, loadProfile, saveProfile, type Profile } from "@/lib/storage";

export default function ProfilePage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [profile, setProfile] = useState<Profile>({});

  useEffect(() => {
    setLang(loadLang());
    setProfile(loadProfile());
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function save() {
    saveProfile(profile);
    alert(lang === "hi" ? "सेव हो गया" : "Saved");
  }

  return (
    <main className="row" style={{ flexDirection: "column", gap: 14 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{lang === "hi" ? "आपका प्रोफाइल" : "Your profile"}</h2>
        <Link className="btn" href="/">
          {lang === "hi" ? "होम" : "Home"}
        </Link>
      </div>

      <div className="card">
        <div className="row">
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "नाम" : "Name"}</label>
            <input value={profile.name || ""} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label>{lang === "hi" ? "उम्र" : "Age"}</label>
            <input
              type="number"
              value={profile.age ?? ""}
              onChange={(e) => update("age", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <label>{lang === "hi" ? "लिंग" : "Gender"}</label>
            <select value={profile.gender || ""} onChange={(e) => update("gender", e.target.value || undefined)}>
              <option value="">{lang === "hi" ? "चुनें" : "Select"}</option>
              <option value="male">{lang === "hi" ? "पुरुष" : "Male"}</option>
              <option value="female">{lang === "hi" ? "महिला" : "Female"}</option>
              <option value="other">{lang === "hi" ? "अन्य" : "Other"}</option>
            </select>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "राज्य" : "State"}</label>
            <input value={profile.state || ""} onChange={(e) => update("state", e.target.value)} />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "जिला" : "District"}</label>
            <input value={profile.district || ""} onChange={(e) => update("district", e.target.value)} />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "आय (₹/वर्ष)" : "Income (₹/year)"}</label>
            <input
              type="number"
              value={profile.income ?? ""}
              onChange={(e) => update("income", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "पेशा" : "Occupation"}</label>
            <input value={profile.occupation || ""} onChange={(e) => update("occupation", e.target.value)} />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "शिक्षा" : "Education"}</label>
            <input value={profile.education || ""} onChange={(e) => update("education", e.target.value)} />
          </div>
          <div style={{ flex: "1 1 220px" }}>
            <label>{lang === "hi" ? "श्रेणी" : "Category"}</label>
            <select value={profile.category || ""} onChange={(e) => update("category", e.target.value || undefined)}>
              <option value="">{lang === "hi" ? "चुनें" : "Select"}</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="General">{lang === "hi" ? "सामान्य" : "General"}</option>
            </select>
          </div>
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <label style={{ flex: "1 1 100%" }}>{lang === "hi" ? "टैग्स" : "Tags"}</label>
          {[
            ["is_farmer", lang === "hi" ? "किसान" : "Farmer"],
            ["is_student", lang === "hi" ? "छात्र" : "Student"],
            ["is_business_owner", lang === "hi" ? "व्यवसायी" : "Business"],
            ["is_job_seeker", lang === "hi" ? "नौकरी खोज" : "Job seeker"],
            ["land_ownership", lang === "hi" ? "जमीन है" : "Own land"],
            ["disability_status", lang === "hi" ? "दिव्यांग" : "Disability"],
            ["location_rural", lang === "hi" ? "ग्रामीण" : "Rural"],
          ].map(([key, label]) => {
            const k = key as keyof Profile;
            const checked = Boolean(profile[k]);
            return (
              <button
                key={key}
                className="btn"
                onClick={() => update(k, (!checked as unknown) as Profile[typeof k])}
                style={{
                  borderColor: checked ? "rgba(94, 234, 212, 0.45)" : undefined,
                  background: checked ? "rgba(94, 234, 212, 0.10)" : undefined,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn btnPrimary" onClick={save}>
            {lang === "hi" ? "सेव" : "Save"}
          </button>
          <Link className="btn" href="/chat">
            {lang === "hi" ? "चैट पर जाएँ" : "Go to chat"}
          </Link>
        </div>
      </div>
    </main>
  );
}

