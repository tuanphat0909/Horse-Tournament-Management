# BÁO CÁO MERGE FE + RÀ SOÁT API — 06/07/2026

So sánh giữa **FE hiện tại** (`frontend/` trong repo HorseRacingManagementSystem) và **FE tham chiếu** (`Horse-Tournament-Management-main`). Nguyên tắc đã tuân thủ: **không sửa bất kỳ file BE nào**, chỉ port những phần mà BE hiện tại **có API dùng được**; phần không dùng được đưa vào mục "Ý tưởng chưa thực hiện được".

---

## 1. Rà soát độ phủ API của BE

BE có 9 controller: Admin, Auth, AuthTest (dev), Health, Jockey, Owner, Public, Referee, Spectator.

### 1.1. API BE **đã được FE hiện tại sử dụng** (hoạt động bình thường)

Toàn bộ các nhóm: đăng nhập/đăng ký, quản lý tài khoản, tạo/sửa giải đấu, sinh cuộc đua tự động (Pre + Final), tạo/xóa cuộc đua, ghép ngựa vào làn, phân công/gỡ trọng tài, duyệt đăng ký, quản lý vi phạm, dự đoán, ví + cược + payout, kết quả trọng tài, publish kết quả, xếp hạng, thông báo (kèm SignalR realtime qua `/hubs/notification`). **Mọi hàm trong `src/api/*.js` đều đang được ít nhất 1 trang sử dụng — không có hàm chết.**

### 1.2. API BE **chưa được FE hiện tại dùng** (BE làm rồi nhưng FE bỏ trống)

| # | Endpoint | FE tham chiếu có dùng? | Ghi chú |
|---|----------|------------------------|---------|
| 1 | `GET /admin/activity-log` | ✅ | **ĐÃ PORT trong đợt này** — thay mock ở Admin Dashboard |
| 2 | `POST /admin/races/{id}/recalculate-odds` | ✅ | Nên thêm nút "Tính lại tỉ lệ cược" ở trang Results |
| 3 | `GET /admin/payouts` | ✅ | Xem lịch sử trả thưởng |
| 4 | `PUT /admin/tournaments/{id}` | ✅ | FE hiện tại chưa có nút sửa giải đấu |
| 5 | `PUT /admin/registrations/{id}/approve` + `/reject` | ✅ | FE hiện tại dùng `PUT .../status` — tương đương, không cần đổi |
| 6 | `GET /admin/users/options`, `GET /admin/horses/options` | ✅ | Dropdown gọn nhẹ thay vì tải cả list |
| 7 | `POST /horses/{id}/documents` | ✅ | Upload giấy tờ ngựa (Owner) |
| 8 | `GET /owner/dashboard` | ✅ | Dashboard Owner bằng số liệu thật |
| 9 | `GET /public/tournaments/{id}/rounds`, `GET /public/rounds/{id}` | ✅ | Load vòng đấu riêng lẻ |
| 10 | `GET /public/races/{raceId}/results` | ✅ | Kết quả công khai cho Spectator |
| 11 | `GET /referee/races/{raceId}/violations` | ✅ | Vi phạm theo từng cuộc đua |
| 12 | `POST /referee/races/{raceId}/results` + `GET .../results` | ✅ | Nộp/xem kết quả theo race-scope |
| 13 | `GET /spectator/predictions/race/{raceId}` | ✅ | Dự đoán theo cuộc đua |
| 14 | `POST /public/tournaments/{id}/generate-races` | — | Endpoint dev/test, không nên dùng ở FE |

→ Các mục 2–13 **đều dùng được ngay** (BE có sẵn), được liệt kê ở mục 6 như lộ trình port tiếp theo.

### 1.3. Kiểm tra commit mới (theo yêu cầu)

- `git fetch`: origin/main có 2 commit mới (`24811ce`, `0f10999→3e3d348`) — **chỉ là Azure deployment workflow, KHÔNG có API mới**.
- Nhánh chưa merge `feature/han-race-entry`: thêm "public race entry read API" (chỉ đọc). Chưa merge vào main nên **không dùng được** — nếu team merge nhánh này thì cũng không giải quyết được bài toán di dời ngựa (chỉ là API đọc).
- **Không có nhánh/commit nào bổ sung API sửa/xóa race entry** → tính năng di dời ngựa vẫn phải vào báo cáo ý tưởng (mục 5).

