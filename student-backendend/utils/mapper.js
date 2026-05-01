exports.mapPayload = (payload) => {
  const p = payload.personal || {};
  const c = payload.contact || {};
  const m = payload.matric || {};
  const iv = payload.inter || {};
  const g = payload.guardian || {};
  const a = payload.additional || {};
  const au = payload.automation || {};

  return {
    appId: payload.appId || "",

    // ✅ IMPORTANT (fix duplicate email issue)
    email: c.email || undefined,

    personal: {
      fullName: p.fullName || "",
      fatherName: p.fatherName || "",
      gender: p.gender || "",
      dob: p.dob || null,
      cnic: p.cnic || "",
      nationality: p.nationality || "Pakistani",
      religion: p.religion || "",
      province: p.province || "",
      district: p.district || "",
    },

    contact: {
      email: c.email || "",
      phone: c.phone || "",
      altPhone: c.altPhone || "",
      city: c.city || "",
      postalCode: c.postalCode || "",
      currentAddress: c.currentAddress || "",
      permanentAddress: c.permanentAddress || "",
    },

    matric: {
      board: m.board || "",
      roll: m.roll || "",
      year: m.year ? Number(m.year) : null,
      total: m.total ? Number(m.total) : null,
      obtained: m.obtained ? Number(m.obtained) : null,
      grade: m.grade || "",
      subjects: m.subjects || "",
    },

    inter: {
      board: iv.board || "",
      roll: iv.roll || "",
      year: iv.year ? Number(iv.year) : null,
      total: iv.total ? Number(iv.total) : null,
      obtained: iv.obtained ? Number(iv.obtained) : null,
      grade: iv.grade || "",
      group: iv.group || "",
    },

    prefs: (payload.prefs || []).map((p) => ({
      uni: p.uni || "",
      campus: p.campus || "",
      program: p.program || "",
    })),

    guardian: {
      name: g.name || "",
      relation: g.relation || "",
      cnic: g.cnic || "",
      phone: g.phone || "",
      occupation: g.occupation || "",
      income: g.income ? Number(g.income) : null,
    },

    additional: {
      hafiz: !!a.hafiz,
      disability: !!a.disability,
      disabilityDetail: a.disabilityDetail || "",
      sports: !!a.sports,
      scholarship: !!a.scholarship,
    },

    automation: {
      portalEmail: au.portalEmail || "",
      portalPass: au.portalPass || "",
      notes: au.notes || "",
    },
  };
};