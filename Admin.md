# Admin Panel — Sahifalar va API Ulanishlari

---

## 1. Dashboard — `/admin/dashboard`
**Fayl:** `pages/admin/Dashboard/DashboardAdmin.tsx`

**Vazifasi:** Bosh sahifa — statistika, yillik reja boshqaruvi

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/` | GET | Faol bolalar sonini olish |
| `GET /v1/specialists/` | GET | Mutaxassislar sonini olish |
| `GET /v1/groups/` | GET | Guruhlar ro'yxati va tanlash |
| `GET /v1/billing/subscriptions/` | GET | Faol obunalar, moliyaviy holat |
| `GET /v1/plans/yearly/` | GET | Yillik rejalar ro'yxati (guruh bo'yicha) |
| `GET /v1/plans/yearly/{id}/` | GET | Yillik reja to'liq (oylik maqsadlar, tavsiyalar) |
| `POST /v1/plans/yearly/` | POST | Yangi yillik reja yaratish. Body: `{group: int, start_date: "YYYY-MM-DD"}` |
| `POST /v1/plans/yearly/{id}/generate-ai/` | POST | AI orqali reja generatsiya qilish |

**Sahifada nima ko'rsatiladi:**
- 7 ta statistika karta (bolalar, mutaxassislar, guruhlar, o'sish, qarzdorlar)
- Guruh tanlash → Yillik reja (12 oylik kartalar)
- Oylik reja (joriy oy maqsadlari)
- AI reja generatsiya tugmasi

---

## 2. Bolalar ro'yxati — `/admin/child`
**Fayl:** `pages/admin/Children/ChildrenAdmin.tsx`

**Vazifasi:** Barcha bolalar jadvali, qidirish, filter, o'chirish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/` | GET | Bolalar ro'yxati. Response: `ChildOut[]` — id, fio, alias, status, group_id, birth_date, diagnosis, subscription, specialist_assignments |
| `GET /v1/groups/` | GET | Guruhlar (filter uchun) |
| `DELETE /v1/children/{id}/` | DELETE | Bolani o'chirish |

**Filter:** Ism bo'yicha qidirish, Guruh, Yosh diapazoni (0-3, 3-5, 5-7, 7+), Status (Faol, Yangi)

---

## 3. Bola yaratish — `/admin/child/create`
**Fayl:** `pages/admin/Children/CreateChildAdmin.tsx`

**Vazifasi:** Yangi bola + user account yaratish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `POST /v1/children/` | POST | Bola yaratish |
| `GET /v1/specialists/` | GET | Mutaxassislar ro'yxati (biriktirish uchun) |
| `GET /v1/specialists/types/` | GET | Mutaxassis turlari (Logoped, Neyropsixolog...) |

**Yuborilgan ma'lumotlar (Request body):**
```json
{
  "fio": "string (3-150)",         // Majburiy
  "phone_number": "string (9-20)", // Majburiy — login uchun
  "password": "string (6-50)",     // Majburiy
  "birth_date": "YYYY-MM-DD",     // Majburiy
  "photo": "File | null",
  "alias": "string | null",       // Taxallus
  "father_name": "string | null",
  "mother_name": "string | null",
  "phone_number_2": "string | null",
  "address": "string | null",
  "child_number_in_family": "int | null",
  "recommended_by": "string | null",
  "specialist_assignments": {"logoped": 5, "neyropsixolog": 3}  // rol: specialist_id
}
```

---

## 4. Bola tahrirlash — `/admin/child/{id}/edit`
**Fayl:** `pages/admin/Children/EditChildAdmin.tsx`

