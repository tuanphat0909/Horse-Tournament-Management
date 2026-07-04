# BÁO CÁO CẢI TIẾN UI/UX — Ngày 04/07/2026 (đợt chiều)

> Phạm vi: **chỉ sửa FE** (`Horse-Tournament-Management-main`). Không đụng vào BE.
> Kiểm chứng: `tsc` 0 lỗi, `npm run build` thành công.

---

## 1. Yêu cầu & kết quả thực hiện

### ✅ Yêu cầu 1 — Bỏ kiểu "list dài sòng sọc", bố cục gọn gàng

Tạo component dùng chung **`src/components/ui/Pager.tsx`**:
- `paginate(list, page, pageSize)` — cắt danh sách theo trang (tự kẹp số trang hợp lệ).
- `<Pager>` — thanh phân trang (trước/sau + tối đa 5 số trang + tổng số mục), đồng bộ style vàng/kính của toàn hệ thống.

Đã áp dụng phân trang + giữ nguyên search/filter cho **14 trang**:

| Role | Trang | Kích thước trang |
|---|---|---|
| Admin | Quản lý cuộc đua (Races) | 8 + lọc theo giải/trạng thái + tìm kiếm (MỚI) |
| Admin | Người dùng (Users) | 10 (số thứ tự đúng theo trang) |
| Admin | Đơn đăng ký (Registrations) | 10, reset trang khi đổi tab |
| Admin | Vi phạm (Violations) | 10 |
| Admin | Dự đoán (Predictions) | 10 |
| Spectator | Cược & Dự đoán | 8 mỗi tab (2 danh sách riêng) |
| Spectator | Ví (lịch sử giao dịch) | 8, reset khi đổi bộ lọc, bỏ khung cuộn dài |
| Spectator | Thông báo | 10 |
| Spectator | Kết quả trực tiếp (lịch thi đấu) | 6 |
| Spectator | Giải đấu (grid card) | 9 |
| Owner | Đăng ký thi đấu | 8 |
| Owner | Nài ngựa (hợp đồng) | 8 |
| Owner | Kết quả | 10 |
| Jockey | Lời mời (Invitations) | 8 |
| Jockey | Cuộc đua của tôi | 8 |
| Referee | Báo cáo | 8 |
| Referee | Vi phạm | 8 |

*(Các trang dashboard, stats, trang vốn ít dữ liệu như AdminReferees (grid nhỏ), JockeySchedule (đã nhóm theo ngày) giữ nguyên vì không bị "dài sòng sọc".)*

### ✅ Yêu cầu 2 — Bỏ nút "Races" ở trang Quản lý giải đấu

- Đã **xóa nút "Races"** (generate races) trên card giải đấu vì trùng chức năng với trang Quản lý cuộc đua.
- Thay vào vị trí đó là nút **"Chi tiết"** (xem mục 4). Nút "Final" (tạo chung kết) giữ nguyên.
- Dọn code: xóa handler + state không dùng.

### ✅ Yêu cầu 3 — UX ghép ngựa vào làn kiểu mới (AdminRacesPage)

Viết lại hoàn toàn modal "Ghép ngựa vào làn":
- Chọn **1 cuộc đua** → hệ thống **tự sinh đúng số hàng theo số làn** của cuộc đua đó (VD: 8 làn → 8 hàng).
- **Làn đã ghép**: hiển thị khóa (màu xanh, tên ngựa + jockey + nhãn "Đã ghép") — không sửa được.
- **Làn trống**: mỗi làn 1 dropdown chọn ngựa. Ràng buộc:
  - Chỉ hiện ngựa có đơn **Approved** đúng giải, **chưa ghép** vào cuộc đua;
  - Ngựa đã chọn ở một làn **tự ẩn khỏi dropdown của các làn khác** (không thể chọn trùng);
- Bấm **"Lưu các làn đã chọn"** → ghép tất cả một lượt (gọi API tuần tự từng làn), báo kết quả chi tiết: ghép được bao nhiêu làn, làn nào lỗi vì sao.
- Có thể mở modal này **trực tiếp từ mỗi hàng** trong bảng cuộc đua (nút ghép làn) — race được chọn sẵn, khỏi tìm lại.

### ✅ Yêu cầu 4 — Chi tiết đầy đủ, mọi nút Detail đều bấm được

1. **AdminRacesPage — modal "Chi tiết cuộc đua"** (nút 👁 mỗi hàng):
   - Thông tin: ngày đua, cự ly, số làn, trạng thái, giải/vòng.
   - **Sơ đồ làn đầy đủ**: từng làn từ 1 → maxLanes, làn đã ghép hiện ngựa + jockey (+ hạng nếu đã có kết quả), làn trống hiện "Chưa ghép ngựa" (viền đứt).
   - Đếm tiến độ: "x/y đã ghép".
   - Danh sách **trọng tài phụ trách**.
   - Nút tắt "Ghép làn cho cuộc đua này" nhảy thẳng sang modal ghép làn.
