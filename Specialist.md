# Specialist Panel — Sahifalar va API Ulanishlari

---

## 1. Dashboard — `/specialist/dashboard`
**Fayl:** `pages/specialist/Dashboard/DashboardSpecialist.tsx`

**Vazifasi:** Bosh sahifa — statistika kartalari, grafik, bugungi jadval

**API:** Child komponentlar orqali chaqiriladi (DinamikaChart, TodaySchedule, AttentionNeeded)

---

## 2. Bemorlarim (Bolalar ro'yxati) — `/specialist/patients`
**Fayl:** `pages/specialist/Patients/Patients.tsx`

**Vazifasi:** Mutaxassisga biriktirilgan bolalar ro'yxati

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/` | GET | Bolalar ro'yxati. Response: `ChildOut[]` — id, fio, diagnosis, status, group_id, birth_date, specialist_assignments |

**Filter:** "Barchasi" va "Yangi" (diagnostikasiz bolalar)

---

## 3. Bemor tafsilotlari — `/specialist/patients/{patientId}`
**Fayl:** `pages/specialist/Patients/PatientDetail.tsx`

**Vazifasi:** Bola profili — 6 ta tab, imtihon va anamnez tugmalari

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/{id}/?include_anamnesis=true` | GET | To'liq ChildDetailOut — anamnez, konsultatsiya, diagnostika, to'lovlar, guruh ma'lumoti |

