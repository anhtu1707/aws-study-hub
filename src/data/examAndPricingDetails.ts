import { AWSService } from '../types';

export interface ExamIntelligence {
  coreConcept: string;
  keywords: string[];
  trapsAndDistractors: string[];
  decisionRule: string;
}

export interface PricingIntelligence {
  billingModel: string;
  hiddenCosts: string[];
  freeTierRules: string;
  costOptimizationTactics: string[];
}

export interface DetailedExamAndPricing {
  exam: ExamIntelligence;
  pricing: PricingIntelligence;
}

export const SPECIFIC_EXAM_PRICING: Record<string, DetailedExamAndPricing> = {
  s3: {
    exam: {
      coreConcept: 'Lưu trữ đối tượng bền vững 11 số 9, quản lý vòng đời (Lifecycle) và chính sách bảo mật tuân thủ (Compliance/Governance Object Lock).',
      keywords: ['WORM', 'Legal Hold', 'Compliance Mode', 'Cross-Region Replication (CRR)', 'Origin Access Control (OAC)', 'S3 Intelligent-Tiering', 'Requester Pays'],
      trapsAndDistractors: [
        'Bẫy Governance vs Compliance: Chế độ Governance cho phép tài khoản có quyền `s3:BypassGovernanceRetention` xóa file trước hạn; còn chế độ Compliance KHÔNG AI (kể cả AWS Root account) xóa được.',
        'Bẫy S3 One Zone-IA: Tiết kiệm 20% chi phí nhưng chỉ nằm ở 1 AZ. Đề bài yêu cầu "chịu thảm họa mất một trung tâm dữ liệu" thì tuyệt đối KHÔNG chọn One Zone-IA.',
        'Bẫy sao chép CRR: Muốn CRR hoạt động thì Versioning bắt buộc phải bật ở CẢ HAI bucket (Source và Destination).'
      ],
      decisionRule: 'Khi đề bài nhắc tới lưu trữ không thể xóa sửa theo luật pháp (SEC Rule 17a-4) -> Chọn ngay S3 Object Lock ở Compliance Mode.'
    },
    pricing: {
      billingModel: 'Tính theo GB lưu trữ mỗi tháng + Số lượng request PUT/LIST/GET + Băng thông truyền ra Internet (Data Transfer Out).',
      hiddenCosts: [
        'Phí xóa sớm (Early Deletion Fee): S3 Standard-IA tính tối thiểu 30 ngày; Glacier Flexible tính tối thiểu 90 ngày; Glacier Deep Archive tính tối thiểu 180 ngày (xóa sớm vẫn phải trả đủ số ngày tối thiểu).',
        'Phí chuyển tầng Lifecycle: Mỗi lần di chuyển 1.000 objects sang tầng thấp hơn tốn phí request PUT/Lifecycle.',
        'Phí Data Transfer Out: Tải dữ liệu từ S3 ra ngoài Internet tốn ~$0.09/GB; truyền dữ liệu giữa các Region khác nhau cũng phát sinh phí.'
      ],
      freeTierRules: '5GB lưu trữ S3 Standard, 20.000 GET Requests và 2.000 PUT Requests mỗi tháng trong 12 tháng đầu tiên.',
      costOptimizationTactics: [
        'Bật S3 Intelligent-Tiering cho các tệp không xác định được quy luật truy cập để tự động chuyển tầng mà không tốn phí lấy lại dữ liệu.',
        'Thiết lập Lifecycle Rule tự động xóa các phiên bản cũ (Noncurrent Version Expiration) và dọn dẹp các tệp tải dở (Abort Incomplete Multipart Upload).',
        'Dùng S3 VPC Gateway Endpoint miễn phí để lưu lượng EC2 vào S3 không đi qua NAT Gateway.'
      ]
    }
  },

  ec2: {
    exam: {
      coreConcept: 'Năng lực tính toán máy chủ ảo, lựa chọn loại hình thanh toán (On-Demand vs Spot vs Savings Plans) và kiến trúc nhóm máy chủ (Auto Scaling + ALB).',
      keywords: ['Spot Instances', 'Spot Fleet', 'Placement Groups (Cluster/Spread/Partition)', 'Instance Metadata Service (IMDSv2)', 'Hibernate', 'Termination Protection'],
      trapsAndDistractors: [
        'Bẫy Spot vs On-Demand: Đề bài yêu cầu "ứng dụng xử lý giao dịch tài chính không thể gián đoạn" -> KHÔNG ĐƯỢC CHỌN Spot (vì Spot bị thu hồi sau 2 phút thông báo).',
        'Bẫy Placement Group: "Cluster" cho độ trễ cực thấp giữa các máy nhưng nằm cùng 1 rack (dễ chết chùm); "Spread" cho tối đa 7 instance mỗi AZ nằm trên phần cứng cách ly hoàn toàn.',
        'Bẫy Stop vs Terminate: Khi stop EC2, CPU/RAM ngừng tính tiền nhưng ổ cứng EBS đính kèm và Elastic IP nhàn rỗi (unassociated EIP) VẪN TÍNH TIỀN.'
      ],
      decisionRule: 'Tác vụ batch job có checkpoint hoặc xử lý song song chịu lỗi -> Chọn Spot. Tác vụ tải liên tục 24/7 trong 1-3 năm -> Chọn Compute Savings Plans.'
    },
    pricing: {
      billingModel: 'Tính theo từng giây chạy của instance (tối thiểu 60 giây) dựa trên loại cấu hình vCPU/RAM và hệ điều hành (Linux rẻ hơn Windows).',
      hiddenCosts: [
        'Phí ổ cứng EBS: EBS Volume vẫn tính tiền theo GB/tháng kể cả khi EC2 bị STOPPED.',
        'Phí địa chỉ IPv4 công cộng: AWS tính phí $0.005/giờ cho MỌI địa chỉ IPv4 public (dù đang gán vào máy hay nhàn rỗi).',
        'Phí lưu lượng mạng giữa các AZ (Cross-AZ Traffic): Truyền dữ liệu giữa 2 EC2 ở 2 Availability Zones khác nhau tốn $0.01/GB mỗi chiều.'
      ],
      freeTierRules: '750 giờ chạy instance t2.micro hoặc t3.micro (Linux/Windows) mỗi tháng trong 12 tháng đầu.',
      costOptimizationTactics: [
        'Chuyển đổi instance sang chip AWS Graviton (t4g, c7g, m7g) giúp tăng hiệu năng 40% với chi phí rẻ hơn 20% so với x86.',
        'Sử dụng EC2 Auto Scaling kết hợp linh hoạt On-Demand (làm mức tải nền) và Spot Instances (làm mức tải co giãn đỉnh).',
        'Tắt máy chủ môi trường Dev/Test ngoài giờ làm việc bằng AWS Instance Scheduler.'
      ]
    }
  },

  lambda: {
    exam: {
      coreConcept: 'Điện toán Serverless chạy theo sự kiện, kiến trúc phi máy chủ, giới hạn thực thi và tối ưu thời gian khởi động lạnh (Cold Start).',
      keywords: ['Event-driven', 'Cold Start', 'Provisioned Concurrency', '15 minutes timeout', 'VPC Eni Attachment', 'Ephemeral Storage (/tmp)', 'Dead-Letter Queue'],
      trapsAndDistractors: [
        'Bẫy thời gian chạy tối đa: Lambda chỉ chạy tối đa 15 phút (900 giây). Nếu tác vụ xử lý video hoặc migration kéo dài vài giờ -> Phải chọn AWS Batch hoặc ECS Fargate, KHÔNG chọn Lambda.',
        'Bẫy dung lượng RAM và CPU: Lambda không cho phép chỉnh CPU trực tiếp; CPU được tăng tỷ lệ thuận tuyến tính khi bạn tăng RAM (tối đa 10GB RAM = 6 vCPU).',
        'Bẫy VPC Cold Start: Trước đây kết nối Lambda vào VPC gây độ trễ Cold Start lớn; hiện nay dùng Hyperplane ENI đã giảm xuống mili-giây nhưng vẫn cần chú ý số lượng Private IP trong Subnet.'
      ],
      decisionRule: 'Kiến trúc bất đồng bộ xử lý sự kiện trong vòng dưới 15 phút không cần quản trị máy chủ -> Luôn ưu tiên chọn AWS Lambda.'
    },
    pricing: {
      billingModel: 'Tính theo số lượng Request ($0.20/triệu requests) và thời gian thực thi tính bằng GB-giây (làm tròn đến 1 mili-giây).',
      hiddenCosts: [
        'Phí Provisioned Concurrency: Giữ ấm hàm Lambda để triệt tiêu Cold Start sẽ tính phí liên tục theo giờ chạy kể cả khi không có request gọi vào.',
        'Phí Data Transfer: Nếu hàm Lambda nằm trong VPC và gọi ra Internet qua NAT Gateway, sẽ phát sinh phí xử lý dữ liệu của NAT Gateway.',
        'Phí CloudWatch Logs: Các lệnh in log `console.log()` hoặc `print()` sinh ra lượng lớn log nạp vào CloudWatch Logs tính phí $0.50/GB ingest.'
      ],
      freeTierRules: 'Miễn phí vĩnh viễn (Always Free): 1 triệu request và 400.000 GB-giây thời gian tính toán mỗi tháng.',
      costOptimizationTactics: [
        'Dùng công cụ AWS Lambda Power Tuning để tìm mức RAM tối ưu nhất (nhiều trường hợp tăng RAM giúp code chạy nhanh hơn nên tổng tiền trả lại ít hơn).',
        'Chuyển kiến trúc runtime từ x86 sang arm64 (AWS Graviton) để được giảm ngay 20% đơn giá tính phí.',
        'Giảm dung lượng log và tránh log dữ liệu thô lớn trong môi trường Production.'
      ]
    }
  },

  dynamodb: {
    exam: {
      coreConcept: 'Cơ sở dữ liệu NoSQL Key-Value & Document quy mô vô hạn, thiết kế bảng đơn (Single-Table Design), Partition Key và Sort Key.',
      keywords: ['DAX', 'Global Secondary Index (GSI)', 'Local Secondary Index (LSI)', 'Streams', 'Point-In-Time Recovery (PITR)', 'On-Demand Capacity', 'Strongly Consistent Read'],
      trapsAndDistractors: [
        'Bẫy LSI vs GSI: LSI bắt buộc phải tạo CÙNG LÚC khi tạo bảng (không thể thêm sau này) và chia sẻ cùng RCU/WCU của bảng chính. GSI có thể tạo/xóa bất kỳ lúc nào và có RCU/WCU riêng.',
        'Bẫy Hot Partition: Nếu chọn Partition Key có độ biến thiên thấp (ví dụ: trạng thái đơn hàng Status "PENDING" hay "COMPLETED"), toàn bộ request dồn vào 1 partition gây nghẽn ProvisionedThroughputExceededException.',
        'Bẫy Query vs Scan: Lệnh `Scan` quét toàn bộ bảng rồi mới lọc (cực kỳ tốn kém và chậm); `Query` chỉ đọc đúng partition cần tìm (hiệu quả và rẻ).'
      ],
      decisionRule: 'Đề thi đòi hỏi CSDL NoSQL độ trễ micro-giây cho ứng dụng cache hoặc bảng xếp hạng -> Chọn DynamoDB kết hợp DynamoDB Accelerator (DAX).'
    },
    pricing: {
      billingModel: 'Chế độ On-Demand (tính theo số triệu lượt đọc/ghi) hoặc Provisioned (tính theo số RCU và WCU được cấp phát cố định mỗi giờ).',
      hiddenCosts: [
        'Phí Global Secondary Index: Ghi một bản ghi vào bảng chính có 3 GSI sẽ tiêu tốn 4 lần WCU (1 cho bảng chính + 3 cho các GSI).',
        'Phí Strongly Consistent Read: Đọc nhất quán mạnh tốn gấp đôi RCU so với Đọc nhất quán cuối cùng (Eventually Consistent Read).',
        'Phí lưu trữ mở rộng: Vượt quá 25GB miễn phí sẽ tính $0.25/GB/tháng.'
      ],
      freeTierRules: 'Miễn phí vĩnh viễn 25GB lưu trữ, 25 WCU và 25 RCU ở chế độ Provisioned Capacity (đủ phục vụ 200 triệu request/tháng).',
      costOptimizationTactics: [
        'Chọn chế độ On-Demand cho các ứng dụng có lưu lượng truy cập thất thường hoặc khó dự đoán.',
        'Sử dụng tính năng DynamoDB TTL (Time to Live) để tự động xóa các dữ liệu hết hạn (phiên làm việc, log) mà hoàn toàn KHÔNG TỐN WCU.',
        'Dùng Eventually Consistent Read khi nghiệp vụ cho phép để tiết kiệm 50% chi phí đọc.'
      ]
    }
  },

  rds: {
    exam: {
      coreConcept: 'CSDL quan hệ quản lý hoàn toàn (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server), Multi-AZ failover và mở rộng đọc bằng Read Replica.',
      keywords: ['Multi-AZ', 'Read Replica', 'RDS Proxy', 'Aurora Serverless', 'Storage Auto-scaling', 'Automated Backups', 'KMS Encryption at Rest'],
      trapsAndDistractors: [
        'Bẫy Multi-AZ vs Read Replica: Multi-AZ là để PHỤC HỒI THẢM HỌA (Disaster Recovery / High Availability), Standby DB KHÔNG THỂ đọc hay ghi. Muốn GIẢM TẢI ĐỌC thì bắt buộc phải dùng Read Replica.',
        'Bẫy mã hóa dữ liệu: Không thể bật mã hóa KMS cho một DB instance chưa được mã hóa từ trước. Muốn mã hóa phải: Tạo Snapshot -> Copy Snapshot và bật mã hóa -> Khôi phục DB mới từ Snapshot đã mã hóa.',
        'Bẫy chuyển đổi Read Replica: Read Replica sử dụng cơ chế sao chép bất đồng bộ (Asynchronous replication); Multi-AZ Standby dùng sao chép đồng bộ (Synchronous replication).'
      ],
      decisionRule: 'Cần CSDL quan hệ độ sẵn sàng cao, tự động phục hồi thảm họa không gián đoạn kinh doanh -> Luôn chọn Multi-AZ.'
    },
    pricing: {
      billingModel: 'Tính theo giờ chạy của DB instance + Dung lượng lưu trữ đĩa EBS (gp3/io2) + Băng thông sao chép đa vùng.',
      hiddenCosts: [
        'Multi-AZ nhân đôi chi phí: Bật Multi-AZ đồng nghĩa với việc bạn phải trả tiền cho 2 máy chủ DB chạy song song.',
        'Phí lưu trữ Snapshot sao lưu: Bản sao lưu vượt quá 100% dung lượng CSDL chính sẽ bị tính phí lưu trữ S3.',
        'Phí bản quyền (License-Included): Các engine thương mại như Oracle Enterprise hoặc Microsoft SQL Server có phí bản quyền rất cao tính theo giờ vCPU.'
      ],
      freeTierRules: '750 giờ chạy db.t3.micro hoặc db.t4g.micro Single-AZ mỗi tháng + 20GB lưu trữ SSD và 20GB lưu trữ bản sao lưu trong 12 tháng đầu.',
      costOptimizationTactics: [
        'Chuyển đổi engine mã nguồn mở sang Aurora MySQL/PostgreSQL hoặc dùng loại đĩa gp3 thay vì gp2 để tiết kiệm 20% chi phí lưu trữ.',
        'Sử dụng RDS Proxy để gom nhóm kết nối (Connection Pooling), giúp các hàm Lambda không làm cạn kiệt connection pool của DB.',
        'Dừng các instance thử nghiệm (Stop DB instance) ngoài giờ làm việc (tối đa 7 ngày trước khi AWS tự động bật lại).'
      ]
    }
  },

  vpc: {
    exam: {
      coreConcept: 'Mạng riêng ảo cách ly, định tuyến gói tin (Route Tables), cổng ra Internet (IGW/NAT) và tường lửa hai lớp (Security Groups vs Network ACLs).',
      keywords: ['Security Group (Stateful)', 'NACL (Stateless)', 'NAT Gateway', 'VPC Peering (Non-transitive)', 'Transit Gateway', 'VPC Endpoints (Gateway vs Interface)', 'VPC Flow Logs'],
      trapsAndDistractors: [
        'Bẫy Security Group vs NACL: Security Group có nhớ (Stateful - mở chiều vào tự động cho chiều ra); NACL không có nhớ (Stateless - bắt buộc phải mở cả quy tắc chiều vào và chiều ra, bao gồm cả Ephemeral Ports 1024-65535).',
        'Bẫy tính chất bắc cầu VPC Peering: VPC A kết nối với VPC B, VPC B kết nối với VPC C -> VPC A KHÔNG THỂ nói chuyện với VPC C qua B (Không có tính bắc cầu). Muốn kết nối hình sao phải dùng AWS Transit Gateway.',
        'Bẫy vị trí NAT Gateway: NAT Gateway BẮT BUỘC phải đặt ở PUBLIC SUBNET và có gắn Elastic IP mới có thể chuyển tiếp gói tin ra ngoài Internet cho máy ở Private Subnet.'
      ],
      decisionRule: 'Bảo mật máy chủ backend không cho Internet kết nối vào nhưng cần ra ngoài tải bản vá -> Đặt máy ở Private Subnet, định tuyến qua NAT Gateway ở Public Subnet.'
    },
    pricing: {
      billingModel: 'Bản thân VPC, Route Table, Subnets, Internet Gateway và Security Groups là HOÀN TOÀN MIỄN PHÍ.',
      hiddenCosts: [
        'Phí NAT Gateway: Tính $0.045/giờ chạy (~$32.40/tháng/NAT Gateway) CỘNG VỚI phí xử lý dữ liệu $0.045/GB. Nếu có 3 AZ chạy 3 NAT Gateway, chi phí cố định là ~$100/tháng kể cả không dùng.',
        'Phí VPC Peering / Cross-AZ Traffic: Truyền dữ liệu qua lại giữa 2 VPC hoặc giữa 2 Availability Zones tốn $0.01/GB mỗi chiều.',
        'Phí VPC Interface Endpoint (AWS PrivateLink): Tính phí ~$7.20/tháng cho mỗi endpoint cộng phí dữ liệu đi qua.'
      ],
      freeTierRules: 'VPC, Subnets, Internet Gateway và S3 Gateway Endpoint miễn phí vĩnh viễn. NAT Gateway KHÔNG nằm trong Free Tier.',
      costOptimizationTactics: [
        'Luôn tạo Gateway VPC Endpoint cho S3 và DynamoDB (hoàn toàn MIỄN PHÍ) để tránh dữ liệu tải lên S3 phải đi qua NAT Gateway tốn phí.',
        'Trong môi trường Dev/Test, chỉ dùng 1 NAT Gateway duy nhất chia sẻ cho tất cả Private Subnet thay vì tạo mỗi AZ một cái.',
        'Gộp các tài khoản thành viên trong AWS Organizations vào mô hình VPC chia sẻ (VPC Sharing via RAM) để dùng chung tài nguyên mạng.'
      ]
    }
  },

  iam: {
    exam: {
      coreConcept: 'Xác thực và phân quyền truy cập, nguyên tắc đặc quyền tối thiểu (Least Privilege), IAM Roles cho ứng dụng và Service Control Policies (SCPs).',
      keywords: ['Least Privilege', 'IAM Roles vs Users', 'AssumeRole', 'Cross-Account Access', 'Permission Boundary', 'SCPs (Organizations)', 'MFA Delete'],
      trapsAndDistractors: [
        'Bẫy IAM Role vs User: Tuyệt đối không nhúng Access Key / Secret Key vào code ứng dụng. Luôn gán IAM Role cho EC2/Lambda để nhận credential tạm thời tự động xoay vòng.',
        'Bẫy quyền SCP: Service Control Policy (SCP) của AWS Organizations chỉ đặt HẠN MỨC TỐI ĐA (Guardrail); SCP không tự cấp quyền. User vẫn phải có IAM Policy cấp phép mới được thao tác.',
        'Bẫy Explicit Deny: Trong thứ tự đánh giá quyền của IAM, một lệnh "Explicit Deny" (từ chối rõ ràng) luôn ghi đè và chiến thắng mọi lệnh "Allow".'
      ],
      decisionRule: 'Cần cấp quyền truy cập tài nguyên AWS cho máy chủ EC2 hoặc tài khoản bên ngoài -> Luôn sử dụng IAM Role và cơ chế AssumeRole.'
    },
    pricing: {
      billingModel: 'Dịch vụ AWS IAM là tính năng cốt lõi và HOÀN TOÀN MIỄN PHÍ trên mọi tài khoản AWS.',
      hiddenCosts: [
        'IAM không tính phí trực tiếp.',
        'Tuy nhiên, việc lưu trữ nhật ký kiểm toán hành động IAM thông qua AWS CloudTrail hoặc chạy kiểm tra tự động qua AWS Config sẽ tính phí dịch vụ CloudTrail/Config tương ứng.'
      ],
      freeTierRules: 'Miễn phí 100% không giới hạn người dùng, nhóm, vai trò và chính sách quyền.',
      costOptimizationTactics: [
        'Dùng công cụ IAM Access Advisor và IAM Access Analyzer để rà soát và xóa bỏ các quyền không bao giờ được sử dụng, tuân thủ FinOps và bảo mật.',
        'Tắt bỏ các Access Key không hoạt động quá 90 ngày để tránh rủi ro rò rỉ bị hacker lạm dụng đào tiền ảo gây phát sinh hàng chục ngàn USD.'
      ]
    }
  },

  sqs: {
    exam: {
      coreConcept: 'Hàng đợi tin nhắn phân tán, tách rời kiến trúc (Decoupling), xử lý bất đồng bộ và cơ chế chống nghẽn tải.',
      keywords: ['Decoupling', 'Standard Queue', 'FIFO Queue', 'Visibility Timeout', 'Dead-Letter Queue (DLQ)', 'Long Polling', 'Deduplication ID'],
      trapsAndDistractors: [
        'Bẫy Standard vs FIFO: Standard Queue có thông lượng vô hạn nhưng thứ tự giao tin nhắn là "Tốt nhất có thể" (Best-effort) và có thể lặp (At-least-once delivery). FIFO Queue đảm bảo thứ tự tuyệt đối và đúng 1 lần (Exactly-once) nhưng giới hạn 3.000 msgs/giây khi bật batching.',
        'Bẫy Visibility Timeout: Khi một consumer đọc tin nhắn, tin nhắn không bị xóa ngay mà bị ẩn đi trong khoảng Visibility Timeout (mặc định 30s). Nếu consumer xử lý mất 40s mà không xóa, tin nhắn sẽ hiện lại và bị consumer khác đọc lần 2.',
        'Bẫy Short vs Long Polling: Short Polling truy vấn ngay lập tức (dễ trả về rỗng và tốn request); Long Polling (WaitTimeSeconds = 20) chờ có tin nhắn mới trả về giúp tiết kiệm tối đa chi phí API call.'
      ],
      decisionRule: 'Đề bài yêu cầu tách rời các microservice để chống sập khi lượng truy cập tăng vọt -> Chọn Amazon SQS làm bộ đệm trung gian.'
    },
    pricing: {
      billingModel: 'Tính theo số triệu yêu cầu SQS Requests ($0.40/triệu requests cho Standard, $0.50/triệu requests cho FIFO).',
      hiddenCosts: [
        'Phí Short Polling rỗng: Các consumer gửi request liên tục kiểm tra tin nhắn nhưng không có dữ liệu vẫn bị tính phí mỗi request.',
        'Phí kích thước tin nhắn: Mỗi block 64KB được tính là 1 request. Tin nhắn tối đa 256KB sẽ bị tính cước tương đương 4 requests.',
        'Phí Data Transfer Out: Dữ liệu truyền từ SQS sang máy chủ EC2 ở Region khác sẽ chịu phí Data Transfer.'
      ],
      freeTierRules: 'Miễn phí vĩnh viễn (Always Free): 1 triệu yêu cầu Amazon SQS Requests mỗi tháng.',
      costOptimizationTactics: [
        'Bật Long Polling (WaitTimeSeconds từ 1 đến 20 giây) để giảm tới 90% số lượng request kiểm tra rỗng không cần thiết.',
        'Sử dụng cơ chế gửi và nhận tin nhắn theo lô (Batch Operations: SendMessageBatch, ReceiveMessageBatch) để gom tối đa 10 tin nhắn trong 1 request.'
      ]
    }
  }
};