---

## 2. UI đã hiển thị nhưng chưa hoạt động thật (trước đợt sửa này)

| Vị trí | Vấn đề | Trạng thái |
|--------|--------|------------|
| `AdminDashboardPage` — "Hoạt động gần đây" | Tự chế activity từ dữ liệu khác + **4 activity giả (mock-1..4)**, và **3 đơn đăng ký giả kiểu F1** (Red Bull Speed, Ferrari Swift…) khi không có đơn Pending | ✅ **Đã sửa**: dùng API thật `GET /admin/activity-log`, bỏ toàn bộ mock |
| `SpectatorWalletPage` — modal VNPay | QR VNPay là **mock trình diễn** (ảnh giả), tiền vẫn nạp qua API `deposit` thật | ⚠ Giữ nguyên (nạp tiền vẫn hoạt động; tích hợp VNPay thật cần BE) |
| `RefereeHorseCheckPage` | Chỉ **xem** danh sách kiểm tra ngựa — không có nút xác nhận đạt/không đạt | ⚠ Đúng với BE: BE chỉ có `GET /referee/races/{id}/horse-checks`, **không có API ghi** → xem mục 5 |
| `AdminRacesPage` — ghép làn kiểu cũ | Nhập **số làn bằng tay**, không thấy làn nào trống/đã chiếm, dễ đụng lỗi "Lane already occupied" | ✅ **Đã thay** bằng modal ghép theo sơ đồ làn (mục 3) |
| Entry "vượt làn" (laneNo > maxLanes do auto-generate cũ) | Trước đây không hiển thị gì | ✅ Modal chi tiết + RaceTrack3D giờ **cảnh báo đỏ** rõ ràng |

---

## 3. Những phần đã port từ FE tham chiếu (tất cả đều chạy trên API có sẵn)

### 3.1. `AdminRacesPage` — Chi tiết làn đua + ghép ngựa vào làn + trọng tài (yêu cầu số 4)

- **Modal "Ghép ngựa vào làn" theo sơ đồ làn**: sinh 1 hàng cho **từng làn** theo `maxLanes`; làn đã ghép hiển thị khóa xanh (ngựa + jockey + "Đã ghép"); làn trống có dropdown chỉ hiện ngựa **Approved đúng giải, chưa được ghép** (ngựa chọn ở làn khác tự ẩn). Lưu nhiều làn một lần (POST tuần tự từng entry — đúng giới hạn BE), lỗi làn nào báo rõ làn đó.
- Mở từ card cuộc đua → **race bị khóa** (chống ghép nhầm giải); mở từ nút trên đầu trang → được chọn race bằng dropdown (giữ tiện ích của FE hiện tại, FE kia không có).
- **Modal "Chi tiết cuộc đua"** (nút 👁): thông tin chung + **sơ đồ làn 3D `RaceTrack3D`** (scheduled: ngựa ở cổng xuất phát; live: ngựa chạy animation; finished: bục trao giải 🥇🥈🥉 theo `finishPosition`) + danh sách làn + chip trọng tài + nút nhảy thẳng sang ghép làn.
- **Modal trọng tài cải tiến**: mở từ card → race khóa + tự tải danh sách trọng tài hiện tại (bỏ nút "Tải danh sách" thủ công); dropdown **tự ẩn trọng tài đã được phân công** vào race đó; gỡ trọng tài ngay trong modal.
- Toàn bộ thông báo chuyển sang **toast hệ thống** (`showToast` của NotificationContext — đúng chuẩn các commit gần đây), bỏ `alert()`.
- Giữ nguyên: bố cục nhóm theo Giải đấu → Vòng → card cuộc đua, nút "Auto xếp làn đua" / "Auto xếp Final (Top 12)", panel mở rộng inline. Sửa thêm 1 bug cũ: refresh panel đang mở rộng sau khi ghép làn/gán trọng tài giờ **cập nhật lại dữ liệu** thay vì bị đóng sập.

### 3.2. `RaceTrack3D.tsx` — copy nguyên vẹn (component độc lập, chỉ cần framer-motion + lucide có sẵn)

### 3.3. `AdminDashboardPage` — feed "Hoạt động gần đây" dùng `GET /admin/activity-log` thật (user mới, đăng ký, cược, thông báo, giao dịch ví — icon phân loại theo type), xóa toàn bộ dữ liệu giả.