2. **AdminTournamentsPage — modal "Chi tiết giải đấu"** (nút mới thay nút Races):
   - Mô tả, 4 mốc thời gian (mở/đóng đăng ký, bắt đầu/kết thúc giải).
   - Danh sách **vòng đấu** (số vòng, tên, thời gian, trạng thái) — có form sẵn, không có dữ liệu thì hiện thông báo trống.
   - Nút **"Đóng đăng ký ngay"** — dùng API mới `POST /admin/tournaments/{id}/close-registration`.
   - Card giải đấu hiện thêm dòng **"Hạn đăng ký"**.
3. **JockeyRacesPage — nút "Chi tiết" trước đây bấm không có gì** → giờ mở modal: thông tin cuộc đua + **sơ đồ làn của cả cuộc đua** (làn của mình được tô vàng + nhãn "Tôi", thấy đối thủ từng làn).
4. Modal phân công trọng tài (AdminRaces): chọn race là **tự tải danh sách trọng tài hiện tại**, dropdown **ẩn trọng tài đã được phân công** vào race đó (cùng nguyên tắc ẩn như ghép làn).

---

## 2. Những phần CHƯA thực hiện được (do BE chưa có API) — đề xuất cho nhóm BE

| # | Chức năng UI cần | API BE còn thiếu | Ảnh hưởng |
|---|---|---|---|
| 1 | **Gỡ ngựa khỏi làn / đổi làn** sau khi đã ghép | Không có `DELETE /admin/races/{raceId}/entries/{entryId}` (chỉ có POST tạo entry) | Ghép nhầm làn thì phải xóa cả cuộc đua tạo lại. UI hiện khóa làn đã ghép để tránh thao tác thừa. |
| 2 | Admin xem **hợp đồng jockey** khi duyệt đơn | Không có `GET /admin/jockey-contracts` | Ràng buộc "phải có jockey trước khi đăng ký" chỉ chặn được ở phía Owner (FE). |
| 3 | **Sửa thông tin cuộc đua** (tên, giờ, số làn) | Không có `PUT /admin/races/{raceId}` | Chỉ có thể xóa + tạo lại. |
| 4 | Số làn đã ghép hiển thị ngay trên **bảng danh sách** cuộc đua | `GET /public/races/schedule` không trả kèm số entry | Phải bấm Chi tiết mới thấy (tránh gọi N request cho N hàng). |
| 5 | Modal chi tiết giải: danh sách **ngựa đã đăng ký của giải** cho role admin xem nhanh | Có `GET /admin/registrations` (toàn bộ) — dùng được nhưng chưa có filter theo giải phía server | Hiện chưa nhúng để tránh tải toàn bộ đơn mỗi lần mở modal. |

## 3. File thay đổi trong đợt này

- **Mới**: `src/components/ui/Pager.tsx`
- **Viết lại**: `src/pages/admin/AdminRacesPage.tsx`
- **Sửa lớn**: `src/pages/admin/AdminTournamentsPage.tsx`, `src/pages/jockey/JockeyRacesPage.tsx`
- **Thêm phân trang**: `AdminUsersPage`, `AdminRegistrationsPage`, `AdminViolationsPage`, `AdminPredictionsPage`, `SpectatorPredictionsPage`, `SpectatorWalletPage`, `SpectatorNotificationsPage`, `SpectatorLiveResultsPage`, `SpectatorTournamentsPage`, `OwnerRegistrationsPage`, `OwnerJockeysPage`, `OwnerResultsPage`, `JockeyInvitationsPage`, `RefereeReportsPage`, `RefereeViolationsPage`

## 4. Việc còn lại để hoàn thành toàn bộ project (tổng hợp)

1. **BE**: bổ sung 3 API ở mục 2 (ưu tiên #1 gỡ entry và #2 admin xem hợp đồng) + đưa ràng buộc jockey-trước-đăng-ký vào server.
2. **FE**: trang chi tiết công khai cho 1 giải/1 cuộc đua ở góc nhìn Spectator (hiện mới có modal cơ bản).
3. Test end-to-end toàn bộ quy trình: Owner mời jockey → jockey chấp nhận → đăng ký → admin duyệt → ghép làn → trọng tài nhập kết quả → công bố → trả thưởng.
4. Code-splitting (bundle 782KB > 500KB — chỉ là cảnh báo, chưa ảnh hưởng chức năng).
