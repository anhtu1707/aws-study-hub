import { Flashcard } from '../types';

export const EXAM_QUESTIONS: Flashcard[] = [
  {
    "id": "q1",
    "examCode": "SAA-C03",
    "domain": "Tối ưu hóa chi phí (Cost-Optimized Architectures)",
    "serviceId": "ec2",
    "scenario": "Một công ty cần chạy tác vụ xử lý video theo lô (batch job) có thể tạm dừng và chạy lại mà không hỏng dữ liệu, yêu cầu tối ưu chi phí thấp nhất có thể.",
    "question": "Loại hình EC2 instance nào là lựa chọn kinh tế nhất?",
    "options": [
      {
        "key": "A",
        "text": "EC2 On-Demand Instances",
        "explanation": "Giá cao nhất, không phù hợp cho tác vụ linh hoạt chấp nhận gián đoạn."
      },
      {
        "key": "B",
        "text": "EC2 Spot Instances",
        "explanation": "Chính xác! Giảm tới 90% chi phí, lý tưởng cho batch job có checkpoint."
      },
      {
        "key": "C",
        "text": "EC2 Reserved Instances kỳ hạn 3 năm",
        "explanation": "Phù hợp tải liên tục cố định, không tối ưu cho batch job ngắn hạn linh hoạt."
      },
      {
        "key": "D",
        "text": "EC2 Dedicated Hosts",
        "explanation": "Chi phí đắt đỏ nhất, dùng khi cần tuân thủ bản quyền phần mềm theo socket/core."
      }
    ],
    "correctKey": "B",
    "answer": "EC2 Spot Instances",
    "explanation": "Spot Instances có mức giảm giá lên tới 90% so với On-Demand. Với các batch job có khả năng chịu lỗi và tiếp tục từ checkpoint, Spot là giải pháp tối ưu chi phí số 1.",
    "decisionRule": "Tác vụ batch job tạm dừng được + Chi phí thấp nhất ➔ Chọn Spot Instances."
  },
  {
    "id": "q2",
    "examCode": "SAA-C03",
    "domain": "Thiết kế hệ thống an toàn & Tuân thủ pháp lý",
    "serviceId": "s3",
    "scenario": "Hồ sơ bệnh án tài chính bắt buộc phải lưu trữ trong 7 năm theo quy định pháp lý, nghiêm cấm mọi hành vi chỉnh sửa hoặc xóa kể cả từ tài khoản quản trị Root.",
    "question": "Giải pháp cấu hình S3 nào đáp ứng yêu cầu trên?",
    "options": [
      {
        "key": "A",
        "text": "Bật S3 Versioning và cấu hình Lifecycle Rule xóa sau 7 năm",
        "explanation": "Versioning vẫn cho phép Root hoặc người có quyền xóa vĩnh viễn phiên bản."
      },
      {
        "key": "B",
        "text": "Bật S3 Object Lock với chế độ Compliance Mode",
        "explanation": "Chính xác! Compliance Mode ngăn chặn mọi đối tượng (kể cả Root) sửa/xóa trước hạn."
      },
      {
        "key": "C",
        "text": "Bật S3 Object Lock với chế độ Governance Mode",
        "explanation": "Governance Mode vẫn cho phép IAM user có quyền đặc biệt bypass để xóa."
      },
      {
        "key": "D",
        "text": "Cấu hình S3 Glacier Vault với IAM deny policy",
        "explanation": "IAM Policy vẫn có thể bị chỉnh sửa bởi tài khoản Root."
      }
    ],
    "correctKey": "B",
    "answer": "S3 Object Lock với chế độ Compliance Mode",
    "explanation": "S3 Object Lock theo mô hình WORM (Write Once, Read Many). Chế độ Compliance đảm bảo không ai, kể cả tài khoản AWS Root, có thể ghi đè hay xóa object trước khi hết thời gian khóa.",
    "decisionRule": "Lưu trữ WORM + Cấm cả Root xóa ➔ S3 Object Lock Compliance Mode."
  },
  {
    "id": "q3",
    "examCode": "SAA-C03",
    "domain": "Thiết kế mạng an toàn & Bảo mật",
    "serviceId": "vpc",
    "scenario": "Các máy chủ EC2 nằm trong Private Subnet cần kết nối ra ngoài Internet để tải các bản vá bảo mật HĐH, nhưng tuyệt đối không cho phép Internet bên ngoài chủ động kết nối vào.",
    "question": "Thành phần mạng nào cần được thiết lập và đặt ở đâu?",
    "options": [
      {
        "key": "A",
        "text": "Internet Gateway gắn trực tiếp vào Private Subnet",
        "explanation": "IGW gắn ở mức VPC và Route table trỏ ra IGW sẽ biến Subnet thành Public."
      },
      {
        "key": "B",
        "text": "Egress-Only Internet Gateway đặt trong Private Subnet",
        "explanation": "Egress-Only IGW chỉ dành riêng cho IPv6, không áp dụng cho IPv4."
      },
      {
        "key": "C",
        "text": "NAT Gateway đặt trong Public Subnet",
        "explanation": "Chính xác! NAT Gateway dịch địa chỉ IP trong Public Subnet, cho phép chiều ra một chiều."
      },
      {
        "key": "D",
        "text": "NAT Instance đặt trong Private Subnet",
        "explanation": "NAT phải nằm trong Public Subnet mới có thể định tuyến ra Internet Gateway."
      }
    ],
    "correctKey": "C",
    "answer": "NAT Gateway đặt trong Public Subnet",
    "explanation": "NAT Gateway chuyển đổi địa chỉ IP Private thành IP Public của nó để liên lạc ra Internet và chỉ cho phép lưu lượng phản hồi quay về (một chiều từ trong ra ngoài). Nó bắt buộc phải đặt trong Public Subnet.",
    "decisionRule": "Private Subnet cần tải ra Internet 1 chiều ➔ NAT Gateway đặt tại Public Subnet."
  },
  {
    "id": "q4",
    "examCode": "SAA-C03",
    "domain": "Hệ thống hiệu năng cao (High-Performing Architectures)",
    "serviceId": "dynamodb",
    "scenario": "Bảng xếp hạng game trực tuyến gặp tình trạng nghẽn do hàng triệu truy vấn đọc lặp đi lặp lại cùng một tập dữ liệu, yêu cầu độ trễ phản hồi phải giảm từ mili-giây xuống micro-giây.",
    "question": "Giải pháp tối ưu hóa hiệu năng nào tốn ít công sức sửa đổi code nhất?",
    "options": [
      {
        "key": "A",
        "text": "Bật DynamoDB Global Tables",
        "explanation": "Global Tables giải quyết bài toán đa vùng, không giải quyết độ trễ micro-giây."
      },
      {
        "key": "B",
        "text": "Tích hợp Amazon DynamoDB Accelerator (DAX)",
        "explanation": "Chính xác! DAX tương thích API DynamoDB 100%, đem lại độ trễ dưới 1 mili-giây (micro-giây)."
      },
      {
        "key": "C",
        "text": "Cài đặt cụm Redis trên EC2 và viết lại logic cache trong app",
        "explanation": "Tốn rất nhiều công sức phát triển và quản lý hạ tầng cụm."
      },
      {
        "key": "D",
        "text": "Tăng Provisioned Read Capacity Units (RCU) lên 10 lần",
        "explanation": "Tăng chi phí cực lớn nhưng không đạt được độ trễ micro-giây."
      }
    ],
    "correctKey": "B",
    "answer": "Tích hợp DynamoDB Accelerator (DAX)",
    "explanation": "DAX là bộ nhớ đệm In-Memory được quản lý hoàn toàn cho DynamoDB, giảm độ trễ đọc từ mili-giây xuống micro-giây và tương thích 100% với các lệnh API DynamoDB hiện có mà không cần sửa logic ứng dụng.",
    "decisionRule": "DynamoDB + Độ trễ micro-giây + Không sửa code API ➔ Chọn DAX."
  },
  {
    "id": "q5",
    "examCode": "SAA-C03",
    "domain": "Hệ thống có độ tin cậy cao (Resilient Architectures)",
    "serviceId": "aurora",
    "scenario": "Hệ thống ngân hàng yêu cầu cơ sở dữ liệu quan hệ có khả năng phục hồi thảm họa đa vùng (Multi-Region Disaster Recovery) với RPO gần bằng 0 và RTO dưới 1 phút.",
    "question": "Giải pháp cơ sở dữ liệu AWS nào đáp ứng tiêu chuẩn khắt khe này?",
    "options": [
      {
        "key": "A",
        "text": "RDS Multi-AZ Deployment",
        "explanation": "Multi-AZ chỉ bảo vệ trong phạm vi 1 Region (đa AZ), không chống được thảm họa toàn Region."
      },
      {
        "key": "B",
        "text": "Amazon Aurora Global Database",
        "explanation": "Chính xác! Sao chép tầng đĩa đa Region dưới 1 giây, thăng hạng vùng phụ dưới 1 phút."
      },
      {
        "key": "C",
        "text": "RDS PostgreSQL với Read Replica đa Region",
        "explanation": "Replication lag qua mạng logic có thể lên tới nhiều phút, RTO khi failover lâu."
      },
      {
        "key": "D",
        "text": "Tự sao lưu Snapshot hàng giờ chuyển sang Region khác",
        "explanation": "RPO lên tới 1 giờ, RTO mất hàng chục phút để restore."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Aurora Global Database",
    "explanation": "Aurora Global Database sử dụng cơ chế nhân bản chuyên dụng ở tầng lưu trữ đĩa, sao chép dữ liệu đa Region với độ trễ thông thường dưới 1 giây và có thể kích hoạt thăng hạng vùng phụ trong chưa đầy 1 phút.",
    "decisionRule": "CSDL Quan hệ + Đa Region + RPO dưới 1s + RTO dưới 1 phút ➔ Aurora Global Database."
  },
  {
    "id": "q6",
    "examCode": "SAA-C03",
    "domain": "Thiết kế tách rời hệ thống (Decoupled Architectures)",
    "serviceId": "sqs",
    "scenario": "Trong đợt Flash Sale hàng nghìn đơn hàng đổ về cùng một lúc khiến cho dịch vụ thanh toán phía sau bị quá tải và sập máy chủ.",
    "question": "Mô hình kiến trúc nào giải quyết triệt để vấn đề nghẽn tải này?",
    "options": [
      {
        "key": "A",
        "text": "Tăng RAM và CPU cho máy chủ thanh toán (Vertical Scaling)",
        "explanation": "Quy mô dọc có giới hạn phần cứng và chi phí lãng phí khi hết giờ sale."
      },
      {
        "key": "B",
        "text": "Đặt hàng đợi Amazon SQS làm bộ đệm (Decoupling)",
        "explanation": "Chính xác! SQS hấp thụ xung đột biến tải, backend lấy tin nhắn ra xử lý theo năng lực."
      },
      {
        "key": "C",
        "text": "Sử dụng Amazon SNS gửi thông báo đẩy trực tiếp vào backend",
        "explanation": "SNS đẩy đồng thời (push) sẽ khiến backend càng sập nhanh hơn."
      },
      {
        "key": "D",
        "text": "Chuyển backend sang chạy trên Spot Instances",
        "explanation": "Spot không giải quyết được vấn đề quá tải luồng request đồng thời."
      }
    ],
    "correctKey": "B",
    "answer": "Đặt hàng đợi Amazon SQS làm bộ đệm (Decoupling)",
    "explanation": "Hàng đợi SQS nhận đơn hàng và lưu trữ an toàn. Dịch vụ thanh toán sẽ lấy (poll) từng đợt tin nhắn ra xử lý theo tốc độ phù hợp của nó, triệt tiêu hoàn toàn nghẽn tải.",
    "decisionRule": "Đột biến tải + Chống sập dịch vụ phía sau ➔ Đặt SQS làm bộ đệm (Decoupling)."
  },
  {
    "id": "q7",
    "examCode": "SAA-C03",
    "domain": "Tối ưu hóa chi phí lưu trữ S3",
    "serviceId": "s3",
    "scenario": "Hàng triệu tệp log giao dịch hàng tháng cần lưu trữ để kiểm toán trong 10 năm. Dữ liệu hầu như không bao giờ được truy cập lại, nhưng nếu cơ quan chức năng yêu cầu thì chấp nhận thời gian lấy dữ liệu từ 12 đến 48 giờ.",
    "question": "Hạng lưu trữ S3 Storage Class nào có chi phí rẻ nhất cho tình huống này?",
    "options": [
      {
        "key": "A",
        "text": "S3 Standard-Infrequent Access (S3 Standard-IA)",
        "explanation": "Giá lưu trữ vẫn cao gấp 10 lần so với Glacier Deep Archive."
      },
      {
        "key": "B",
        "text": "S3 Glacier Flexible Retrieval",
        "explanation": "Rẻ nhưng chưa phải là rẻ nhất (vẫn đắt gấp 3 lần Glacier Deep Archive)."
      },
      {
        "key": "C",
        "text": "S3 Glacier Deep Archive",
        "explanation": "Chính xác! Chi phí lưu trữ rẻ nhất toàn bộ AWS (~$0.00099/GB/tháng), truy xuất 12-48h."
      },
      {
        "key": "D",
        "text": "S3 One Zone-IA",
        "explanation": "Không an toàn vì mất dữ liệu nếu 1 AZ bị thảm họa, chi phí lưu trữ cao hơn Glacier."
      }
    ],
    "correctKey": "C",
    "answer": "S3 Glacier Deep Archive",
    "explanation": "S3 Glacier Deep Archive là hạng lưu trữ có chi phí rẻ nhất trên AWS, được thiết kế cho dữ liệu lưu trữ dài hạn hiếm khi truy cập và chấp nhận thời gian trích xuất tiêu chuẩn từ 12 đến 48 giờ.",
    "decisionRule": "Lưu trữ dài hạn + Hiếm khi truy cập + Chấp nhận 12-48h ➔ S3 Glacier Deep Archive."
  },
  {
    "id": "q8",
    "examCode": "SAA-C03",
    "domain": "Định tuyến tải tầng ứng dụng",
    "serviceId": "elb",
    "scenario": "Ứng dụng thương mại điện tử cần định tuyến các yêu cầu `/api/orders` tới cụm máy chủ Đơn hàng và `/api/users` tới cụm máy chủ Người dùng.",
    "question": "Loại Load Balancer nào hỗ trợ tính năng định tuyến này với cấu hình đơn giản nhất?",
    "options": [
      {
        "key": "A",
        "text": "Network Load Balancer (NLB)",
        "explanation": "NLB hoạt động ở Tầng 4 (TCP/UDP), không đọc được URI đường dẫn HTTP."
      },
      {
        "key": "B",
        "text": "Application Load Balancer (ALB)",
        "explanation": "Chính xác! ALB hoạt động ở Tầng 7, hỗ trợ Path-based routing và Host-based routing."
      },
      {
        "key": "C",
        "text": "Classic Load Balancer (CLB)",
        "explanation": "CLB là công nghệ cũ, không hỗ trợ linh hoạt các quy tắc Path-based routing."
      },
      {
        "key": "D",
        "text": "Gateway Load Balancer (GWLB)",
        "explanation": "GWLB chuyên dùng cho chèn thiết bị mạng bảo mật (firewall/IDS)."
      }
    ],
    "correctKey": "B",
    "answer": "Application Load Balancer (ALB)",
    "explanation": "Application Load Balancer (ALB) hoạt động ở tầng ứng dụng Layer 7, hỗ trợ tính năng Path-based routing cho phép phân tích URL path (`/orders`, `/users`) để chuyển đến đúng Target Group.",
    "decisionRule": "Định tuyến theo đường dẫn URL (`/path`) ➔ Chọn Application Load Balancer (ALB)."
  },
  {
    "id": "q9",
    "examCode": "SAA-C03",
    "domain": "Phân phối nội dung bảo mật toàn cầu",
    "serviceId": "cloudfront",
    "scenario": "Trang web đào tạo trực tuyến cung cấp các video bài giảng trả phí. Yêu cầu chỉ học viên đã thanh toán mới được tải video từ CloudFront, link chỉ có hiệu lực trong 2 giờ và không được chia sẻ cho người khác.",
    "question": "Cơ chế nào của CloudFront đáp ứng chính xác bài toán phân phối này?",
    "options": [
      {
        "key": "A",
        "text": "CloudFront Geo Restriction (Chặn theo quốc gia)",
        "explanation": "Geo Restriction chỉ lọc theo vị trí địa lý, không xác thực từng người dùng trả phí."
      },
      {
        "key": "B",
        "text": "Sử dụng CloudFront Signed URLs (URL có chữ ký)",
        "explanation": "Chính xác! Signed URL giới hạn thời gian hết hạn (2h) và kiểm tra tính hợp lệ qua khóa bí mật."
      },
      {
        "key": "C",
        "text": "Đặt mật khẩu cho tệp trên Amazon S3",
        "explanation": "S3 không hỗ trợ cơ chế đặt mật khẩu trực tiếp cho từng tệp."
      },
      {
        "key": "D",
        "text": "Bật WAF chặn IP ngoài danh sách",
        "explanation": "IP người dùng gia đình liên tục thay đổi, không thể whitelist thủ công."
      }
    ],
    "correctKey": "B",
    "answer": "CloudFront Signed URLs",
    "explanation": "CloudFront Signed URLs cho phép kiểm soát quyền truy cập tệp tạm thời với thời gian hết hạn cụ thể (2 giờ). Chỉ những yêu cầu mang chữ ký mã hóa hợp lệ mới được CloudFront phân phối.",
    "decisionRule": "Bảo vệ nội dung cao cấp phân phối qua CloudFront có hạn giờ ➔ CloudFront Signed URLs."
  },
  {
    "id": "q10",
    "examCode": "SAA-C03",
    "domain": "Tự động co giãn theo tải thực tế",
    "serviceId": "auto-scaling",
    "scenario": "Hệ thống xử lý hóa đơn nhận công việc từ hàng đợi SQS. Vào giờ cao điểm số lượng tin nhắn trong queue tăng vọt, cần tự động bổ sung máy chủ EC2 để xử lý kịp tiến độ.",
    "question": "Chỉ số đo lường (metric) nào của Auto Scaling phản ánh chính xác nhất nhu cầu mở rộng?",
    "options": [
      {
        "key": "A",
        "text": "Tỷ lệ sử dụng CPU trung bình (Average CPU Utilization)",
        "explanation": "CPU có thể thấp khi máy chủ đang chờ I/O hoặc tin nhắn nạp chưa kịp xử lý."
      },
      {
        "key": "B",
        "text": "Số lượng tin nhắn có sẵn trong SQS trên mỗi instance (Backlog per instance)",
        "explanation": "Chính xác! Phản ánh khối lượng công việc thực tế mà mỗi worker cần gánh."
      },
      {
        "key": "C",
        "text": "Lưu lượng mạng vào mạng ra (Network In/Out)",
        "explanation": "Không phản ánh số lượng công việc còn tồn đọng trong queue."
      },
      {
        "key": "D",
        "text": "Số lượng kết nối HTTP của Load Balancer",
        "explanation": "Worker xử lý ngầm từ queue, không nhận request trực tiếp từ Load Balancer."
      }
    ],
    "correctKey": "B",
    "answer": "Tỷ lệ Backlog tin nhắn trên mỗi instance (ApproximateNumberOfMessages / Group InService)",
    "explanation": "Tỷ lệ Backlog per instance (Số tin nhắn trong queue chia cho số worker đang chạy) là chỉ số chuẩn mực được AWS khuyến nghị để Auto Scaling tính toán chính xác số instance cần thêm để hoàn thành SLA.",
    "decisionRule": "Auto Scaling dựa trên SQS Queue ➔ Chọn Custom Metric: Backlog per instance."
  },
  {
    "id": "q11",
    "examCode": "SAA-C03",
    "domain": "Lưu trữ khối hiệu năng cao",
    "serviceId": "ebs",
    "scenario": "Hệ thống CSDL Oracle RAC yêu cầu hai máy chủ EC2 cùng gắn đồng thời vào một ổ đĩa lưu trữ dạng khối (Block Storage) với tính nhất quán cao và hỗ trợ khóa tệp.",
    "question": "Giải pháp cấu hình ổ cứng EBS nào đáp ứng được yêu cầu gắn đồng thời này?",
    "options": [
      {
        "key": "A",
        "text": "EBS General Purpose SSD (gp3) bật Multi-Attach",
        "explanation": "gp3 không hỗ trợ tính năng Multi-Attach."
      },
      {
        "key": "B",
        "text": "EBS Provisioned IOPS SSD (io1/io2) bật Multi-Attach",
        "explanation": "Chính xác! Chỉ có dòng io1/io2 trong cùng AZ mới hỗ trợ gắn tối đa 16 instance cùng lúc."
      },
      {
        "key": "C",
        "text": "Amazon EFS với chế độ Max I/O",
        "explanation": "EFS là File Storage (NFS), không phải Block Storage mà CSDL yêu cầu."
      },
      {
        "key": "D",
        "text": "EBS Throughput Optimized HDD (st1)",
        "explanation": "st1 là ổ đĩa từ tính tuần tự, không hỗ trợ Multi-Attach và hiệu năng IOPS rất thấp."
      }
    ],
    "correctKey": "B",
    "answer": "EBS Provisioned IOPS SSD (io1/io2) bật Multi-Attach",
    "explanation": "EBS Multi-Attach cho phép gắn một ổ Provisioned IOPS SSD (io1 hoặc io2) vào tối đa 16 máy chủ EC2 trong cùng một Availability Zone, phù hợp cho các cụm cluster CSDL như Oracle RAC.",
    "decisionRule": "Nhiều EC2 gắn chung 1 ổ Block Storage ➔ EBS io1/io2 Multi-Attach."
  },
  {
    "id": "q12",
    "examCode": "SAA-C03",
    "domain": "Hệ thống tệp chia sẻ phân tán",
    "serviceId": "efs",
    "scenario": "Một cụm 50 máy chủ web Linux chạy trên nhiều Availability Zones cần chia sẻ chung một thư mục mã nguồn và tài liệu tĩnh, hỗ trợ giao thức POSIX tiêu chuẩn.",
    "question": "Dịch vụ lưu trữ nào phù hợp và tối ưu nhất?",
    "options": [
      {
        "key": "A",
        "text": "Amazon EBS gp3 gắn vào máy chủ chính rồi chia sẻ qua NFS tự dựng",
        "explanation": "Tự dựng NFS server tạo điểm nghẽn Single Point of Failure (SPOF)."
      },
      {
        "key": "B",
        "text": "Amazon Elastic File System (Amazon EFS)",
        "explanation": "Chính xác! EFS là Managed NFS đa AZ, tự động co giãn và hỗ trợ POSIX cho hàng nghìn EC2."
      },
      {
        "key": "C",
        "text": "Amazon FSx for Windows File Server",
        "explanation": "Dùng cho Windows và giao thức SMB, không tối ưu cho cụm Linux."
      },
      {
        "key": "D",
        "text": "Amazon S3 gắn qua công cụ s3fs",
        "explanation": "S3 không hỗ trợ chuẩn khóa tệp POSIX đầy đủ và độ trễ cao hơn file system thực thụ."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Elastic File System (Amazon EFS)",
    "explanation": "Amazon EFS cung cấp hệ thống tệp dùng chung serverless hỗ trợ chuẩn NFSv4/POSIX, tự động mở rộng dung lượng và có thể gắn đồng thời vào hàng trăm máy chủ Linux trên nhiều AZ.",
    "decisionRule": "Chia sẻ tệp Linux đa AZ + Chuẩn POSIX ➔ Chọn Amazon EFS."
  },
  {
    "id": "q13",
    "examCode": "SAA-C03",
    "domain": "Mã hóa và nhân bản bảo mật",
    "serviceId": "s3",
    "scenario": "Doanh nghiệp muốn cấu hình nhân bản tệp từ S3 Bucket ở Singapore sang S3 Bucket ở Tokyo (Cross-Region Replication). Tuy nhiên các tệp được mã hóa bằng khóa KMS Customer Managed Key (CMK).",
    "question": "Điều kiện bắt buộc để việc nhân bản diễn ra thành công là gì?",
    "options": [
      {
        "key": "A",
        "text": "Chuyển toàn bộ tệp sang chế độ mã hóa S3-Managed Key (SSE-S3)",
        "explanation": "Không đáp ứng yêu cầu quản lý khóa bảo mật doanh nghiệp bằng CMK."
      },
      {
        "key": "B",
        "text": "Cấp quyền giải mã cho Replication Role ở bucket nguồn và cấp quyền mã hóa bằng CMK ở bucket đích",
        "explanation": "Chính xác! Replication Role cần quyền kms:Decrypt ở nguồn và kms:Encrypt ở đích."
      },
      {
        "key": "C",
        "text": "Sử dụng chung một mã ARN khóa KMS cho cả hai Region",
        "explanation": "Khóa KMS CMK là tài nguyên vùng (Regional), không thể dùng chung ARN giữa các Region."
      },
      {
        "key": "D",
        "text": "Bật tính năng S3 Transfer Acceleration trên cả 2 bucket",
        "explanation": "Transfer Acceleration chỉ tăng tốc đường truyền, không giải quyết bài toán quyền KMS."
      }
    ],
    "correctKey": "B",
    "answer": "Cấp quyền giải mã cho IAM Replication Role ở nguồn và mã hóa bằng KMS Key ở vùng đích",
    "explanation": "Khi nhân bản object mã hóa SSE-KMS, IAM Replication Role phải được cấp quyền `kms:Decrypt` trên khóa KMS tại Region nguồn, và quyền `kms:Encrypt` trên khóa KMS tại Region đích.",
    "decisionRule": "S3 Replication với KMS CMK ➔ Role phải có quyền Decrypt ở nguồn & Encrypt ở đích."
  },
  {
    "id": "q14",
    "examCode": "SAA-C03",
    "domain": "Điều phối DNS toàn cầu",
    "serviceId": "route53",
    "scenario": "Một công ty muốn thử nghiệm giao diện web mới bằng cách chuyển 10% lượng người dùng vào cụm máy chủ mới và 90% còn lại vẫn truy cập cụm máy chủ cũ.",
    "question": "Chính sách định tuyến (Routing Policy) nào của Route 53 đáp ứng bài toán này?",
    "options": [
      {
        "key": "A",
        "text": "Latency Routing Policy",
        "explanation": "Định tuyến theo độ trễ mạng thấp nhất tới người dùng, không chia tỷ lệ %."
      },
      {
        "key": "B",
        "text": "Weighted Routing Policy (Định tuyến theo trọng số)",
        "explanation": "Chính xác! Thiết lập trọng số 90 và 10 cho hai bản ghi."
      },
      {
        "key": "C",
        "text": "Geolocation Routing Policy",
        "explanation": "Định tuyến theo vị trí địa lý (quốc gia/châu lục) của người truy cập."
      },
      {
        "key": "D",
        "text": "Failover Routing Policy",
        "explanation": "Dành cho chuyển đổi dự phòng Active-Passive khi máy chủ chính gặp sự cố."
      }
    ],
    "correctKey": "B",
    "answer": "Route 53 Weighted Routing Policy",
    "explanation": "Weighted Routing cho phép gán trọng số (ví dụ 90 và 10) cho các endpoint khác nhau, chia tỷ lệ lưu lượng DNS tương ứng, rất phổ biến cho kiểm thử A/B hoặc Canary Deployment.",
    "decisionRule": "Chia tỷ lệ lưu lượng theo phần trăm (%) ➔ Chọn Route 53 Weighted Routing."
  },
  {
    "id": "q15",
    "examCode": "SAA-C03",
    "domain": "Tối ưu chi phí kết nối nội bộ",
    "serviceId": "vpc",
    "scenario": "Hàng trăm máy chủ EC2 trong Private Subnet truyền tải hàng chục Terabyte dữ liệu mỗi ngày lên Amazon S3. Hóa đơn ghi nhận chi phí NAT Gateway tăng rất cao.",
    "question": "Giải pháp kiến trúc mạng nào giúp loại bỏ 100% chi phí NAT Gateway khi truy cập S3?",
    "options": [
      {
        "key": "A",
        "text": "Tạo VPC Interface Endpoint cho Amazon S3",
        "explanation": "Interface Endpoint tính phí theo giờ và phí dung lượng GB truyền tải."
      },
      {
        "key": "B",
        "text": "Tạo VPC Gateway Endpoint cho Amazon S3",
        "explanation": "Chính xác! Gateway Endpoint cho S3 và DynamoDB hoàn toàn MIỄN PHÍ."
      },
      {
        "key": "C",
        "text": "Gắn Elastic IP công cộng trực tiếp vào từng máy chủ EC2",
        "explanation": "Vi phạm nguyên tắc bảo mật của Private Subnet và tốn phí IPv4."
      },
      {
        "key": "D",
        "text": "Nén toàn bộ dữ liệu trước khi gửi lên S3",
        "explanation": "Vẫn phải đi qua NAT Gateway và chịu phí truyền tải."
      }
    ],
    "correctKey": "B",
    "answer": "Tạo VPC Gateway Endpoint cho Amazon S3",
    "explanation": "VPC Gateway Endpoint (hỗ trợ riêng cho S3 và DynamoDB) hoàn toàn miễn phí, không tốn cước duy trì hàng giờ và không tốn cước dữ liệu. Dữ liệu đi thẳng qua mạng ngầm AWS mà không cần qua NAT Gateway.",
    "decisionRule": "EC2 Private truy cập S3/DynamoDB giảm chi phí NAT ➔ Tạo VPC Gateway Endpoint (Miễn phí)."
  },
  {
    "id": "q16",
    "examCode": "SAP-C02",
    "domain": "Quản trị tổ chức & Chính sách bảo mật tập trung",
    "serviceId": "organizations",
    "scenario": "Tập đoàn tài chính có hơn 200 tài khoản AWS. Để tuân thủ pháp luật, tập đoàn nghiêm cấm mọi tài khoản con (kể cả Root account của tài khoản con) khởi tạo tài nguyên ngoài hai Region Singapore và Tokyo.",
    "question": "Giải pháp quản trị tập trung nào có hiệu lực bắt buộc trên toàn bộ tổ chức?",
    "options": [
      {
        "key": "A",
        "text": "Cấu hình IAM Policy hạn chế Region và gán vào từng tài khoản con",
        "explanation": "Root account của tài khoản con có thể xóa hoặc sửa đổi IAM policy này."
      },
      {
        "key": "B",
        "text": "Thiết lập Service Control Policy (SCP) với điều kiện `aws:RequestedRegion`",
        "explanation": "Chính xác! SCP quản lý từ Management Account kiểm soát toàn bộ tài khoản kể cả Root con."
      },
      {
        "key": "C",
        "text": "Sử dụng AWS Config Rule tự động tắt máy chủ ngoài 2 Region",
        "explanation": "Đây là giải pháp phản ứng sau khi tài nguyên đã tạo, không ngăn chặn được từ đầu."
      },
      {
        "key": "D",
        "text": "Bật AWS Shield Advanced trên các Region bị cấm",
        "explanation": "Shield là dịch vụ chống DDoS, không có chức năng cấm tạo tài nguyên theo Region."
      }
    ],
    "correctKey": "B",
    "answer": "Thiết lập Service Control Policy (SCP) áp dụng điều kiện `aws:RequestedRegion`",
    "explanation": "Service Control Policies (SCPs) trong AWS Organizations áp dụng rào chắn bảo mật cấp cao nhất. Khi gắn SCP deny các Region ngoài Singapore và Tokyo, không ai trong tài khoản con (kể cả Root con) có thể vượt qua.",
    "decisionRule": "Cấm tạo tài nguyên cấp tổ chức (kể cả cấm Root con) ➔ Áp dụng Service Control Policy (SCP)."
  },
  {
    "id": "q17",
    "examCode": "SAP-C02",
    "domain": "Khởi tạo Landing Zone tự động chuẩn hóa",
    "serviceId": "control-tower",
    "scenario": "Doanh nghiệp muốn thiết lập môi trường đa tài khoản (Multi-Account Landing Zone) chuẩn Best Practices của AWS, tự động cấp phát tài khoản mới có sẵn cấu hình bảo mật, mạng và logging tập trung.",
    "question": "Dịch vụ nào giúp triển khai nhanh chóng và chuẩn hóa toàn bộ hạ tầng này?",
    "options": [
      {
        "key": "A",
        "text": "Tự viết script AWS CLI để tạo account qua Organizations",
        "explanation": "Thiếu các guardrails tự động, tốn công bảo trì và dễ sai sót cấu hình."
      },
      {
        "key": "B",
        "text": "AWS Control Tower kết hợp Account Factory",
        "explanation": "Chính xác! Cung cấp Landing Zone tự động hóa, SSO, Guardrails và Account Factory."
      },
      {
        "key": "C",
        "text": "AWS Systems Manager Automation",
        "explanation": "Chuyên về quản lý cấu hình hệ điều hành bên trong máy chủ, không quản lý Landing Zone."
      },
      {
        "key": "D",
        "text": "AWS CloudFormation StackSets đơn thuần",
        "explanation": "Chỉ triển khai template hạ tầng, không có governance framework hoàn chỉnh như Control Tower."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Control Tower với Account Factory",
    "explanation": "AWS Control Tower tự động thiết lập Landing Zone chuẩn gồm SSO (IAM Identity Center), logging tập trung vào S3, kiểm toán bằng AWS Config và cung cấp Account Factory để các nhóm tự tạo tài khoản mới tuân thủ 100% Guardrails của tổ chức.",
    "decisionRule": "Landing Zone đa tài khoản + Cấp phát tài khoản tự động chuẩn hóa ➔ AWS Control Tower."
  },
  {
    "id": "q18",
    "examCode": "SAP-C02",
    "domain": "Chiến lược phục hồi thảm họa chi phí thấp",
    "serviceId": "drs",
    "scenario": "Doanh nghiệp yêu cầu giải pháp Phục hồi thảm họa (DR) cho các máy chủ on-premises lên AWS với RPO dưới 1 giây và RTO dưới 15 phút, nhưng chi phí hạ tầng dự phòng thường trực trên AWS phải ở mức tối thiểu.",
    "question": "Chiến lược và dịch vụ DR nào đáp ứng hoàn hảo tiêu chí này?",
    "options": [
      {
        "key": "A",
        "text": "Multi-Site Active-Active chạy song song toàn bộ EC2 công suất lớn",
        "explanation": "Chi phí cực kỳ đắt đỏ vì phải trả tiền cho máy chủ lớn chạy 24/7."
      },
      {
        "key": "B",
        "text": "Chiến lược Pilot Light sử dụng AWS Elastic Disaster Recovery (DRS)",
        "explanation": "Chính xác! Chỉ sao chép ngầm vào Staging EBS giá rẻ, khi thảm họa mới dựng EC2 lớn."
      },
      {
        "key": "C",
        "text": "Chiến lược Backup & Restore bằng AWS Backup định kỳ mỗi 6 giờ",
        "explanation": "RPO lên tới 6 giờ, vi phạm yêu cầu RPO dưới 1 giây."
      },
      {
        "key": "D",
        "text": "Chiến lược Warm Standby với RDS Multi-AZ",
        "explanation": "Warm Standby chi phí cao hơn Pilot Light và không trực tiếp sao chép máy chủ vật lý On-Prem."
      }
    ],
    "correctKey": "B",
    "answer": "Chiến lược Pilot Light sử dụng AWS Elastic Disaster Recovery (DRS)",
    "explanation": "AWS DRS sao chép liên tục mức khối đĩa (block-level replication) vào một Staging Area gọn nhẹ trên AWS (chỉ gồm các ổ EBS giá rẻ và instance EC2 nhỏ làm replication server). Khi thảm họa xảy ra, DRS tự động kích hoạt máy chủ công suất lớn trong vòng vài phút.",
    "decisionRule": "DR từ On-Premises lên AWS + RPO cực thấp + Chi phí thường trực tối thiểu ➔ AWS DRS Pilot Light."
  },
  {
    "id": "q19",
    "examCode": "SAP-C02",
    "domain": "Triển khai ứng dụng quy mô lớn không gián đoạn",
    "serviceId": "route53",
    "scenario": "Triển khai phiên bản ứng dụng mới theo phương pháp Blue/Green Deployment cho hàng triệu người dùng toàn cầu mà không phát sinh bất kỳ giây downtime nào và có thể rollback tức thì nếu có lỗi.",
    "question": "Cơ chế chuyển hướng mạng nào là an toàn và nhanh nhất?",
    "options": [
      {
        "key": "A",
        "text": "Chuyển đổi bản ghi DNS Alias Record trên Route 53 (hoặc Swap CNAME)",
        "explanation": "Chính xác! Route 53 Alias Record đổi tức thì (TTL = 0 nội bộ), rollback trong 1 thao tác."
      },
      {
        "key": "B",
        "text": "Tắt toàn bộ EC2 phiên bản Blue và bật EC2 phiên bản Green",
        "explanation": "Dẫn đến thời gian gián đoạn (downtime) khi cụm mới khởi động."
      },
      {
        "key": "C",
        "text": "Gỡ target group cũ và gắn target group mới vào ALB",
        "explanation": "Dễ làm rớt các kết nối in-flight đang xử lý dở dang."
      },
      {
        "key": "D",
        "text": "Đổi địa chỉ IP công cộng Elastic IP giữa hai máy chủ",
        "explanation": "Không thể áp dụng khi ứng dụng chạy phía sau Load Balancer."
      }
    ],
    "correctKey": "A",
    "answer": "Chuyển đổi bản ghi DNS Alias Record trên Route 53",
    "explanation": "Bằng cách dựng môi trường Green hoàn chỉnh chạy song song với môi trường Blue, bạn kiểm thử tải toàn diện trên Green. Khi sẵn sàng, chỉ cần đổi Route 53 Alias Record trỏ sang ALB của Green (TTL = 0 trên Alias). Nếu có sự cố, đổi ngược lại Blue trong 1 thao tác.",
    "decisionRule": "Blue/Green Deployment + Rollback tức thì không downtime ➔ Đổi Route 53 Alias Record."
  },
  {
    "id": "q20",
    "examCode": "SAP-C02",
    "domain": "Lưu trữ đám mây lai (Hybrid Cloud Storage)",
    "serviceId": "storage-gateway",
    "scenario": "Doanh nghiệp on-premises có dung lượng ổ cứng NAS sắp cạn kiệt, cần giải pháp mở rộng dung lượng không giới hạn lên Amazon S3 qua giao thức chia sẻ tệp SMB/NFS quen thuộc cho nhân viên văn phòng mà vẫn duy trì tốc độ mở file nhanh với các file mới dùng.",
    "question": "Loại hình Storage Gateway nào phù hợp nhất?",
    "options": [
      {
        "key": "A",
        "text": "Amazon S3 File Gateway",
        "explanation": "Chính xác! Hỗ trợ SMB/NFS, duy trì Local Cache on-premises và đồng bộ ngầm vào S3."
      },
      {
        "key": "B",
        "text": "Volume Gateway chế độ Stored Volume",
        "explanation": "Lưu toàn bộ bản sao ở On-Premises, không giải quyết được việc cạn kiệt ổ cứng."
      },
      {
        "key": "C",
        "text": "Tape Gateway",
        "explanation": "Chuyên thay thế băng từ sao lưu (Virtual Tape Library), không chia sẻ file văn phòng."
      },
      {
        "key": "D",
        "text": "Amazon FSx File Gateway",
        "explanation": "Dành riêng cho FSx for Windows, chi phí cao hơn nhiều so với S3 File Gateway."
      }
    ],
    "correctKey": "A",
    "answer": "Amazon S3 File Gateway",
    "explanation": "S3 File Gateway triển khai dưới dạng máy ảo VM on-premises, cung cấp giao thức SMB/NFS cho người dùng cục bộ. Nó duy trì bộ nhớ đệm (Local Cache) cho các file thường xuyên truy cập và tự động đồng bộ bất đồng bộ dữ liệu vào S3 Bucket.",
    "decisionRule": "Mở rộng NAS On-Premises vào S3 + Giữ Local Cache truy cập nhanh ➔ S3 File Gateway."
  },
  {
    "id": "q21",
    "examCode": "SAP-C02",
    "domain": "Tối ưu độ trễ kiến trúc Serverless",
    "serviceId": "lambda",
    "scenario": "Ứng dụng ngân hàng số sử dụng kiến trúc Serverless Microservices. Trong các đợt mở cổng đăng ký mở thẻ tín dụng, hiện tượng Cold Start của các hàm Lambda viết bằng Java khiến cho thời gian phản hồi API bị trễ hơn 5 giây gây trải nghiệm tiêu cực.",
    "question": "Tính năng nào của AWS Lambda giải quyết triệt để 100% hiện tượng Cold Start này?",
    "options": [
      {
        "key": "A",
        "text": "Viết cronjob ping hàm Lambda mỗi 5 phút một lần",
        "explanation": "Chỉ giữ ấm được 1 instance, không đáp ứng được khi có hàng trăm request đồng thời."
      },
      {
        "key": "B",
        "text": "Bật AWS Lambda Provisioned Concurrency",
        "explanation": "Chính xác! Giữ ấm sẵn một lượng container thực thi, triệt tiêu hoàn toàn Cold Start."
      },
      {
        "key": "C",
        "text": "Tăng RAM của Lambda lên mức tối đa 10 GB",
        "explanation": "Tăng tốc độ khởi động nhưng không triệt tiêu được quá trình nạp JVM ban đầu."
      },
      {
        "key": "D",
        "text": "Chuyển toàn bộ code sang chạy trên EC2",
        "explanation": "Mất hoàn toàn lợi ích tự động co giãn và quản trị không máy chủ của Serverless."
      }
    ],
    "correctKey": "B",
    "answer": "Bật AWS Lambda Provisioned Concurrency",
    "explanation": "Provisioned Concurrency khởi tạo và giữ ấm sẵn sàng một số lượng môi trường thực thi Lambda được cấu hình trước (ví dụ 100 execution environments). Khi request ập đến, code thực thi ngay lập tức với độ trễ phản hồi tính bằng mili-giây, triệt tiêu hoàn toàn Cold Start.",
    "decisionRule": "Serverless Lambda + Triệt tiêu hiện tượng Cold Start ➔ Bật Provisioned Concurrency."
  },
  {
    "id": "q22",
    "examCode": "SAP-C02",
    "domain": "Di chuyển hệ thống lớn (Migration & Modernization)",
    "serviceId": "mgn",
    "scenario": "Doanh nghiệp cần chuyển dịch 500 máy chủ ảo VMware on-premises lên AWS với thời gian gián đoạn kinh doanh (cutover window) tối đa dưới 10 phút.",
    "question": "Chiến lược và công cụ nào tối ưu nhất?",
    "options": [
      {
        "key": "A",
        "text": "Sử dụng VM Import/Export xuất tệp OVA/VMDK tải lên S3",
        "explanation": "Quá trình upload file dung lượng hàng TB và convert tốn hàng ngày downtime."
      },
      {
        "key": "B",
        "text": "AWS Application Migration Service (MGN)",
        "explanation": "Chính xác! Sao chép mức khối đĩa liên tục ngầm, cutover window chỉ mất vài phút đổi DNS."
      },
      {
        "key": "C",
        "text": "Cài đặt lại toàn bộ hệ điều hành và ứng dụng thủ công trên EC2",
        "explanation": "Tốn hàng tháng làm việc và tiềm ẩn lỗi cấu hình ứng dụng cũ."
      },
      {
        "key": "D",
        "text": "Sử dụng AWS DataSync",
        "explanation": "DataSync chỉ đồng bộ dữ liệu tệp/object, không chuyển đổi hệ điều hành máy chủ."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Application Migration Service (MGN)",
    "explanation": "AWS MGN thực hiện sao chép khối liên tục (continuous block-level replication) ở chế độ ngầm. Khi đến lịch chuyển đổi (cutover window), chỉ cần chuyển hướng DNS và thời gian downtime chỉ mất vài phút.",
    "decisionRule": "Di chuyển hàng loạt Server lên AWS + Downtime tối thiểu (vài phút) ➔ AWS MGN."
  },
  {
    "id": "q23",
    "examCode": "SAP-C02",
    "domain": "Khả năng phục hồi thảm họa cao cấp nhất (Active-Active Multi-Region)",
    "serviceId": "route53",
    "scenario": "Hệ thống giao dịch chứng khoán toàn cầu yêu cầu độ sẵn sàng 99.999%. Nếu toàn bộ một Region của AWS gặp sự cố, hệ thống phải tự động chuyển hướng lưu lượng sang Region thứ hai trong vòng dưới 10 giây mà không cần con người can thiệp.",
    "question": "Thành phần điều phối nào của Route 53 được thiết kế cho bài toán này?",
    "options": [
      {
        "key": "A",
        "text": "Route 53 Geolocation Routing",
        "explanation": "Chỉ định tuyến theo quốc gia, không tự động chuyển vùng khi Region chết."
      },
      {
        "key": "B",
        "text": "Route 53 Application Recovery Controller (ARC)",
        "explanation": "Chính xác! Cung cấp Readiness Checks và Routing Controls failover tự động cực nhanh."
      },
      {
        "key": "C",
        "text": "Route 53 Health Checks kết hợp chu kỳ kiểm tra 60 giây",
        "explanation": "Chu kỳ 60s quá chậm, không đáp ứng được yêu cầu failover dưới 10 giây."
      },
      {
        "key": "D",
        "text": "Bật Elastic IP động qua Lambda",
        "explanation": "Elastic IP không thể chia sẻ hoặc chuyển đổi xuyên lục địa giữa hai Region khác nhau."
      }
    ],
    "correctKey": "B",
    "answer": "Route 53 Application Recovery Controller (ARC)",
    "explanation": "Route 53 ARC cung cấp hai tính năng mạnh mẽ: Readiness Checks liên tục kiểm tra năng lực dự phòng của vùng phụ và Routing Controls kích hoạt chuyển hướng lưu lượng đa vùng an toàn chỉ trong vài giây.",
    "decisionRule": "Đa vùng Active-Active + Failover tự động dưới 10 giây ➔ Route 53 Application Recovery Controller (ARC)."
  },
  {
    "id": "q24",
    "examCode": "SAP-C02",
    "domain": "Kiến trúc an ninh mạng Hub-and-Spoke",
    "serviceId": "transit-gateway",
    "scenario": "Tập đoàn có 50 VPCs. Đội ngũ an ninh yêu cầu tất cả lưu lượng đi ra ngoài Internet (Egress Traffic) và lưu lượng giao tiếp giữa các VPC bắt buộc phải đi qua một cụm Tường lửa kiểm tra gói tin sâu (Deep Packet Inspection IDS/IPS) tập trung.",
    "question": "Mô hình thiết kế mạng nào đáp ứng chuẩn bảo mật này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo kết nối VPC Peering dạng lưới (Full Mesh) giữa 50 VPCs",
        "explanation": "Quá phức tạp (1225 kết nối), không có điểm kiểm tra an ninh mạng tập trung."
      },
      {
        "key": "B",
        "text": "Hub-and-Spoke với AWS Transit Gateway và Inspection VPC gắn AWS Network Firewall",
        "explanation": "Chính xác! TGW định tuyến toàn bộ lưu lượng qua một Inspection VPC tập trung."
      },
      {
        "key": "C",
        "text": "Cài đặt tường lửa riêng lẻ trên từng VPC con",
        "explanation": "Chi phí nhân bản thiết bị quá đắt và quản trị chính sách phân tán thiếu an toàn."
      },
      {
        "key": "D",
        "text": "Sử dụng NAT Gateway trong mỗi VPC",
        "explanation": "NAT Gateway chỉ dịch địa chỉ IP, không có khả năng Deep Packet Inspection hay IPS."
      }
    ],
    "correctKey": "B",
    "answer": "Mô hình Hub-and-Spoke với Transit Gateway kết hợp Inspection VPC",
    "explanation": "AWS Transit Gateway đóng vai trò trung tâm hình sao (Hub). Mọi lưu lượng giữa các VPC và ra Internet đều được định tuyến đi qua một Inspection VPC trung tâm có trang bị AWS Network Firewall để kiểm tra gói tin sâu trước khi cho phép đi tiếp.",
    "decisionRule": "Hàng chục VPC + Kiểm tra an ninh tường lửa tập trung ➔ Transit Gateway + Inspection VPC."
  },
  {
    "id": "q25",
    "examCode": "SAP-C02",
    "domain": "Kết nối mạng lai băng thông cao và dự phòng",
    "serviceId": "direct-connect",
    "scenario": "Trung tâm dữ liệu ngân hàng kết nối lên AWS qua đường cáp vật lý AWS Direct Connect 10 Gbps. Ngân hàng yêu cầu thiết lập giải pháp dự phòng kết nối (failover) với chi phí thấp nhất nếu đường cáp ngầm bị đứt.",
    "question": "Phương án kết nối dự phòng kinh tế nhất theo khuyến nghị của AWS là gì?",
    "options": [
      {
        "key": "A",
        "text": "Thuê thêm một đường Direct Connect thứ hai từ một nhà mạng viễn thông khác",
        "explanation": "Độ tin cậy cao nhất nhưng chi phí đường truyền vật lý chuyên dụng rất đắt."
      },
      {
        "key": "B",
        "text": "Thiết lập kết nối Site-to-Site VPN có hỗ trợ giao thức BGP qua mạng Internet công cộng",
        "explanation": "Chính xác! VPN làm backup cho Direct Connect là giải pháp tối ưu chi phí số 1."
      },
      {
        "key": "C",
        "text": "Sử dụng vệ tinh AWS Ground Station làm dự phòng",
        "explanation": "Ground Station chỉ dành cho liên lạc vệ tinh không gian, không dùng cho mạng doanh nghiệp."
      },
      {
        "key": "D",
        "text": "Thiết lập mạng 5G riêng AWS Private 5G",
        "explanation": "Chỉ phủ sóng trong khuôn viên nhà máy cục bộ, không nối được về Data Center."
      }
    ],
    "correctKey": "B",
    "answer": "Thiết lập kết nối dự phòng IPsec VPN qua Internet (Direct Connect with VPN Backup)",
    "explanation": "Để tối ưu chi phí dự phòng cho Direct Connect, giải pháp chuẩn mực là cấu hình đường hầm IPsec Site-to-Site VPN qua Internet công cộng kết hợp định tuyến động BGP với AS-Path Prepending để ưu tiên Direct Connect và tự động nhảy sang VPN khi đứt cáp.",
    "decisionRule": "Dự phòng cho Direct Connect với chi phí thấp nhất ➔ AWS Site-to-Site VPN Backup (BGP)."
  },
  {
    "id": "q26",
    "examCode": "SAP-C02",
    "domain": "Hiện đại hóa giao thức truyền tệp truyền thống",
    "serviceId": "transfer-family",
    "scenario": "Hàng trăm đối tác kinh doanh truyền dữ liệu hóa đơn hàng ngày vào hệ thống qua giao thức SFTP/FTPS truyền thống. Doanh nghiệp muốn hiện đại hóa để dữ liệu lưu trực tiếp vào S3 Data Lake mà không phải duy trì máy chủ SFTP cũ.",
    "question": "Dịch vụ được quản lý nào của AWS hỗ trợ chuyển đổi mà không cần đối tác thay đổi quy trình?",
    "options": [
      {
        "key": "A",
        "text": "AWS DataSync",
        "explanation": "Dùng cho tác vụ đồng bộ theo lịch trình nội bộ, không cung cấp SFTP endpoint cho đối tác gửi."
      },
      {
        "key": "B",
        "text": "AWS Transfer Family (SFTP/FTPS/FTP)",
        "explanation": "Chính xác! Đối tác giữ nguyên SFTP client, dữ liệu nạp thẳng vào S3 hoặc EFS."
      },
      {
        "key": "C",
        "text": "Amazon API Gateway",
        "explanation": "Sử dụng giao thức HTTP/REST, đối tác bắt buộc phải sửa đổi code kết nối."
      },
      {
        "key": "D",
        "text": "Amazon Kinesis Data Firehose",
        "explanation": "Chuyên nạp luồng sự kiện streaming qua SDK/API, không hỗ trợ giao thức SFTP."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Transfer Family",
    "explanation": "AWS Transfer Family cung cấp các endpoint SFTP, FTPS và FTP được quản lý hoàn toàn (serverless). Đối tác tiếp tục sử dụng các công cụ SFTP hiện tại của họ trong khi dữ liệu tự động lưu trực tiếp vào S3 Bucket.",
    "decisionRule": "Đối tác dùng SFTP/FTPS truyền thống + Lưu thẳng vào S3 ➔ AWS Transfer Family."
  },
  {
    "id": "q27",
    "examCode": "SAP-C02",
    "domain": "Bảo mật ủy quyền truy cập chéo tài khoản",
    "serviceId": "iam",
    "scenario": "Một công ty SaaS cần quyền truy cập vào tài nguyên trong tài khoản AWS của khách hàng để thu thập dữ liệu giám sát. Cần ngăn chặn triệt để lỗ hổng bảo mật tấn công \"Confused Deputy\".",
    "question": "Biện pháp bắt buộc khi cấu hình IAM Role Assumption giữa hai tài khoản là gì?",
    "options": [
      {
        "key": "A",
        "text": "Chia sẻ Access Key và Secret Access Key của tài khoản khách hàng cho SaaS",
        "explanation": "Vi phạm nghiêm trọng nguyên tắc bảo mật thông tin xác thực lâu dài (Long-term credentials)."
      },
      {
        "key": "B",
        "text": "Yêu cầu kiểm tra giá trị External ID bí mật duy nhất trong Trust Policy của IAM Role",
        "explanation": "Chính xác! External ID là giải pháp chuẩn mực ngăn chặn cuộc tấn công Confused Deputy."
      },
      {
        "key": "C",
        "text": "Chỉ cho phép kết nối thông qua địa chỉ IP tĩnh của công ty SaaS",
        "explanation": "IP có thể bị giả mạo hoặc thay đổi khi nhà cung cấp SaaS mở rộng quy mô."
      },
      {
        "key": "D",
        "text": "Bật tính năng xác thực hai yếu tố MFA bắt buộc trên tài khoản khách hàng",
        "explanation": "MFA chỉ áp dụng cho người dùng tương tác, không khả thi cho API tự động giữa các hệ thống."
      }
    ],
    "correctKey": "B",
    "answer": "Sử dụng External ID trong Trust Policy của IAM Role",
    "explanation": "Khi cấp quyền cho bên thứ ba (SaaS) giả định (assume) IAM Role trong tài khoản của bạn, việc bắt buộc truyền tham số `sts:ExternalId` trong Trust Policy là biện pháp kỹ thuật được AWS chỉ định để ngăn chặn lỗ hổng Confused Deputy.",
    "decisionRule": "Cấp quyền chéo cho bên thứ 3 (SaaS) + Chống Confused Deputy ➔ Yêu cầu External ID."
  },
  {
    "id": "q28",
    "examCode": "SAP-C02",
    "domain": "Chiến lược sao lưu và chống Ransomware tập trung",
    "serviceId": "backup",
    "scenario": "Tập đoàn tài chính yêu cầu chính sách sao lưu tập trung toàn bộ dữ liệu EBS, RDS, DynamoDB từ 100 tài khoản con vào một kho lưu trữ tập trung, đồng thời bảo vệ các bản backup không thể bị mã hóa hoặc xóa bởi tin tặc ransomware.",
    "question": "Giải pháp kiến trúc toàn diện nào đáp ứng đầy đủ tiêu chí này?",
    "options": [
      {
        "key": "A",
        "text": "Tự viết script Lambda snapshot định kỳ và đẩy vào S3",
        "explanation": "Khó quản lý tập trung 100 tài khoản và rủi ro bị xóa snapshot nếu tài khoản con bị hack."
      },
      {
        "key": "B",
        "text": "AWS Backup với Cross-Account Backup và AWS Backup Vault Lock",
        "explanation": "Chính xác! Vault Lock WORM ngăn chặn mọi hành vi xóa backup sớm kể cả khi tài khoản bị chiếm."
      },
      {
        "key": "C",
        "text": "Sử dụng S3 Versioning cho các máy chủ EC2",
        "explanation": "S3 Versioning không trực tiếp bảo vệ snapshot của EBS hay RDS."
      },
      {
        "key": "D",
        "text": "Sao chép dữ liệu định kỳ sang băng từ của nhà mạng viễn thông",
        "explanation": "Thời gian phục hồi quá chậm và tốn chi phí vận hành vật lý."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Backup với Cross-Account Backup và Vault Lock",
    "explanation": "AWS Backup tích hợp với AWS Organizations cho phép tự động sao chép bản sao lưu chéo sang một tài khoản Backup chuyên biệt, kết hợp với Vault Lock (chế độ WORM) đảm bảo không ai có thể xóa bản backup trước thời hạn.",
    "decisionRule": "Sao lưu đa tài khoản tập trung + Chống Ransomware xóa bản sao lưu ➔ AWS Backup Vault Lock."
  },
  {
    "id": "q29",
    "examCode": "SAP-C02",
    "domain": "Tự động mở rộng cụm Kubernetes tối ưu chi phí",
    "serviceId": "eks",
    "scenario": "Hệ thống chạy trên Amazon EKS gồm hàng trăm microservices. Bộ điều phối Kubernetes Cluster Autoscaler truyền thống mất hơn 3 phút để bổ sung node mới khi có đột biến tải, gây nghẽn dịch vụ.",
    "question": "Giải pháp cấp phát node hiện đại nào được AWS khuyến nghị thay thế để bổ sung node trong dưới 30 giây?",
    "options": [
      {
        "key": "A",
        "text": "Tăng kích thước tối thiểu của Auto Scaling Group lên gấp đôi",
        "explanation": "Lãng phí chi phí rất lớn khi hệ thống chạy trong giờ thấp điểm."
      },
      {
        "key": "B",
        "text": "Triển khai Karpenter tự động cấp phát EC2 instance linh hoạt theo Pod",
        "explanation": "Chính xác! Karpenter loại bỏ độ trễ của ASG, khởi tạo node phù hợp chỉ trong ~30 giây."
      },
      {
        "key": "C",
        "text": "Chuyển toàn bộ ứng dụng sang AWS Fargate",
        "explanation": "Fargate không hỗ trợ một số daemonsets đặc thù và chi phí cao hơn ở quy mô lớn."
      },
      {
        "key": "D",
        "text": "Bật Elastic Fabric Adapter (EFA) trên cụm EKS",
        "explanation": "EFA chỉ tối ưu hóa băng thông mạng HPC/AI, không liên quan đến tốc độ mở rộng node."
      }
    ],
    "correctKey": "B",
    "answer": "Karpenter (Kubernetes Node Autoscaler)",
    "explanation": "Karpenter là bộ tự động mở rộng node mã nguồn mở thế hệ mới cho Kubernetes do AWS phát triển. Nó quan sát trực tiếp hàng đợi Pod chưa được lập lịch và gọi thẳng API EC2 để tạo node đúng kích cỡ trong chưa đầy 30 giây.",
    "decisionRule": "EKS Auto Scaling node siêu nhanh dưới 30 giây + Tối ưu kích cỡ instance ➔ Chọn Karpenter."
  },
  {
    "id": "q30",
    "examCode": "SAP-C02",
    "domain": "Định tuyến sự kiện toàn cầu chịu lỗi",
    "serviceId": "eventbridge",
    "scenario": "Kiến trúc hướng sự kiện cần đảm bảo nếu Amazon EventBridge ở Region chính (us-east-1) bị gián đoạn, các sự kiện phát sinh từ đối tác thanh toán SaaS phải tự động được định tuyến sang Region phụ mà không làm mất thông điệp.",
    "question": "Tính năng nào của Amazon EventBridge giải quyết bài toán dự phòng đa vùng này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo hai Event Bus độc lập và yêu cầu đối tác gửi song song vào cả hai Region",
        "explanation": "Gây trùng lặp đơn hàng gấp đôi và gây khó khăn cho đối tác."
      },
      {
        "key": "B",
        "text": "Sử dụng Amazon EventBridge Global Endpoints với tự động failover",
        "explanation": "Chính xác! Global Endpoints cung cấp 1 DNS duy nhất, tự động chuyển vùng khi có sự cố."
      },
      {
        "key": "C",
        "text": "Đặt Network Load Balancer phía trước EventBridge",
        "explanation": "NLB không thể làm proxy trực tiếp phía trước dịch vụ serverless EventBridge API."
      },
      {
        "key": "D",
        "text": "Định kỳ sao chép sự kiện bằng AWS Lambda qua mạng WAN",
        "explanation": "Chỉ sao chép sau khi sự kiện đã vào bus, nếu bus chính sập thì sự kiện mới bị từ chối."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon EventBridge Global Endpoints",
    "explanation": "EventBridge Global Endpoints cung cấp một điểm cuối DNS toàn cầu duy nhất được giám sát bởi CloudWatch Alarms và Route 53 Health Checks. Khi Region chính có sự cố, lưu lượng sự kiện tự động chuyển sang Region phụ không gián đoạn.",
    "decisionRule": "EventBridge đa vùng + Failover tự động không mất sự kiện ➔ EventBridge Global Endpoints."
  },
  {
    "id": "q31",
    "examCode": "SCS-C02",
    "domain": "Bảo mật mật mã học & Quản lý khóa (KMS)",
    "serviceId": "kms",
    "scenario": "Quy chuẩn an toàn thông tin PCI-DSS bắt buộc các khóa mã hóa bảo vệ thông tin thẻ tín dụng phải được thay thế định kỳ hàng năm (Key Rotation) mà không làm hỏng khả năng giải mã các dữ liệu cũ đã lưu.",
    "question": "Cấu hình nào trên AWS KMS đáp ứng yêu cầu tự động này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo khóa KMS mới mỗi năm và viết script giải mã rồi mã hóa lại toàn bộ CSDL",
        "explanation": "Gây tải cực lớn lên hệ thống và tiềm ẩn nguy cơ gián đoạn dịch vụ."
      },
      {
        "key": "B",
        "text": "Bật tính năng Automatic Key Rotation trên Customer Managed Key (CMK)",
        "explanation": "Chính xác! KMS tự động tạo phiên bản khóa mới mỗi năm và giữ lại phiên bản cũ để giải mã."
      },
      {
        "key": "C",
        "text": "Sử dụng AWS Managed Key mặc định (aws/s3)",
        "explanation": "AWS Managed Key tự xoay vòng nhưng không cung cấp quyền kiểm soát chính sách theo chuẩn kiểm toán."
      },
      {
        "key": "D",
        "text": "Nhập khóa từ trung tâm dữ liệu on-premises (Imported Key Material)",
        "explanation": "Imported Key không hỗ trợ tính năng Automatic Key Rotation tự động trên AWS."
      }
    ],
    "correctKey": "B",
    "answer": "Bật Automatic Key Rotation trên KMS Customer Managed Key (CMK)",
    "explanation": "Khi bật Automatic Key Rotation trên KMS CMK, AWS KMS sẽ tự động tạo một phiên bản khóa mật mã mới sau mỗi 365 ngày. ID khóa (Key ID/ARN) không đổi, dữ liệu mới mã hóa bằng khóa mới và dữ liệu cũ tự động dùng khóa cũ giải mã.",
    "decisionRule": "KMS tự động xoay khóa hàng năm không làm hỏng dữ liệu cũ ➔ Bật Automatic Key Rotation."
  },
  {
    "id": "q32",
    "examCode": "SCS-C02",
    "domain": "Truy cập chéo tài khoản an toàn",
    "serviceId": "secrets-manager",
    "scenario": "Ứng dụng chạy trên tài khoản AWS A cần đọc chuỗi kết nối CSDL được lưu trữ trong AWS Secrets Manager tại tài khoản AWS B. Cả hai tài khoản đều thuộc cùng tổ chức AWS Organizations.",
    "question": "Các điều kiện cần thiết để cấp quyền truy cập chéo tài khoản an toàn là gì?",
    "options": [
      {
        "key": "A",
        "text": "Chỉ cần cấp quyền `secretsmanager:GetSecretValue` cho IAM Role tại tài khoản A",
        "explanation": "Tài khoản B là nơi chứa tài nguyên nên bắt buộc phải có Resource-based Policy cho phép."
      },
      {
        "key": "B",
        "text": "Cấp quyền trong Secret Resource Policy, IAM Role tài khoản A, và KMS Key Policy cho phép tài khoản A giải mã",
        "explanation": "Chính xác! Truy cập chéo cần cả 3 tầng: Resource Policy + IAM Identity Policy + KMS Key Policy."
      },
      {
        "key": "C",
        "text": "Tạo tài khoản IAM User trong tài khoản B và truyền Access Key sang tài khoản A",
        "explanation": "Vi phạm bảo mật chia sẻ khóa lâu dài (Long-term credentials)."
      },
      {
        "key": "D",
        "text": "Bật tính năng Secrets Manager Replication sang tài khoản A",
        "explanation": "Replication chỉ hỗ trợ đa Region trong cùng 1 account, không hỗ trợ cross-account tự động."
      }
    ],
    "correctKey": "B",
    "answer": "Secret Resource Policy + IAM Role Policy + KMS Key Policy cho phép giải mã",
    "explanation": "Truy cập chéo tài khoản vào Secrets Manager yêu cầu: 1) Secret Resource Policy cho phép Principal từ tài khoản A; 2) IAM Role tại tài khoản A có quyền `secretsmanager:GetSecretValue`; 3) Khóa KMS dùng mã hóa secret phải là Customer Managed Key (CMK) và Key Policy cho phép tài khoản A quyền `kms:Decrypt`.",
    "decisionRule": "Truy cập chéo tài khoản Secrets Manager ➔ Resource Policy + Identity Policy + KMS Key Policy."
  },
  {
    "id": "q33",
    "examCode": "SCS-C02",
    "domain": "Phòng chống tấn công ứng dụng Web",
    "serviceId": "waf",
    "scenario": "Trang web đăng nhập của ngân hàng liên tục bị hacker dùng tool tự động dò mật khẩu (Credential Stuffing/Brute-force) từ hàng ngàn địa chỉ IP khác nhau, gửi hơn 200 request/phút vào đường dẫn `/api/login`.",
    "question": "Quy tắc AWS WAF nào ngăn chặn triệt để cuộc tấn công này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo quy tắc IP Set chặn thủ công các địa chỉ IP vi phạm",
        "explanation": "Không khả thi vì hacker dùng botnet hàng ngàn IP biến đổi liên tục."
      },
      {
        "key": "B",
        "text": "Tạo WAF Rate-based Rule lọc theo đường dẫn URI \"/api/login\" với giới hạn số request trên mỗi IP",
        "explanation": "Chính xác! Rate-based Rule tự động chặn tạm thời bất kỳ IP nào vượt quá ngưỡng cho phép."
      },
      {
        "key": "C",
        "text": "Bật AWS Shield Standard",
        "explanation": "Shield Standard chỉ bảo vệ tầng mạng Layer 3/4 (SYN flood, UDP reflection)."
      },
      {
        "key": "D",
        "text": "Chuyển đường dẫn đăng nhập sang một tên miền khác",
        "explanation": "Chỉ là giải pháp tạm thời, hacker sẽ nhanh chóng quét ra đường dẫn mới."
      }
    ],
    "correctKey": "B",
    "answer": "Tạo WAF Rate-based Rule cho đường dẫn URI /api/login",
    "explanation": "Rate-based Rule trong AWS WAF theo dõi số lượng yêu cầu đến từ mỗi địa chỉ IP trong khung thời gian 5 phút. Khi một IP gửi vượt ngưỡng cấu hình (ví dụ 100 requests) tới URI /api/login, WAF tự động chặn tạm thời IP đó bằng mã phản hồi 403 Forbidden.",
    "decisionRule": "Chống tấn công dò mật khẩu tần suất cao trên 1 URI ➔ AWS WAF Rate-based Rule."
  },
  {
    "id": "q34",
    "examCode": "SCS-C02",
    "domain": "Phát hiện mối đe dọa thông minh",
    "serviceId": "guardduty",
    "scenario": "Một máy chủ EC2 bị nhiễm mã độc và bắt đầu kết nối tới các máy chủ điều khiển botnet (C&C Server) và đào tiền điện tử ngầm. Dịch vụ nào phát hiện hành vi bất thường này tự động mà không cần cài agent trên máy chủ?",
    "question": "Dịch vụ bảo mật AWS nào phát hiện mối đe dọa này?",
    "options": [
      {
        "key": "A",
        "text": "Amazon Inspector",
        "explanation": "Inspector chuyên quét lỗ hổng phần mềm CVE và bản vá, không phân tích luồng mạng C&C thời gian thực."
      },
      {
        "key": "B",
        "text": "Amazon GuardDuty",
        "explanation": "Chính xác! GuardDuty phân tích VPC Flow Logs, DNS Logs và CloudTrail để phát hiện mã độc/đào coin."
      },
      {
        "key": "C",
        "text": "AWS CloudTrail",
        "explanation": "CloudTrail chỉ ghi lại nhật ký gọi API, không có thuật toán Machine Learning phát hiện mối đe dọa."
      },
      {
        "key": "D",
        "text": "Amazon CloudWatch Logs",
        "explanation": "Chỉ lưu trữ log thô, không tự động đối chiếu cơ sở dữ liệu tình báo mối đe dọa (Threat Intelligence)."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon GuardDuty",
    "explanation": "Amazon GuardDuty sử dụng Machine Learning và Threat Intelligence để phân tích luồng nhật ký VPC Flow Logs, DNS Query Logs và CloudTrail Management Events. Nó phát hiện tức thì các dấu hiệu máy chủ EC2 đào tiền điện tử hoặc giao tiếp với máy chủ độc hại mà hoàn toàn không cần cài agent.",
    "decisionRule": "Phát hiện mã độc/đào coin/kết nối C&C không cần agent ➔ Amazon GuardDuty."
  },
  {
    "id": "q35",
    "examCode": "SCS-C02",
    "domain": "Bảo vệ dữ liệu nhạy cảm và thông tin cá nhân (PII)",
    "serviceId": "macie",
    "scenario": "Tập đoàn tài chính có hàng trăm S3 Bucket chứa tài liệu không có cấu trúc. Ban kiểm toán yêu cầu quét toàn diện để tìm kiếm và lập danh mục các tệp có chứa số thẻ tín dụng, số căn cước công dân (PII) bị vô tình lộ lọt.",
    "question": "Dịch vụ nào của AWS thực hiện việc phân loại và phát hiện PII trên S3 tự động?",
    "options": [
      {
        "key": "A",
        "text": "Amazon Rekognition",
        "explanation": "Chuyên về phân tích hình ảnh và video thị giác máy tính."
      },
      {
        "key": "B",
        "text": "Amazon Macie",
        "explanation": "Chính xác! Macie sử dụng ML quét S3 buckets để phát hiện và cảnh báo thông tin nhạy cảm PII."
      },
      {
        "key": "C",
        "text": "AWS Config",
        "explanation": "Config chỉ kiểm tra cấu hình tài nguyên (như bucket có public không), không đọc nội dung tệp."
      },
      {
        "key": "D",
        "text": "Amazon Comprehend Medical",
        "explanation": "Dành riêng cho trích xuất thông tin y tế, không quét tự động trên quy mô toàn bộ S3 bucket."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Macie",
    "explanation": "Amazon Macie là dịch vụ bảo mật dữ liệu được hỗ trợ bởi Machine Learning, tự động phát hiện, phân loại và bảo vệ dữ liệu nhạy cảm (như thông tin định danh cá nhân PII, số thẻ tín dụng, API keys) được lưu trữ trên Amazon S3.",
    "decisionRule": "Quét tự động phát hiện thông tin nhạy cảm PII trên S3 ➔ Amazon Macie."
  },
  {
    "id": "q36",
    "examCode": "SCS-C02",
    "domain": "Quản lý trạng thái an ninh tập trung",
    "serviceId": "security-hub",
    "scenario": "Đội ngũ bảo mật muốn có một bảng điều khiển duy nhất (Single Pane of Glass) tổng hợp cảnh báo từ GuardDuty, Inspector, Macie, đồng thời liên tục đánh giá mức độ tuân thủ theo tiêu chuẩn CIS AWS Foundations Benchmark.",
    "question": "Dịch vụ trung tâm nào giải quyết bài toán này?",
    "options": [
      {
        "key": "A",
        "text": "AWS Systems Manager",
        "explanation": "Quản lý máy chủ và vá lỗi, không phải trung tâm tổng hợp cảnh báo an ninh."
      },
      {
        "key": "B",
        "text": "AWS Security Hub",
        "explanation": "Chính xác! Tổng hợp phát hiện an ninh đa dịch vụ và đánh giá tuân thủ chuẩn CIS/PCI."
      },
      {
        "key": "C",
        "text": "Amazon CloudWatch Dashboard",
        "explanation": "Dashboard hiển thị đồ thị số liệu, không có các quy tắc kiểm tra tiêu chuẩn bảo mật chuyên sâu."
      },
      {
        "key": "D",
        "text": "AWS Artifact",
        "explanation": "Cổng thông tin tải các báo cáo tuân thủ của AWS, không kiểm tra tài nguyên của khách hàng."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Security Hub",
    "explanation": "AWS Security Hub cung cấp cái nhìn toàn diện về tình trạng bảo mật, tổng hợp và chuẩn hóa các cảnh báo (Findings) từ nhiều dịch vụ bảo mật của AWS và đối tác, đồng thời tự động kiểm tra tuân thủ các tiêu chuẩn như CIS Benchmark, PCI-DSS.",
    "decisionRule": "Bảng điều khiển bảo mật trung tâm + Đánh giá tuân thủ chuẩn CIS ➔ AWS Security Hub."
  },
  {
    "id": "q37",
    "examCode": "SCS-C02",
    "domain": "Bảo vệ chống tấn công từ chối dịch vụ phân tán (DDoS)",
    "serviceId": "shield",
    "scenario": "Website thương mại điện tử bị tấn công DDoS quy mô lớn khiến hóa đơn CloudFront và Route 53 tăng vọt hàng chục nghìn USD do lượng request tấn công khổng lồ. Dịch vụ nào bảo vệ chống DDoS chuyên sâu và hỗ trợ hoàn lại chi phí tăng đột biến do tấn công?",
    "question": "Gói bảo vệ DDoS nào của AWS cung cấp tính năng Cost Protection này?",
    "options": [
      {
        "key": "A",
        "text": "AWS Shield Standard",
        "explanation": "Miễn phí, chỉ chống các cuộc tấn công phổ biến tầng 3/4, không có đội ngũ hỗ trợ và không có bảo vệ chi phí."
      },
      {
        "key": "B",
        "text": "AWS Shield Advanced",
        "explanation": "Chính xác! Có đội ngũ Shield Response Team 24/7 và chính sách bồi hoàn chi phí phát sinh do DDoS (Cost Protection)."
      },
      {
        "key": "C",
        "text": "AWS WAF với Managed Rules",
        "explanation": "WAF chặn request nhưng không có chính sách bồi hoàn chi phí sốc hóa đơn do DDoS."
      },
      {
        "key": "D",
        "text": "Amazon CloudWatch Anomaly Detection",
        "explanation": "Chỉ cảnh báo số liệu bất thường, không có chức năng giảm thiểu DDoS."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Shield Advanced",
    "explanation": "AWS Shield Advanced cung cấp bảo vệ chống DDoS chuyên sâu cho Route 53, CloudFront, ALB và EIP. Nó bao gồm quyền tiếp cận Đội ngũ Ứng phó Shield (SRT) 24/7 và chính sách \"DDoS Cost Protection\" bảo vệ khách hàng khỏi việc phát sinh sốc chi phí do cuộc tấn công gây ra.",
    "decisionRule": "Bảo vệ DDoS nâng cao + Hỗ trợ bồi hoàn chi phí đột biến (Cost Protection) ➔ AWS Shield Advanced."
  },
  {
    "id": "q38",
    "examCode": "SCS-C02",
    "domain": "Phân quyền IAM và ranh giới đặc quyền",
    "serviceId": "iam",
    "scenario": "Doanh nghiệp muốn cho phép các kỹ sư DevOps tự do tạo các IAM Role cho hàm Lambda của họ, nhưng phải đảm bảo các kỹ sư không thể tự cấp cho mình hoặc Lambda quyền Administrator (leo thang đặc quyền Privilege Escalation).",
    "question": "Cơ chế nào của IAM kiểm soát mức quyền tối đa mà một người có thể tự cấp?",
    "options": [
      {
        "key": "A",
        "text": "Service Control Policy (SCP)",
        "explanation": "SCP chỉ áp dụng ở cấp độ tài khoản/OU, không kiểm soát trực tiếp từng user/role nội bộ trong 1 tài khoản."
      },
      {
        "key": "B",
        "text": "IAM Permissions Boundary (Ranh giới quyền hạn)",
        "explanation": "Chính xác! Đặt mức trần quyền hạn tối đa mà một Identity có thể sở hữu, ngăn chặn leo thang quyền."
      },
      {
        "key": "C",
        "text": "IAM Resource Policy",
        "explanation": "Gắn trên tài nguyên (như S3, SQS), không kiểm soát hành vi tạo role của người dùng."
      },
      {
        "key": "D",
        "text": "AWS Systems Manager Session Manager",
        "explanation": "Dùng để truy cập terminal máy chủ, không liên quan đến phân quyền IAM."
      }
    ],
    "correctKey": "B",
    "answer": "IAM Permissions Boundary",
    "explanation": "Permissions Boundary là một chính sách nâng cao dùng để thiết lập mức quyền tối đa (maximum permissions) mà một IAM entity có thể có. Dù kỹ sư có gán quyền `AdministratorAccess` cho một role, quyền thực tế chỉ là giao điểm (intersection) giữa Policy và Permissions Boundary.",
    "decisionRule": "Cho phép tự tạo IAM Role nhưng cấm leo thang đặc quyền ➔ Áp dụng IAM Permissions Boundary."
  },
  {
    "id": "q39",
    "examCode": "ANS-C01",
    "domain": "Kiến trúc mạng doanh nghiệp nâng cao (Advanced Network Architectures)",
    "serviceId": "transit-gateway",
    "scenario": "Một tổ chức lớn có nhiều VPC Production và nhiều VPC Development cùng kết nối vào một AWS Transit Gateway. Yêu cầu các VPC Production có thể giao tiếp với nhau, các VPC Development có thể giao tiếp với nhau, nhưng tuyệt đối nghiêm cấm Production giao tiếp với Development.",
    "question": "Giải pháp cấu hình Transit Gateway nào đáp ứng chuẩn cô lập mạng này?",
    "options": [
      {
        "key": "A",
        "text": "Sử dụng chung một Route Table mặc định và cấu hình Security Group trên từng EC2",
        "explanation": "Rất khó quản lý, vi phạm nguyên tắc cô lập ở tầng mạng (Network Layer Segmentation)."
      },
      {
        "key": "B",
        "text": "Tạo hai Route Table riêng biệt trên Transit Gateway (Prod Route Table & Dev Route Table)",
        "explanation": "Chính xác! Phân tách bảng định tuyến trên TGW đảm bảo gói tin không thể định tuyến chéo."
      },
      {
        "key": "C",
        "text": "Mua thêm một đường truyền Direct Connect thứ hai",
        "explanation": "Không liên quan đến việc phân tách định tuyến nội bộ giữa các VPC trên AWS."
      },
      {
        "key": "D",
        "text": "Tạo VPC Peering giữa các VPC cùng loại",
        "explanation": "Peering không tận dụng được kiến trúc hình sao của Transit Gateway."
      }
    ],
    "correctKey": "B",
    "answer": "Tạo nhiều Route Table riêng biệt trên Transit Gateway (Network Segmentation)",
    "explanation": "AWS Transit Gateway hỗ trợ nhiều Route Table độc lập. Bằng cách liên kết (associate) các VPC Production với Prod Route Table và các VPC Dev với Dev Route Table mà không truyền bá (propagate) route chéo, hai môi trường hoàn toàn bị cô lập ở mức mạng.",
    "decisionRule": "Phân tách mạng trên Transit Gateway (Prod vs Dev không nhìn thấy nhau) ➔ Tạo nhiều TGW Route Tables riêng."
  },
  {
    "id": "q40",
    "examCode": "ANS-C01",
    "domain": "Phân giải tên miền mạng lai (Hybrid DNS)",
    "serviceId": "route53",
    "scenario": "Các máy chủ on-premises trong trung tâm dữ liệu doanh nghiệp cần phân giải tên miền nội bộ của các dịch vụ AWS trong Private Hosted Zone (ví dụ: `corp.internal`).",
    "question": "Thành phần DNS nào của AWS Route 53 giải quyết kết nối này?",
    "options": [
      {
        "key": "A",
        "text": "Route 53 Resolver Outbound Endpoint",
        "explanation": "Outbound Endpoint dùng cho chiều ngược lại (EC2 trong VPC hỏi tên miền DNS on-premises)."
      },
      {
        "key": "B",
        "text": "Route 53 Resolver Inbound Endpoint",
        "explanation": "Chính xác! Tạo IP nội bộ trong Subnet để máy chủ on-premises forward truy vấn DNS vào."
      },
      {
        "key": "C",
        "text": "Tạo bản ghi DNS công khai (Public Hosted Zone)",
        "explanation": "Làm lộ cấu trúc mạng nội bộ ra Internet công cộng, vi phạm an ninh thông tin."
      },
      {
        "key": "D",
        "text": "Cài đặt BIND DNS server trên máy chủ EC2",
        "explanation": "Tốn công vận hành và không phải là giải pháp Native Serverless của AWS."
      }
    ],
    "correctKey": "B",
    "answer": "Route 53 Resolver Inbound Endpoint",
    "explanation": "Route 53 Resolver Inbound Endpoint tạo các card mạng ENI gắn IP nội bộ trong Subnet của VPC. Máy chủ DNS on-premises chỉ cần cấu hình DNS Forwarder trỏ các truy vấn tên miền `corp.internal` về các IP Inbound Endpoint này qua Direct Connect hoặc VPN.",
    "decisionRule": "On-premises cần phân giải tên miền Private DNS trên AWS ➔ Route 53 Resolver Inbound Endpoint."
  },
  {
    "id": "q41",
    "examCode": "ANS-C01",
    "domain": "Kết nối dịch vụ riêng tư không lộ IP",
    "serviceId": "privatelink",
    "scenario": "Một công ty SaaS cung cấp dịch vụ phân tích dữ liệu cho hàng trăm khách hàng doanh nghiệp trên AWS. Khách hàng yêu cầu kết nối an toàn tuyệt đối từ VPC của họ sang dịch vụ SaaS mà không đi qua Internet công cộng và không cần kết nối VPC Peering phức tạp.",
    "question": "Giải pháp kiến trúc mạng nào là tiêu chuẩn ngành?",
    "options": [
      {
        "key": "A",
        "text": "Yêu cầu khách hàng mở kết nối qua Internet với IP Whitelist",
        "explanation": "Dữ liệu phải đi ra Internet công cộng, không đáp ứng yêu cầu kết nối an toàn riêng tư."
      },
      {
        "key": "B",
        "text": "AWS PrivateLink (VPC Endpoint Service)",
        "explanation": "Chính xác! Khách hàng kết nối qua Interface Endpoint, không lộ IP và không sợ trùng dải IP CIDR."
      },
      {
        "key": "C",
        "text": "Tạo VPC Peering với từng khách hàng",
        "explanation": "Dễ bị xung đột dải địa chỉ IP (CIDR overlapping) và giới hạn số lượng peering."
      },
      {
        "key": "D",
        "text": "Sử dụng AWS Client VPN",
        "explanation": "Dành cho người dùng cá nhân (nhân viên làm việc từ xa), không dùng kết nối giữa 2 hệ thống đám mây."
      }
    ],
    "correctKey": "B",
    "answer": "AWS PrivateLink (VPC Endpoint Service)",
    "explanation": "Nhà cung cấp SaaS cấu hình Network Load Balancer (NLB) làm Endpoint Service. Khách hàng tạo VPC Interface Endpoint trong VPC của họ để kết nối trực tiếp qua mạng ngầm AWS mà không lo trùng lặp dải IP CIDR và hoàn toàn không lộ IP ra Internet.",
    "decisionRule": "Cung cấp dịch vụ cho khách hàng không qua Internet + Không xung đột IP CIDR ➔ AWS PrivateLink."
  },
  {
    "id": "q42",
    "examCode": "ANS-C01",
    "domain": "Tích hợp thiết bị bảo mật của bên thứ ba (Virtual Appliances)",
    "serviceId": "elb",
    "scenario": "Doanh nghiệp muốn tích hợp cụm tường lửa kiểm tra gói tin của bên thứ ba (như Palo Alto hoặc Fortinet) vào luồng mạng của các VPC để soi xét lưu lượng. Yêu cầu cụm tường lửa có thể tự động co giãn và kiểm tra lưu lượng hai chiều minh bạch (transparent).",
    "question": "Loại Load Balancer nào được thiết kế chuyên biệt cho việc chèn thiết bị mạng ảo này?",
    "options": [
      {
        "key": "A",
        "text": "Application Load Balancer (ALB)",
        "explanation": "Hoạt động ở Layer 7 HTTP, không chèn thiết bị định tuyến trong suốt ở mức gói tin."
      },
      {
        "key": "B",
        "text": "Network Load Balancer (NLB)",
        "explanation": "Dùng cho cân bằng tải TCP/UDP ứng dụng, không hỗ trợ giao thức GENEVE cho tường lửa."
      },
      {
        "key": "C",
        "text": "Gateway Load Balancer (GWLB)",
        "explanation": "Chính xác! GWLB sử dụng giao thức GENEVE (cổng 6081) để chèn cụm tường lửa trong suốt."
      },
      {
        "key": "D",
        "text": "Classic Load Balancer (CLB)",
        "explanation": "Công nghệ cũ lỗi thời, không hỗ trợ thiết bị mạng ảo."
      }
    ],
    "correctKey": "C",
    "answer": "Gateway Load Balancer (GWLB)",
    "explanation": "Gateway Load Balancer (GWLB) kết hợp một cổng vào mạng trong suốt và bộ cân bằng tải cho các thiết bị ảo (Virtual Appliances). Nó đóng gói lưu lượng mạng bằng giao thức GENEVE trên cổng UDP 6081 và duy trì luồng giao tiếp đối xứng cho cụm tường lửa.",
    "decisionRule": "Cân bằng tải cụm thiết bị tường lửa ảo của bên thứ ba ➔ Gateway Load Balancer (GWLB)."
  },
  {
    "id": "q43",
    "examCode": "ANS-C01",
    "domain": "Tối ưu hóa băng thông kết nối vật lý",
    "serviceId": "direct-connect",
    "scenario": "Kết nối AWS Direct Connect 10 Gbps hiện tại của doanh nghiệp đã đạt 90% công suất trong giờ cao điểm. Doanh nghiệp muốn gộp thêm một kết nối Direct Connect 10 Gbps mới để tạo thành một kết nối logic duy nhất có băng thông 20 Gbps.",
    "question": "Tính năng kết nối mạng nào cho phép gộp các đường cáp vật lý này?",
    "options": [
      {
        "key": "A",
        "text": "Direct Connect Gateway",
        "explanation": "Dùng để kết nối 1 Direct Connect tới nhiều VPC ở các Region khác nhau, không gộp băng thông."
      },
      {
        "key": "B",
        "text": "Link Aggregation Group (LAG)",
        "explanation": "Chính xác! LAG gộp tối đa 4 đường Direct Connect cùng tốc độ tại cùng 1 điểm PoP."
      },
      {
        "key": "C",
        "text": "BGP Equal-Cost Multi-Path (ECMP)",
        "explanation": "ECMP cân bằng tải theo luồng IP, không gộp thành 1 giao diện mạng logic duy nhất như LAG."
      },
      {
        "key": "D",
        "text": "Transit Gateway Connect",
        "explanation": "Dùng cho đường hầm GRE giữa SD-WAN và TGW, không gộp cáp vật lý."
      }
    ],
    "correctKey": "B",
    "answer": "Direct Connect Link Aggregation Group (LAG)",
    "explanation": "Link Aggregation Group (LAG) là giao diện mạng logic sử dụng giao thức LACP (802.3ad) để gộp tối đa 4 kết nối Direct Connect vật lý cùng tốc độ tại cùng một điểm kết nối Direct Connect PoP, nâng tổng băng thông và tăng độ sẵn sàng.",
    "decisionRule": "Gộp nhiều đường cáp vật lý Direct Connect thành 1 liên kết logic ➔ Direct Connect LAG."
  },
  {
    "id": "q44",
    "examCode": "ANS-C01",
    "domain": "Phân tích và giám sát lưu lượng mạng chuyên sâu",
    "serviceId": "vpc",
    "scenario": "Đội ngũ điều tra an ninh cần lưu trữ toàn bộ nhật ký kết nối IP mạng (Network Flow Logs) của 20 VPC trong vòng 1 năm và cần khả năng chạy các câu lệnh truy vấn SQL phức tạp để phân tích các cuộc quét cổng bất thường.",
    "question": "Kiến trúc thu thập và phân tích nhật ký nào có chi phí rẻ và hiệu quả nhất?",
    "options": [
      {
        "key": "A",
        "text": "Gửi VPC Flow Logs vào CloudWatch Logs và truy vấn bằng CloudWatch Logs Insights",
        "explanation": "Chi phí lưu trữ và truy vấn trên CloudWatch Logs rất đắt đỏ khi lưu trữ hàng chục TB trong 1 năm."
      },
      {
        "key": "B",
        "text": "Xuất VPC Flow Logs định dạng Parquet trực tiếp vào Amazon S3 và truy vấn bằng Amazon Athena",
        "explanation": "Chính xác! Lưu trữ S3 giá cực rẻ, nén Parquet tăng tốc độ và Athena tính tiền theo dung lượng quét."
      },
      {
        "key": "C",
        "text": "Truyền VPC Flow Logs vào Amazon OpenSearch Service",
        "explanation": "Phải duy trì cụm máy chủ OpenSearch chạy 24/7 với chi phí rất cao."
      },
      {
        "key": "D",
        "text": "Gửi VPC Flow Logs qua email cho kỹ sư",
        "explanation": "Hoàn toàn bất khả thi với khối lượng hàng tỷ bản ghi mạng mỗi ngày."
      }
    ],
    "correctKey": "B",
    "answer": "VPC Flow Logs lưu vào S3 (định dạng Parquet) + Truy vấn bằng Amazon Athena",
    "explanation": "AWS cho phép xuất VPC Flow Logs trực tiếp vào Amazon S3 dưới định dạng Apache Parquet với tổ chức phân vùng theo giờ. Giải pháp này giúp tiết kiệm tới 80% chi phí so với CloudWatch Logs và cho phép dùng Amazon Athena truy vấn SQL tức thì.",
    "decisionRule": "Lưu trữ lượng lớn VPC Flow Logs dài hạn + Truy vấn SQL tối ưu chi phí ➔ S3 Parquet + Amazon Athena."
  },
  {
    "id": "q45",
    "examCode": "ANS-C01",
    "domain": "Tối ưu độ trễ ứng dụng toàn cầu không dùng HTTP",
    "serviceId": "global-accelerator",
    "scenario": "Một tựa game trực tuyến toàn cầu sử dụng giao thức UDP cho các trận đấu thể thao điện tử thời gian thực. Game thủ ở Châu Âu phàn nàn về tình trạng mất gói tin và độ trễ tăng vọt khi kết nối tới máy chủ game đặt tại Singapore.",
    "question": "Dịch vụ mạng toàn cầu nào giúp tối ưu hóa định tuyến cho giao thức UDP này?",
    "options": [
      {
        "key": "A",
        "text": "Amazon CloudFront",
        "explanation": "CloudFront là mạng CDN dành cho HTTP/HTTPS và WebSocket, không hỗ trợ định tuyến gói tin UDP thô."
      },
      {
        "key": "B",
        "text": "AWS Global Accelerator",
        "explanation": "Chính xác! Cung cấp 2 IP tĩnh Anycast, dẫn lưu lượng UDP đi thẳng vào mạng cáp quang toàn cầu của AWS."
      },
      {
        "key": "C",
        "text": "Route 53 Geoproximity Routing",
        "explanation": "Route 53 chỉ phân giải DNS ban đầu, các gói tin sau đó vẫn đi qua mạng Internet công cộng bất ổn."
      },
      {
        "key": "D",
        "text": "Bật AWS Transit Gateway Peering",
        "explanation": "TGW chỉ kết nối giữa các VPC của AWS với nhau, không kết nối từ thiết bị game thủ bên ngoài."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Global Accelerator",
    "explanation": "AWS Global Accelerator cung cấp 2 địa chỉ IP tĩnh Anycast toàn cầu. Lưu lượng của người chơi (hỗ trợ cả TCP và UDP) đi vào điểm PoP gần nhất của AWS và được dẫn qua mạng trục cáp quang riêng của AWS tới cụm máy chủ đích, triệt tiêu độ trễ Internet công cộng.",
    "decisionRule": "Tối ưu độ trễ toàn cầu cho giao thức UDP (Game/VoIP) ➔ AWS Global Accelerator."
  },
  {
    "id": "q46",
    "examCode": "DBS-C01",
    "domain": "Cơ sở dữ liệu phân tán toàn cầu (Global Databases)",
    "serviceId": "dynamodb",
    "scenario": "Ứng dụng mua sắm trực tuyến toàn cầu yêu cầu người dùng ở Mỹ, Châu Âu và Châu Á đều có thể đọc và ghi dữ liệu giỏ hàng vào Region gần nhất với độ trễ dưới 10ms, dữ liệu phải tự động đồng bộ hai chiều giữa các vùng.",
    "question": "Giải pháp cơ sở dữ liệu NoSQL nào đáp ứng hoàn hảo tiêu chí này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo các bảng DynamoDB độc lập và viết Lambda đồng bộ thủ công",
        "explanation": "Cực kỳ phức tạp, dễ xung đột ghi và độ trễ đồng bộ cao."
      },
      {
        "key": "B",
        "text": "Amazon DynamoDB Global Tables",
        "explanation": "Chính xác! Mô hình Multi-Region Active-Active tự động đồng bộ hai chiều đa vùng."
      },
      {
        "key": "C",
        "text": "Amazon DocumentDB với Multi-Region Replica",
        "explanation": "DocumentDB chỉ hỗ trợ một vùng ghi chính (Active-Passive), các vùng khác chỉ đọc."
      },
      {
        "key": "D",
        "text": "Amazon RDS for MySQL với Galera Cluster",
        "explanation": "Tự dựng cluster trên EC2 tốn công quản trị và độ trễ ghi đồng bộ qua mạng WAN rất lớn."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon DynamoDB Global Tables (Active-Active Multi-Region)",
    "explanation": "DynamoDB Global Tables cung cấp giải pháp CSDL NoSQL phân tán toàn cầu hoàn toàn được quản lý (Multi-Region Active-Active). Mọi Region đều có thể ghi và dữ liệu tự động đồng bộ hai chiều tới các Region khác trong vòng chưa đầy 1 giây.",
    "decisionRule": "NoSQL đọc ghi 2 chiều đa Region (Active-Active) ➔ Amazon DynamoDB Global Tables."
  },
  {
    "id": "q47",
    "examCode": "DBS-C01",
    "domain": "Tự động co giãn theo tải biến thiên đột ngột",
    "serviceId": "aurora",
    "scenario": "Hệ thống bán vé hòa nhạc thường xuyên có lượng truy cập thấp nhưng sẽ bùng nổ hàng triệu giao dịch CSDL quan hệ trong vòng 15 phút khi mở bán vé, sau đó giảm đột ngột về mức ban đầu. Cần tối ưu chi phí và tránh phải cấp phát máy chủ CSDL quá cỡ thường trực.",
    "question": "Loại hình Amazon Aurora nào phù hợp nhất?",
    "options": [
      {
        "key": "A",
        "text": "Aurora Provisioned với instance db.r6g.16xlarge",
        "explanation": "Chi phí hàng nghìn USD mỗi tháng lãng phí khi hệ thống không có người mua vé."
      },
      {
        "key": "B",
        "text": "Amazon Aurora Serverless v2",
        "explanation": "Chính xác! Tự động tăng giảm tài nguyên tính toán (ACUs) tức thì trong vài giây theo tải thực tế."
      },
      {
        "key": "C",
        "text": "Amazon RDS Multi-AZ với tính năng Read Replica Auto Scaling",
        "explanation": "Tốc độ khởi tạo Read Replica trên RDS mất từ 5-10 phút, quá chậm cho đợt flash sale 15 phút."
      },
      {
        "key": "D",
        "text": "Chuyển toàn bộ dữ liệu giao dịch sang Amazon S3",
        "explanation": "S3 là Object Storage, không hỗ trợ giao dịch quan hệ ACID phức tạp cho việc đặt vé."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Aurora Serverless v2",
    "explanation": "Aurora Serverless v2 tự động mở rộng và thu hẹp tài nguyên tính toán (đo bằng Aurora Capacity Units - ACUs) từ mức thấp nhất lên hàng trăm ACU chỉ trong vài giây mà không làm gián đoạn các kết nối CSDL đang mở.",
    "decisionRule": "CSDL Quan hệ + Tải biến thiên đột ngột trong vài phút ➔ Aurora Serverless v2."
  },
  {
    "id": "q48",
    "examCode": "DBS-C01",
    "domain": "Phục hồi thảm họa cơ sở dữ liệu quan hệ (Relational DB Disaster Recovery)",
    "serviceId": "rds",
    "scenario": "Ứng dụng tài chính chạy trên Amazon RDS PostgreSQL tại Region Singapore. Yêu cầu thiết lập phương án DR sang Region Tokyo với RPO dưới 5 phút, khi xảy ra thảm họa có thể kích hoạt CSDL ở Tokyo thành CSDL chính để ứng dụng ghi dữ liệu.",
    "question": "Tính năng nào của Amazon RDS đáp ứng bài toán này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo Cross-Region Read Replica và Promote thành Standalone DB khi có sự cố",
        "explanation": "Chính xác! Cross-region replica sao chép bất đồng bộ liên tục, thăng hạng (promote) khi failover."
      },
      {
        "key": "B",
        "text": "Bật RDS Multi-AZ Deployment",
        "explanation": "Multi-AZ chỉ bảo vệ trong phạm vi 1 Region (giữa 2 AZ), không chống được thảm họa toàn Region."
      },
      {
        "key": "C",
        "text": "Tự động sao lưu tự động (Automated Backups) mỗi đêm",
        "explanation": "RPO lên tới 24 giờ, vi phạm yêu cầu RPO dưới 5 phút."
      },
      {
        "key": "D",
        "text": "Sử dụng AWS DataSync đồng bộ thư mục dữ liệu",
        "explanation": "DataSync không thể can thiệp vào tầng lưu trữ dữ liệu nội bộ đang chạy của RDS."
      }
    ],
    "correctKey": "A",
    "answer": "Tạo Cross-Region Read Replica và Promote thành Standalone Database",
    "explanation": "Amazon RDS hỗ trợ tạo Read Replica xuyên vùng (Cross-Region). Dữ liệu được nhân bản liên tục với độ trễ thấp (vài giây). Khi Region chính gặp thảm họa, bạn thực hiện thao tác Promote bản replica ở Region phụ thành CSDL độc lập có quyền ghi.",
    "decisionRule": "RDS phục hồi thảm họa xuyên Region ➔ Tạo Cross-Region Read Replica và Promote."
  },
  {
    "id": "q49",
    "examCode": "DBS-C01",
    "domain": "CSDL tài liệu JSON quy mô lớn",
    "serviceId": "documentdb",
    "scenario": "Doanh nghiệp đang vận hành cụm cơ sở dữ liệu MongoDB on-premises với khối lượng dữ liệu tài liệu JSON phức tạp. Doanh nghiệp muốn chuyển dịch lên AWS thành dịch vụ được quản lý hoàn toàn, có khả năng tách rời tầng tính toán và lưu trữ, tự động sao chép 6 bản dữ liệu trên 3 AZs.",
    "question": "Dịch vụ CSDL tương thích nào là lựa chọn hàng đầu?",
    "options": [
      {
        "key": "A",
        "text": "Amazon DynamoDB",
        "explanation": "DynamoDB là NoSQL dạng Key-Value/Document nhưng không tương thích cú pháp API MongoDB."
      },
      {
        "key": "B",
        "text": "Amazon DocumentDB (with MongoDB compatibility)",
        "explanation": "Chính xác! Tương thích MongoDB API, kiến trúc đĩa chia sẻ nhân bản 6 bản trên 3 AZ."
      },
      {
        "key": "C",
        "text": "Amazon Neptune",
        "explanation": "Neptune là CSDL đồ thị (Graph Database - Gremlin/SPARQL), không phù hợp cho tài liệu JSON."
      },
      {
        "key": "D",
        "text": "Amazon Timestream",
        "explanation": "Timestream là CSDL chuỗi thời gian (Time-series) cho cảm biến IoT."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon DocumentDB (with MongoDB compatibility)",
    "explanation": "Amazon DocumentDB là dịch vụ cơ sở dữ liệu tài liệu JSON tương thích với MongoDB, sử dụng kiến trúc lưu trữ phân tán thế hệ mới của AWS tự động nhân bản 6 bản sao trên 3 Availability Zones.",
    "decisionRule": "Chuyển đổi MongoDB lên AWS được quản lý hoàn toàn ➔ Amazon DocumentDB."
  },
  {
    "id": "q50",
    "examCode": "DBS-C01",
    "domain": "Bộ nhớ đệm In-Memory có khả năng mở rộng ngang",
    "serviceId": "elasticache",
    "scenario": "Cụm Amazon ElastiCache for Redis hiện tại gặp tình trạng quá tải dung lượng RAM (bộ nhớ vượt quá 500 GB) và số lượng kết nối đồng thời từ các máy chủ web đạt giới hạn tối đa của một node.",
    "question": "Cấu hình kiến trúc ElastiCache Redis nào cho phép mở rộng dung lượng RAM và ghi dữ liệu theo chiều ngang?",
    "options": [
      {
        "key": "A",
        "text": "Nâng cấp instance Redis lên loại lớn hơn (Vertical Scaling)",
        "explanation": "Quy mô dọc có mức trần phần cứng tối đa, không giải quyết được khi dữ liệu vượt ngưỡng."
      },
      {
        "key": "B",
        "text": "Bật tính năng Redis Cluster Mode Enabled (Phân mảnh Sharding)",
        "explanation": "Chính xác! Cluster Mode chia dữ liệu qua tối đa 500 Shards, mở rộng dung lượng lên hàng Terabyte."
      },
      {
        "key": "C",
        "text": "Bổ sung thêm 10 Read Replicas vào cụm hiện tại",
        "explanation": "Read Replica chỉ mở rộng năng lực đọc, không tăng được dung lượng RAM và năng lực ghi."
      },
      {
        "key": "D",
        "text": "Chuyển sang dùng Amazon ElastiCache for Memcached",
        "explanation": "Memcached thiếu nhiều cấu trúc dữ liệu nâng cao và tính năng bền vững dữ liệu mà ứng dụng đang dùng."
      }
    ],
    "correctKey": "B",
    "answer": "Bật ElastiCache Redis Cluster Mode Enabled",
    "explanation": "Khi bật Cluster Mode Enabled, dữ liệu được tự động phân mảnh (sharded) trên nhiều Shard (mỗi Shard có 1 node chính và nhiều node phụ). Điều này cho phép mở rộng cả dung lượng lưu trữ In-memory và băng thông ghi theo chiều ngang.",
    "decisionRule": "Redis vượt quá giới hạn 1 máy chủ + Mở rộng ghi theo chiều ngang ➔ Bật Cluster Mode Enabled."
  },
  {
    "id": "q51",
    "examCode": "DBS-C01",
    "domain": "Di chuyển cơ sở dữ liệu không gián đoạn (Zero-Downtime DB Migration)",
    "serviceId": "dms",
    "scenario": "Hệ thống CSDL Microsoft SQL Server on-premises dung lượng 10 TB cần di chuyển lên Amazon RDS for SQL Server. Yêu cầu ứng dụng kinh doanh phải hoạt động liên tục trong suốt quá trình đồng bộ và chỉ được dừng hoạt động tối đa 5 phút trong thời điểm bàn giao (cutover).",
    "question": "Giải pháp và tính năng nào của AWS Database Migration Service (DMS) đáp ứng bài toán này?",
    "options": [
      {
        "key": "A",
        "text": "Tạo DMS Task chế độ \"Full Load only\"",
        "explanation": "Full Load chỉ sao chép một lần dữ liệu ban đầu, không bắt kịp các giao dịch phát sinh sau đó."
      },
      {
        "key": "B",
        "text": "Tạo DMS Task chế độ \"Full Load and Ongoing Replication\" (Change Data Capture - CDC)",
        "explanation": "Chính xác! Sao chép ban đầu và liên tục bắt kịp các thay đổi từ transaction log (CDC)."
      },
      {
        "key": "C",
        "text": "Sao lưu file .BAK on-premises rồi tải lên S3 restore vào RDS",
        "explanation": "File 10 TB mất hàng chục giờ upload và restore, vi phạm yêu cầu downtime dưới 5 phút."
      },
      {
        "key": "D",
        "text": "Sử dụng AWS Snowball Edge để chuyển dữ liệu",
        "explanation": "Chuyển vật lý bằng thiết bị phần cứng mất nhiều ngày, không đồng bộ được giao dịch mới."
      }
    ],
    "correctKey": "B",
    "answer": "AWS DMS với tính năng Change Data Capture (CDC)",
    "explanation": "AWS DMS hỗ trợ chế độ Full Load kết hợp Ongoing Replication (CDC). DMS nạp dữ liệu nền tảng ban đầu, sau đó liên tục đọc Transaction Logs để đồng bộ các giao dịch phát sinh thời gian thực, giúp thời gian chuyển đổi (cutover) chỉ mất vài phút.",
    "decisionRule": "Di chuyển CSDL với thời gian downtime tối thiểu (vài phút) ➔ AWS DMS kết hợp CDC."
  },
  {
    "id": "q52",
    "examCode": "DEA-C01",
    "domain": "Thu thập và truyền phát dữ liệu luồng thời gian thực",
    "serviceId": "kinesis-data-streams",
    "scenario": "Hệ thống cần thu thập luồng dữ liệu clickstream của người dùng theo thời gian thực để 3 ứng dụng độc lập cùng đọc song song: 1 ứng dụng hiển thị dashboard, 1 ứng dụng phân tích gian lận, 1 ứng dụng lưu trữ raw data vào Data Lake.",
    "question": "Công nghệ trung chuyển nào đáp ứng yêu cầu trên tốt hơn SQS FIFO?",
    "options": [
      {
        "key": "A",
        "text": "Amazon SQS FIFO Queue",
        "explanation": "SQS tin nhắn sau khi được một consumer đọc và xóa sẽ biến mất, các consumer khác không đọc lại được."
      },
      {
        "key": "B",
        "text": "Amazon Kinesis Data Streams",
        "explanation": "Chính xác! Cho phép nhiều Consumer Applications đọc song song độc lập trên cùng 1 luồng dữ liệu."
      },
      {
        "key": "C",
        "text": "Amazon Simple Notification Service (SNS)",
        "explanation": "SNS không lưu trữ lại dữ liệu (no replay capability) nếu ứng dụng phân tích bị lỗi."
      },
      {
        "key": "D",
        "text": "Amazon MQ (RabbitMQ)",
        "explanation": "Khó mở rộng quy mô tự động lên hàng triệu sự kiện/giây như Kinesis."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Kinesis Data Streams",
    "explanation": "Kinesis Data Streams lưu trữ dữ liệu luồng theo Shards trong tối đa 365 ngày và cho phép nhiều Consumer Applications đọc song song độc lập tại các vị trí con trỏ khác nhau mà không làm mất dữ liệu của ứng dụng khác.",
    "decisionRule": "Dữ liệu luồng + Nhiều ứng dụng độc lập đọc song song cùng 1 stream ➔ Kinesis Data Streams."
  },
  {
    "id": "q53",
    "examCode": "DEA-C01",
    "domain": "Xử lý biến đổi luồng phức tạp (Stream Analytics)",
    "serviceId": "managed-flink",
    "scenario": "Hệ thống cần tính toán số tiền giao dịch trung bình của người dùng trong mỗi cửa sổ trượt 10 phút (10-minute sliding window) từ luồng Kinesis để phát hiện giao dịch bất thường trong thời gian thực dưới 1 giây.",
    "question": "Dịch vụ xử lý luồng dữ liệu chuyên biệt nào phù hợp nhất?",
    "options": [
      {
        "key": "A",
        "text": "AWS Glue ETL Job theo lịch mỗi 10 phút",
        "explanation": "Glue Job dạng batch có độ trễ khởi động container vài phút, không đạt được thời gian thực."
      },
      {
        "key": "B",
        "text": "Amazon Managed Service for Apache Flink",
        "explanation": "Chính xác! Chuẩn mực xử lý tính toán cửa sổ thời gian (windowing) phức tạp dưới 1 giây."
      },
      {
        "key": "C",
        "text": "Amazon Athena",
        "explanation": "Athena truy vấn dữ liệu tĩnh trên S3, không tính toán trực tiếp trên luồng stream đang chuyển động."
      },
      {
        "key": "D",
        "text": "Amazon CloudWatch Metrics Insights",
        "explanation": "Chỉ dành cho số liệu hạ tầng hệ thống, không xử lý logic nghiệp vụ dữ liệu giao dịch."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Managed Service for Apache Flink",
    "explanation": "Amazon Managed Service for Apache Flink (trước đây là Kinesis Data Analytics) cho phép viết mã Java/Scala/SQL để xử lý luồng dữ liệu sự kiện phức tạp với các loại cửa sổ thời gian (Tumbling, Sliding, Session Windows) và độ trễ cực thấp tính bằng mili-giây.",
    "decisionRule": "Phân tích luồng thời gian thực + Cửa sổ tính toán (Windowing Analytics) ➔ Managed Apache Flink."
  },
  {
    "id": "q54",
    "examCode": "DEA-C01",
    "domain": "Kiến trúc Hồ dữ liệu hiện đại (Modern Data Lakehouse)",
    "serviceId": "s3",
    "scenario": "Hồ dữ liệu Data Lake trên Amazon S3 cần hỗ trợ tính năng cập nhật từng dòng (Update/Delete) để tuân thủ quyền được quên của người dùng (GDPR Right to be Forgotten) và đảm bảo các giao dịch ACID đồng thời mà không bị lỗi xung đột dữ liệu.",
    "question": "Định dạng bảng mở (Open Table Format) nào được tích hợp sâu trên AWS Lake Formation và Athena?",
    "options": [
      {
        "key": "A",
        "text": "Tệp CSV thuần túy (Raw CSV)",
        "explanation": "CSV không hỗ trợ ACID, không hỗ trợ index và việc xóa từng dòng bắt buộc phải ghi đè toàn bộ file."
      },
      {
        "key": "B",
        "text": "Định dạng bảng Apache Iceberg",
        "explanation": "Chính xác! Apache Iceberg hỗ trợ đầy đủ ACID transactions, row-level update/delete trên S3."
      },
      {
        "key": "C",
        "text": "Tệp JSON nén Gzip",
        "explanation": "Không tối ưu cho truy vấn phân tích quy mô lớn và không hỗ trợ ACID."
      },
      {
        "key": "D",
        "text": "Amazon DynamoDB JSON",
        "explanation": "Chỉ lưu trong DynamoDB, không phải định dạng bảng mở của Data Lake trên S3."
      }
    ],
    "correctKey": "B",
    "answer": "Định dạng bảng Apache Iceberg trên Amazon S3",
    "explanation": "Apache Iceberg là định dạng bảng mở thế hệ mới cho hồ dữ liệu trên S3, cung cấp các tính năng mạnh mẽ: Giao dịch ACID, Cập nhật/Xóa mức dòng (Row-level mutation), Time Travel xem lại lịch sử dữ liệu và tương thích tự nhiên với AWS Glue và Amazon Athena.",
    "decisionRule": "Data Lake trên S3 + Giao dịch ACID + Update/Delete từng dòng (GDPR) ➔ Apache Iceberg."
  },
  {
    "id": "q55",
    "examCode": "DEA-C01",
    "domain": "Quản lý danh mục siêu dữ liệu tập trung",
    "serviceId": "glue",
    "scenario": "Hàng ngày hàng trăm nguồn dữ liệu mới đổ về các thư mục S3 khác nhau dưới dạng Parquet và JSON. Cần một cơ chế tự động quét cấu trúc tệp (Schema), phát hiện các cột mới thêm vào và cập nhật danh mục dữ liệu để người dùng truy vấn bằng Athena ngay lập tức.",
    "question": "Tính năng nào của AWS Glue thực hiện tác vụ tự động này?",
    "options": [
      {
        "key": "A",
        "text": "AWS Glue DataBrew",
        "explanation": "DataBrew là công cụ giao diện trực quan để dọn dẹp và chuẩn hóa dữ liệu, không tự động quét schema."
      },
      {
        "key": "B",
        "text": "AWS Glue Crawlers kết hợp AWS Glue Data Catalog",
        "explanation": "Chính xác! Glue Crawlers quét tệp trên S3, suy diễn schema và cập nhật bảng vào Data Catalog."
      },
      {
        "key": "C",
        "text": "Amazon EMR Presto cluster",
        "explanation": "EMR cần schema đã định nghĩa sẵn trong catalog, không tự động suy diễn cấu trúc file mới."
      },
      {
        "key": "D",
        "text": "Amazon QuickSight Datasets",
        "explanation": "QuickSight là công cụ BI hiển thị báo cáo, không làm nhiệm vụ quét danh mục siêu dữ liệu."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Glue Crawlers kết hợp AWS Glue Data Catalog",
    "explanation": "AWS Glue Crawlers có thể chạy theo lịch trình hoặc sự kiện, tự động quét các kho lưu trữ dữ liệu trên S3, xác định định dạng tệp, suy diễn lược đồ (Schema Inference) và tự động tạo hoặc cập nhật bảng siêu dữ liệu trong AWS Glue Data Catalog.",
    "decisionRule": "Tự động quét cấu trúc tệp S3 + Cập nhật Schema cho Athena ➔ AWS Glue Crawlers."
  },
  {
    "id": "q56",
    "examCode": "DEA-C01",
    "domain": "Kho dữ liệu đám mây quy mô lớn (Cloud Data Warehousing)",
    "serviceId": "redshift",
    "scenario": "Kho dữ liệu Amazon Redshift của doanh nghiệp hoạt động bình thường với chi phí ổn định. Tuy nhiên, vào hai ngày cuối tháng khi hàng trăm nhà phân tích cùng chạy báo cáo tổng kết, cụm Redshift bị nghẽn nghiêm trọng và các câu truy vấn phải xếp hàng chờ đợi.",
    "question": "Tính năng nào của Redshift giải quyết tình trạng nghẽn tạm thời này mà không cần nâng cấp cụm máy chủ cố định quanh năm?",
    "options": [
      {
        "key": "A",
        "text": "Tăng gấp đôi số node của cụm Redshift Provisioned vĩnh viễn",
        "explanation": "Chi phí lãng phí 28 ngày còn lại trong tháng khi không có nhiều truy vấn."
      },
      {
        "key": "B",
        "text": "Bật tính năng Redshift Concurrency Scaling",
        "explanation": "Chính xác! Tự động bổ sung cụm xử lý phụ trong suốt thời gian nghẽn và tính phí theo giây."
      },
      {
        "key": "C",
        "text": "Chuyển toàn bộ dữ liệu phân tích sang RDS MySQL",
        "explanation": "MySQL là CSDL OLTP giao dịch, không thể gánh được khối lượng phân tích OLAP Terabyte."
      },
      {
        "key": "D",
        "text": "Giới hạn số lượng câu truy vấn tối đa của người dùng về 1 query/lần",
        "explanation": "Làm chậm trễ công việc báo cáo kinh doanh của ban giám đốc."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Redshift Concurrency Scaling",
    "explanation": "Concurrency Scaling tự động bổ sung thêm năng lực cụm xử lý trong vài giây khi có đột biến số lượng truy vấn phân tích đồng thời. Mỗi cụm Redshift được tích lũy 1 giờ miễn phí Concurrency Scaling cho mỗi 24 giờ cụm hoạt động.",
    "decisionRule": "Redshift bị nghẽn truy vấn vào cuối tháng ➔ Bật Redshift Concurrency Scaling."
  },
  {
    "id": "q57",
    "examCode": "MLS-C01",
    "domain": "Tối ưu hóa mô hình học máy cho thiết bị biên (Edge ML)",
    "serviceId": "sagemaker",
    "scenario": "Mô hình học máy Deep Learning thị giác máy tính sau khi huấn luyện xong cần triển khai xuống các camera thông minh chạy chip ARM nhúng tại các cửa hàng bán lẻ để phát hiện hành vi trộm cắp với độ trễ dưới 20ms.",
    "question": "Công cụ nào trong hệ sinh thái SageMaker tối ưu hóa mô hình cho phần cứng biên?",
    "options": [
      {
        "key": "A",
        "text": "Amazon SageMaker Ground Truth",
        "explanation": "Ground Truth dùng để gán nhãn dữ liệu huấn luyện (Data Labeling), không biên dịch mô hình."
      },
      {
        "key": "B",
        "text": "Amazon SageMaker Neo",
        "explanation": "Chính xác! Biên dịch và tối ưu mô hình ML chạy riêng biệt trên phần cứng ARM/Nvidia."
      },
      {
        "key": "C",
        "text": "Amazon SageMaker JumpStart",
        "explanation": "JumpStart là kho mô hình mã nguồn mở và nền tảng dựng sẵn, không tối ưu hóa mã máy cho chip nhúng."
      },
      {
        "key": "D",
        "text": "Amazon Rekognition Custom Labels",
        "explanation": "Dịch vụ API quản lý trên đám mây, không hỗ trợ xuất mô hình chạy offline độc lập trên chip ARM."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon SageMaker Neo",
    "explanation": "SageMaker Neo tự động chuyển đổi và tối ưu hóa các mô hình ML (TensorFlow, PyTorch, ONNX) thành mã máy nhị phân chạy tối ưu riêng cho từng loại phần cứng cụ thể (NVIDIA Jetson, ARM Cortex, Intel) giúp giảm kích thước mô hình tới 10 lần và tăng tốc suy luận gấp đôi.",
    "decisionRule": "Tối ưu hóa mô hình Machine Learning chạy trên phần cứng biên (ARM/Edge) ➔ Amazon SageMaker Neo."
  },
  {
    "id": "q58",
    "examCode": "MLS-C01",
    "domain": "AI tạo sinh và Truy xuất tăng cường tri thức (Enterprise Generative AI & RAG)",
    "serviceId": "bedrock",
    "scenario": "Tổ chức muốn xây dựng chatbot tra cứu tri thức nội bộ dựa trên các tài liệu PDF mật, đảm bảo dữ liệu không bị đem đi huấn luyện lại mô hình công cộng và cần tích hợp sẵn cơ chế phân đoạn văn bản và tìm kiếm vector (RAG).",
    "question": "Dịch vụ Generative AI nào là chuẩn mực doanh nghiệp trên AWS?",
    "options": [
      {
        "key": "A",
        "text": "Tự dựng cụm máy chủ GPU EC2 cài mô hình Llama và vector database thủ công",
        "explanation": "Chi phí GPU cực kỳ đắt đỏ và tốn đội ngũ kỹ sư vận hành hạ tầng liên tục."
      },
      {
        "key": "B",
        "text": "Amazon Bedrock với Knowledge Bases (RAG)",
        "explanation": "Chính xác! API Serverless kết nối mô hình hàng đầu (Claude 3.5), tích hợp RAG và cam kết bảo mật."
      },
      {
        "key": "C",
        "text": "Amazon Kendra đơn thuần",
        "explanation": "Kendra là công cụ tìm kiếm doanh nghiệp, không sinh câu trả lời ngôn ngữ tự nhiên như LLM."
      },
      {
        "key": "D",
        "text": "Amazon Translate",
        "explanation": "Chỉ có chức năng dịch thuật văn bản đa ngôn ngữ, không phải AI tạo sinh."
      }
    ],
    "correctKey": "B",
    "answer": "Amazon Bedrock với Knowledge Bases (RAG)",
    "explanation": "Amazon Bedrock cung cấp API serverless truy cập các model hàng đầu (như Claude 3.5), cam kết không lưu trữ hoặc huấn luyện lại dữ liệu khách hàng, tích hợp sẵn RAG với Knowledge Bases.",
    "decisionRule": "GenAI doanh nghiệp + Bảo mật tài liệu PDF nội bộ + RAG không máy chủ ➔ Amazon Bedrock Knowledge Bases."
  },
  {
    "id": "q59",
    "examCode": "DVA-C02",
    "domain": "Điều phối quy trình phi máy chủ tốc độ cao",
    "serviceId": "step-functions",
    "scenario": "Hệ thống tiếp nhận luồng sự kiện cảm biến xe hơi thông minh với tần suất 50.000 sự kiện/giây, yêu cầu điều phối quy trình xử lý không quá 5 phút với chi phí cực thấp.",
    "question": "Loại hình State Machine nào của AWS Step Functions là lựa chọn bắt buộc?",
    "options": [
      {
        "key": "A",
        "text": "Step Functions Standard Workflows",
        "explanation": "Standard Workflows tối ưu cho quy trình dài ngày (tối đa 1 năm) với giá tính theo từng bước state, quá đắt cho 50k events/s."
      },
      {
        "key": "B",
        "text": "Step Functions Express Workflows",
        "explanation": "Chính xác! Hỗ trợ hơn 100.000 sự kiện/giây, thời lượng tối đa 5 phút, giá tính theo GB-giây cực rẻ."
      },
      {
        "key": "C",
        "text": "AWS Simple Workflow Service (SWF)",
        "explanation": "Công nghệ cũ, yêu cầu tự quản lý worker decider trên EC2 phức tạp."
      },
      {
        "key": "D",
        "text": "Amazon SQS FIFO kết hợp Lambda",
        "explanation": "SQS FIFO tối đa 300-3000 msgs/s, không đáp ứng được tần suất 50.000 events/giây."
      }
    ],
    "correctKey": "B",
    "answer": "Step Functions Express Workflows",
    "explanation": "Express Workflows được thiết kế chuyên biệt cho khối lượng sự kiện khổng lồ (hơn 100.000 executions/giây), thời gian chạy tối đa 5 phút, thanh toán theo số execution và thời lượng GB-giây với chi phí rẻ hơn nhiều lần so với Standard Workflows.",
    "decisionRule": "Step Functions + Tần suất sự kiện cực lớn (50k/s) + Chạy dưới 5 phút ➔ Step Functions Express Workflows."
  },
  {
    "id": "q60",
    "examCode": "DVA-C02",
    "domain": "Tự động hóa bảo mật thông tin xác thực",
    "serviceId": "secrets-manager",
    "scenario": "Doanh nghiệp muốn định kỳ tự động thay đổi mật khẩu cơ sở dữ liệu RDS PostgreSQL mỗi 30 ngày một lần mà không cần nhân viên can thiệp thủ công.",
    "question": "Dịch vụ nào của AWS cung cấp tính năng này sẵn sàng?",
    "options": [
      {
        "key": "A",
        "text": "AWS Systems Manager Parameter Store",
        "explanation": "Parameter Store lưu cấu hình nhưng không tích hợp sẵn cơ chế hàm Lambda xoay vòng mật khẩu CSDL."
      },
      {
        "key": "B",
        "text": "AWS Secrets Manager kết hợp với Lambda Rotation function",
        "explanation": "Chính xác! Secrets Manager tích hợp sẵn các mẫu hàm Lambda chuyên dụng tự động xoay mật khẩu RDS."
      },
      {
        "key": "C",
        "text": "Amazon Cognito User Pools",
        "explanation": "Quản lý tài khoản đăng nhập của người dùng cuối, không quản lý thông tin kết nối CSDL."
      },
      {
        "key": "D",
        "text": "AWS Key Management Service (KMS)",
        "explanation": "KMS quản lý khóa mật mã để mã hóa/giải mã, không lưu trữ chuỗi bí mật và không can thiệp vào RDS."
      }
    ],
    "correctKey": "B",
    "answer": "AWS Secrets Manager kết hợp với Lambda Rotation function",
    "explanation": "Secrets Manager tích hợp sẵn các mẫu hàm Lambda chuyên dụng để tự động kết nối vào RDS, cập nhật mật khẩu mới và lưu trữ phiên bản an toàn theo chu kỳ lịch trình.",
    "decisionRule": "Tự động xoay mật khẩu RDS CSDL định kỳ (30 ngày) ➔ AWS Secrets Manager Rotation."
  }
];