### 3.4. Font chữ — dùng **100% font của FE tham chiếu** (yêu cầu số 5)

- `index.css`: `@import` Google Fonts → **DM Sans** (body) + **Playfair Display** (heading); `--font-serif`/`--font-sans` đổi tương ứng. `tailwind.config.js` hai bên vốn đã giống nhau.
- `LoginPage`/`RegisterPage`: các style inline `Poppins` → `Playfair Display` (khớp từng dòng với file kia, kể cả chỗ giữ `Inter`).
- ⚠ **Cảnh báo quan trọng**: đã kiểm tra trực tiếp Google Fonts — **DM Sans KHÔNG có subset tiếng Việt** (Playfair Display thì có). Chữ có dấu ở phần body sẽ fallback sang font hệ thống → có thể lệch nét nhẹ giữa chữ có dấu/không dấu. Đây chính là lý do commit `b93906b` trước đây đổi sang Poppins/Inter. FE tham chiếu cũng dính hạn chế này. Nếu team thấy xấu, sửa 1 dòng: `--font-sans: "DM Sans", "Inter", sans-serif;` hoặc thay DM Sans bằng "Be Vietnam Pro".

### 3.5. Sửa kèm: 3 lỗi TypeScript có sẵn (biến không dùng ở `AdminUsersPage`, `OwnerJockeysPage`) để `npm run build` xanh. **Đã build production thành công.**

---

## 4. Những phần của FE tham chiếu **không port** (và lý do)

| Phần | Lý do không port |
|------|------------------|
| `Toast.tsx` (toast singleton riêng) | FE hiện tại đã có hệ toast tốt hơn qua `NotificationContext` (top-right, success/error, gắn SignalR) — port sẽ tạo 2 hệ toast song song |
| `notificationHub.ts` | FE hiện tại đã tích hợp SignalR trực tiếp trong `NotificationContext` — không cần |
| `Pager.tsx` + bảng races phẳng có filter/phân trang | Bố cục nhóm theo giải đấu của FE hiện tại phù hợp quy trình admin hơn (có nút auto-xếp theo giải); Pager sẽ hữu ích nếu sau này danh sách quá dài |
| Layout khác biệt ở Sidebar/Topbar/landing | Khác biệt thẩm mỹ thuần túy, FE hiện tại có thêm LanguageContext (đa ngôn ngữ) — không đáng đổi |

---

## 5. BÁO CÁO Ý TƯỞNG CHƯA THỰC HIỆN ĐƯỢC (do BE chưa có API — không sửa BE theo yêu cầu)

### 5.1. ⭐ Di dời ngựa đã ghép sang làn trống khác (yêu cầu số 4 — phần tinh chỉnh)

**Mục tiêu**: làn của ngựa đã đăng ký bị hư hỏng → admin chuyển ngựa sang làn trống mà không phá dữ liệu.

**Kết luận sau khi rà toàn bộ BE + mọi nhánh/commit mới: KHÔNG thể thực hiện với API hiện có.**
- BE chỉ có `POST /admin/races/{raceId}/entries` (tạo mới). `RaceService.CreateRaceEntryAsync` chặn cứng: làn đã chiếm → lỗi; đơn/ngựa đã có entry trong race → lỗi. **Không có `PUT`/`DELETE` cho entry.**
- Cách "lách" duy nhất là `DELETE /admin/races/{raceId}` (xóa cả cuộc đua) rồi tạo lại race + ghép lại toàn bộ → **mất trọng tài đã gán, kết quả, cược, dự đoán, đổi raceId** — quá nguy hiểm, không đưa vào UI.

**Đề xuất API cho team BE (chỉ cần 1 trong 2):**
```
PUT  /api/admin/races/{raceId}/entries/{raceEntryId}   body: { "laneNo": 5 }
     → đổi làn; validate: 1 ≤ laneNo ≤ maxLanes, làn đích chưa bị chiếm,
       race chưa Finished/Live (hoặc cho phép khi Scheduled)
```
hoặc:
```
DELETE /api/admin/races/{raceId}/entries/{raceEntryId}
     → gỡ entry (chặn khi đã có kết quả/cược); FE sẽ gỡ + ghép lại làn mới
```
**FE đã chuẩn bị sẵn chỗ**: modal ghép làn hiển thị từng làn (chiếm/trống) — khi có API chỉ cần thêm nút "Di dời" trên hàng làn đã ghép, mở dropdown chọn làn trống, gọi API rồi `selectLaneRace()` refresh. Ước lượng ~30 dòng code.

