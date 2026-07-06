# DANH SÁCH Ý TƯỞNG ĐÃ LÀM SẴN Ở FRONTEND — ĐANG CHỜ API BACKEND

> Cập nhật: 06/07/2026.
> Đây là các tính năng **đã dựng sẵn giao diện/luồng trong FE** (form, modal, nút, validation...) nhưng backend chưa có API đáp ứng.
> Mỗi mục ghi rõ: FE đã làm gì, hiện tại chạy tạm ra sao, và **API cần nhóm BE bổ sung** — có API là cắm vào chạy ngay, FE gần như không phải sửa thêm.

---

## 🔴 ƯU TIÊN CAO (chặn quy trình nghiệp vụ chính)

### 1. Trọng tài cập nhật tình trạng sức khỏe ngựa
- **FE đã làm** (`RefereeHorseCheckPage.tsx`): nút "Cập nhật tình trạng" từng ngựa → modal dropdown 4 mức (Healthy / Minor Issue / Injured / Sick) + **mô tả bắt buộc**; chọn mức không đủ điều kiện thì tự kèm đề nghị gỡ ngựa khỏi làn.
- **Hiện chạy tạm**: gửi qua `POST /referee/reports` (kèm `reportedHorseId`) → Admin đọc ở trang Reports rồi xử lý thủ công.
- **API cần có**: `PUT /referee/horses/{horseId}/health-status` — body `{ status, description, raceId? }`. Phía server nên tự động:
  1. Cập nhật `Horse.HealthStatus` (→ trang Owner tự phản ánh vì cùng đọc DB);
  2. Nếu status không đủ điều kiện → **xóa các RaceEntry** của ngựa ở các race chưa diễn ra (ngựa "văng khỏi làn");
  3. Bắn notification (SignalR sẵn có) tới **Admin + Owner + Jockey có hợp đồng** với con ngựa đó, nội dung = description.

### 2. Admin thấy jockey của đơn đăng ký → ẩn/hiện nút Duyệt tự động
- **FE đã làm** (`AdminRegistrationsPage.tsx`): cột "Jockey" trong bảng duyệt đơn + modal "Xem & Duyệt" (nút Duyệt ẩn mặc định, phải tick xác nhận thủ công mới hiện).
- **Hiện chạy tạm**: cột Jockey hiển thị "Chưa có dữ liệu"; admin tick checkbox tự chịu trách nhiệm.
- **API cần có**: thêm thông tin hợp đồng Active vào response `GET /admin/registrations` (join `JockeyContract` theo HorseId + TournamentId, trả `jockeyId, jockeyName, contractStatus`) — hoặc endpoint riêng `GET /admin/jockey-contracts`. FE chỉ cần đổi 1 điều kiện là tự động hoàn toàn.

### 3. Gỡ ngựa khỏi làn / sửa làn đã ghép
- **FE đã làm** (`AdminRacesPage.tsx`, `RaceTrack3D.tsx`): sơ đồ làn khóa làn đã ghép; phát hiện + cảnh báo đỏ dữ liệu lỗi "ngựa vượt quá số làn" (vd 9 ngựa/8 làn) ở cả modal ghép làn, modal chi tiết và sơ đồ 3D.
- **Hiện chạy tạm**: ghép nhầm là chịu — chỉ có thể xóa cả cuộc đua tạo lại.
- **API cần có**: `DELETE /admin/races/{raceId}/entries/{entryId}` (+ tùy chọn `PUT .../entries/{entryId}` đổi làn). Có API này thì fix được tận gốc lỗi 9/8 và mở được tính năng kéo-thả đổi làn.

### 4. Ràng buộc "jockey ký hợp đồng trước khi đăng ký thi đấu" ở phía server
- **FE đã làm** (`OwnerRegistrationsPage.tsx`): dropdown chỉ hiện ngựa có hợp đồng Active cho giải; chặn submit kèm hướng dẫn; badge 🏇 trạng thái jockey trên từng đơn (Active / chờ phản hồi / chưa có).
- **Hiện chạy tạm**: chỉ chặn ở giao diện — gọi API trực tiếp vẫn lách được.
- **API cần có**: thêm validation trong `RegistrationService.RegisterHorseAsync`: từ chối nếu ngựa chưa có `JockeyContract` Active cho tournament đó.

---

## 🟡 ƯU TIÊN VỪA (tính năng mới đã dựng form sẵn)

### 5. Loại cược "Về CHÓT"
- **FE đã làm** (`SpectatorPredictionsPage.tsx`): bộ chọn 3 loại cược trong modal Đặt cược; loại "🐢 Về CHÓT" có đủ form (cuộc đua, ngựa, tiền) + giải thích luật.
- **Hiện chạy tạm**: nút xác nhận khóa "Chờ backend hỗ trợ".
- **API cần có**: thêm `betType` (`Win` | `Last`) vào `PlaceBetRequest` + logic settle trong `BetPayoutService` (Last = ngựa về cuối cùng thắng cược).