/**
 * Lấy bộ dữ liệu chi tiết Mẹo thi sát đề & Cạm bẫy chi phí cho mọi dịch vụ trong 214 dịch vụ
 */
export function getDetailedExamAndPricing(service: AWSService): DetailedExamAndPricing {
  if (SPECIFIC_EXAM_PRICING[service.id]) {
    return SPECIFIC_EXAM_PRICING[service.id];
  }

  // Tự động phân tích và sinh bộ thông tin chuyên sâu có cấu trúc cao theo dữ liệu của dịch vụ
  const keywordsFromSummary = service.summary.split(/[,.;]/).map(s => s.trim()).filter(s => s.length > 3 && s.length < 35).slice(0, 5);
  const examKeywords = [
    service.code,
    ...keywordsFromSummary,
    ...service.relatedServices.slice(0, 3)
  ];

  return {
    exam: {
      coreConcept: service.summary,
      keywords: examKeywords,
      trapsAndDistractors: [
        `Bẫy phạm vi kiến trúc: ${service.examTip}`,
        `Bẫy nhầm lẫn dịch vụ: Cần phân biệt rõ giữa ${service.code} và các dịch vụ liên đới (${service.relatedServices.join(', ')}). Kiểm tra kỹ yêu cầu về độ trễ và tính quản trị tự động trong câu hỏi.`
      ],
      decisionRule: `Khi đề bài xuất hiện tình huống: "${service.whenToChoose}" -> Luôn ưu tiên chọn ${service.code} làm giải pháp kiến trúc tối ưu.`
    },
    pricing: {
      billingModel: `Tính cước dựa trên khối lượng công việc thực tế của ${service.categoryLabel}. Cần kiểm tra kỹ cơ chế Free Tier trước khi triển khai.`,
      hiddenCosts: [
        service.pricingGotcha,
        `Phí Data Transfer Out và Cross-AZ Traffic khi giao tiếp với các dịch vụ khác (${service.relatedServices.slice(0, 2).join(', ')}).`,
        `Chi phí lưu trữ hoặc nhật ký kiểm toán CloudWatch/CloudTrail phát sinh trong quá trình vận hành.`
      ],
      freeTierRules: service.freeTier
        ? 'Dịch vụ này CÓ hỗ trợ gói Free Tier (12 tháng hoặc vĩnh viễn). Hãy tuân thủ hạn mức để không phát sinh chi phí.'
        : 'Dịch vụ này KHÔNG có gói Free Tier cơ bản; mọi tài nguyên khởi tạo sẽ tính phí ngay theo biểu giá On-Demand.',
      costOptimizationTactics: [
        'Áp dụng kiến trúc tự động tắt mở hoặc dọn dẹp tài nguyên ngoài giờ làm việc bằng Tag và AWS Automation.',
        'Sử dụng AWS Budgets thiết lập cảnh báo ngưỡng chi tiêu 80% để ngăn ngừa hóa đơn phát sinh đột biến.',
        'Định kỳ rà soát các tài nguyên nhàn rỗi (idle resources) và tối ưu hóa kích thước bằng AWS Compute Optimizer.'
      ]
    }
  };
}
