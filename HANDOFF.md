# OpenStock — מצב הפרויקט

> נכתב ב-2026-10-09 בסוף סשן ההתקנה והתרגום.
> הקובץ הזה נועד לסשן Claude Code הבא שנפתח בתיקייה הזו.

## מה זה

[OpenStock](https://github.com/Open-Dev-Society/OpenStock) — פלטפורמת מעקב מניות בקוד פתוח (AGPL-3.0),
משוכפלת מגיטהאב ומותאמת לעברית. **לא ברוקר** — לא שולחת הזמנות ולא מתחברת לחשבון מסחר.

סטאק: Next.js 15.5.7 · React 19 · TypeScript · Tailwind 4 · shadcn/ui · MongoDB Atlas · Better Auth · Finnhub · TradingView.

## הרצה

```bash
npm run dev       # http://localhost:3000
npm run test:db   # בדיקת חיבור ל-MongoDB
npm run build     # בילד לפרודקשן (אומת 2026-10-09)
npm run lint
```

**שים לב:** זה npm, לא pnpm — למרות מה שכתוב ב-README. בריפו יש רק `package-lock.json`.

## Git

- **origin** = `liorgab/OpenStock` (fork ציבורי שלך). לכאן דוחפים.
- **upstream** = `Open-Dev-Society/OpenStock` (המקור). רק למשיכת עדכונים. אין הרשאת כתיבה.
- **ענף העבודה: `hebrew-rtl`** — כל התרגום כאן. `main` נשאר נקי ועוקב אחרי upstream.
- למשוך עדכונים מהמקור: `git checkout main && git pull upstream main`, ואז `git checkout hebrew-rtl && git merge main` (צפויים קונפליקטים בקבצים המתורגמים).
- `atlas-credentials.env` נמחק. הערכים ב-`.env`.

## מה כבר עובד

- ✅ חיבור ל-MongoDB Atlas
- ✅ מפתח Finnhub מאומת מול ה-API (החזיר מחיר אמיתי)
- ✅ האפליקציה עולה, כל העמודים מחזירים HTTP 200, אפס שגיאות קומפילציה
- ✅ ממשק בעברית + RTL מלא

## מה כבוי בכוונה (חסרים מפתחות ב-`.env`)

| פיצ'ר | מה חסר |
|---|---|
| סיכומי חדשות ב-AI | `GEMINI_API_KEY` |
| מיילים והתראות | `NODEMAILER_EMAIL` + `NODEMAILER_PASSWORD` |
| ניתוח סנטימנט | `ADANOS_API_KEY` |
| משימות מתוזמנות | `INNGEST_SIGNING_KEY` + `INNGEST_EVENT_KEY` |
| התחברות Google/GitHub | `GOOGLE_CLIENT_ID` / `GITHUB_CLIENT_ID` + secrets |

---

## שני תיקונים לא מובנים מאליהם — אל תבטל אותם

### 1. ה-connection string הוא `mongodb://` ולא `mongodb+srv://`

Node.js במחשב הזה לא מצליח לבצע שאילתת DNS מסוג SRV (`querySrv ECONNREFUSED`),
ולכן הכתובת שמגיעה מ-Atlas עם `+srv` **לא עובדת באפליקציה** — אף על פי
ש-`npm run test:db` כן עובד, כי הסקריפט ההוא מגדיר לעצמו DNS של גוגל.

הפתרון: שלושת שרתי ה-shard כתובים מפורשות ב-`MONGODB_URI`, יחד עם
`replicaSet=atlas-rek67u-shard-0`, `authSource=admin` ו-`ssl=true`.

**אם החיבור יישבר יום אחד** — ייתכן ש-Atlas החליף שרתים. להרצה מחדש:
```bash
nslookup -type=SRV _mongodb._tcp.cluster0.xywdgo2.mongodb.net 8.8.8.8
nslookup -type=TXT cluster0.xywdgo2.mongodb.net 8.8.8.8
```
ולעדכן את רשימת השרתים ואת `replicaSet` לפי התוצאה.

### 2. הגופן הוחלף ל-Heebo

`Plus_Jakarta_Sans` המקורי לא מכיל אותיות עבריות. ב-`app/layout.tsx` הוא הוחלף
ב-`Heebo` עם `subsets: ["hebrew", "latin"]`, וב-`app/globals.css` השורה
`--font-sans` מצביעה עליו.

---

## מצב התרגום

19 קבצים שונו, ~140 שורות. הכל הפיך: `git diff` · ביטול: `git checkout .`

### תורגם ✅
- `app/layout.tsx` — `lang="he" dir="rtl"` + גופן עברי
- `components/shell/` — Sidebar, TabBar (ניווט ראשי)
- `app/(root)/` — dashboard, watchlist, profile, stocks/[symbol]
- `app/(auth)/` — sign-in, sign-up, forgot-password, reset-password
- `components/watchlist/` + `components/stocks/` + `components/forms/`
- מחלקות Tailwind כיווניות הומרו ללוגיות: `ml-`→`ms-`, `pr-`→`pe-`, `text-left`→`text-start`

### לא תורגם ❌
- **`app/(marketing)/`** — about, help, terms, api-docs, sponsor, דף הנחיתה.
  ~44 טקסטים. לא נכנסים לשם בשימוש יומיומי. זו המשימה הבאה אם רוצים.
- **מחרוזות עם "OpenStock Cloud"** — שם מוצר, הושאר בכוונה.

### לא ניתן לתרגום (מקור חיצוני)
- ווידג'טים של TradingView — גרפים, מפות חום, אינדיקטורים
- דאטה מ-Finnhub — שמות חברות, כותרות חדשות, שורות בדוחות הכספיים

---

## סיכונים ידועים

1. **51 פרצות אבטחה בתלויות, 4 קריטיות** — הכי משמעותית ב-`better-auth`
   (מירוץ ב-OAuth שמאפשר מימוש כפול של קוד הרשאה). `npm audit fix` זמין אך **טרם הורץ**
   כי הוא עלול לשבור את הבילד.

2. **`NEXT_PUBLIC_FINNHUB_API_KEY` נשלח לדפדפן.** התחילית `NEXT_PUBLIC_` ב-Next.js
   אורזת את הערך לתוך קוד הלקוח. ב-localhost זה בסדר. **אל תעלה לרשת עם המפתח הזה.**

3. ~~`npm run build` מעולם לא הורץ~~ — הורץ ועבר ב-2026-10-09. תפס באג אחד (גרש במילה "פיצ'ר" סגר מחרוזת עם גרש בודד) שתוקן. **כלל:** מחרוזת עברית שמכילה גרש חייבת מרכאות כפולות.

4. **עדכונים עתידיים יתנגשו.** `git pull` ידרוש מיזוג ידני מול שינויי התרגום.

5. **AGPL-3.0** — שינוי + הגשה כשירות מחייבים פרסום הקוד. לשימוש אישי מקומי אין בעיה.

---

## הצעדים הבאים המומלצים

1. ~~`npm run build`~~ — בוצע, עובר.
2. לעבור על המסכים בדפדפן ולתפוס בעיות RTL שהחלפת המחלקות לא כיסתה
   (חשוד עיקרי: ה-glider של ה-TabBar, שמחושב ב-`offsetLeft`/`translateX`)
3. להחליט לגבי `npm audit fix`
4. לתרגם את `app/(marketing)/` אם רוצים כיסוי מלא