### 6. Cược XUYÊN GIẢI (accumulator)
- **FE đã làm**: chọn giải → tự sinh dropdown chọn ngựa thắng cho **từng vòng** (nạp danh sách ngựa thật từng race), nhập tiền, preview thưởng ×2^số-vòng, cảnh báo "sai 1 trận mất sạch".
- **Hiện chạy tạm**: nút xác nhận khóa.
- **API cần có**: bảng + endpoint mới, vd `POST /spectator/accumulator-bets` body `{ tournamentId, amount, picks: [{ raceId, horseId }] }`; luật settle: sau mỗi race sai 1 pick → cả vé thua ngay; đúng hết mọi vòng → trả `amount × hệ số`.

### 7. Owner hủy đơn đăng ký (đơn Pending)
- **FE đã làm** (`OwnerRegistrationsPage.tsx`): nút ✕ hủy trên đơn Pending.
- **Hiện chạy tạm**: bấm ra toast "Backend chưa hỗ trợ API hủy đơn — liên hệ Admin".
- **API cần có**: `DELETE /owner/registrations/{id}` (chỉ cho đơn Pending của chính owner).

### 8. Sửa thông tin cuộc đua
- **FE chưa đặt nút** (cố ý — không muốn nút chết): trang Quản lý cuộc đua chỉ có Tạo/Xóa/Chi tiết.
- **API cần có**: `PUT /admin/races/{raceId}` (tên, ngày giờ, cự ly, số làn). Có API thì FE thêm nút Sửa dùng lại form tạo race là xong.

---

## 🟢 ƯU TIÊN THẤP (trải nghiệm — có thì đẹp hơn)

### 9. Vị trí ngựa real-time trong sơ đồ 3D khi Live
- **FE đã làm** (`RaceTrack3D.tsx`): trạng thái Live/Ongoing có ngựa phi về vạch đích + nhãn LIVE — hiện là **animation minh họa**, không phải vị trí thật.
- **API cần có**: SignalR đẩy tiến độ đua (hub hiện chỉ có `ReceiveNotification`), vd event `RaceProgress { raceId, positions: [{ laneNo, distancePct }] }` — FE map thẳng vào toạ độ X của từng con ngựa.

### 10. Ảnh thật của ngựa / jockey
- **FE đã làm**: sơ đồ 3D + bục trao giải + card ngựa dùng hình tượng 🏇/🐴.
- **API cần có**: trường `photoUrl`/`avatarUrl` trong Horse & User + endpoint upload. FE chỉ việc thay emoji bằng `<img>`.

### 11. Detail giải/vòng trong dashboard trọng tài
- **FE đã làm** (`RefereeDashboardPage.tsx`): tự ghép tournamentName/roundName/cự ly/số làn bằng cách gọi thêm `/public/races/schedule` rồi join theo raceId.
- **API nên sửa**: `/referee/dashboard` trả kèm luôn các field này → bỏ được 1 request thừa.

### 12. Số làn đã ghép hiển thị ngay trên bảng danh sách cuộc đua
- **FE hiện tại**: phải mở modal Chi tiết mới thấy tiến độ x/y (tránh bắn N request cho N hàng).
- **API nên sửa**: `/public/races/schedule` trả kèm `entryCount`.

### 13. Danh sách ngựa đã đăng ký trong modal chi tiết giải (Admin)
- **FE hiện tại**: modal chi tiết giải có mốc thời gian + vòng đấu; chưa nhúng danh sách ngựa vì `/admin/registrations` không lọc theo giải phía server (phải tải toàn bộ).
- **API nên sửa**: hỗ trợ `GET /admin/registrations?tournamentId=x`.

---

## Tổng kết cho nhóm BE

| # | API | Ưu tiên | FE chờ ở file |
|---|-----|---------|---------------|
| 1 | `PUT /referee/horses/{id}/health-status` (+ auto gỡ làn + notify) | 🔴 | RefereeHorseCheckPage |
| 2 | Jockey trong `GET /admin/registrations` | 🔴 | AdminRegistrationsPage |
| 3 | `DELETE /admin/races/{raceId}/entries/{entryId}` | 🔴 | AdminRacesPage, RaceTrack3D |
| 4 | Validate hợp đồng jockey khi RegisterHorse | 🔴 | (server-side, FE đã chặn UI) |
| 5 | `betType` Win/Last trong PlaceBet | 🟡 | SpectatorPredictionsPage |
| 6 | `POST /spectator/accumulator-bets` | 🟡 | SpectatorPredictionsPage |
| 7 | `DELETE /owner/registrations/{id}` | 🟡 | OwnerRegistrationsPage |
| 8 | `PUT /admin/races/{raceId}` | 🟡 | AdminRacesPage |
| 9 | SignalR `RaceProgress` | 🟢 | RaceTrack3D |
| 10 | `photoUrl` cho Horse/User + upload | 🟢 | RaceTrack3D, OwnerHorsesPage |
| 11 | Detail giải/vòng trong `/referee/dashboard` | 🟢 | RefereeDashboardPage |
| 12 | `entryCount` trong `/public/races/schedule` | 🟢 | AdminRacesPage |
| 13 | Filter `?tournamentId=` cho `/admin/registrations` | 🟢 | AdminTournamentsPage |
