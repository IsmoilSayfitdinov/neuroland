# Parent Panel — Sahifalar va API Ulanishlari

---

## 1. Dashboard — `/parent/dashboard`
**Fayl:** `pages/parent/Dashboard.tsx`

**Vazifasi:** Bosh sahifa — bugungi vazifalar, rivojlanish ko'rsatkichlari, haftalik faollik

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/sessions/home-tasks/` | GET | Uy vazifalari ro'yxati (bugungi + haftalik) |
| `GET /v1/children/me/` | GET | Bolaning profili va diagnostika natijalari |
| `GET /v1/meetings/mothers-events/` | GET | Kelayotgan onalar tadbirlari |

**Komponentlar:**
- HeroBanner — salom matn
- TodayTasks — bugungi vazifalar (uy vazifalari)
- DevelopmentIndicators — diagnostika natijalaridan rivojlanish ko'rsatkichlari
- WeeklyActivity — haftalik vazifa bajarish grafigi
- ChildAndMotherTask — kelayotgan onalar tadbirlari

---

## 2. To'lovlar — `/parent/payments`
**Fayl:** `pages/parent/Payments.tsx`

**Vazifasi:** Obuna holati, balans, to'lov tarixi, tariflar

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/billing/subscriptions/me/` | GET | Joriy obuna. Response: `{id, balance, plan, is_active, last_payment_date, next_payment_date, remaining_days}` |
| `GET /v1/billing/payments/` | GET | To'lovlar tarixi. Response: `Payment[]` — id, amount, payment_date, status, method |
| `GET /v1/billing/plans/` | GET | Mavjud tariflar. Response: `Plan[]` — id, name, price, sessions_per_week, description |

**Sahifada:**
- Balans kartasi (Wallet icon)
- Obuna tafsilotlari (tarif, oxirgi to'lov, keyingi to'lov, qolgan kunlar)
- Progress bar (obuna muddati)
- Tariflar grid (narx, haftalik seanslar)
- To'lov tarixi jadvali

---

## 3. Yutuqlar — `/parent/achievements`
**Fayl:** `pages/parent/Achievements.tsx`

**API:** Yo'q (Coming Soon placeholder)

---

## 4. Bilim markazi — `/parent/knowledge`
**Fayl:** `pages/parent/Knowledge.tsx`

**Vazifasi:** Video mashqlar va ta'limiy videolarni ko'rish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/videos/` | GET | Barcha ta'limiy videolar |
| `GET /v1/topics/exercises/` | GET | Mavzu mashqlari (video) |
| `POST /v1/topics/exercises/{id}/start/` | POST | Videoni boshlash |
| `POST /v1/topics/exercises/{id}/end/` | POST | Videoni tugatish |

**Sahifada:** 2 ta tab — Video mashqlar, Ta'limiy videolar. Bo'lim filtri bor.

---

## 5. Yillik reja — `/parent/annual-plan`
**Fayl:** `pages/parent/AnnualPlan.tsx`

**Vazifasi:** 12 oylik rivojlanish rejasini ko'rish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/me/` | GET | Bola profili (group_id olish) |
| `GET /v1/plans/yearly/` | GET | Yillik rejalar |
| `GET /v1/plans/yearly/{id}/monthly-goals/` | GET | Oylik maqsadlar. Response: `MonthlyGoal[]` — month_number, items (is_mastered, section_name) |

**Sahifada:** 12 ta oy kartasi — har biri locked/active/completed holat, progress %, ko'nikmalar ro'yxati

---

## 6. Uy vazifalari — `/parent/tasks`
**Fayl:** `pages/parent/Tasks.tsx`

**Vazifasi:** Uy vazifalarini ko'rish va bajarish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/sessions/home-tasks/` | GET | Uy vazifalari. Response: `HomeTask[]` — id, title, items, specialist_name, due_date, status (pending/submitted/approved/rejected) |

**HomeTask status:**
- `pending` — bajarilmagan (sariq)
- `submitted` — yuborilgan, ko'rib chiqilmoqda (ko'k)
- `approved` — tasdiqlangan (yashil)
- `rejected` — rad etilgan (qizil)

---

## 7. Bola ma'lumotlari — `/parent/child-info`
**Fayl:** `pages/parent/ChildInfo.tsx`