### 5.2. Sửa dữ liệu "entry vượt làn" (laneNo > maxLanes)

Dữ liệu lỗi từ auto-generate cũ. FE giờ đã **hiển thị cảnh báo đỏ**, nhưng muốn sửa tận gốc cần API xóa/sửa entry như 5.1. Hiện chỉ có cách xóa cả cuộc đua tạo lại.

### 5.3. Trọng tài xác nhận kiểm tra ngựa (Horse Check)

BE chỉ có `GET /referee/races/{id}/horse-checks` (suy ra trạng thái từ đơn đăng ký), **không có API ghi kết quả kiểm tra** (đạt/không đạt, ghi chú sức khỏe). Cần: `POST /api/referee/races/{raceId}/horse-checks` body `{ raceEntryId, passed, note }`.

### 5.4. Cổng thanh toán VNPay thật

Modal VNPay ở ví Spectator là mock trình diễn. Cần BE tích hợp VNPay (tạo payment URL + webhook/IPN xác nhận) → FE mới bỏ mock được.

### 5.5. Thống kê dashboard nâng cao

`GET /admin/dashboard` trả số liệu tổng (users, tournaments…) nhưng chưa có chuỗi thời gian (doanh thu cược theo ngày, lượt đăng ký theo tuần…) để vẽ chart xu hướng thật — chart xu hướng nếu vẽ sẽ phải fake, nên chưa làm.

---

## 6. Khuyến nghị port tiếp theo (BE ĐÃ CÓ API — làm được ngay, chưa làm trong đợt này để tránh phình phạm vi)

Ưu tiên theo giá trị cho quy trình giải đấu:
1. **Trang Results**: nút "Recalculate odds" (`POST /admin/races/{id}/recalculate-odds`) + bảng lịch sử payout (`GET /admin/payouts`).
2. **Sửa giải đấu** (`PUT /admin/tournaments/{id}`) — hiện tạo xong không sửa được ngày/tên.
3. **Owner**: dashboard số liệu thật (`GET /owner/dashboard`) + upload giấy tờ ngựa (`POST /horses/{id}/documents`).
4. **Referee**: vi phạm + kết quả theo từng race (`GET /referee/races/{id}/violations`, `POST/GET /referee/races/{id}/results`).
5. **Spectator**: kết quả công khai (`GET /public/races/{id}/results`) + dự đoán theo race (`GET /spectator/predictions/race/{id}`).

---

## 7. KỊCH BẢN CHẠY TRỌN QUY TRÌNH 1 GIẢI ĐẤU (từ bắt đầu → kết thúc)

Dùng để demo/kiểm thử end-to-end sau merge. Mỗi bước ghi rõ vai trò → trang UI → API.

