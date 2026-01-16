# Lucky Draw - Year End Party 2024

Ung dung web Lucky Draw cho su kien Year End Party voi cac tinh nang:
- Cap so ngau nhien **KHONG TRUNG LAP** cho nguoi tham gia
- Man hinh quay so lucky draw voi animation Slot Machine
- Luu lich su cac so da quay de trao qua

## Tech Stack
- React + TypeScript + Vite
- TailwindCSS
- Firebase (Firestore + Authentication)
- Framer Motion

## Cai dat

### 1. Clone va cai dat dependencies
```bash
npm install
```

### 2. Setup Firebase

1. Tao project moi tren [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Enable **Authentication** voi Email/Password
4. Tao 1 user admin trong Authentication
5. Copy Firebase config va tao file `.env.local`:

```bash
cp .env.example .env.local
```

Dien thong tin Firebase cua ban vao file `.env.local`

### 3. Deploy Firestore Rules
Copy noi dung file `firestore.rules` va paste vao Firestore Rules tren Firebase Console.

### 4. Chay development server
```bash
npm run dev
```

## Su dung

### Nguoi tham gia (User)
1. Truy cap trang chu `/`
2. Nhap ten va email
3. Nhan so may man (khong trung voi ai khac)
4. Chup anh man hinh hoac tai anh so ve

### Admin (Quay so)
1. Truy cap `/admin/login`
2. Dang nhap bang tai khoan admin (da tao tren Firebase Auth)
3. Chon tab "Quay So"
4. Nhap ten giai thuong
5. Nhan nut "QUAY SO" de bat dau

## Routes

| Route | Mo ta |
|-------|-------|
| `/` | Trang dang ky nhan so |
| `/history` | Xem lich su trung thuong (public) |
| `/admin/login` | Dang nhap admin |
| `/admin` | Panel quay so (can dang nhap) |

## Dam bao so KHONG TRUNG LAP

- Su dung Firebase Transaction de dam bao atomic operation
- Kiem tra email da dang ky truoc khi cap so moi
- Moi email chi duoc 1 so duy nhat
- Database rules ngan chan viec ghi so trung

## Build cho production
```bash
npm run build
```

## Deploy len Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```