**Vazifasi:** Bola profilini yangilash (anamnez, konsultatsiya, mutaxassislar)

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/{id}/?include_anamnesis=true` | GET | To'liq bola ma'lumoti (ChildDetailOut) |
| `GET /v1/specialists/` | GET | Mutaxassislar (biriktirish uchun) |
| `PATCH /v1/children/{id}/` | PATCH | Qisman yangilash |

**PATCH yuborilgan fieldlar:**
```json
{
  "fio": "string",
  "phone_number": "string",
  "birth_date": "YYYY-MM-DD",
  "alias": "string | null",
  "diagnosis": "string | null",
  "group_id": "int | null",
  "specialist_assignments": {"logoped": 5},
  "consultation": {
    "arrival_date": "YYYY-MM-DD | null",
    "preliminary_diagnosis": "string | null",
    "final_diagnosis": "string | null",
    "neuro_complex_name": "string | null",
    "working_period": "string | null",
    "recommendations": "string | null",
    "group_acceptance_date": "YYYY-MM-DD | null",
    "accompanied_by": "string | null"
  },
  "anamnesis": {
    "pregnancy_1_trimester": "string | null",
    "pregnancy_2_trimester": "string | null",
    "pregnancy_3_trimester": "string | null",
    "birth_process": "string | null",
    "birth_weight": "string | null",
    "first_40_days": "string | null",
    "up_to_1_year": "string | null",
    "breastfeeding_duration": "string | null",
    "pacifier_usage_period": "string | null",
    "walking_age": "int | null",
    "gadget_usage_age": "int | null",
    "kindergarten_age": "int | null",
    "sleep_habits": "string | null",
    "eating_habits": "string | null",
    "has_constipation": "boolean",
    "has_diarrhea": "boolean",
    "wears_pampers": "boolean",
    "likes_bathing": "boolean",
    "has_inner_speech": "boolean",
    "first_word_age": "int | null",
    "current_vocabulary_count": "string | null",
    "vaccination": "string | null"
  }
}
```

---

## 5. Bola tafsilotlari — `/admin/child/{id}`
**Fayl:** `pages/admin/Children/ChildDetailAdmin.tsx`

**Vazifasi:** Bola profili — 6 ta tab

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/{id}/?include_anamnesis=true` | GET | To'liq ChildDetailOut |
| `GET /v1/billing/payments/` | GET | To'lovlar (PaymentsTab) |
| `GET /v1/billing/plans/` | GET | Tariflar (PaymentsTab modal) |
| `POST /v1/billing/payments/` | POST | Yangi to'lov qo'shish. Body: `{child, amount, plan, method}` |
| `DELETE /v1/billing/payments/{id}/` | DELETE | To'lovni o'chirish |

**Tablar:**
1. **Asosiy ma'lumotlar** — fio, yosh, guruh, mutaxassislar
2. **Rivojlanish tarixi** — anamnez ma'lumotlari
3. **Diagnostika** — diagnostika natijalari
4. **Diagnostika natijalari** — jadval ko'rinishida
5. **Uchrashuvlar** — oylik uchrashuvlar
6. **To'lov tarixi** — to'lovlar + yangi to'lov qo'shish modal

---

## 6. Guruhlar ro'yxati — `/admin/groups`
**Fayl:** `pages/admin/Groups/GroupsAdmin.tsx`

**API:** `GET /v1/groups/` → `GroupOut[]`

---