| Bước | Vai trò | Thao tác trên UI | API |
|------|---------|------------------|-----|
| 1 | Admin | Tạo tài khoản Owner/Jockey/Referee (Quản lý người dùng) hoặc user tự đăng ký | `POST /admin/accounts`, `POST /auth/register` |
| 2 | Admin | Tạo giải đấu (modal validate ngày realtime) — tự sinh 2 vòng Prefinal/Final | `POST /admin/tournaments` |
| 3 | Owner | Thêm ngựa vào chuồng | `POST /horses` |
| 4 | Owner | Mời jockey ký hợp đồng theo giải (hệ thống chặn jockey bận) | `POST /jockey-contracts`, `GET /jockeys/{id}/check-busy/{tid}` |
| 5 | Jockey | Chấp nhận lời mời | `PUT /jockeys/contracts/{id}/respond` |
| 6 | Owner | Đăng ký ngựa vào giải — **chỉ ngựa Khỏe mạnh (Healthy) chọn được**, ngựa sức khỏe kém bị khóa trong dropdown (gate sức khỏe bước 1) | `POST /registrations` + `GET /horses/my-horses` |
| 7 | Admin | Duyệt đơn đăng ký | `PUT /admin/registrations/{id}/status` |
| 8 | Admin | Đóng đăng ký giải | `POST /admin/tournaments/{id}/close-registration` |
| 8b | Referee | **Kiểm tra sức khỏe ngựa trước khi ghép làn** — chỉ ngựa Healthy được vào làn. ⚠ Bước này hiện là quy trình thủ công/quy ước: BE chưa có API cho referee ghi kết quả kiểm tra (5.7) và API đăng ký chưa trả sức khỏe cho admin (5.8) nên FE chưa tự chặn được | (chờ BE — xem 5.7, 5.8) |
| 9 | Admin | "Auto xếp làn đua" (sinh races vòng loại + chia ngựa) **hoặc** tạo race thủ công rồi ghép làn bằng modal sơ đồ làn mới | `POST /admin/tournaments/{id}/generate-races`, `POST /admin/races`, `POST /admin/races/{id}/entries` |
| 10 | Admin | Phân công trọng tài cho từng race (modal mới: ẩn trọng tài đã gán) | `POST /admin/races/{id}/referees` |
| 11 | Admin | Kiểm tra bằng modal 👁 Chi tiết: sơ đồ làn 3D + trọng tài đủ chưa | `GET /public/races/{id}/entries`, `GET /admin/races/{id}/referees` |
| 12 | Spectator | Nạp ví → xem tỉ lệ cược → đặt cược / dự đoán | `POST /spectator/wallet/deposit`, `GET /spectator/races/{id}/betting-info`, `POST /spectator/bets`, `POST /spectator/predictions` |
| 13 | Referee | Sau khi đua: nhập kết quả (thứ hạng/thời gian), ghi vi phạm nếu có | `POST /referee/results`, `POST /referee/violations` |
| 14 | Admin | Publish kết quả race (modal 👁 chuyển thành bục trao giải 3D 🥇) | `POST /admin/races/{id}/publish` |
| 15 | Admin | Lặp bước 13–14 cho hết vòng loại → nút "Auto xếp Final (Top 12)" sáng | `POST /admin/tournaments/{id}/generate-final` |
| 16 | Admin | Chung kết: gán trọng tài → đua → nhập kết quả → publish | như 10, 13, 14 |
| 17 | Admin | Trả thưởng: tạo cơ cấu giải + trigger payout cược | `POST /admin/payouts/prizes`, `POST /admin/payouts/trigger/{raceId}` |
| 18 | Mọi người | Xem BXH ngựa/jockey, Owner xem thành tích, Spectator xem ví/lịch sử cược, thông báo realtime qua SignalR | `GET /public/rankings/*`, `GET /owner/results`, `GET /spectator/wallet/history` |

> Điểm cần lưu ý khi chạy kịch bản: bước 9 nếu ghép làn thủ công mà chọn nhầm — **hiện chưa gỡ/di dời được** (mục 5.1). Tạm thời phải xóa race tạo lại, nên hãy kiểm tra kỹ ở modal 👁 trước khi sang bước 12 (đã có cược thì không nên xóa race).

---

## 7b. CẬP NHẬT ĐỢT 2 (chiều 06/07/2026)

### Đã làm theo yêu cầu mới

1. **Bỏ 2 nút "Ghép ngựa vào làn" + "Phân công trọng tài" trên PageHero trang Quản lý cuộc đua** — các thao tác này chỉ còn nằm trên từng card cuộc đua (race luôn được khóa theo card, không còn chế độ chọn race bằng dropdown; code nhánh đó đã dọn sạch).
2. **Trang "Phân công trọng tài" → "Quản lý trọng tài"** (đổi cả label Sidebar + bản dịch):
   - Cột trái: **tổng danh sách trọng tài** — mỗi trọng tài hiển thị GP/kinh nghiệm + badge số cuộc đua đang phụ trách + liệt kê chi tiết *cuộc đua • vòng • giải • ngày* (tra ngược từ `GET /admin/races/referee-assignments`).
   - Giữ khu "Đã Phân Công (Assigned)" dạng card như cũ nhưng **bỏ toàn bộ UI gán** (dropdown "Thêm trọng tài khác" + nút Gán/Thêm); chỉ còn xem + gỡ (🗑).
   - Khu "Chưa Phân Công" thành danh sách cảnh báo, mỗi card có nút dẫn thẳng sang **Quản lý cuộc đua** — đúng luồng: ghép làn xong mới phân công trọng tài tại trang lịch đua.
   - `alert()` → toast hệ thống.
