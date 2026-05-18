# BÁO CÁO PHÂN TÍCH VÀ BIỆN LUẬN KIẾN TRÚC HỆ THỐNG AI (SNEAKFREAK)

## 1. Tổng quan
Hệ thống gợi ý sản phẩm (Recommendation System) trong đồ án **SneakFreak** được thiết kế theo kiến trúc **Hybrid AI (Trí tuệ nhân tạo hỗn hợp)**. Đây là sự kết hợp chiến lược giữa sức mạnh xử lý ngôn ngữ của các mô hình đám mây (Cloud LLM - Gemini API) và logic điều phối, cá nhân hóa nội tại (Local AI Layer).

---

## 2. Phân định vai trò trong hệ thống

Để tối ưu hóa hiệu năng và chất lượng, hệ thống được chia làm hai tầng xử lý tách biệt:

### A. Tầng Cloud AI (Sử dụng Gemini API)
*   **Vai trò:** Đóng vai trò là "Cảm quan ngữ nghĩa".
*   **Tác vụ cụ thể:** Thực hiện **Semantic Encoding**, chuyển đổi các dữ liệu văn bản (tên sản phẩm, mô tả, thuộc tính) thành các Vector đặc trưng (Embeddings).
*   **Lý do chọn:** Tận dụng khả năng hiểu biết ngôn ngữ sâu sắc của các mô hình hàng nghìn tỷ tham số mà không cần đầu tư hạ tầng phần cứng đắt tiền.

### B. Tầng Local AI Engine (Python/FastAPI & PostgreSQL)
*   **Vai trò:** Đóng vai trò là "Bộ não điều phối và thực thi".
*   **Tác vụ cụ thể:** 
    *   **Vector Database:** Lưu trữ và truy vấn nhúng qua `pgvector` thay vì tìm kiếm toàn văn.
    *   **Scoring Engine (Python):** Tính toán điểm sở thích dựa trên hành vi thực tế bằng các thư viện toán học (Numpy/Scikit-learn).
    *   **Ranking Layer:** Tái xếp hạng sản phẩm dựa trên các quy tắc kinh doanh (Inventory, Popularity, Flash Sale).
    *   **Feedback Loop:** Lắng nghe tương tác và cập nhật hồ sơ người dùng theo thời gian thực.
*   **Lý do chọn:** Việc tách biệt AI Engine thành một service Python độc lập (Microservices) đảm bảo tốc độ phản hồi nhanh cho API chính, tận dụng sức mạnh của hệ sinh thái AI Python, bảo mật dữ liệu hành vi và linh hoạt trong việc tùy chỉnh logic kinh doanh.

---

## 3. Phân tích sự đánh đổi (Trade-off Analysis)

Việc lựa chọn kiến trúc Hybrid thay vì sử dụng 100% Cloud hoặc 100% Local dựa trên các phân tích kỹ thuật sau:

### 3.1. Tại sao không sử dụng 100% Cloud AI?
*   **Độ trễ (Latency):** Việc gọi API Cloud cho mỗi yêu cầu gợi ý sẽ tạo ra độ trễ lớn (2-5 giây), không đáp ứng được tiêu chuẩn của một ứng dụng thương mại điện tử hiện đại.
*   **Chi phí vận hành:** Việc lạm dụng API cho các tác vụ tính toán lặp đi lặp lại sẽ làm phát sinh chi phí lớn.
*   **Sự phụ thuộc (Vendor Lock-in):** Phụ thuộc hoàn toàn vào dịch vụ bên thứ ba khiến hệ thống dễ bị đình trệ nếu API gặp sự cố hoặc thay đổi chính sách.
*   **Kiểm soát Logic:** Các mô hình Cloud khó có thể can thiệp sâu vào các biến số kinh doanh nội bộ (như số lượng tồn kho chính xác trong kho).

### 3.2. Tại sao không sử dụng 100% Local AI?
*   **Rào cản hạ tầng:** Việc tự host các mô hình Generative AI hoặc Embedding lớn (hàng chục tỷ tham số) yêu cầu phần cứng (GPU/VRAM) đắt đỏ, không phù hợp cho môi trường đồ án hoặc startup vừa và nhỏ.
*   **Chất lượng NLP:** Các mô hình nhỏ chạy local thường có độ chính xác về xử lý ngôn ngữ tự nhiên kém hơn đáng kể so với Gemini, đặc biệt khi yêu cầu Chatbot giao tiếp lưu loát bằng tiếng Việt.
*   **Độ phức tạp kỹ thuật:** Triển khai Full Local cho phần Chatbot sinh văn bản (LLM) đòi hỏi kỹ năng tối ưu hóa mô hình (Quantization, vLLM) rất sâu, làm phân tán nguồn lực khỏi việc phát triển các tính năng nghiệp vụ cốt lõi (Core Business Logic).

### 3.3. Sự dịch chuyển từ Node.js Monolith sang Python Microservice cho tầng Local
*   **Vấn đề cũ:** Việc nhồi nhét các thuật toán tính toán ma trận (Cosine Similarity) hay Scoring phức tạp vào trong Node.js (NestJS) có nguy cơ gây tắc nghẽn Event Loop, làm sập toàn bộ hệ thống API mua sắm.
*   **Giải pháp hiện tại:** Tách riêng một Microservice bằng Python (FastAPI). Việc giao tiếp qua REST API/gRPC giải quyết triệt để bài toán thắt cổ chai, đồng thời mở đường cho việc áp dụng các mô hình Open Source chuyên nghiệp (như Sentence-Transformers tạo Embedding) một cách độc lập và hiệu quả.

---

## 4. Giá trị kỹ thuật của giải pháp Hybrid

Sự kết hợp này mang lại 4 lợi ích vượt trội:

1.  **Hiệu năng tối ưu (High Performance):** Nhờ việc lưu trữ Vector và tính toán điểm số tại Local (PostgreSQL & Redis), hệ thống đạt độ trễ cực thấp (<200ms).
2.  **Tính bảo mật (Data Privacy):** Chỉ có dữ liệu sản phẩm (công khai) được gửi lên Cloud để tạo Embedding. Toàn bộ dữ liệu hành vi nhạy cảm của khách hàng được giữ lại và xử lý hoàn toàn tại Local.
3.  **Khả năng tự học (Continuous Learning):** Hệ thống cập nhật sở thích người dùng ngay lập tức sau mỗi tương tác thông qua kiến trúc Event-Driven (BullMQ), giúp gợi ý luôn "tươi mới".
4.  **Tính độc lập và mở rộng (Full Local Capability):** Với việc sử dụng FastAPI và các thư viện Python, hệ thống đã đạt được khả năng chạy Local hoàn toàn cho khâu tính toán điểm số và Vector, giảm thiểu sự phụ thuộc vào Cloud API và dễ dàng tích hợp thêm các mô hình Open Source (Ollama, HuggingFace) khi cần mở rộng.

---

## 5. Kết luận
Kiến trúc Hybrid AI của **SneakFreak** là sự lựa chọn tối ưu, thể hiện tư duy thiết kế hệ thống hiện đại: **Sử dụng Cloud để lấy sự thông minh, sử dụng Local để lấy tốc độ và sự kiểm soát.** Đây là giải pháp có tính thực tế cao, phù hợp với các hệ thống thương mại điện tử thực chiến.
