import { useState, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 0, label: "Personal",   icon: "👤" },
  { id: 1, label: "Contact",    icon: "📞" },
  { id: 2, label: "Academic",   icon: "🎓" },
  { id: 3, label: "Program",    icon: "🏫" },
  { id: 4, label: "Documents",  icon: "📄" },
  { id: 5, label: "Guardian",   icon: "👨‍👩‍👧" },
  { id: 6, label: "Additional", icon: "💼" },
  { id: 7, label: "Review",     icon: "✅" },
];

const genId = () => "APP-" + Math.random().toString(36).slice(2, 8).toUpperCase();

const INITIAL = {
  appId: genId(),
  personal: { fullName: "", fatherName: "", gender: "", dob: "", cnic: "", nationality: "Pakistani", religion: "", province: "", district: "" },
  contact: { email: "", phone: "", altPhone: "", city: "", postalCode: "", currentAddress: "", permanentAddress: "" },
  matric: { board: "", roll: "", year: "", total: "", obtained: "", grade: "", subjects: "" },
  inter: { board: "", roll: "", year: "", total: "", obtained: "", grade: "", group: "" },
  prefs: [{ uni: "", campus: "", program: "" }, { uni: "", campus: "", program: "" }, { uni: "", campus: "", program: "" }],
  docs: { cnic: null, matric: null, inter: null, domicile: null, photo: null, char: null },
  guardian: { name: "", relation: "", cnic: "", phone: "", occupation: "", income: "" },
  additional: { hafiz: false, disability: false, disabilityDetail: "", sports: false, scholarship: false },
  automation: { portalEmail: "", portalPass: "", notes: "" },
};

// ─── Theme Tokens ─────────────────────────────────────────────────────────────
const tk = {
  card:        "#e7dbbf",
  input:       "#dbc894",
  muted:       "#decea0",
  accent:      "#dbc894",
  border:      "#b19681",
  radius:      "0.425rem",
  primary:     "#8d9d4f",
  primaryDk:   "#7d8d45",
  sidebar:     "#e2d1a2",
  secondary:   "#decea0",
  background:  "#e4d7b0",
  foreground:  "#5c4b3e",
  destructive: "#d98b7e",
  mutedFg:     "#85766a",
  primaryFg:   "#fdfbf6",
  popover:     "#f3ead2",
  fontSans:    "'Merriweather', serif",
  fontSerif:   "'Source Serif 4', serif",
  fontMono:    "'JetBrains Mono', monospace",
};

// ─── Global Styles (injected once) ───────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .saf-inp:focus, .saf-sel:focus, .saf-ta:focus {
    outline: none;
    border-color: #8d9d4f !important;
    box-shadow: 0 0 0 3px rgba(141,157,79,.15) !important;
    background: #f3ead2 !important;
  }
  .saf-inp::placeholder, .saf-ta::placeholder {
    color: #85766a; opacity: .7; font-style: italic;
  }
  .saf-step-btn:hover:not(.saf-step-active):not(.saf-step-done) {
    background: #decea0 !important;
    color: #5c4b3e !important;
  }
  .saf-btn-back:hover:not(:disabled) {
    background: #decea0 !important;
    color: #5c4b3e !important;
  }
  .saf-btn-next:hover:not(:disabled) {
    background: #7d8d45 !important;
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 rgba(141,157,79,.5) !important;
  }
  .saf-btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 3px 3px 0 rgba(92,75,62,.5) !important;
  }
  .saf-file-zone:hover {
    border-color: #8d9d4f !important;
    background: #e2d1a2 !important;
  }
  .saf-stepper::-webkit-scrollbar { display: none; }