3. **Trang Duyệt đăng ký**: thêm banner giải thích điều kiện duyệt + **dịch thông báo chặn của BE sang tiếng Việt** ("ngựa chưa có hợp đồng jockey…" / "hợp đồng chưa được jockey chấp nhận…"). Lưu ý: BE **đã tự chặn** duyệt đơn khi ngựa chưa có jockey Accepted, nên không thể duyệt nhầm — FE chỉ chưa *hiển thị trước* được tên jockey (xem 5.6).

### Bổ sung mục 5 — Ý tưởng chưa thực hiện được

**5.6. Hiển thị jockey trong trang Duyệt đăng ký + ẩn nút Duyệt khi chưa có jockey**

- `GET /admin/registrations` hiện chỉ trả: registrationId, tournament, horse, owner, status, registeredAt — **không có thông tin hợp đồng jockey**; admin cũng không gọi được API hợp đồng nào khác (OwnerController khóa `[Authorize(Roles="HorseOwner")]`, JockeyController chỉ trả hợp đồng của chính jockey đang đăng nhập).
- Đề xuất BE (sửa ~5 dòng trong `AdminController.GetRegistrations`): join thêm `JockeyContracts` (theo TournamentId + HorseId) và trả thêm:
  ```
  JockeyName        : tên jockey của hợp đồng Accepted/Active (null nếu chưa có)
  ContractStatus    : trạng thái hợp đồng (null nếu chưa có)
  ```
- Khi có 2 field này, FE chỉ cần: thêm cột "Jockey" và điều kiện `reg.jockeyName ? <nút Duyệt> : <badge "Chưa có jockey">` — ước lượng ~15 dòng.

**5.7. Trọng tài chỉnh sửa tình trạng sức khỏe ngựa (dropdown) tại trang Kiểm tra ngựa**

- Sức khỏe ngựa (`Horse.HealthStatus`) chỉ sửa được qua `PUT /api/horses/{id}` — endpoint này khóa `[Authorize(Roles="HorseOwner")]`; `RefereeController` **không có bất kỳ API ghi nào** cho horse-check (chỉ có `GET .../horse-checks`).
- Đề xuất BE: `POST /api/referee/races/{raceId}/horse-checks` body `{ raceEntryId, medicalStatus, passed, note }` (hoặc tối thiểu `PUT /api/referee/horses/{horseId}/health`). Khi có API, FE chỉ cần đổi badge sức khỏe thành dropdown (bộ giá trị chuẩn Healthy/Injured/Sick/Recovering/Retired đã dùng ở trang Chủ ngựa) + nút lưu.
- Trong lúc chờ: FE đã xử lý phần **mâu thuẫn hiển thị** (xem mục 7d) — ngựa sức khỏe kém không còn hiện "Đã duyệt".

**5.8. Chặn ghép làn khi ngựa không Healthy (bước gate sức khỏe trong quy trình)**

- Quy trình mong muốn: tạo giải → owner đăng ký + contract jockey → admin duyệt → **referee duyệt sức khỏe → chỉ Healthy mới được ghép làn**.
- Hiện trạng BE: **admin không có bất kỳ API nào đọc được `HealthStatus`** — `GET /admin/registrations` không trả, `GET /admin/horses/options` chỉ có Id/Label/Owner, `GET /public/rankings/horses` không có; health chỉ đọc được bởi Owner (`/horses/my-horses`) và Referee (`/referee/races/{id}/horse-checks` — nhưng chỉ CÓ dữ liệu **sau khi** đã ghép làn, thành vòng lặp ngược). `POST /admin/races/{id}/entries` (RaceService) cũng không kiểm tra health, và generate-races tự động cũng vậy.
- Đề xuất BE (chọn 1 hoặc cả 2):
  1. Thêm `HealthStatus` vào response `GET /admin/registrations` (gộp chung với đề xuất 5.6 — thêm cả JockeyName) → FE lọc dropdown ghép làn chỉ còn ngựa Healthy (~5 dòng FE).
  2. Chặn ở tầng service: `CreateRaceEntryAsync` throw khi `Horse.HealthStatus != "Healthy"` (an toàn tuyệt đối, chặn được cả auto-generate).