## 7. Guruh yaratish — `/admin/groups/create`
**Fayl:** `pages/admin/Groups/CreateGroupAdmin.tsx`

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/specialists/` | GET | Mutaxassislar (biriktirish) |
| `GET /v1/skills/age-groups/` | GET | Yosh guruhlari |
| `GET /v1/children/` | GET | Bolalar (tanlash uchun) |
| `POST /v1/groups/` | POST | Guruh yaratish |

**Request body:**
```json
{
  "name": "string",
  "shift": "1 | 2",
  "age_group_id": "int",
  "specialist_ids": [1, 2, 3],
  "child_ids": [1, 4, 7],
  "status": "active"
}
```

---

## 8. Guruh tahrirlash — `/admin/groups/{id}/edit`
**Fayl:** `pages/admin/Groups/EditGroupAdmin.tsx`

**API:** `GET /v1/groups/{id}/`, `PUT /v1/groups/{id}/`, `GET /v1/groups/unassigned-children/`

---

## 9. Guruh tafsilotlari — `/admin/groups/{id}`
**Fayl:** `pages/admin/Groups/GroupDetailAdmin.tsx`

**API:** `GET /v1/groups/{id}/` → Guruh ma'lumotlari, bolalar, mutaxassislar

---

## 10. Mutaxassislar ro'yxati — `/admin/specialists`
**Fayl:** `pages/admin/Specialists/SpecialistsAdmin.tsx`

**API:** `GET /v1/specialists/` → `SpecialistOut[]`

---

## 11. Mutaxassis yaratish — `/admin/specialists/create`
**Fayl:** `pages/admin/Specialists/CreateSpecialistAdmin.tsx`

**API:** `POST /v1/specialists/`

**Request body:**
```json
{
  "fio": "string",
  "specialist_type_id": "int",
  "email": "string",
  "phone_number": "string",
  "password": "string",
  "photo": "File | null",
  "shift": "string",
  "work_days": "string"
}
```

---

## 12. Mutaxassis tahrirlash — `/admin/specialists/{id}/edit`
**Fayl:** `pages/admin/Specialists/EditSpecialistAdmin.tsx`

**API:** `GET /v1/specialists/{id}/`, `PUT /v1/specialists/{id}/`

---

## 13. Mutaxassis tafsilotlari — `/admin/specialists/{id}`
**Fayl:** `pages/admin/Specialists/SpecialistDetailAdmin.tsx`

**API:** `GET /v1/specialists/{id}/`, `DELETE /v1/specialists/{id}/`

---

## 14. Mutaxassis turlari — `/admin/specialists/types`
**Fayl:** `pages/admin/Specialists/SpecialistTypesAdmin.tsx`

**API:** `GET/POST/PUT/DELETE /v1/specialists/types/`

---

## 15. Bo'limlar (Departments) — `/admin/departments`
**Fayl:** `pages/admin/Departments/DepartmentsAdmin.tsx`

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/skills/age-groups/` | GET | Yosh guruhlari (tab) |
| `GET /v1/skills/sections/` | GET | Bo'limlar ro'yxati |
| `POST /v1/skills/age-groups/` | POST | Yosh guruhi yaratish |
| `DELETE /v1/skills/age-groups/{id}/` | DELETE | Yosh guruhini o'chirish |

---

## 16. Bo'lim yaratish — `/admin/departments/create`
**API:** `POST /v1/skills/sections/` — Body: `{name, description, age_group_id, percentage, icon, color}`

---

