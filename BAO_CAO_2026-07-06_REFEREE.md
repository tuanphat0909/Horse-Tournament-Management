# BÁO CÁO NGÀY 06/07/2026 — Hoàn thiện phần REFEREE + fix filter

> Phạm vi: **chỉ sửa FE**. Kiểm chứng: `npm run build` thành công, 0 lỗi TS.

---

## ✅ Yêu cầu 1 — Referee thấy được detail giải đấu của cuộc đua được phân công

**Nguyên nhân thiếu:** API `/referee/dashboard` chỉ trả `raceId, raceName, raceDate, status` — không có giải/vòng/cự ly.

**Đã sửa (FE tự ghép dữ liệu):** dashboard trọng tài giờ ghép thêm thông tin từ lịch đua công khai (`/public/races/schedule`) theo `raceId`:
- Mỗi dòng "Cuộc đua hôm nay" hiện đủ: 🏆 **tên giải đấu**, **vòng**, **cự ly**, **số làn**, ngày giờ định dạng Việt Nam.
- Thêm nút 👁 **Chi tiết** từng dòng → modal: 4 ô thông tin (ngày đua/cự ly/số làn/trạng thái) + **sơ đồ làn 3D** (ai ở làn nào, jockey nào) + nút tắt "Kiểm tra ngựa cuộc đua này".

## ✅ Yêu cầu 2 — Quy trình kiểm tra sức khỏe ngựa của trọng tài

Trang **Kiểm tra ngựa** giờ có nút **"Cập nhật tình trạng"** trên từng con ngựa → modal:
- **Dropdown tình trạng**: 🟢 Khỏe mạnh / 🟡 Vấn đề nhẹ / 🔴 Chấn thương / 🔴 Bệnh.
- **Mô tả BẮT BUỘC** (không ghi không gửi được) — ghi rõ mô tả sẽ đến Admin, chủ ngựa & jockey.
- Nếu chọn tình trạng **không đủ điều kiện** → cảnh báo đỏ + báo cáo tự kèm **đề nghị Admin gỡ ngựa khỏi làn**.
- Cột "Y tế" tô màu: xanh = Healthy, đỏ = còn lại.

**Giới hạn backend (quan trọng — đã ghi backlog):** BE **không có API** cho trọng tài (1) sửa trực tiếp `HealthStatus` của ngựa, (2) gỡ ngựa khỏi làn, (3) gửi notification đến owner/jockey. Do đó kết quả kiểm tra được gửi qua **API báo cáo** (`POST /referee/reports` kèm `reportedHorseId`) — Admin đọc được ngay ở trang Reports và xử lý tiếp. Muốn đúng 100% quy trình bạn mô tả (trọng tài đổi status → ngựa tự văng khỏi làn → owner/jockey nhận notify → trang owner tự đổi), nhóm BE cần thêm: `PUT /referee/horses/{id}/health-status` (tự động: cập nhật Horse.HealthStatus + xóa race entries + bắn notification cho owner/jockey/admin qua SignalR sẵn có).

## ✅ Yêu cầu 3 — Owner vẫn tự chỉnh tình trạng ngựa

- Owner vốn được sửa (form Sửa ngựa) — **giữ nguyên quyền này**.
- Nâng cấp: ô sức khỏe từ text tự do → **dropdown 4 mức giống hệt bộ giá trị của trọng tài** (Healthy/Minor Issue/Injured/Sick) — 2 bên dùng chung thang đo, không còn cảnh owner gõ "Tốt" còn trọng tài ghi "Healthy".
- "Trọng tài đổi → trang owner tự đổi": sẽ tự hoạt động ngay khi BE có API ở mục 2 (vì owner đọc `HealthStatus` từ DB); hiện tại phụ thuộc Admin cập nhật thủ công sau khi nhận báo cáo.

## ✅ Yêu cầu 4 — Filter "Live" không khớp trạng thái "Ongoing"

Đúng chẩn đoán của bạn — BE trả `Ongoing`, filter chỉ so sánh `live`. Đã sửa 3 chỗ:
- **Bộ lọc trạng thái** (Quản lý cuộc đua): "Live / Ongoing" giờ khớp cả `Live, Ongoing, Running, InProgress`.
- **Badge màu trạng thái**: `Ongoing` tô đỏ (đang diễn ra) thay vì xanh mặc định.
- **Sơ đồ làn 3D**: `Ongoing` giờ được nhận là trạng thái **live** → ngựa phi + nhãn LIVE (trước đây hiển thị như scheduled).

---

## File thay đổi
`RefereeDashboardPage.tsx` (ghép detail + modal 3D), `RefereeHorseCheckPage.tsx` (modal cập nhật tình trạng), `OwnerHorsesPage.tsx` (dropdown sức khỏe), `AdminRacesPage.tsx` (filter + badge), `RaceTrack3D.tsx` (nhận Ongoing).

## Backlog BE (cập nhật)
1. `PUT /referee/horses/{id}/health-status` — đổi tình trạng + tự gỡ khỏi làn + notify owner/jockey/admin ⭐ mới
2. `DELETE /admin/races/{raceId}/entries/{entryId}` — gỡ ngựa khỏi làn
3. Jockey (hợp đồng Active) trong `/admin/registrations`
4. `betType` Win/Last + cược xuyên giải
5. Ràng buộc server: đăng ký cần hợp đồng jockey Active
6. API hủy đơn đăng ký cho Owner
7. Thêm tournamentName/roundName vào `/referee/dashboard` (FE đang tự ghép — hoạt động nhưng thừa 1 request)