- Tạm thời: modal ghép làn đã có dòng cảnh báo quy trình nhắc admin đối chiếu sức khỏe với trọng tài/chủ ngựa trước khi ghép.
- **Đã triển khai biến thể khả thi (07/07)**: gate sức khỏe được đẩy lên **bước đăng ký** — Chủ ngựa (role duy nhất đọc được `healthStatus` qua API) không thể đăng ký ngựa không Healthy vào giải (xem 7f). Phương án "referee kiểm tra theo giải trước khi ghép làn" vẫn cần BE vì: `/admin/registrations` khóa role Admin (referee không gọi được), tournament detail public không kèm đơn đăng ký, và không API nào referee đọc được health trước khi có entry.

---

## 7c. CẬP NHẬT ĐỢT 3 (tối 06/07/2026)

1. **Fix lỗi modal Chi tiết không hiển thị trọng tài đã gán**: API `GET /admin/races/{id}/referees` trả về **mảng JSON thô** (không bọc `{result}`), trong khi modal chỉ đọc `.result` → luôn rỗng. Đã thêm fallback đọc mảng thô cho cả trọng tài lẫn entries.
2. **Modal "Ghi nhận vi phạm" (Referee)**: ô nhập tay "Ngựa / Nài ngựa vi phạm" → **dropdown** tự tải danh sách ngựa/jockey đã ghép làn của cuộc đua đang chọn (`GET /public/races/{id}/entries`), hiển thị dạng "Làn X • Tên ngựa / Tên jockey"; khóa khi chưa chọn cuộc đua, báo rõ khi race chưa ghép làn.
3. **Trang Quản lý cuộc đua — thu gọn từng giải đấu**: mặc định mỗi giải chỉ còn 1 hàng (tên + trạng thái + tổng số cuộc đua + các nút Auto xếp), bấm mũi tên/tiêu đề mới đổ phần detail vòng & cuộc đua xuống.
4. **Phân trang (port `Pager.tsx` + `paginate` từ Horse-Tournament-Management)** cho các list dài:
   - Quản lý cuộc đua: 5 giải/trang
   - Duyệt đăng ký: 10 đơn/trang (reset trang khi đổi tab/tìm kiếm)
   - Tài khoản (Users): 10/trang (reset khi đổi role filter/tìm kiếm)
   - Vi phạm (Admin): 10/trang cho từng tab Chờ xử lý / Đã xác nhận / Đã bác bỏ
   - Dự đoán (Predictions): 10/trang
   - Xử lý vi phạm (Referee): 9 card/trang

File thay đổi thêm: `Pager.tsx` (mới), `AdminRacesPage.tsx`, `AdminRegistrationsPage.tsx`, `AdminUsersPage.tsx`, `AdminViolationsPage.tsx`, `AdminPredictionsPage.tsx`, `RefereeViolationsPage.tsx`.

---

## 7d. CẬP NHẬT ĐỢT 4 (tối 06/07/2026)

1. **Chủ ngựa — ô "Tình trạng sức khỏe" khi sửa ngựa → dropdown** với 5 giá trị chuẩn (Healthy / Injured / Sick / Recovering / Retired, nhãn song ngữ). Giá trị cũ nhập tay ngoài danh sách được giữ thành option "(giá trị cũ)" để không mất dữ liệu; ngựa chưa có tình trạng mặc định Healthy. (BE không so sánh giá trị cụ thể của trường này nên chuẩn hóa an toàn.)
2. **Trọng tài — Kiểm tra ngựa: hết mâu thuẫn Sức khỏe ↔ Trạng thái.** Nguyên nhân cũ: cột "Trạng thái" đọc thẳng `RaceEntry.Status` (BE mặc định luôn = `"Ready"`) nên ngựa ốm vẫn hiện "Đã duyệt". Đã sửa: trạng thái kiểm tra được **suy ra từ cả hai** — sức khỏe không đạt ⇒ hiển thị "⚠ Không đủ điều kiện (sức khỏe)" (cam) thay cho "Đã duyệt"; tab lọc (Chờ kiểm tra / Đạt yêu cầu / Không đạt) dùng đúng cùng logic với cột hiển thị. Cột sức khỏe hiển thị đúng nhãn từng loại (Chấn thương / Bị bệnh / Đang hồi phục / Ngừng thi đấu) thay vì gộp chung "Gặp sự cố / Yếu".
3. **Trọng tài chỉnh sức khỏe bằng dropdown**: BE chưa có API ghi cho referee (chi tiết + spec đề xuất ở mục **5.7**) — trang đã có banner hướng dẫn tạm thời (yêu cầu chủ ngựa cập nhật hoặc ghi nhận vi phạm).