## 17. Bo'lim tafsilotlari — `/admin/departments/{id}`
**Fayl:** `pages/admin/Departments/DepartmentDetailAdmin.tsx`

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/skills/sections/{id}/exercises/` | GET | Mashqlar ro'yxati |
| `POST /v1/skills/exercises/` | POST | Mashq qo'shish. Body: `{name, description, section_id}` |
| `PATCH /v1/skills/exercises/{id}/` | PATCH | Mashq tahrirlash |
| `DELETE /v1/skills/exercises/{id}/` | DELETE | Mashq o'chirish |

---

## 18. Moliya — `/admin/finance`
**Fayl:** `pages/admin/Finance/FinanceAdmin.tsx`

**API:** `GET /v1/billing/plans/`, `GET /v1/billing/subscriptions/`, `GET /v1/billing/payments/`

**Ko'rsatiladi:** Jami daromad, faol obunalar, tarif kartalari, grafik, to'lov tarixi

---

## 19. Bilim markazi — `/admin/knowledge-center`
**Fayl:** `pages/admin/KnowledgeCenter/KnowledgeCenterAdmin.tsx`

**API:** `GET /v1/videos/`, `POST /v1/videos/`, `DELETE /v1/videos/{id}/`, `GET /v1/skills/sections/`

---

## 20. Kalendar — `/admin/calendar`
**Fayl:** `pages/admin/Calendar/Calendar.tsx`

**API:** `GET /v1/sessions/`, `GET /v1/specialists/`, `GET /v1/children/`

---

## 21. Tadbirlar — `/admin/events`
**Fayl:** `pages/admin/Events/EventsAdmin.tsx`

**API:** `GET/POST/DELETE /v1/meetings/mothers-events/`, `POST .../mark-complete/`

---

## 22. Yutuqlar — `/admin/achievements`
**Fayl:** `pages/admin/Achievements/AchievementsAdmin.tsx`

**API:** `GET /v1/gamification/badges/`

---

## 23. O'sish tahlili — `/admin/growth-analysis`
**Fayl:** `pages/admin/GrowthAnalysis/GrowthAnalysisAdmin.tsx`

**API:** `GET /v1/diagnostics/results/` — Radar chart, bar chart, bo'limlar bo'yicha ball

---

## 24. Jadval — `/admin/schedule`
**Fayl:** `pages/admin/Schedule/ScheduleAdmin.tsx`

**API:** `GET /v1/groups/`, `GET /v1/skills/sections/`, `POST /v1/topics/`

---

## STATIK / API ULANMAGAN QISMLAR

### Dashboard — qisman statik
| Qism | Holati | Muammo |
|------|--------|--------|
| "O'rtacha o'sish %" | STATIK | `78%` hardcoded — API dan hisoblash kerak |
| "Aqliy yosh o'sishi" | STATIK | `3.2 oy` hardcoded |
| "Ota-onalar faolligi" | STATIK | `85%` hardcoded |
| "Qarzdorlar" | STATIK | Hardcoded raqam |
| Bolalar soni, Mutaxassislar, Guruhlar | API ✅ | To'g'ri ishlaydi |

### Activity sahifasi — to'liq statik
| Qism | Holati | Muammo |
|------|--------|--------|
| Oilalar reytingi | STATIK | Hardcoded massiv — API yo'q |
| Heatmap (faollik) | STATIK | Hardcoded 7x6 massiv |
| 4 ta stat karta | STATIK | Hardcoded raqamlar |
| **Kerakli API:** | — | Gamification/activity endpoint kerak |

### Calendar — qisman statik
| Qism | Holati | Muammo |
|------|--------|--------|
| Seanslar | API ✅ | `GET /v1/sessions/` ishlaydi |
| Tadbir turlari (ranglar) | STATIK | Hardcoded event types — dinamik bo'lishi kerak |

---

## UMUMAN ISHLATILMAGAN API ENDPOINTLAR

| Endpoint | Method | Sabab |
|----------|--------|-------|
| `/v1/plans/treatment-complexes/` | CRUD | API fayl bor, lekin hech qayerda import qilinmagan |
| `/v1/billing/subscriptions/{id}/deduct/` | PUT | Hook'da bor, sahifada ishlatilmagan |
| `/v1/sessions/{id}/attendance/` | POST | Davomat — sahifa yo'q |
| `/v1/sessions/schedule-slots/` | CRUD | Jadval slotlari — to'liq ulanmagan |
| `/v1/topics/rotate/` | POST | Mavzu rotatsiyasi — sahifa yo'q |
| `/v1/meetings/monthly/{id}/goal-reviews/` | POST | Maqsad ko'rib chiqish — sahifada ishlatilmagan |
| `/v1/gamification/child/{id}/xp/` | GET | XP tarixi — sahifa yo'q |
| `/v1/gamification/child/{id}/total-xp/` | GET | Jami XP — sahifa yo'q |
| `/v1/videos/age_group/{id}/` | GET | Yosh guruhi bo'yicha video — client-side filter qilinadi |
| `/v1/exams/schedule/` | GET | Imtihon jadvali — sahifada ishlatilmagan |
| `/v1/exams/results/{id}/` | PUT/PATCH/DELETE | Tahrirlash/o'chirish — sahifa yo'q |
