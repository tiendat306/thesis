# Hướng dẫn Test Product Catalog API

Tài liệu này hướng dẫn cách kiểm tra các API mới triển khai cho module Sản phẩm.

## 1. Chuẩn bị
- Đảm bảo Docker (PostgreSQL & Redis) đang chạy.
- Đã chạy migration và seed dữ liệu: `npx prisma migrate dev && npx prisma db seed`.
- Chỉnh sửa file `.env` với thông tin Cloudinary chính xác.

## 2. Truy cập Swagger UI
Mở trình duyệt và truy cập:
`http://localhost:3004/api/docs`

Đây là cách dễ nhất để test API mà không cần Postman.

## 3. Xác thực (Authentication)
Hầu hết các API Create/Update/Delete yêu cầu quyền **OWNER** hoặc **STAFF**.
1. Tại Swagger, tìm endpoint `POST /api/auth/login`.
2. Sử dụng tài khoản admin đã được seed:
   - **Email**: `admin@thesis.local`
   - **Password**: `admin123`
3. Copy mã `accessToken` từ response.
4. Nhấn nút **Authorize** ở phía trên cùng của Swagger và dán mã token vào.

---

## 4. Test Brands (Thương hiệu)
- **GET `/api/brands`**: Lấy danh sách thương hiệu (Công khai).
- **POST `/api/brands`**: Tạo thương hiệu mới (Yêu cầu đăng nhập & File ảnh).
  - Chọn file logo (png/jpg).
  - Điền `name`, `description`.
  - Kiểm tra kết quả trong folder `thesis/brands` trên Cloudinary.

## 5. Test Categories (Danh mục)
- **GET `/api/categories/tree`**: Xem cấu trúc thư mục lồng nhau.
- **POST `/api/categories`**: Tạo danh mục.
  - Có thể chọn `parentId` (UUID) của một danh mục khác để tạo danh mục con.
- **DELETE `/api/categories/:id`**: Chỉ xóa được nếu danh mục không có con.

## 6. Test Products (Sản phẩm)
Đây là module phức tạp nhất, cho phép tạo sản phẩm cùng lúc với nhiều màu sắc và biến thể.

### Tạo sản phẩm (POST `/api/products`)
Body mẫu (JSON):
```json
{
  "name": "Nike Air Force 1 '07",
  "description": "The radiance lives on in the Nike Air Force 1 '07.",
  "brandId": "UUID_CUA_NIKE",
  "categoryId": "UUID_CUA_GIAY_THE_THAO",
  "colors": [
    {
      "name": "White",
      "colorCode": "#FFFFFF",
      "variants": [
        {
          "size": "40",
          "sku": "AF1-WHT-40",
          "price": 2800000,
          "stock": 10
        },
        {
          "size": "41",
          "sku": "AF1-WHT-41",
          "price": 2800000,
          "stock": 5
        }
      ]
    }
  ],
  "status": "ACTIVE",
  "isFeatured": true
}
```

### Truy vấn sản phẩm
- **Filter**: Sử dụng query params trên `GET /api/products` (ví dụ: `?minPrice=2000000&maxPrice=3000000`).
- **Admin View**: `GET /api/products/admin` cho phép xem cả các sản phẩm `DRAFT`.
- **Detail**: `GET /api/products/:identifier` (với identifier là ID hoặc Slug - ví dụ: `nike-air-force-1-07`).

---

## Lưu ý về Cloudinary
- Folder ảnh được quy định cứng trong code:
  - Brands: `thesis/brands`
  - Categories: `thesis/categories`
- Bạn có thể theo dõi Dashboard Cloudinary để xem ảnh có được upload thành công hay không.