**Tablar:**
1. **Asosiy ma'lumotlar** — shaxsiy ma'lumotlar, mutaxassislar
2. **Rivojlanish tarixi** — anamnez (homiladorlik, tug'ilish, rivojlanish)
3. **Diagnostika** — diagnostika ma'lumotlari
4. **Diagnostika natijalari** — natijalar jadvali
5. **Uchrashuvlar** — oylik uchrashuvlar
6. **To'lov tarixi** — to'lovlar

**Tugmalar:**
- "Anamnez to'ldirish" → `/specialist/patients/{id}/anamnesis`
- "Imtihon qilish" → dropdown: Oylik/Choraklik → `/specialist/patients/{id}/exam?type=monthly|quarterly`
- "Diagnostikani boshlash" → `/specialist/diagnostics`

---

## 4. Anamnez to'ldirish — `/specialist/patients/{patientId}/anamnesis`
**Fayl:** `pages/specialist/Patients/PatientAnamnesis.tsx`

**Vazifasi:** 5 bosqichli wizard — anamnez va konsultatsiya kartasini to'ldirish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/{id}/?include_anamnesis=true` | GET | Mavjud ma'lumotlarni olish (prefill) |
| `PATCH /v1/children/{id}/` | PATCH | Har bir step da saqlash |
| `GET /v1/specialists/` | GET | Mutaxassislar (biriktirish uchun) |

**5 ta Step:**

**Step 1 — Homiladorlik va tug'ilish:**
- pregnancy_1_trimester, pregnancy_2_trimester, pregnancy_3_trimester
- birth_process, birth_weight, first_40_days, up_to_1_year

**Step 2 — Rivojlanish bosqichlari:**
- breastfeeding_duration, pacifier_usage_period
- walking_age (oy), gadget_usage_age (oy), kindergarten_age (oy)

**Step 3 — Kunlik odatlar:**
- sleep_time, sleep_with_who, eating_habits
- has_constipation, has_diarrhea, wears_pampers, likes_bathing (toggle)

**Step 4 — Nutq rivojlanishi:**
- has_inner_speech (toggle), first_word_age, current_vocabulary_count

**Step 5 — Tibbiy ma'lumotlar + Konsultatsiya:**
- vaccination, preliminary_diagnosis
- arrival_date, accompanied_by, final_diagnosis
- neuro_complex_name, working_period, group_acceptance_date
- recommendations, assigned_specialists (mutaxassis tanlash)

---

## 5. Imtihon o'tkazish — `/specialist/patients/{patientId}/exam?type=monthly|quarterly`
**Fayl:** `pages/specialist/Exams/ExamConduct.tsx`

**Vazifasi:** Oylik yoki choraklik imtihon — mashqlarni baholash

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/diagnostics/questions/` | GET | Mashqlar (bo'lim → yosh guruhi → mashq) |
| `GET /v1/children/{id}/?include_anamnesis=true` | GET | Bola ma'lumoti |
| `POST /v1/exams/results/` | POST | Imtihon natijasini saqlash |
| `POST /v1/exams/results/{id}/generate-comparison/` | POST | AI taqqoslama (faqat choraklik) |

**POST /v1/exams/results/ Request:**
```json
{
  "child": 1,
  "exam_type": "monthly | quarterly",
  "comment": "string | null",
  "answers": [
    {"exercise": 1, "score": 0.0, "answered_at": "ISO8601"},
    {"exercise": 2, "score": 0.5, "answered_at": "ISO8601"},
    {"exercise": 3, "score": 1.0, "answered_at": "ISO8601"}
  ]
}
```

**Baholash:** 0.0 = Bajarmadi (qizil), 0.5 = Yordam bilan (sariq), 1.0 = Mustaqil (yashil)

**Oylik imtihon:** Progress bar + bo'limlar + saqlash
**Choraklik imtihon:** + Natija xulosasi sidebar (ball, foiz, mental yosh)

---

## 6. Diagnostika — `/specialist/diagnostics`
**Fayl:** `pages/specialist/Diagnostics/Diagnostics.tsx`

**Vazifasi:** Diagnostika testini o'tkazish — bo'limlar bo'yicha baholash

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/skills/sections/` | GET | Bo'limlar (Yirik motorika, Nutq...) |
| `GET /v1/children/` | GET | Bolalar ro'yxati (tanlash) |
| `GET /v1/skills/sections/{id}/exercises/` | GET | Bo'lim mashqlari |
| `POST /v1/diagnostics/results/` | POST | Natijani saqlash. Body: `{child, comment, answers: [{exercise, score}]}` |

**Komponentlar:** SkillScoringTable (baholash jadvali), DiagnosticsSidebar (aqliy yosh, radar chart)

---

## 7. AI Reja ro'yxati — `/specialist/ai-plan`
**Fayl:** `pages/specialist/AIPlan/AIPlanList.tsx`

**API:** `GET /v1/groups/` → Guruhlar kartalar ro'yxati

---

## 8. AI Reja tafsilotlari — `/specialist/ai-plan/{groupId}`
**Fayl:** `pages/specialist/AIPlan/AIPlanDetail.tsx`

**Vazifasi:** Guruh uchun 12 oylik yillik reja — AI generatsiya, oylik maqsadlar

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/groups/{id}/` | GET | Guruh ma'lumoti |
| `GET /v1/plans/yearly/?group_id={id}` | GET | Yillik rejalar |
| `GET /v1/plans/yearly/{id}/` | GET | To'liq reja (monthly_goals, child_recommendations) |
| `POST /v1/plans/yearly/` | POST | Reja yaratish. Body: `{group, start_date}` |
| `POST /v1/plans/yearly/{id}/generate-ai/` | POST | AI generatsiya |

---

## 9. Uyga vaziyfa — `/specialist/daily-plan`
**Fayl:** `pages/specialist/DailyPlan/DailyPlan.tsx`

**Vazifasi:** Bugungi seanslar, uy vazifalari berish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/groups/` | GET | Guruhlar |
| `GET /v1/children/` | GET | Bolalar |
| `GET /v1/sessions/today/` | GET | Bugungi seanslar |

---

## 10. Bilim markazi — `/specialist/knowledge`
**Fayl:** `pages/specialist/Knowledge/KnowledgeCenter.tsx`

**API:** `GET /v1/videos/`, `GET /v1/skills/sections/`

---

## 11. Guruhlar ro'yxati — `/specialist/groups`
**Fayl:** `pages/specialist/Groups/GroupsList.tsx`

**API:** `GET /v1/groups/`

---

## 12. Guruh tafsilotlari — `/specialist/groups/{groupId}`
**Fayl:** `pages/specialist/Groups/GroupDetail.tsx`

**API:** `GET /v1/groups/{id}/` — Bolalar, jadval, statistika

---

## 13. Mavzular — `/specialist/topics`
**Fayl:** `pages/specialist/Topics/Topics.tsx`

**API:** `GET /v1/topics/`, `POST /v1/topics/{id}/exercises/`

---

## 14. Mavzu tafsilotlari — `/specialist/topics/{topicId}`
**Fayl:** `pages/specialist/Topics/TopicDetail.tsx`

**API:** `GET /v1/topics/{id}/` — Mashqlar, guruh birikmalari

---

## 15. Hisobotlar — `/specialist/reports`
**Fayl:** `pages/specialist/Reports/Reports.tsx`

**API:** `GET /v1/sessions/`

---

## 16. Hisobot yaratish — `/specialist/reports/create`
**Fayl:** `pages/specialist/Reports/CreateReport.tsx`

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/groups/` | GET | Guruhlar (tanlash) |
| `GET /v1/topics/` | GET | Mavzular (tanlash) |
| `POST /v1/sessions/` | POST | Seans yaratish. Body: `{topic, group, date, start_time}` |
| `POST /v1/sessions/{id}/report/` | POST | Hisobot yozish. Body: `{game_name, notes}` |
| `POST /v1/sessions/{id}/report/media/` | POST | Media yuklash (multipart: file, media_type) |

---

## 17. Bildirishnomalar — `/specialist/notifications`
**Fayl:** `pages/shared/NotificationsPage.tsx`

**API:** `GET /v1/notifications/`, `PATCH /v1/notifications/{id}/read/`, `POST /v1/notifications/mark-all-read/`

---

## STATIK / API ULANMAGAN QISMLAR

### Dashboard — to'liq statik
| Qism | Holati | Muammo |
|------|--------|--------|
| Statistika kartalari | STATIK | Child komponentlardagi hardcoded raqamlar |
| DinamikaChart | STATIK | Mock data — diagnostika natijalaridan olish kerak |
| TodaySchedule | QISMAN | `GET /v1/sessions/today/` ishlatilishi kerak |
| AttentionNeeded | STATIK | Qaysi bolalarni ko'rsatish kerak — API yo'q |

### Diagnostics — qisman
| Qism | Holati | Muammo |
|------|--------|--------|
| Scoring Table | API ✅ | Ishlaydi |
| DiagnosticsSidebar | API ✅ | Ishlaydi |
| **Natija saqlash** | API ✅ | `POST /v1/diagnostics/results/` |
| **Oldingi natijalarni ko'rish** | QISMAN | `GET /v1/diagnostics/results/?child_id=X` — sidebar'da ishlaydi |

### DailyPlan — qisman
| Qism | Holati | Muammo |
|------|--------|--------|
| Guruhlar, Bolalar | API ✅ | Ishlaydi |
| Bugungi seanslar | API ✅ | `GET /v1/sessions/today/` |
| Uy vazifasi berish | QISMAN | `POST /v1/sessions/home-tasks/` — DailyJournal komponentida |
| Seans boshlash/yakunlash | YO'Q | `POST /v1/sessions/{id}/start/` va `/end/` ulanmagan |
| Davomat belgilash | YO'Q | `POST /v1/sessions/{id}/attendance/` ulanmagan |

---

## SPECIALIST DA ULANMAGAN API ENDPOINTLAR

| Endpoint | Method | Vazifasi | Holati |
|----------|--------|----------|--------|
| `POST /v1/sessions/{id}/start/` | POST | Seansni boshlash | Sahifada tugma yo'q |
| `POST /v1/sessions/{id}/end/` | POST | Seansni yakunlash | Sahifada tugma yo'q |
| `POST /v1/sessions/{id}/attendance/` | POST | Davomat belgilash | Sahifa yo'q |
| `POST /v1/sessions/home-tasks/{id}/review/` | POST | Uy vazifasini ko'rib chiqish | Hook yo'q |
| `GET /v1/exams/schedule/{child_id}/` | GET | Imtihon jadvali | Sahifada ishlatilmagan |
| `PATCH /v1/plans/monthly-goal-items/{id}/` | PATCH | Ko'nikma holatini yangilash | AIPlanDetail da ishlatilishi kerak |
| `POST /v1/topics/{id}/assign-group/` | POST | Mavzuni guruhga biriktirish | Topics sahifasida yo'q |
| `POST /v1/topics/rotate/` | POST | Mavzu rotatsiyasi | Sahifa yo'q |