**Vazifasi:** Bola profili va rivojlanish tarixi

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/me/?include_anamnesis=true` | GET | To'liq ChildDetailOut — anamnez, konsultatsiya, diagnostika, guruh |

**2 ta tab:**
- **Asosiy ma'lumotlar** — fio, tug'ilgan sana, yosh, guruh, tashxis, ota-ona
- **Rivojlanish tarixi** — homiladorlik, tug'ilish, erkalatish, yurish, nutq, uxlash, ovqatlanish

---

## 8. Rivojlanish — `/parent/development`
**Fayl:** `pages/parent/Development.tsx`

**Vazifasi:** Diagnostika natijalarini grafik ko'rinishida ko'rish

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/children/me/` | GET | Bola profili (diagnostic_results ichida natijalar) |

**Sahifada:**
- Radar chart — joriy vs oldingi diagnostika natijalari (bo'limlar bo'yicha)
- Batafsil natijalar — har bir bo'lim bo'yicha ball va mutaxassis izohlari

---

## 9. Bildirishnomalar — `/parent/notifications`
**Fayl:** `pages/shared/NotificationsPage.tsx`

**API chaqiruvlari:**
| Endpoint | Method | Vazifasi |
|----------|--------|----------|
| `GET /v1/notifications/` | GET | Barcha bildirishnomalar |
| `GET /v1/notifications/unread-count/` | GET | O'qilmaganlar soni |
| `PATCH /v1/notifications/{id}/read/` | PATCH | O'qilgan deb belgilash |
| `POST /v1/notifications/mark-all-read/` | POST | Barchasini o'qish |

**Bildirishnoma turlari:**
- `task_assigned` — Uy vazifasi berildi
- `task_approved` — Uy vazifasi tasdiqlandi
- `task_rejected` — Uy vazifasi rad etildi
- `payment_due` — To'lov muddati
- `meeting_scheduled` — Uchrashuv belgilandi
- `badge_earned` — Yangi badge
- `session_reminder` — Seans eslatmasi
- `exam_coming` — Imtihon yaqinlashmoqda

---

## STATIK / API ULANMAGAN QISMLAR

### Achievements sahifasi — to'liq statik
| Qism | Holati | Muammo |
|------|--------|--------|
| To'liq sahifa | STATIK | "Coming Soon" placeholder — API bor lekin ulanmagan |
| **Kerakli API:** | — | `GET /v1/gamification/child/{id}/badges/` — bola badge'lari |
| | — | `GET /v1/gamification/child/{id}/total-xp/` — jami XP |
| | — | `GET /v1/gamification/child/{id}/xp/` — XP tarixi |

### Dashboard — qisman statik
| Qism | Holati | Muammo |
|------|--------|--------|
| TodayTasks | API ✅ | `GET /v1/sessions/home-tasks/` |
| DevelopmentIndicators | QISMAN | API dan oladi, lekin natija yo'q bo'lsa hardcoded fallback data ko'rsatadi |
| WeeklyActivity | API ✅ | Home tasks dan hisoblaydi |
| ChildAndMotherTask | API ✅ | `GET /v1/meetings/mothers-events/` |

### Development sahifasi — qisman
| Qism | Holati | Muammo |
|------|--------|--------|
| Radar Chart | API ✅ | child.diagnostic_results dan oladi |
| DetailedResults | API ✅ | Ishlaydi |
| **Muammo:** | — | Agar diagnostika natijasi yo'q bo'lsa bo'sh sahifa ko'rsatadi |

### Tasks sahifasi — qisman
| Qism | Holati | Muammo |
|------|--------|--------|
| Vazifalar ro'yxati | API ✅ | `GET /v1/sessions/home-tasks/` |
| Vazifa yuborish (submit) | YO'Q | `POST /v1/sessions/home-tasks/{id}/submit/` — tugma yo'q |
| Evidence file upload | YO'Q | Submit bilan birga file yuklash kerak |

---

## PARENT DA ULANMAGAN API ENDPOINTLAR

| Endpoint | Method | Vazifasi | Holati |
|----------|--------|----------|--------|
| `POST /v1/sessions/home-tasks/{id}/submit/` | POST | Uy vazifasini topshirish (video/rasm bilan) | Sahifada tugma yo'q |
| `GET /v1/gamification/child/{id}/badges/` | GET | Bola badge'lari | Achievements sahifasi placeholder |
| `GET /v1/gamification/child/{id}/total-xp/` | GET | Jami XP | Sahifada ishlatilmagan |
| `GET /v1/gamification/child/{id}/xp/` | GET | XP tarixi | Sahifada ishlatilmagan |
| `GET /v1/exams/schedule/{child_id}/` | GET | Imtihon jadvali | Sahifada ishlatilmagan |
| `GET /v1/exams/results/?child_id=X` | GET | Imtihon natijalari | Sahifada ishlatilmagan |