File thay đổi thêm: `OwnerHorsesPage.tsx`, `RefereeHorseCheckPage.tsx`.

---

## 7e. CẬP NHẬT ĐỢT 5 (tối 06/07/2026)

1. **Bỏ hoàn toàn phần mở rộng inline "Chi tiết làn & trọng tài"** trên card cuộc đua ở trang Quản lý cuộc đua (cùng toàn bộ state/handler liên quan) — chi tiết xem qua modal 👁 (sơ đồ làn 3D + trọng tài), thao tác nhanh vẫn ở các nút trên card.
2. **Bước gate sức khỏe trong quy trình** (referee duyệt Healthy mới được ghép làn): FE **chưa thể tự chặn** vì admin không có API nào đọc được sức khỏe ngựa (chi tiết + 2 phương án đề xuất BE ở mục **5.8**; bước quy trình đã ghi vào bảng mục 7 — hàng 8b). Modal ghép làn đã thêm dòng cảnh báo quy trình.

File thay đổi thêm: `AdminRacesPage.tsx`.

---

## 7f. CẬP NHẬT ĐỢT 6 (07/07/2026) — Gate sức khỏe tại bước ĐĂNG KÝ

Theo đề xuất tính điều kiện theo **ngựa đăng ký vào giải** (thay vì theo entry đã ghép làn): vì Chủ ngựa là role duy nhất đọc được `healthStatus` qua API hiện có, gate được đặt tại **bước đăng ký giải** (`OwnerRegistrationsPage`):

1. Dropdown "Chọn ngựa" khi đăng ký: ngựa không Healthy bị **disabled** kèm nhãn "— không đủ sức khỏe (Chấn thương/Bị bệnh/…)".
2. Cảnh báo liệt kê rõ những ngựa đang bị khóa và lý do; hướng dẫn cập nhật tình trạng ở trang Ngựa của tôi khi hồi phục.
3. Chặn cứng lần 2 trong `handleSubmit` (phòng trường hợp lách qua UI).

Hệ quả chuỗi quy trình: chỉ ngựa Healthy vào được pool đăng ký → admin duyệt (BE đã tự chặn thiếu jockey) → ghép làn. Trang Kiểm tra ngựa của referee (7d) là chốt kiểm cuối: ngựa đổ bệnh **sau khi** ghép làn sẽ hiện "Không đủ điều kiện". Lỗ hổng còn lại cần BE (5.7/5.8): ngựa đổi trạng thái xấu đi *sau khi đã đăng ký nhưng trước khi ghép làn* — admin không nhìn thấy được vì API registrations không trả health.

File thay đổi: `OwnerRegistrationsPage.tsx`.

---

## 8. Danh sách file thay đổi

| File | Thay đổi |
|------|----------|
| `src/index.css` | Font: DM Sans + Playfair Display (100% theo FE kia) |
| `src/pages/LoginPage.tsx`, `RegisterPage.tsx` | Font inline: Poppins → Playfair Display |
| `src/components/ui/RaceTrack3D.tsx` | **Mới** — copy từ FE kia |
| `src/pages/admin/AdminRacesPage.tsx` | Modal ghép làn theo sơ đồ + modal chi tiết 3D + modal trọng tài cải tiến + toast + fix refresh panel |
| `src/pages/admin/AdminDashboardPage.tsx` | Activity feed thật từ `/admin/activity-log`, bỏ mock |
| `src/api/adminService.js` | Thêm `getActivityLog` |
| `src/pages/admin/AdminUsersPage.tsx`, `src/pages/owner/OwnerJockeysPage.tsx` | Xóa biến không dùng (fix lỗi build có sẵn) |
| `src/pages/admin/AdminRefereesPage.tsx` | Viết lại thành "Quản lý trọng tài" (đợt 2 — xem mục 7b) |
| `src/pages/admin/AdminRegistrationsPage.tsx` | Banner điều kiện duyệt + dịch lỗi BE (đợt 2) |
| `src/components/layout/Sidebar.tsx`, `src/context/LanguageContext.tsx` | Label menu → "Quản lý trọng tài" (đợt 2) |
