# 탐정법인 정성 랜딩 페이지

Vite + React로 제작한 반응형 랜딩 페이지입니다. Vercel이 프론트엔드와 서버 함수를 호스팅합니다. 상담 신청은 Firebase Firestore의 `consultations` 컬렉션에 저장되고, Google Sheets 기록과 Telegram 알림이 동시에 전송됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## Firebase 설정

1. Firebase 콘솔에서 웹 앱과 Firestore Database를 생성합니다.
2. `.env.example`을 `.env.local`로 복사하고 웹 앱 설정값을 입력합니다.
3. 프로젝트를 Firebase CLI에 연결한 뒤 쓰기 전용 보안 규칙을 배포합니다.

```bash
firebase use --add
firebase deploy --only firestore:rules
```

브라우저에서는 신규 상담 문서 생성만 허용되고, 조회·수정·삭제는 모두 차단됩니다.

## Vercel 배포

Vercel 프로젝트의 Production, Preview, Development 환경에 `.env.example`의 변수를 추가합니다. `VITE_FIREBASE_*` 값은 브라우저용 Firebase 설정이며, `GOOGLE_*`와 `TELEGRAM_*` 값은 서버 함수에서만 읽는 비밀값입니다.

### Google Sheets

1. Google Cloud에서 Sheets API를 활성화하고 서비스 계정을 만듭니다.
2. 대상 스프레드시트를 서비스 계정 이메일에 편집자로 공유합니다.
3. 시트 첫 행에 `접수일시, 이름, 연락처, 문의내용, 유입경로, 접수ID` 열을 준비합니다.
4. 스프레드시트 ID, 서비스 계정 이메일, 비공개 키를 Vercel 환경변수에 입력합니다.

### Telegram

1. BotFather로 봇을 만든 뒤 Bot Token을 발급받습니다.
2. 알림을 받을 개인 채팅 또는 그룹의 Chat ID를 확인합니다.
3. `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`를 Vercel 환경변수에 입력합니다.

로컬 CLI를 사용할 경우 다음 순서로 배포합니다.

```bash
vercel link
vercel env pull .env.local
vercel --prod
```

배포 전에 아래 명령으로 확인할 수 있습니다.

```bash
npm run lint
npm run build
```