`;

// ─── Primitive Components ─────────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div style={{ marginBottom: "1.1rem" }}>
    <label style={{
      display: "block", fontFamily: tk.fontMono,
      fontSize: "10px", fontWeight: 500,
      letterSpacing: ".1em", textTransform: "uppercase",
      color: tk.mutedFg, marginBottom: "6px",
    }}>
      {label}{required && <span style={{ color: tk.destructive, marginLeft: 2 }}>*</span>}
    </label>
    {children}
  </div>
);

const inputBase = {
  width: "100%", height: "40px", borderRadius: tk.radius,
  border: `1px solid ${tk.border}`, padding: "0 13px",
  fontSize: "13.5px", fontFamily: tk.fontSans,
  fontWeight: 300, color: tk.foreground,
  background: tk.input, outline: "none",
  boxSizing: "border-box",
  transition: "border-color .15s, box-shadow .15s, background .15s",
  appearance: "none", WebkitAppearance: "none",
};

const Inp = ({ style, ...props }) => (
  <input className="saf-inp" style={{ ...inputBase, ...style }} {...props} />
);

const Sel = ({ children, style, ...props }) => (
  <select className="saf-sel" style={{ ...inputBase, cursor: "pointer", ...style }} {...props}>
    {children}
  </select>
);

const Textarea = ({ style, ...props }) => (
  <textarea
    className="saf-ta"
    style={{ ...inputBase, height: "80px", padding: "10px 13px", resize: "vertical", lineHeight: 1.6, ...style }}
    {...props}
  />
);

const Row2 = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
    {children}
  </div>
);

const SectionTitle = ({ icon, text, style }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "12px",
    marginBottom: "1.75rem", paddingBottom: "1rem",
    borderBottom: `1px solid ${tk.border}`, ...style,
  }}>
    <div style={{
      width: "34px", height: "34px", borderRadius: "4px",
      border: `1px solid ${tk.border}`, background: tk.sidebar,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "15px", flexShrink: 0,
    }}>{icon}</div>
    <span style={{ fontFamily: tk.fontSerif, fontSize: "16px", fontWeight: 600, color: tk.foreground, letterSpacing: "-.01em" }}>
      {text}
    </span>
  </div>
);

const SubBlock = ({ label, children }) => (
  <div style={{
    background: tk.sidebar, border: `1px solid ${tk.border}`,
    borderRadius: tk.radius, padding: "1.25rem", marginBottom: "1.25rem",
  }}>
    {label && (
      <div style={{
        fontFamily: tk.fontMono, fontSize: "10px", fontWeight: 500,
        color: tk.primary, textTransform: "uppercase", letterSpacing: ".1em",
        marginBottom: "1rem", paddingBottom: ".6rem",
        borderBottom: `1px dashed ${tk.border}`,
      }}>{label}</div>
    )}
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", cursor: "pointer", userSelect: "none" }}
  >
    <div style={{
      width: "38px", height: "20px", borderRadius: "10px",
      background: checked ? tk.primary : tk.muted,
      border: `1px solid ${checked ? tk.primary : tk.border}`,
      position: "relative", transition: "background .2s, border-color .2s", flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: "2px",
        left: checked ? "20px" : "2px",
        width: "14px", height: "14px", borderRadius: "50%",
        background: tk.primaryFg, transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.15)",
      }} />
    </div>
    <span style={{ fontSize: "13px", color: tk.foreground, fontWeight: 300 }}>{label}</span>
  </div>
);

const FileZone = ({ label, name, value, onChange, required }) => {
  const ref = useRef();
  const done = !!value;
  return (
    <Field label={label} required={required}>
      <div
        className="saf-file-zone"
        onClick={() => ref.current.click()}
        style={{
          border: `1.5px ${done ? "solid" : "dashed"} ${done ? tk.primary : tk.border}`,
          borderRadius: tk.radius, padding: "14px 16px",
          cursor: "pointer", background: done ? tk.sidebar : tk.muted,
          display: "flex", alignItems: "center", gap: "10px",
          transition: "all .15s",
        }}
      >
        <span style={{ fontSize: "16px", flexShrink: 0 }}>{done ? "✅" : "📎"}</span>
        <span style={{ fontSize: "12.5px", color: done ? tk.primary : tk.mutedFg, fontStyle: done ? "normal" : "italic", fontWeight: done ? 400 : 300 }}>
          {done ? value.name : "Click to upload (.jpg .png .pdf)"}
        </span>
      </div>
      <input
        ref={ref} type="file" accept=".jpg,.jpeg,.png,.pdf"
        style={{ display: "none" }}
        onChange={e => e.target.files[0] && onChange(name, e.target.files[0])}
      />
    </Field>
  );
};

// ─── Step Panels ──────────────────────────────────────────────────────────────
const StepPersonal = ({ data, set }) => {
  const up = (k, v) => set(d => ({ ...d, personal: { ...d.personal, [k]: v } }));
  const provinces = ["Punjab", "Sindh", "KPK", "Balochistan", "AJK", "Gilgit-Baltistan", "Islamabad Capital Territory"];
  return (
    <>
      <SectionTitle icon="👤" text="Personal Information" />
      <Row2>
        <Field label="Full Name (as per CNIC)" required>
          <Inp value={data.fullName} onChange={e => up("fullName", e.target.value)} placeholder="Muhammad Ahmed Ali" />
        </Field>
        <Field label="Father Name" required>
          <Inp value={data.fatherName} onChange={e => up("fatherName", e.target.value)} placeholder="Muhammad Ali" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Gender" required>
          <Sel value={data.gender} onChange={e => up("gender", e.target.value)}>
            <option value="">Select gender</option>
            {["Male", "Female", "Other"].map(o => <option key={o}>{o}</option>)}
          </Sel>
        </Field>
        <Field label="Date of Birth" required>
          <Inp type="date" value={data.dob} onChange={e => up("dob", e.target.value)} />
        </Field>
      </Row2>
      <Row2>
        <Field label="CNIC / B-Form" required>
          <Inp value={data.cnic} onChange={e => up("cnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" maxLength={15} />
        </Field>
        <Field label="Nationality">
          <Inp value={data.nationality} onChange={e => up("nationality", e.target.value)} placeholder="Pakistani" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Religion">
          <Inp value={data.religion} onChange={e => up("religion", e.target.value)} placeholder="Islam" />
        </Field>
        <Field label="Domicile Province">
          <Sel value={data.province} onChange={e => up("province", e.target.value)}>
            <option value="">Select province</option>
            {provinces.map(p => <option key={p}>{p}</option>)}
          </Sel>
        </Field>
      </Row2>
      <Field label="Domicile District">
        <Inp value={data.district} onChange={e => up("district", e.target.value)} placeholder="e.g. Lahore" />
      </Field>
    </>
  );
};

const StepContact = ({ data, set }) => {
  const up = (k, v) => set(d => ({ ...d, contact: { ...d.contact, [k]: v } }));
  return (
    <>
      <SectionTitle icon="📞" text="Contact Information" />
      <Row2>
        <Field label="Email Address" required>
          <Inp type="email" value={data.email} onChange={e => up("email", e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Phone Number" required>
          <Inp value={data.phone} onChange={e => up("phone", e.target.value)} placeholder="03XX-XXXXXXX" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Alternate Phone">
          <Inp value={data.altPhone} onChange={e => up("altPhone", e.target.value)} placeholder="03XX-XXXXXXX" />
        </Field>
        <Field label="City">
          <Inp value={data.city} onChange={e => up("city", e.target.value)} placeholder="Lahore" />
        </Field>
      </Row2>
      <Field label="Current Address">
        <Textarea value={data.currentAddress} onChange={e => up("currentAddress", e.target.value)} placeholder="House #, Street, Area" />
      </Field>
      <Field label="Permanent Address">
        <Textarea value={data.permanentAddress} onChange={e => up("permanentAddress", e.target.value)} placeholder="If different from current" />
      </Field>
      <Field label="Postal Code">
        <Inp value={data.postalCode} onChange={e => up("postalCode", e.target.value)} placeholder="54000" style={{ maxWidth: "180px" }} />
      </Field>
    </>
  );
};

const AcademicBlock = ({ label, data, onUpdate, showGroup }) => (
  <SubBlock label={label}>
    <Row2>
      <Field label="Board Name"><Inp value={data.board} onChange={e => onUpdate("board", e.target.value)} placeholder="BISE Lahore" /></Field>
      <Field label="Roll Number"><Inp value={data.roll} onChange={e => onUpdate("roll", e.target.value)} placeholder="123456" /></Field>
    </Row2>
    <Row2>
      <Field label="Passing Year"><Inp type="number" value={data.year} onChange={e => onUpdate("year", e.target.value)} placeholder="2022" /></Field>
      <Field label="Total Marks"><Inp type="number" value={data.total} onChange={e => onUpdate("total", e.target.value)} placeholder="1100" /></Field>
    </Row2>
    <Row2>
      <Field label="Obtained Marks"><Inp type="number" value={data.obtained} onChange={e => onUpdate("obtained", e.target.value)} placeholder="950" /></Field>
      <Field label="Percentage / Grade"><Inp value={data.grade} onChange={e => onUpdate("grade", e.target.value)} placeholder="86.4% / A+" /></Field>
    </Row2>
    {showGroup ? (
      <Field label="Group">
        <Sel value={data.group} onChange={e => onUpdate("group", e.target.value)}>
          <option value="">Select group</option>
          {["Pre-Medical", "Pre-Engineering", "ICS", "Commerce", "Arts"].map(g => <option key={g}>{g}</option>)}
        </Sel>
      </Field>
    ) : (
      <Field label="Subjects">
        <Inp value={data.subjects} onChange={e => onUpdate("subjects", e.target.value)} placeholder="Physics, Chemistry, Biology..." />
      </Field>
    )}
  </SubBlock>
);

const StepAcademic = ({ data, set }) => (
  <>
    <SectionTitle icon="🎓" text="Academic Information" />
    <AcademicBlock
      label="📘 Matric / SSC"
      data={data.matric}
      onUpdate={(k, v) => set(d => ({ ...d, matric: { ...d.matric, [k]: v } }))}
      showGroup={false}
    />
    <AcademicBlock
      label="📗 Intermediate / HSSC"
      data={data.inter}
      onUpdate={(k, v) => set(d => ({ ...d, inter: { ...d.inter, [k]: v } }))}
      showGroup={true}
    />
  </>
);

const PREF_COLORS = [tk.primary, "#8a9f7b", "#bac9b4"];
const PREF_LABELS = ["1st Choice", "2nd Choice", "3rd Choice"];

const StepProgram = ({ data, set }) => {
  const upPref = (i, k, v) => set(d => {
    const prefs = [...d.prefs];
    prefs[i] = { ...prefs[i], [k]: v };
    return { ...d, prefs };
  });
  return (
    <>
      <SectionTitle icon="🏫" text="Program Selection" />
      {data.map((pref, i) => (
        <div key={i} style={{ borderLeft: `3px solid ${PREF_COLORS[i]}`, paddingLeft: "16px", marginBottom: "1.75rem" }}>
          <div style={{
            fontFamily: tk.fontMono, fontSize: "10px", fontWeight: 500,
            color: PREF_COLORS[i], textTransform: "uppercase",
            letterSpacing: ".1em", marginBottom: ".75rem",
          }}>{PREF_LABELS[i]}</div>
          <Row2>
            <Field label="University Name">
              <Inp value={pref.uni} onChange={e => upPref(i, "uni", e.target.value)} placeholder="University of Punjab" />
            </Field>
            <Field label="Campus">
              <Inp value={pref.campus} onChange={e => upPref(i, "campus", e.target.value)} placeholder="Main Campus" />
            </Field>
          </Row2>
          <Field label="Degree Program">
            <Inp value={pref.program} onChange={e => upPref(i, "program", e.target.value)} placeholder="BSCS, BSIT, BBA, MBBS..." />
          </Field>
        </div>
      ))}
    </>
  );
};

const StepDocuments = ({ data, set }) => {
  const up = (k, file) => set(d => ({ ...d, docs: { ...d.docs, [k]: file } }));
  return (
    <>
      <SectionTitle icon="📄" text="Documents Upload" />
      <p style={{ fontSize: "12.5px", color: tk.mutedFg, marginBottom: "1.25rem", fontStyle: "italic", fontWeight: 300 }}>
        Accepted formats: JPG, PNG, PDF. Maximum 5MB per file.
      </p>
      <Row2>
        <FileZone label="CNIC / B-Form"         name="cnic"     value={data.cnic}     onChange={up} required />
        <FileZone label="Matric Result Card"     name="matric"   value={data.matric}   onChange={up} required />
      </Row2>
      <Row2>
        <FileZone label="Intermediate Result Card" name="inter"  value={data.inter}    onChange={up} required />
        <FileZone label="Domicile Certificate"   name="domicile" value={data.domicile} onChange={up} required />
      </Row2>
      <Row2>
        <FileZone label="Passport Size Photo"    name="photo"    value={data.photo}    onChange={up} required />
        <FileZone label="Character Certificate"  name="char"     value={data.char}     onChange={up} />
      </Row2>
    </>
  );
};

const StepGuardian = ({ data, set }) => {
  const up = (k, v) => set(d => ({ ...d, guardian: { ...d.guardian, [k]: v } }));
  return (
    <>
      <SectionTitle icon="👨‍👩‍👧" text="Guardian Information" />
      <Row2>
        <Field label="Guardian Name" required>
          <Inp value={data.name} onChange={e => up("name", e.target.value)} placeholder="Full Name" />
        </Field>
        <Field label="Relation" required>
          <Sel value={data.relation} onChange={e => up("relation", e.target.value)}>
            <option value="">Select relation</option>
            {["Father", "Mother", "Other"].map(o => <option key={o}>{o}</option>)}
          </Sel>
        </Field>
      </Row2>
      <Row2>
        <Field label="Guardian CNIC">
          <Inp value={data.cnic} onChange={e => up("cnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" />
        </Field>
        <Field label="Phone">
          <Inp value={data.phone} onChange={e => up("phone", e.target.value)} placeholder="03XX-XXXXXXX" />
        </Field>
      </Row2>
      <Row2>
        <Field label="Occupation">
          <Inp value={data.occupation} onChange={e => up("occupation", e.target.value)} placeholder="e.g. Teacher, Farmer" />
        </Field>
        <Field label="Monthly Income (PKR)">
          <Inp type="number" value={data.income} onChange={e => up("income", e.target.value)} placeholder="50000" />
        </Field>
      </Row2>
    </>
  );
};

const StepAdditional = ({ form, set }) => {
  const upA   = (k, v) => set(d => ({ ...d, additional: { ...d.additional, [k]: v } }));
  const upAuto = (k, v) => set(d => ({ ...d, automation: { ...d.automation, [k]: v } }));
  const { additional: a, automation: au } = form;
  return (
    <>
      <SectionTitle icon="💼" text="Additional Information" />
      <SubBlock>
        <Toggle label="Hafiz-e-Quran"             checked={a.hafiz}       onChange={v => upA("hafiz", v)} />
        <Toggle label="Has Disability"             checked={a.disability}  onChange={v => upA("disability", v)} />
        {a.disability && (
          <div style={{ marginTop: ".5rem" }}>
            <Field label="Disability Details">
              <Inp value={a.disabilityDetail} onChange={e => upA("disabilityDetail", e.target.value)} placeholder="Describe disability..." />
            </Field>
          </div>
        )}
        <Toggle label="Applying for Sports Quota" checked={a.sports}      onChange={v => upA("sports", v)} />
        <Toggle label="Scholarship Required"       checked={a.scholarship} onChange={v => upA("scholarship", v)} />
      </SubBlock>
      <SectionTitle icon="🔥" text="Automation / Portal Info" style={{ marginTop: "1.5rem" }} />
      <Row2>
        <Field label="University Portal Email">
          <Inp type="email" value={au.portalEmail} onChange={e => upAuto("portalEmail", e.target.value)} placeholder="portal@university.edu.pk" />
        </Field>
        <Field label="Portal Password">
          <Inp type="password" value={au.portalPass} onChange={e => upAuto("portalPass", e.target.value)} placeholder="••••••••" />
        </Field>
      </Row2>
      <Field label="Notes / Remarks">
        <Textarea value={au.notes} onChange={e => upAuto("notes", e.target.value)} placeholder="Additional notes for the automation script..." />
      </Field>
    </>
  );
};

// ─── Review ───────────────────────────────────────────────────────────────────
const ReviewRow = ({ label, value }) =>
  value ? (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "5px 0", borderBottom: `.5px dashed ${tk.muted}` }}>
      <span style={{ fontSize: "12px", color: tk.mutedFg, fontStyle: "italic", fontWeight: 300 }}>{label}</span>
      <span style={{ fontSize: "12.5px", color: tk.foreground, fontWeight: 400, textAlign: "right", maxWidth: "55%" }}>{value}</span>
    </div>
  ) : null;

const ReviewSection = ({ title, rows }) => {
  const filtered = rows.filter(r => r[1]);
  if (!filtered.length) return null;
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div style={{
        fontFamily: tk.fontMono, fontSize: "9.5px", fontWeight: 500,
        color: tk.primary, textTransform: "uppercase", letterSpacing: ".12em",
        marginBottom: ".5rem", paddingBottom: ".4rem",
        borderBottom: `1px solid ${tk.border}`,
      }}>{title}</div>
      {filtered.map(([label, val]) => <ReviewRow key={label} label={label} value={val} />)}
    </div>
  );
};

const StepReview = ({ form }) => {
  const { personal: p, contact: c, matric: m, inter: iv, prefs: pp, guardian: g } = form;
  return (
    <>
      {/* App ID card */}
      <div style={{
        background: tk.sidebar, border: `1px solid ${tk.border}`,
        borderRadius: tk.radius, padding: "1.1rem 1.4rem",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "1.75rem",
      }}>
        <div>
          <div style={{ fontFamily: tk.fontMono, fontSize: "9px", letterSpacing: ".12em", textTransform: "uppercase", color: tk.mutedFg, marginBottom: "4px" }}>
            Application ID
          </div>
          <div style={{ fontFamily: tk.fontMono, fontSize: "20px", fontWeight: 500, color: tk.primary, letterSpacing: ".06em" }}>
            {form.appId}
          </div>
        </div>
        <div style={{
          background: tk.muted, color: tk.mutedFg,
          border: `1px solid ${tk.border}`, borderRadius: "3px",
          padding: "4px 12px", fontFamily: tk.fontMono,
          fontSize: "10px", letterSpacing: ".08em", textTransform: "uppercase",
        }}>
          Pending Review
        </div>
      </div>

      <SectionTitle icon="✅" text="Review Your Application" />

      <ReviewSection title="Personal" rows={[
        ["Full Name", p.fullName], ["Father Name", p.fatherName], ["Gender", p.gender],
        ["Date of Birth", p.dob], ["CNIC / B-Form", p.cnic], ["Nationality", p.nationality],
        ["Religion", p.religion], ["Province", p.province], ["District", p.district],
      ]} />
      <ReviewSection title="Contact" rows={[
        ["Email", c.email], ["Phone", c.phone], ["City", c.city], ["Postal Code", c.postalCode],
      ]} />
      <ReviewSection title="Matric / SSC" rows={[
        ["Board", m.board], ["Year", m.year],
        ["Marks", m.obtained && m.total ? `${m.obtained} / ${m.total}` : ""], ["Grade", m.grade],
      ]} />
      <ReviewSection title="Intermediate / HSSC" rows={[
        ["Board", iv.board], ["Year", iv.year],
        ["Marks", iv.obtained && iv.total ? `${iv.obtained} / ${iv.total}` : ""], ["Group", iv.group],
      ]} />
      <ReviewSection title="1st Choice Program" rows={[
        ["University", pp[0]?.uni], ["Program", pp[0]?.program],
      ]} />
      <ReviewSection title="Guardian" rows={[
        ["Name", g.name], ["Relation", g.relation], ["Phone", g.phone], ["Occupation", g.occupation],
      ]} />

      <div style={{
        background: tk.sidebar, border: `1px solid ${tk.border}`,
        borderLeft: `3px solid ${tk.primary}`, borderRadius: tk.radius,
        padding: ".9rem 1.1rem", display: "flex", gap: "10px", marginTop: "1.25rem",
      }}>
        <span style={{ fontSize: "14px", flexShrink: 0 }}>ℹ️</span>
        <p style={{ fontSize: "12.5px", color: tk.foreground, lineHeight: 1.6, margin: 0, fontWeight: 300, fontStyle: "italic" }}>
          Please review all information carefully before submitting. Once submitted, changes may require contacting the admissions office.
        </p>
      </div>
    </>
  );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ appId }) => (
  <div style={{
    textAlign: "center", padding: "3rem 2rem",
    minHeight: "400px", display: "flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      width: "80px", height: "80px", borderRadius: "50%",
      border: `3px solid ${tk.primary}`, background: tk.sidebar,
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "0 auto 1.5rem", fontSize: "32px",
      boxShadow: `3px 3px 0 rgba(141,157,79,.3)`,
    }}>✦</div>
    <h2 style={{ fontFamily: tk.fontSerif, fontSize: "24px", fontWeight: 700, color: tk.foreground, margin: "0 0 .5rem", letterSpacing: "-.01em" }}>
      Application Submitted!
    </h2>
    <p style={{ fontSize: "13px", color: tk.mutedFg, maxWidth: "300px", lineHeight: 1.6, fontStyle: "italic", fontWeight: 300 }}>
      Your application has been received and is currently under review by the admissions office.
    </p>
    <div style={{
      background: tk.sidebar, border: `1px solid ${tk.border}`,
      borderRadius: tk.radius, padding: "1rem 2rem",
      display: "inline-block", marginTop: "1.5rem",
      boxShadow: `3px 3px 0 ${tk.border}`,
    }}>
      <div style={{ fontFamily: tk.fontMono, fontSize: "9px", letterSpacing: ".14em", textTransform: "uppercase", color: tk.mutedFg, marginBottom: "6px" }}>
        Your Application ID
      </div>
      <div style={{ fontFamily: tk.fontMono, fontSize: "22px", fontWeight: 500, color: tk.primary, letterSpacing: ".08em" }}>
        {appId}
      </div>
    </div>
    <p style={{ fontFamily: tk.fontMono, fontSize: "11px", color: tk.mutedFg, marginTop: "1rem", letterSpacing: ".04em" }}>
      Save this ID to track your application status.
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StudentAdmissionForm() {
  const [step, setStep]           = useState(0);
  const [form, setForm]           = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const goStep = (i) => { setStep(i); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goNext = () => { if (step < STEPS.length - 1) goStep(step + 1); };
  const goPrev = () => { if (step > 0) goStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form.docs).forEach(([k, f]) => { if (f) formData.append(k, f); });
      const payload = { ...form };
      delete payload.docs;
      formData.append("data", JSON.stringify(payload));
      const res = await fetch("http://localhost:5000/api/students", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setSubmitted(true);
      else alert(data.message || "Submission failed");
    } catch {
      // Demo fallback — remove in production
      await new Promise(r => setTimeout(r, 1200));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  const pageStyle = {
    minHeight: "100vh",
    background: tk.background,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b19681' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    fontFamily: tk.fontSans,
    padding: "2.5rem 1.25rem 4rem",
  };

  return (
    <>
      {/* Inject global CSS */}
      <style>{GLOBAL_CSS}</style>

      <div style={pageStyle}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: tk.primary, color: tk.primaryFg,
              borderRadius: "2px", padding: "4px 16px", marginBottom: "18px",
              fontFamily: tk.fontMono, fontSize: "10px",
              letterSpacing: ".12em", textTransform: "uppercase",
            }}>
              <span style={{ fontSize: "7px", opacity: .7 }}>◆</span>
              2025–26 Admissions Open
              <span style={{ fontSize: "7px", opacity: .7 }}>◆</span>
            </div>
            <h1 style={{ fontFamily: tk.fontSerif, fontSize: "28px", fontWeight: 700, color: tk.foreground, lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-.02em" }}>
              Student Admission Form
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "14px 0", justifyContent: "center" }}>
              <div style={{ flex: 1, maxWidth: "120px", height: "1px", background: tk.border }} />
              <span style={{ color: tk.primary, fontSize: "14px" }}>✦</span>
              <div style={{ flex: 1, maxWidth: "120px", height: "1px", background: tk.border }} />
            </div>
            <p style={{ fontSize: "13px", color: tk.mutedFg, fontStyle: "italic", fontWeight: 300 }}>
              Complete all sections carefully. Fields marked <span style={{ color: tk.destructive }}>*</span> are required.
            </p>
          </div>

          {/* ── Stepper ── */}
          {!submitted && (
            <div className="saf-stepper" style={{ display: "flex", gap: 0, marginBottom: "2rem", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
              {STEPS.map((s, i) => {
                const state = i === step ? "active" : i < step ? "done" : "todo";
                const bg    = state === "active" ? tk.primary  : state === "done" ? tk.sidebar  : tk.card;
                const color = state === "active" ? tk.primaryFg : state === "done" ? tk.foreground : tk.mutedFg;
                const numBg = state === "active" ? "rgba(255,255,255,.25)" : state === "done" ? tk.primary : tk.muted;
                const numCl = state === "active" ? "#fff" : state === "done" ? tk.primaryFg : tk.mutedFg;
                return (
                  <button
                    key={s.id}
                    className={`saf-step-btn${state === "active" ? " saf-step-active" : ""}${state === "done" ? " saf-step-done" : ""}`}
                    onClick={() => goStep(i)}
                    style={{
                      flexShrink: 0, display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 13px",
                      border: `1px solid ${tk.border}`,
                      borderRight: i < STEPS.length - 1 ? "none" : `1px solid ${tk.border}`,
                      borderRadius: i === 0 ? `${tk.radius} 0 0 ${tk.radius}` : i === STEPS.length - 1 ? `0 ${tk.radius} ${tk.radius} 0` : "0",
                      background: bg, color,
                      cursor: "pointer", fontFamily: tk.fontSans,
                      fontSize: "11.5px", fontWeight: 400,
                      whiteSpace: "nowrap", transition: "all .18s",
                    }}
                  >
                    <span style={{
                      width: "19px", height: "19px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: tk.fontMono, fontSize: "10px", fontWeight: 500, flexShrink: 0,
                      background: numBg, color: numCl,
                    }}>
                      {i < step ? "✓" : i + 1}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Form Card ── */}
          <div style={{
            background: tk.card,
            borderRadius: `calc(${tk.radius} * 2)`,
            border: `1px solid ${tk.border}`,
            padding: "2.25rem",
            boxShadow: `3px 3px 0 ${tk.border}, 6px 6px 0 rgba(177,150,129,.15)`,
            marginBottom: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* top stripe */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: `repeating-linear-gradient(90deg, ${tk.primary} 0, ${tk.primary} 8px, transparent 8px, transparent 16px)`,
            }} />

            {submitted ? (
              <SuccessScreen appId={form.appId} />
            ) : (
              <>
                {step === 0 && <StepPersonal  data={form.personal}                            set={setForm} />}
                {step === 1 && <StepContact   data={form.contact}                             set={setForm} />}
                {step === 2 && <StepAcademic  data={{ matric: form.matric, inter: form.inter }} set={setForm} />}
                {step === 3 && <StepProgram   data={form.prefs}                               set={setForm} />}
                {step === 4 && <StepDocuments data={form.docs}                                set={setForm} />}
                {step === 5 && <StepGuardian  data={form.guardian}                            set={setForm} />}
                {step === 6 && <StepAdditional form={form}                                    set={setForm} />}
                {step === 7 && <StepReview    form={form} />}

                {/* Navigation */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  paddingTop: "1.5rem", borderTop: `1px solid ${tk.border}`, marginTop: "1.75rem",
                }}>
                  <button
                    className="btn saf-btn-back"
                    onClick={goPrev}
                    disabled={step === 0}
                    style={{
                      padding: "9px 22px", borderRadius: tk.radius,
                      border: `1.5px solid ${tk.border}`, background: "transparent",
                      color: step === 0 ? tk.border : tk.mutedFg,
                      cursor: step === 0 ? "not-allowed" : "pointer",
                      fontSize: "13px", fontWeight: 700,
                      fontFamily: tk.fontSans, transition: "all .15s",
                      opacity: step === 0 ? .35 : 1,
                    }}
                  >
                    ← Back
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      className="btn saf-btn-next"
                      onClick={goNext}
                      style={{
                        padding: "9px 22px", borderRadius: tk.radius,
                        border: "none", background: tk.primary, color: tk.primaryFg,
                        cursor: "pointer", fontSize: "13px", fontWeight: 700,
                        fontFamily: tk.fontSans, transition: "all .15s",
                        boxShadow: `2px 2px 0 rgba(141,157,79,.4)`,
                      }}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      className="btn saf-btn-submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{
                        padding: "9px 22px", borderRadius: tk.radius,
                        border: "none",
                        background: loading ? tk.muted : tk.foreground,
                        color: loading ? tk.mutedFg : "#f3ead2",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "13px", fontWeight: 700,
                        fontFamily: tk.fontSans, transition: "all .15s",
                        boxShadow: loading ? "none" : `2px 2px 0 rgba(92,75,62,.4)`,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}
                    >
                      {loading ? "Submitting…" : "🚀 Submit Application"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ── Progress Bar ── */}
          {!submitted && (
            <div style={{ marginTop: ".75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: tk.fontMono, fontSize: "10px", color: tk.mutedFg, marginBottom: "6px", letterSpacing: ".06em" }}>
                <span>Step {step + 1} of {STEPS.length}</span>
                <span>{pct}%</span>
              </div>
              <div style={{ height: "4px", background: tk.muted, borderRadius: "2px", overflow: "hidden", border: `1px solid ${tk.border}` }}>
                <div style={{
                  height: "100%", width: `${pct}%`,
                  background: tk.primary, borderRadius: "2px",
                  transition: "width .35s ease",
                }} />
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}