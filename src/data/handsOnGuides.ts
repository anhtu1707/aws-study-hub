import { AWSService, HandsOnGuide } from '../types';

export const SPECIFIC_HANDS_ON_GUIDES: Record<string, HandsOnGuide> = {
  s3: {
    title: 'Thực Hành: Tạo Bucket, Bật Versioning & Cấu Hình S3 Object Lock (WORM)',
    objective: 'Nắm vững quy trình thao tác tạo S3 Bucket bất biến, ngăn ngừa xóa file phục vụ yêu cầu tuân thủ pháp lý (Compliance).',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ S3 -> Bấm nút [Create bucket].',
      '2. Đặt tên Bucket theo quy chuẩn duy nhất toàn cầu (ví dụ: "my-compliance-vault-2026"), chọn AWS Region gần người dùng (ví dụ: ap-southeast-1).',
      '3. Tại mục "Object Ownership", chọn "ACLs disabled (recommended)".',
      '4. Tại mục "Block Public Access settings", giữ nguyên đánh dấu [Block all public access] để bảo mật 100%.',
      '5. Mở rộng mục "Bucket Versioning", chọn [Enable] (bắt buộc để bật Object Lock).',
      '6. Mở rộng mục "Advanced settings", bật công tắc [Enable Object Lock] -> Đọc cảnh báo và bấm xác nhận.',
      '7. Bấm [Create bucket]. Sau đó nhấp vào tên Bucket vừa tạo -> Tab "Properties" -> Cuộn tới "Default retention" -> Bấm [Edit].',
      '8. Bật chế độ "Compliance mode" và đặt thời hạn khóa (ví dụ: 30 ngày) -> Bấm [Save changes]. Thử tải lên một tệp và thử xóa để kiểm chứng cơ chế WORM.'
    ],
    cliSteps: [
      '# 1. Tạo S3 bucket có bật Object Lock:',
      'aws s3api create-bucket --bucket my-compliance-vault-2026 --region ap-southeast-1 --create-bucket-configuration LocationConstraint=ap-southeast-1 --object-lock-enabled-for-bucket',
      '',
      '# 2. Bật cấu hình mặc định lưu giữ (Default Retention) chế độ COMPLIANCE trong 30 ngày:',
      'aws s3api put-object-lock-configuration --bucket my-compliance-vault-2026 --object-lock-configuration \'{"ObjectLockConfiguration":{"ObjectLockEnabled":"Enabled","Rule":{"DefaultRetention":{"Mode":"COMPLIANCE","Days":30}}}}\'',
      '',
      '# 3. Tải lên tệp thử nghiệm:',
      'echo "Dữ liệu mật tài chính" > test.txt',
      'aws s3 cp test.txt s3://my-compliance-vault-2026/test.txt',
      '',
      '# 4. Thử lệnh xóa tệp (AWS sẽ báo lỗi Access Denied do đang bị Object Lock bảo vệ):',
      'aws s3 rm s3://my-compliance-vault-2026/test.txt'
    ],
    verification: 'Khi thực hiện xóa tệp, AWS Console hoặc CLI sẽ báo lỗi: "Access Denied: An Object Lock configuration prevents this object from being deleted". Tệp được bảo vệ tuyệt đối.',
    cleanup: 'Chỉ có thể xóa Bucket sau khi hết thời hạn lưu giữ hoặc thử nghiệm trên Bucket thử nghiệm không bật retention dài hạn.'
  },

  ec2: {
    title: 'Thực Hành: Khởi Tạo EC2 Không Cần Mở Port 22 SSH (Dùng AWS Systems Manager)',
    objective: 'Triển khai máy chủ web an toàn tuyệt đối: không IP Public, không mở Port 22 SSH trong Security Group, quản trị an toàn bằng SSM Session Manager.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ EC2 -> Bấm nút [Launch Instances].',
      '2. Đặt tên instance (ví dụ: "Secure-Web-App"). Tại mục OS, chọn Amazon Linux 2023 (đã cài sẵn SSM Agent).',
      '3. Chọn Instance Type: t4g.small hoặc t3.micro (phù hợp Free Tier).',
      '4. Tại mục "Key pair (login)", chọn "Proceed without a key pair (Not recommended)" - vì chúng ta sẽ dùng IAM & SSM thay thế SSH.',
      '5. Tại "Network settings": Chọn VPC của bạn, chọn Private Subnet. Tại Security Group: Chỉ mở Port 80 (HTTP) và 443 (HTTPS) từ nguồn cho phép. KHÔNG mở Port 22.',
      '6. Mở rộng "Advanced details" -> Mục "IAM instance profile", chọn Role có policy "AmazonSSMManagedInstanceCore".',
      '7. Tại ô "User data" cuối trang, dán script cài đặt web server: \n#!/bin/bash\ndnf update -y\ndnf install -y nginx\nsystemctl enable --now nginx',
      '8. Bấm [Launch instance]. Chờ máy chuyển sang trạng thái "Running" và Status Check "2/2 checks passed".',
      '9. Bấm vào Instance -> Bấm nút [Connect] ở góc trên -> Chọn tab "Session Manager" -> Bấm [Connect] để mở shell Linux trực tiếp trên trình duyệt.'
    ],
    cliSteps: [
      '# 1. Tạo IAM Role cho EC2 kết nối SSM:',
      'aws iam create-role --role-name EC2SSMRole --assume-role-policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}\'',
      'aws iam attach-role-policy --role-name EC2SSMRole --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore',
      'aws iam create-instance-profile --instance-profile-name EC2SSMProfile',
      'aws iam add-role-to-instance-profile --instance-profile-name EC2SSMProfile --role-name EC2SSMRole',
      '',
      '# 2. Khởi tạo EC2 gán IAM Instance Profile:',
      'aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.micro --iam-instance-profile Name=EC2SSMProfile --tag-specifications \'ResourceType=instance,Tags=[{Key=Name,Value=Secure-Web-App}]\'',
      '',
      '# 3. Kết nối Terminal vào máy chủ mà không cần SSH key:',
      'aws ssm start-session --target i-0123456789abcdef0'
    ],
    verification: 'Session Manager mở thành công màn hình console bash terminal với quyền `ssm-user`. Bạn có thể gõ lệnh `systemctl status nginx` kiểm tra dịch vụ.',
    cleanup: 'Vào EC2 Console -> Chọn instance "Secure-Web-App" -> [Instance state] -> [Terminate instance] để tránh phát sinh chi phí.'
  },

  lambda: {
    title: 'Thực Hành: Tạo Hàm Serverless Lambda Tự Động Xử Lý Khi Có Tệp Tải Lên S3',
    objective: 'Xây dựng quy trình xử lý sự kiện bất đồng bộ: Khi người dùng upload ảnh/file vào S3 -> Tự động kích hoạt Lambda đọc metadata và in log.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ Lambda -> Bấm [Create function].',
      '2. Chọn "Author from scratch", đặt tên hàm "ProcessUploadTrigger", chọn Runtime: Python 3.12 hoặc Node.js 20.x, kiến trúc arm64 (tiết kiệm chi phí).',
      '3. Tại "Change default execution role", giữ mặc định "Create a new role with basic Lambda permissions". Bấm [Create function].',
      '4. Trong cửa sổ "Code source", dán đoạn mã đọc sự kiện S3: \nimport json\ndef lambda_handler(event, context):\n    for record in event[\'Records\']:\n        bucket = record[\'s3\'][\'bucket\'][\'name\']\n        key = record[\'s3\'][\'object\'][\'key\']\n        print(f"File mới được tải lên: s3://{bucket}/{key}")\n    return {"statusCode": 200, "body": "Success"}',
      '5. Bấm [Deploy] để lưu mã nguồn.',
      '6. Tại phần "Function overview", bấm [+ Add trigger] -> Chọn nguồn sự kiện [S3] -> Chọn Bucket bạn muốn theo dõi -> Event type chọn "All object create events" -> Bấm [Add].',
      '7. Chuyển sang S3 Bucket, thử tải lên 1 tệp hình ảnh hoặc tài liệu.',
      '8. Quay lại Lambda Console -> Tab "Monitor" -> Bấm [View CloudWatch logs] -> Mở log stream mới nhất để thấy dòng log tên tệp vừa được in ra.'
    ],
    cliSteps: [
      '# 1. Tạo hàm Lambda từ file zip mã nguồn:',
      'zip function.zip index.py',
      'aws lambda create-function --function-name ProcessUploadTrigger --runtime python3.12 --role arn:aws:iam::123456789012:role/lambda-basic-role --handler index.lambda_handler --zip-file fileb://function.zip',
      '',
      '# 2. Cấp quyền cho S3 kích hoạt Lambda:',
      'aws lambda add-permission --function-name ProcessUploadTrigger --principal s3.amazonaws.com --statement-id s3invoke --action "lambda:InvokeFunction" --source-arn arn:aws:s3:::my-upload-bucket',
      '',
      '# 3. Kích hoạt trực tiếp hàm để kiểm tra:',
      'aws lambda invoke --function-name ProcessUploadTrigger --payload \'{"test": true}\' response.json && cat response.json'
    ],
    verification: 'Tại CloudWatch Log Streams, xuất hiện dòng thông báo: `File mới được tải lên: s3://my-upload-bucket/image.png` với thời gian thực thi (Billed Duration) chỉ vài chục mili-giây.',
    cleanup: 'Vào Lambda Console chọn hàm và bấm [Delete function]. Xóa trigger trong S3 Properties.'
  },

  dynamodb: {
    title: 'Thực Hành: Thiết Kế Bảng NoSQL, Bật Point-in-Time Recovery (PITR) & Query Dữ Liệu',
    objective: 'Nắm chắc thao tác tạo Partition Key (PK) & Sort Key (SK), cấu hình On-Demand capacity và thực hiện thao tác Query có điều kiện.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ DynamoDB -> Bấm [Create table].',
      '2. Đặt tên bảng: "ECommerceOrders".',
      '3. Partition key: Điền "CustomerId" (dạng String). Sort key: Điền "OrderId" (dạng String).',
      '4. Tại mục "Table settings", chọn "Customize settings" -> Capacity mode: Chọn "On-demand" (tự động co giãn theo request, không cần dự đoán trước dung lượng).',
      '5. Bấm [Create table] và chờ 10 giây để bảng sẵn sàng hoạt động (Active).',
      '6. Nhấp vào bảng "ECommerceOrders" -> Tab "Backups" -> Cuộn tới "Point-in-time recovery (PITR)" -> Bấm [Edit] -> Đánh dấu [Turn on PITR] -> Bấm [Save changes] (Tính năng sống còn để khôi phục dữ liệu tới từng giây trong 35 ngày).',
      '7. Bấm nút [Actions] -> [Create item] -> Thêm các thuộc tính: OrderDate (String: 2026-11-02), TotalAmount (Number: 150.5), Status (String: PAID) -> Bấm [Create item].',
      '8. Chuyển sang tab "Explore items" -> Chọn chế độ [Query] (thay vì Scan) -> Điền CustomerId = "CUST#101" -> Bấm [Run] để lấy dữ liệu với độ trễ dưới 5ms.'
    ],
    cliSteps: [
      '# 1. Tạo bảng DynamoDB chế độ Pay-per-request On-Demand:',
      'aws dynamodb create-table --table-name ECommerceOrders --attribute-definitions AttributeName=CustomerId,AttributeType=S AttributeName=OrderId,AttributeType=S --key-schema AttributeName=CustomerId,KeyType=HASH AttributeName=OrderId,KeyType=RANGE --billing-mode PAY_PER_REQUEST',
      '',
      '# 2. Bật tính năng khôi phục Point-in-time recovery (PITR):',
      'aws dynamodb update-continuous-backups --table-name ECommerceOrders --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true',
      '',
      '# 3. Chèn một bản ghi JSON (PutItem):',
      'aws dynamodb put-item --table-name ECommerceOrders --item \'{"CustomerId":{"S":"CUST#101"},"OrderId":{"S":"ORD#2026-001"},"Amount":{"N":"250.0"},"Status":{"S":"CONFIRMED"}}\'',
      '',
      '# 4. Thực hiện lệnh Query tối ưu:',
      'aws dynamodb query --table-name ECommerceOrders --key-condition-expression "CustomerId = :c" --expression-attribute-values \'{\":c\":{\"S\":\"CUST#101\"}}\''
    ],
    verification: 'Lệnh Query trả về đúng bản ghi của khách hàng mà chỉ đọc đúng phân vùng (Partition), lượng Consumed Capacity Units cực nhỏ (0.5 RCU).',
    cleanup: 'aws dynamodb delete-table --table-name ECommerceOrders'
  },

  rds: {
    title: 'Thực Hành: Triển Khai RDS Multi-AZ Failover & Cấu Hình Read Replica',
    objective: 'Thực hành thao tác tạo CSDL độ sẵn sàng cao chuẩn doanh nghiệp và thử nghiệm quy trình chuyển đổi dự phòng (Reboot with Failover).',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ RDS -> Bấm nút [Create database].',
      '2. Chọn "Standard create" -> Engine: PostgreSQL hoặc MySQL.',
      '3. Templates: Chọn "Production" (để mở khóa tùy chọn Multi-AZ).',
      '4. Deployment options: Chọn [Multi-AZ DB cluster] hoặc [Multi-AZ DB instance] (tạo 1 Primary DB và 1 Standby DB đồng bộ tại 2 AZ khác nhau).',
      '5. Đặt Master username (ví dụ: dbadmin) và bật "Auto generate a password" (hoặc lưu mật khẩu vào AWS Secrets Manager).',
      '6. DB instance class: Chọn db.t4g.medium hoặc db.m6g.large.',
      '7. Tại "Connectivity": Chọn VPC, chọn DB Subnet Group bao gồm ít nhất 2 Availability Zones. Đặt Public access: "No" (Bảo mật).',
      '8. Bấm [Create database]. Sau khi khởi tạo xong, nhấp vào DB Instance -> Bấm [Actions] -> Chọn [Reboot] -> Đánh dấu [Reboot with failover?] -> Bấm [Confirm].',
      '9. Quan sát tab Logs & Events để thấy AWS tự động chuyển đổi DNS endpoint sang máy chủ Standby trong chưa đầy 60 giây.'
    ],
    cliSteps: [
      '# 1. Tạo RDS PostgreSQL Multi-AZ:',
      'aws rds create-db-instance --db-instance-identifier my-prod-db --db-instance-class db.t4g.medium --engine postgres --master-username dbadmin --master-user-password "SuperSecretPassword123!" --allocated-storage 50 --multi-az',
      '',
      '# 2. Tạo Read Replica để phân tải đọc:',
      'aws rds create-db-instance-read-replica --db-instance-identifier my-prod-db-replica --source-db-instance-identifier my-prod-db',
      '',
      '# 3. Kích hoạt quy trình kiểm thử Failover khẩn cấp:',
      'aws rds reboot-db-instance --db-instance-identifier my-prod-db --force-failover'
    ],
    verification: 'Tại tab Events, xuất hiện thông báo: "Multi-AZ instance failover completed. DB instance restarted and standby promoted to primary".',
    cleanup: 'Xóa Read Replica trước, sau đó xóa Primary DB (tắt tùy chọn Create final snapshot nếu chỉ là bài test).'
  },

  vpc: {
    title: 'Thực Hành: Thiết Kế Mạng Chuẩn VPC Đa Vùng (Public/Private Subnets & NAT Gateway)',
    objective: 'Tự tay cấu hình kiến trúc mạng nền tảng AWS: Phân chia dải mạng CIDR, định tuyến Internet Gateway và NAT Gateway an toàn.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ VPC -> Bấm [Create VPC].',
      '2. Chọn chế độ "VPC and more" (AWS sẽ tự động sinh sơ đồ trực quan và tạo đủ thành phần cùng lúc).',
      '3. Đặt Name tag: "Production-VPC", IPv4 CIDR block: 10.0.0.0/16.',
      '4. Number of Availability Zones: Chọn 2 (ví dụ ap-southeast-1a và ap-southeast-1b).',
      '5. Number of public subnets: 2 (10.0.1.0/24 và 10.0.2.0/24).',
      '6. Number of private subnets: 2 (10.0.10.0/24 và 10.0.20.0/24).',
      '7. NAT Gateways: Chọn "1 per AZ" (cho sản xuất chịu lỗi cao) hoặc "1 in 1 AZ" (để tiết kiệm chi phí học tập).',
      '8. VPC Endpoints: Chọn "S3 Gateway" (miễn phí, giúp các máy tính trong Private Subnet kết nối thẳng tới S3 mà không tốn phí NAT Gateway).',
      '9. Bấm [Create VPC] và quan sát thanh tiến trình tạo tự động toàn bộ Subnets, Route Tables, Internet Gateway và kết hợp bảng định tuyến.'
    ],
    cliSteps: [
      '# 1. Tạo VPC:',
      'aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications \'ResourceType=vpc,Tags=[{Key=Name,Value=Production-VPC}]\'',
      '',
      '# 2. Tạo Internet Gateway và gắn vào VPC:',
      'aws ec2 create-internet-gateway --tag-specifications \'ResourceType=internet-gateway,Tags=[{Key=Name,Value=Prod-IGW}]\'',
      'aws ec2 attach-internet-gateway --internet-gateway-id igw-0123456789 --vpc-id vpc-0123456789',
      '',
      '# 3. Tạo S3 Gateway Endpoint miễn phí:',
      'aws ec2 create-vpc-endpoint --vpc-id vpc-0123456789 --service-name com.amazonaws.ap-southeast-1.s3 --route-table-ids rtb-0123456789'
    ],
    verification: 'Kiểm tra bảng Route Table của Private Subnet: Đường `0.0.0.0/0` trỏ tới target `nat-xxxx`, đường `pl-xxxx (S3)` trỏ tới `vpce-xxxx`. Các máy tính nội bộ ping và tải bản vá an toàn.',
    cleanup: 'Xóa NAT Gateway trước (để dừng tính phí theo giờ), giải phóng Elastic IP, sau đó vào VPC Actions bấm [Delete VPC].'
  },

  iam: {
    title: 'Thực Hành: Thiết Lập IAM Least-Privilege & Giả Lập Quyền Bằng Policy Simulator',
    objective: 'Xây dựng Policy chuẩn JSON không dùng wildcard (*) bừa bãi, gán Role cho ứng dụng và kiểm thử tính hợp lệ trước khi áp dụng.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ IAM -> Bấm mục [Policies] -> [Create policy].',
      '2. Chọn tab "JSON" và dán policy hạn chế quyền chỉ được đọc và ghi trong 1 bucket S3 duy nhất: \n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject", "s3:PutObject"],\n    "Resource": "arn:aws:s3:::my-app-data-bucket/*"\n  }]\n}',
      '3. Bấm [Next] -> Đặt tên Policy: "StrictAppS3Access" -> Bấm [Create policy].',
      '4. Vào mục [Roles] -> [Create role] -> Chọn "AWS service" -> Chọn use case "EC2" hoặc "Lambda".',
      '5. Tìm và tick chọn policy "StrictAppS3Access" vừa tạo -> Đặt tên Role "AppBackendServiceRole" -> Bấm [Create role].',
      '6. Mở công cụ "IAM Policy Simulator" (trong menu bên trái hoặc tìm kiếm) -> Chọn Role "AppBackendServiceRole".',
      '7. Chọn Service: Amazon S3 -> Action: DeleteObject -> Bấm [Run Simulation]. Quan sát kết quả hiển thị "Denied" (chứng minh quyền xóa bị chặn thành công).'
    ],
    cliSteps: [
      '# 1. Tạo policy JSON kiểm soát quyền truy cập chặt chẽ:',
      'cat <<EOF > policy.json\n{\n  "Version": "2012-10-17",\n  "Statement": [{\n    "Effect": "Allow",\n    "Action": ["s3:GetObject", "s3:PutObject"],\n    "Resource": "arn:aws:s3:::my-app-data-bucket/*"\n  }]\n}\nEOF',
      'aws iam create-policy --policy-name StrictAppS3Access --policy-document file://policy.json',
      '',
      '# 2. Tạo IAM Role cho ứng dụng:',
      'aws iam create-role --role-name AppBackendServiceRole --assume-role-policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}\'',
      'aws iam attach-role-policy --role-name AppBackendServiceRole --policy-arn arn:aws:iam::123456789012:policy/StrictAppS3Access',
      '',
      '# 3. Mô phỏng thử quyền xóa tệp (sẽ trả về DENIED):',
      'aws iam simulate-principal-policy --policy-source-arn arn:aws:iam::123456789012:role/AppBackendServiceRole --action-names s3:DeleteObject --resource-arns arn:aws:s3:::my-app-data-bucket/test.jpg'
    ],
    verification: 'Kết quả mô phỏng trả về `evalDecision: "explicitDeny"` hoặc `"implicitDeny"`. Ứng dụng chỉ có thể đọc ghi, hoàn toàn không có quyền xóa tệp hay can thiệp vào các tài nguyên khác.',
    cleanup: 'Gỡ Policy khỏi Role và xóa Role `AppBackendServiceRole`, sau đó xóa Policy `StrictAppS3Access`.'
  },

  sqs: {
    title: 'Thực Hành: Cấu Hình Hàng Đợi SQS Standard & Gắn Dead-Letter Queue (DLQ)',
    objective: 'Thiết lập mô hình kiến trúc chịu lỗi (fault-tolerant): tin nhắn xử lý lỗi 3 lần liên tiếp sẽ tự động chuyển vào hàng đợi thư chết (DLQ) để điều tra.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ SQS -> Bấm nút [Create queue].',
      '2. Chọn Type: "Standard", đặt tên hàng đợi thư chết trước: "Orders-DeadLetterQueue" -> Giữ mặc định và bấm [Create queue].',
      '3. Bấm lại [Create queue] để tạo hàng đợi chính: Đặt tên "Orders-MainQueue".',
      '4. Cuộn xuống mục "Dead-letter queue" -> Bật tùy chọn [Enabled].',
      '5. Tại ô "Choose queue", chọn "Orders-DeadLetterQueue" vừa tạo.',
      '6. Đặt "Maximum receives" = 3 (nghĩa là nếu worker lấy ra xử lý thất bại 3 lần, SQS sẽ tự động cô lập tin nhắn này sang DLQ). Bấm [Create queue].',
      '7. Nhấp vào "Orders-MainQueue" -> Bấm [Send and receive messages] -> Soạn nội dung tin nhắn JSON mẫu -> Bấm [Send message].',
      '8. Nhấp [Poll for messages] xem tin nhắn, để hết thời gian Visibility Timeout 3 lần liên tiếp -> Kiểm tra "Orders-DeadLetterQueue" sẽ thấy tin nhắn đã tự động nhảy sang đây.'
    ],
    cliSteps: [
      '# 1. Tạo Dead-Letter Queue:',
      'aws sqs create-queue --queue-name Orders-DeadLetterQueue',
      '# Lấy ARN của DLQ: arn:aws:sqs:us-east-1:123456789012:Orders-DeadLetterQueue',
      '',
      '# 2. Tạo Main Queue cấu hình RedrivePolicy trỏ sang DLQ (maxReceiveCount = 3):',
      'aws sqs create-queue --queue-name Orders-MainQueue --attributes \'{"RedrivePolicy":"{\\"deadLetterTargetArn\\":\\"arn:aws:sqs:us-east-1:123456789012:Orders-DeadLetterQueue\\",\\"maxReceiveCount\\":\\"3\\"}"}\'',
      '',
      '# 3. Gửi tin nhắn thử nghiệm:',
      'aws sqs send-message --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/Orders-MainQueue --message-body \'{"orderId": 999, "items": ["Laptop"]}\'',
      '',
      '# 4. Kiểm tra số lượng tin nhắn trong DLQ:',
      'aws sqs get-queue-attributes --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/Orders-DeadLetterQueue --attribute-names ApproximateNumberOfMessages'
    ],
    verification: 'Khi ứng dụng gặp lỗi lặp đi lặp lại, tin nhắn độc hại (poison pill) không làm nghẽn hàng đợi chính mà được cách ly an toàn trong DLQ, CloudWatch Alarm có thể bắn cảnh báo.',
    cleanup: 'Vào SQS Console chọn cả 2 queues và bấm [Delete].'
  },

  bedrock: {
    title: 'Thực Hành: Kích Hoạt Model Access & Xây Dựng RAG Knowledge Base Với Bedrock',
    objective: 'Cấu hình nền tảng AI tạo sinh doanh nghiệp: Xin quyền sử dụng model Anthropic Claude 3.5 Sonnet và nạp kho tri thức từ tệp PDF trong S3.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ Amazon Bedrock (chọn Region US East N. Virginia us-east-1 hoặc Oregon us-west-2).',
      '2. Trong thanh menu bên trái, cuộn xuống dưới cùng chọn [Model access] -> Bấm [Modify model access].',
      '3. Tìm hãng "Anthropic" -> Đánh dấu chọn "Claude 3.5 Sonnet" và "Claude 3 Haiku" -> Bấm [Next] -> Điền lý do sử dụng doanh nghiệp và bấm [Submit]. Quyền sẽ được cấp tức thì trong vài giây.',
      '4. Vào mục [Playgrounds] -> [Chat] -> Chọn model Claude 3.5 Sonnet -> Thử nghiệm gõ prompt để kiểm tra kết nối suy luận.',
      '5. Tạo 1 Bucket S3 (ví dụ: "company-policies-vault") và upload một số file tài liệu PDF quy định nội bộ lên bucket này.',
      '6. Trong Bedrock Console -> Chọn mục [Knowledge bases] -> Bấm [Create knowledge base].',
      '7. Đặt tên "InternalPolicyKB" -> Chọn data source là S3 bucket vừa tạo -> Vector store: Chọn "Quick create a new vector store - Amazon OpenSearch Serverless".',
      '8. Bấm [Create knowledge base] và bấm [Sync] để hệ thống tự động phân đoạn văn bản, tính toán vector embeddings và nạp vào OpenSearch. Sau khi đồng bộ xong, gõ câu hỏi vào khung Test để thấy câu trả lời kèm trích dẫn chính xác trang tài liệu.'
    ],
    cliSteps: [
      '# 1. Gọi trực tiếp mô hình Claude 3.5 Sonnet qua Bedrock Runtime API:',
      'aws bedrock-runtime invoke-model --model-id anthropic.claude-3-5-sonnet-20240620-v1:0 --body \'{"anthropic_version":"bedrock-2023-05-31","max_tokens":300,"messages":[{"role":"user","content":"Giải thích ngắn gọn cơ chế RAG trong 3 gạch đầu dòng"}]}\' --cli-binary-format raw-in-base64-out output.json && cat output.json',
      '',
      '# 2. Đồng bộ Knowledge Base sau khi tải thêm tài liệu mới lên S3:',
      'aws bedrock-agent start-ingestion-job --knowledge-base-id "KB12345678" --data-source-id "DS12345678"'
    ],
    verification: 'Cửa sổ Test Knowledge Base trả về nội dung giải đáp chính xác nghiệp vụ nội bộ kèm footnote trích dẫn file PDF nguồn, ngăn chặn triệt để hiện tượng AI bị ảo giác (hallucination).',
    cleanup: 'Xóa Knowledge Base và OpenSearch Serverless collection tương ứng nếu không còn dùng để tránh phí duy trì OCU của OpenSearch.'
  },

  cloudfront: {
    title: 'Thực Hành: Tạo CloudFront CDN Tăng Tốc S3 Với Origin Access Control (OAC)',
    objective: 'Bảo vệ nguồn dữ liệu S3: Chặn 100% truy cập trực tiếp từ Internet vào S3, chỉ cho phép xem qua CloudFront Distribution với chứng chỉ HTTPS.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ CloudFront -> Bấm [Create distribution].',
      '2. Tại ô "Origin domain", nhấp vào và chọn tên S3 Bucket của bạn (ví dụ: my-web-assets.s3.ap-southeast-1.amazonaws.com).',
      '3. Tại mục "Origin access", chọn tùy chọn: [Origin access control settings (recommended)] -> Bấm [Create new OAC] -> Đặt tên và bấm [Create].',
      '4. Tại mục "Default cache behavior": Viewer protocol policy chọn [Redirect HTTP to HTTPS]. Allowed HTTP methods: [GET, HEAD].',
      '5. Tại "Web Application Firewall (WAF)": Chọn "Do not enable security protections" (cho môi trường học tập) hoặc gắn Web ACL sẵn có.',
      '6. Bấm [Create distribution] ở cuối trang.',
      '7. Sau khi bấm tạo, CloudFront hiển thị một banner màu xanh: "The S3 bucket policy needs to be updated". Bấm nút [Copy policy].',
      '8. Chuyển sang S3 Console -> Chọn Bucket của bạn -> Tab "Permissions" -> Cuộn tới "Bucket policy" -> Bấm [Edit] -> Dán nội dung policy vừa copy vào -> Bấm [Save changes].',
      '9. Lấy tên miền Distribution domain name (ví dụ: d111111abcdef8.cloudfront.net) dán vào trình duyệt để kiểm tra hình ảnh/file được tải qua mạng lưới Edge Location toàn cầu với độ trễ cực thấp.'
    ],
    cliSteps: [
      '# 1. Tạo Origin Access Control (OAC):',
      'aws cloudfront create-key-value-store --name "MyOACStore" # Hoặc dùng OAC mặc định',
      '',
      '# 2. Xóa bộ đệm cache toàn cầu (Invalidation) sau khi cập nhật web:',
      'aws cloudfront create-invalidation --distribution-id EDFDVBD632BHDS56 --paths "/*"'
    ],
    verification: 'Khi truy cập link trực tiếp của S3 (`https://my-bucket.s3.amazonaws.com/test.jpg`), trình duyệt báo lỗi `403 Access Denied`. Nhưng khi truy cập qua link CloudFront (`https://d111.cloudfront.net/test.jpg`), ảnh hiển thị mượt mà với header `X-Cache: Hit from cloudfront`.',
    cleanup: 'Chọn Distribution trong CloudFront Console -> Bấm [Disable] (mất 2 phút) -> Sau khi disabled, bấm nút [Delete].'
  },

  'api-gateway': {
    title: 'Thực Hành: Xây Dựng REST API Serverless Tích Hợp Lambda Proxy & CORS',
    objective: 'Thực hành tạo điểm cuối API RESTful công khai trên Internet, kết nối thẳng vào hàm Lambda xử lý logic nghiệp vụ và hỗ trợ gọi từ trình duyệt web.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ API Gateway -> Mục "REST API", bấm [Build].',
      '2. Chọn "New API", đặt API name: "OrderServiceAPI", Endpoint Type: Regional (hoặc Edge-optimized). Bấm [Create API].',
      '3. Bấm menu [Actions] -> [Create Resource] -> Đặt Resource Name: "orders", Resource Path: "/orders" -> Đánh dấu [Enable API Gateway CORS] -> Bấm [Create Resource].',
      '4. Chọn Resource "/orders" vừa tạo -> Bấm [Actions] -> [Create Method] -> Chọn phương thức [POST] hoặc [GET] -> Bấm dấu tick xác nhận.',
      '5. Integration type: Chọn [Lambda Function] -> Đánh dấu [Use Lambda Proxy integration] (rất quan trọng để truyền toàn bộ headers, body, query params vào Lambda).',
      '6. Lambda Function: Chọn hàm Lambda bạn đã tạo -> Bấm [Save] và bấm [OK] khi hộp thoại xin quyền cấp phép xuất hiện.',
      '7. Bấm [Actions] -> [Deploy API] -> Deployment stage: Chọn [New Stage] -> Stage name: "prod" -> Bấm [Deploy].',
      '8. Sao chép đường dẫn "Invoke URL" hiển thị trên đầu trang (ví dụ: https://xyz.execute-api.ap-southeast-1.amazonaws.com/prod/orders) để kiểm thử bằng Postman hoặc curl.'
    ],
    cliSteps: [
      '# 1. Tạo REST API:',
      'aws apigateway create-rest-api --name "OrderServiceAPI" --region ap-southeast-1',
      '',
      '# 2. Kiểm thử gọi API endpoint:',
      'curl -X POST https://xyz.execute-api.ap-southeast-1.amazonaws.com/prod/orders -H "Content-Type: application/json" -d \'{"item": "book", "qty": 2}\''
    ],
    verification: 'Lệnh curl trả về mã phản hồi HTTP `200 OK` kèm kết quả JSON từ Lambda trả về. Log chi tiết từng request xuất hiện trong CloudWatch API Gateway Execution Logs.',
    cleanup: 'Vào API Gateway Console -> Chọn "OrderServiceAPI" -> Bấm [Actions] -> [Delete API].'
  },

  route53: {
    title: 'Thực Hành: Cấu Hình DNS Alias Record & Failover Routing Policy Với Health Check',
    objective: 'Thiết lập chuyển hướng tên miền thông minh: Khi cụm máy chủ chính (Primary) gặp sự cố, Route 53 tự động chuyển hướng người dùng sang trang bảo trì (Secondary S3 static site).',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ Route 53 -> Vào mục [Health checks] bên trái -> Bấm [Create health check].',
      '2. Đặt tên "Primary-App-HealthCheck", What to monitor: [Endpoint], Endpoint: Nhập IP hoặc domain của ALB/EC2 chính, Port 80 hoặc 443, Request path: "/health" -> Bấm [Next] -> [Create health check].',
      '3. Vào mục [Hosted zones] -> Chọn tên miền của bạn (ví dụ: mycompany.com).',
      '4. Bấm [Create record] -> Record name: "app" (tức app.mycompany.com) -> Record type: "A - Routes traffic to an IPv4 address".',
      '5. Bật công tắc [Alias] -> Route traffic to: [Alias to Application and Classic Load Balancer] -> Chọn Region và chọn ALB chính của bạn.',
      '6. Routing policy: Chọn [Failover] -> Failover record type: [Primary] -> Đánh dấu [Associate with health check] và chọn "Primary-App-HealthCheck" -> Bấm [Create records].',
      '7. Tạo thêm 1 bản ghi thứ hai cùng tên "app" -> Routing policy: [Failover] -> Failover record type: [Secondary] -> Trỏ sang S3 static website bucket hiển thị trang thông báo "Hệ thống đang bảo trì".',
      '8. Thử tắt máy chủ chính để kiểm tra Route 53 tự động chuyển hướng sang trang phụ trong vòng 60 giây.'
    ],
    cliSteps: [
      '# 1. Tạo Health Check giám sát đường dẫn /health:',
      'aws route53 create-health-check --caller-reference "Check-001" --health-check-config \'{"IPAddress":"54.255.10.20","Port":80,"Type":"HTTP","ResourcePath":"/health","RequestInterval":30,"FailureThreshold":3}\'',
      '',
      '# 2. Liệt kê các bản ghi DNS trong Hosted Zone:',
      'aws route53 list-resource-record-sets --hosted-zone-id Z1234567890ABC'
    ],
    verification: 'Khi Health Check phát hiện Primary Endpoint thất bại (Unhealthy), truy vấn DNS `dig app.mycompany.com` sẽ trả về ngay địa chỉ của Secondary S3 bucket, người dùng vẫn xem được trang thông báo thay vì gặp lỗi sập mạng.',
    cleanup: 'Xóa 2 bản ghi Failover trong Hosted Zone trước, sau đó xóa Health Check.'
  },

  'secrets-manager': {
    title: 'Thực Hành: Tạo Secret Lưu Trữ CSDL & Bật Tự Động Xoay Vòng Mật Khẩu (Rotation)',
    objective: 'Xóa bỏ hoàn toàn việc hardcode mật khẩu trong source code hoặc file .env; tự động đổi mật khẩu định kỳ 30 ngày một lần không cần con người can thiệp.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ AWS Secrets Manager -> Bấm [Store a new secret].',
      '2. Secret type: Chọn "Credentials for Amazon RDS database" (hoặc "Other type of secret").',
      '3. Nhập User name (ví dụ: app_user) và Password. Tại mục "Database", chọn instance RDS PostgreSQL/MySQL của bạn -> Bấm [Next].',
      '4. Secret name: Đặt theo định dạng phân cấp (ví dụ: "prod/ecommerce/db-credentials") -> Bấm [Next].',
      '5. Tại trang "Configure automatic rotation": Bật công tắc [Automatic rotation].',
      '6. Chọn Rotation schedule: "Every 30 days".',
      '7. Rotation function: Chọn "Create a new Lambda function" (AWS sẽ tự động tạo sẵn mã nguồn Lambda kết nối vào CSDL đổi mật khẩu) -> Bấm [Next].',
      '8. Kiểm tra lại thông số -> Cuộn xuống cuối trang có sẵn các đoạn code mẫu Java, Python, Node.js, Go để lấy secret trong app -> Bấm [Store].',
      '9. Bấm nút [Rotate secret immediately] để kiểm tra hàm Lambda chạy thử nghiệm thành công.'
    ],
    cliSteps: [
      '# 1. Tạo secret lưu chuỗi kết nối CSDL:',
      'aws secretsmanager create-secret --name "prod/ecommerce/db" --secret-string \'{"username":"app_user","password":"SuperSecretPassword2026!","host":"prod-db.xyz.rds.amazonaws.com","port":5432}\'',
      '',
      '# 2. Ứng dụng đọc secret bằng AWS CLI/SDK tại runtime:',
      'aws secretsmanager get-secret-value --secret-id "prod/ecommerce/db" --query SecretString --output text'
    ],
    verification: 'Lệnh `get-secret-value` trả về chuỗi JSON thông tin đăng nhập. Khi đến chu kỳ 30 ngày, Secrets Manager tự động cập nhật mật khẩu mới cả trên CSDL và trong kho lưu trữ, ứng dụng lấy phiên bản `AWSCURRENT` không bao giờ bị đứt kết nối.',
    cleanup: 'aws secretsmanager delete-secret --secret-id "prod/ecommerce/db" --force-delete-without-recovery'
  },

  waf: {
    title: 'Thực Hành: Tạo Web ACL Chặn Tấn Công SQL Injection & Giới Hạn Tần Suất (Rate Limiting)',
    objective: 'Bảo vệ tầng ứng dụng (Layer 7): Ngăn chặn hacker quét lỗ hổng SQLi và chặn các cuộc tấn công Brute-Force/DDoS đăng nhập bằng Rate-Based Rule.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ AWS WAF & Shield -> Bấm [Create web ACL].',
      '2. Đặt tên: "WebSecurityACL", Resource type: Chọn "Regional resources" (dành cho ALB, API Gateway) hoặc "CloudFront distributions". Chọn Region của bạn -> Bấm [Next].',
      '3. Tại mục "Add rules and rule groups": Bấm [Add rules] -> Chọn [Add managed rule groups].',
      '4. Mở rộng "AWS managed rule groups": Bật [Core rule set] (bảo vệ các lỗi phổ biến OWASP Top 10) và bật [SQL database] (chặn câu lệnh chèn mã SQL Injection độc hại) -> Bấm [Add rules].',
      '5. Tiếp tục bấm [Add rules] -> Chọn [Add my own rules and rule groups] -> Rule type: Chọn [Rate-based rule].',
      '6. Đặt tên rule: "RateLimitPerIP", Rate limit: Đặt "100" (tức là 1 địa chỉ IP chỉ được gửi tối đa 100 requests trong 5 phút) -> Action: Chọn [Block] -> Bấm [Add rule].',
      '7. Default web ACL action for requests that don\'t match any rules: Chọn [Allow] (cho phép truy cập bình thường) -> Bấm [Next] cho tới trang cuối và bấm [Create web ACL].',
      '8. Chuyển sang tab "Associated AWS resources" -> Bấm [Add AWS resources] -> Chọn Application Load Balancer hoặc API Gateway của bạn.'
    ],
    cliSteps: [
      '# 1. Liệt kê các Web ACL đang hoạt động:',
      'aws wafv2 list-web-acls --scope REGIONAL --region ap-southeast-1',
      '',
      '# 2. Xem các request bị WAF chặn (Sampled Requests):',
      'aws wafv2 get-sampled-requests --web-acl-arn "arn:aws:wafv2:ap-southeast-1:123456789012:regional/webacl/WebSecurityACL/abc" --rule-metric-name "AWS-AWSManagedRulesCommonRuleSet" --scope REGIONAL --time-window StartTime=2026-11-02T00:00:00Z,EndTime=2026-11-02T12:00:00Z --max-items 100'
    ],
    verification: 'Khi thử gửi request có chuỗi `/?id=1\' OR \'1\'=\'1`, trình duyệt nhận về ngay mã lỗi `403 Forbidden` do AWS WAF chặn đứng trước khi gói tin chạm tới máy chủ web EC2/ALB.',
    cleanup: 'Gỡ Application Load Balancer khỏi Web ACL trước, sau đó bấm [Delete] Web ACL.'
  },

  guardduty: {
    title: 'Thực Hành: Bật Phát Hiện Mối Đe Dọa Bằng AI GuardDuty & Tạo Sample Findings',
    objective: 'Kích hoạt hệ thống phòng thủ giám sát thông minh 24/7 không cần cài agent, tự động phát hiện mã độc đào coin (Cryptocurrency mining) hoặc rò rỉ IAM credential.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ Amazon GuardDuty -> Bấm nút [Get Started] -> Bấm [Enable GuardDuty] (Chỉ 1 thao tác duy nhất là toàn bộ tài khoản được bảo vệ).',
      '2. GuardDuty tự động phân tích VPC Flow Logs, DNS Logs, CloudTrail Management Events, S3 Data Events và EKS Audit Logs bằng Machine Learning.',
      '3. Vào mục [Settings] ở thanh menu bên trái -> Cuộn tới phần "Sample findings" -> Bấm nút [Generate sample findings].',
      '4. Chuyển sang mục [Findings] ở bên trái: Bạn sẽ thấy xuất hiện ngay hàng chục mẫu cảnh báo thực chiến với các mức độ High, Medium, Low.',
      '5. Nhấp vào mẫu cảnh báo: `CryptoCurrency:EC2/BitcoinTool.B!DNS`: Xem chi tiết IP tấn công, ID máy chủ EC2 bị nhiễm mã độc và khuyến nghị khắc phục sự cố (Remediation steps).'
    ],
    cliSteps: [
      '# 1. Bật GuardDuty qua CLI:',
      'aws guardduty create-detector --enable',
      '',
      '# 2. Sinh các sự kiện cảnh báo mẫu để kiểm tra hệ thống thông báo SIEM/SOC:',
      'aws guardduty create-sample-findings --detector-id "detector-id-12345" --finding-types "CryptoCurrency:EC2/BitcoinTool.B!DNS"'
    ],
    verification: 'Trang Findings liệt kê chi tiết các mối nguy hại kèm khuyến cáo. Khi kết hợp với EventBridge, bạn có thể tự động cô lập máy chủ EC2 bị nhiễm độc bằng cách tháo Security Group.',
    cleanup: 'Miễn phí dùng thử 30 ngày (Free Trial). Nếu muốn tắt, vào GuardDuty Settings -> Bấm [Disable GuardDuty].'
  },

  cloudwatch: {
    title: 'Thực Hành: Tạo CloudWatch Alarm Giám Sát CPU EC2 & Tự Động Gửi Email Cảnh Báo Qua SNS',
    objective: 'Thiết lập quy trình giám sát hạ tầng tự động: Khi mức tải CPU vượt quá 80% trong 5 phút liên tục, hệ thống tự động bắn cảnh báo khẩn cấp đến đội ngũ DevOps.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ CloudWatch -> Mục [Alarms] bên trái -> Bấm [Create alarm].',
      '2. Bấm [Select metric] -> Chọn [EC2] -> [Per-Instance Metrics] -> Tìm tên instance của bạn -> Tick chọn metric "CPUUtilization" -> Bấm [Select metric].',
      '3. Metric conditions: Threshold type chọn "Static", Đặt điều kiện: "Greater than" > "80". Period: Chọn "5 minutes". Bấm [Next].',
      '4. Tại trang "Configure actions": Alarm state trigger chọn "In alarm".',
      '5. Send a notification to the following SNS topic: Chọn [Create new topic] -> Đặt tên "DevOpsAlertsTopic", nhập địa chỉ Email của bạn -> Bấm [Create topic].',
      '6. Bấm [Next] -> Đặt tên Alarm: "EC2-HighCPU-Alert" -> Bấm [Next] -> [Create alarm].',
      '7. Mở hòm thư email của bạn -> Tìm email có tiêu đề "AWS Notification - Subscription Confirmation" -> Bấm vào đường link [Confirm subscription] (bắt buộc để kích hoạt nhận email).'
    ],
    cliSteps: [
      '# 1. Tạo SNS Topic và đăng ký nhận email:',
      'aws sns create-topic --name DevOpsAlertsTopic',
      'aws sns subscribe --topic-arn "arn:aws:sns:us-east-1:123456789012:DevOpsAlertsTopic" --protocol email --notification-endpoint "devops@phucan.vn"',
      '',
      '# 2. Tạo CloudWatch Alarm ngưỡng CPU > 80%:',
      'aws cloudwatch put-metric-alarm --alarm-name "EC2-HighCPU-Alert" --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanThreshold --dimensions Name=InstanceId,Value=i-0123456789abcdef0 --evaluation-periods 1 --alarm-actions "arn:aws:sns:us-east-1:123456789012:DevOpsAlertsTopic"'
    ],
    verification: 'Chạy lệnh test tải `stress --cpu 4` trên EC2 trong 5 phút -> Trạng thái CloudWatch Alarm chuyển từ màu xanh (OK) sang màu đỏ (In alarm) và một email cảnh báo chi tiết được gửi tức thì vào hòm thư.',
    cleanup: 'Vào CloudWatch Alarms chọn "EC2-HighCPU-Alert" bấm [Delete]. Vào SNS xóa topic.'
  },

  'aws-budgets': {
    title: 'Thực Hành: Tạo AWS Budget $10/Tháng Chống Sốc Hóa Đơn (Bill Shock Protection)',
    objective: 'Bắt buộc thực hành cho mọi tài khoản AWS: Giới hạn ngân sách chi tiêu $10/tháng và nhận cảnh báo sớm qua email khi chi phí thực tế hoặc dự báo chạm 80%.',
    consoleSteps: [
      '1. Truy cập AWS Console -> Dịch vụ AWS Budgets (hoặc vào Billing and Cost Management -> Budgets) -> Bấm [Create budget].',
      '2. Budget setup: Chọn mẫu "Use a template (simplified)" hoặc "Customize (advanced)". Chọn "Zero spend budget" (nếu muốn cảnh báo ngay khi mất Free Tier) hoặc "Monthly cost budget".',
      '3. Đặt Budget name: "Monthly-Max-10USD". Period: "Monthly". Budget renewal type: "Recurring budget".',
      '4. Budgeting method: "Fixed". Budget amount ($): Nhập "10.00" -> Bấm [Next].',
      '5. Cấu hình ngưỡng cảnh báo (Set alert threshold): Bấm [Add an alert threshold].',
      '6. Threshold 1: Nhập "80" % của ngân sách ($8). Trigger: Chọn "Actual" (chi phí thực tế). Nhập Email của bạn.',
      '7. Threshold 2: Bấm [+ Add threshold] -> Nhập "100" % của ngân sách. Trigger: Chọn "Forecasted" (chi phí dự báo sẽ chạm $10 vào cuối tháng dựa trên xu hướng chi tiêu) -> Nhập Email.',
      '8. Bấm [Next] -> Kiểm tra lại thông số tổng quan và bấm [Create budget].'
    ],
    cliSteps: [
      '# 1. Liệt kê các ngân sách hiện có trong tài khoản:',
      'aws budgets describe-budgets --account-id "123456789012"',
      '',
      '# 2. Tạo ngân sách $10 với cảnh báo 80%:',
      'aws budgets create-budget --account-id "123456789012" --budget \'{"BudgetName":"Monthly-Max-10USD","BudgetLimit":{"Amount":"10","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}\' --notifications-with-subscribers \'[{"Notification":{"NotificationType":"ACTUAL","ComparisonOperator":"GREATER_THAN","Threshold":80},"Subscribers":[{"SubscriptionType":"EMAIL","Address":"finance@phucan.vn"}]}]\''
    ],
    verification: 'Bảng điều khiển AWS Budgets hiển thị thanh đo tiến độ chi tiêu màu xanh với hạn mức $10.00. Khi chi phí tài khoản chạm $8.00 hoặc có nguy cơ vượt, bạn sẽ nhận được email cảnh báo ngay lập tức.',
    cleanup: 'Mỗi tài khoản được miễn phí 2 budgets đầu tiên. Để xóa, tick chọn budget và bấm [Delete].'
  }
};

/**
 * Tạo tự động quy trình thao tác thực chiến cho bất kỳ dịch vụ nào trong 214 dịch vụ
 */
export function getHandsOnGuide(service: AWSService): HandsOnGuide {
  if (SPECIFIC_HANDS_ON_GUIDES[service.id]) {
    return SPECIFIC_HANDS_ON_GUIDES[service.id];
  }

  // Tự động sinh quy trình thao tác chuẩn hóa theo danh mục & đặc tính của dịch vụ
  const categoryWorkflows: Record<string, { consoleFocus: string; verifyTip: string }> = {
    compute: {
      consoleFocus: 'Cấu hình tài nguyên tính toán (vCPU/RAM), VPC Subnet, IAM Role gán quyền và Security Group kiểm soát cổng ra vào.',
      verifyTip: 'Kiểm tra trạng thái máy chủ/tiến trình ở trạng thái Healthy/Running và xem nhật ký thực thi trong CloudWatch.'
    },
    storage: {
      consoleFocus: 'Khởi tạo không gian lưu trữ, thiết lập chính sách mã hóa KMS, phân quyền Bucket/Share và cấu hình Lifecycle lưu trữ.',
      verifyTip: 'Thực hiện thao tác Put/Read file thử nghiệm và kiểm tra độ trễ cùng dung lượng thống kê trong bảng điều khiển.'
    },
    database: {
      consoleFocus: 'Thiết lập tham số động (Parameter Group), cấu hình tài khoản quản trị Master trong Secrets Manager, kiểm tra tính năng Multi-AZ sao chép.',
      verifyTip: 'Sử dụng công cụ client kết nối vào Endpoint CSDL, tạo bảng mẫu và chạy thử nghiệm truy vấn dữ liệu.'
    },
    networking: {
      consoleFocus: 'Phân bổ dải IP CIDR, cấu hình bảng định tuyến Route Table, liên kết mạng Subnet/Gateway và thiết lập quy tắc tường lửa.',
      verifyTip: 'Dùng công cụ traceroute/ping hoặc VPC Reachability Analyzer kiểm tra luồng gói tin kết nối xuyên suốt.'
    },
    security: {
      consoleFocus: 'Kích hoạt chính sách phát hiện mối đe dọa, cấu hình phát hiện bất thường, rà soát nhật ký kiểm toán và quản lý chứng chỉ/chìa khóa.',
      verifyTip: 'Tạo một sự kiện mẫu (Sample finding) hoặc chạy bài kiểm tra Policy Simulator để chứng minh cơ chế ngăn chặn hoạt động đúng.'
    },
    serverless: {
      consoleFocus: 'Định nghĩa sự kiện kích hoạt (Event Trigger), cấu hình hạn mức tài nguyên/thời gian chạy và thiết lập cơ chế Dead-Letter Queue.',
      verifyTip: 'Bắn một thông điệp sự kiện JSON vào hệ thống và quan sát kết quả xử lý thành công trong bảng điều khiển giám sát.'
    },
    aiml: {
      consoleFocus: 'Lựa chọn mô hình AI phù hợp, cấu hình quyền truy cập Model Access, nạp tập dữ liệu huấn luyện hoặc kết nối tri thức nghiệp vụ.',
      verifyTip: 'Gửi truy vấn Prompt hoặc tập tin media kiểm thử vào giao diện Playground và nhận kết quả suy luận AI thời gian thực.'
    },
    management: {
      consoleFocus: 'Tạo quy tắc giám sát Alarm theo ngưỡng cảnh báo, cấu hình kiểm toán tuân thủ tự động và thiết lập kênh nhận thông báo qua SNS.',
      verifyTip: 'Mô phỏng tình huống chạm ngưỡng cảnh báo để kiểm tra tin nhắn thông báo được gửi thành công đến quản trị viên.'
    },
    analytics: {
      consoleFocus: 'Khởi tạo danh mục dữ liệu (Catalog), thiết lập quy trình trích xuất chuyển đổi (ETL) và cấu hình phân vùng dữ liệu để tối ưu truy vấn.',
      verifyTip: 'Chạy một câu lệnh truy vấn phân tích SQL thử nghiệm và đo lường thời gian đáp ứng cùng khối lượng dữ liệu được quét.'
    },
    devtools: {
      consoleFocus: 'Tạo Pipeline tự động hóa, liên kết kho mã nguồn Git, thiết lập các bước Build/Test và triển khai hạ tầng theo mô hình IaC.',
      verifyTip: 'Thực hiện commit một thay đổi mã nguồn nhỏ và theo dõi pipeline tự động kích hoạt chuyển giao thành công.'
    },
    migration: {
      consoleFocus: 'Cài đặt công cụ thu thập thông tin hoặc agent sao chép trên hệ thống nguồn, kiểm tra băng thông truyền tải và lập kế hoạch cutover.',
      verifyTip: 'Khởi chạy một máy chủ thử nghiệm (Test Instance) trên AWS để xác thực ứng dụng hoạt động chính xác trước giờ cutover chính thức.'
    },
    iot: {
      consoleFocus: 'Đăng ký đối tượng thiết bị (Thing), tạo và đính kèm chứng chỉ bảo mật X.509, viết luật Rules Engine định tuyến dữ liệu cảm biến.',
      verifyTip: 'Sử dụng MQTT Web Client tích hợp sẵn trong console để subscribe vào topic và nhận bản tin JSON từ thiết bị gửi lên.'
    },
    business: {
      consoleFocus: 'Khởi tạo môi trường ứng dụng doanh nghiệp, phân quyền người dùng qua tài khoản định danh và tùy biến quy trình làm việc.',
      verifyTip: 'Đăng nhập vào cổng người dùng cuối (End-user portal) để thực hiện thử nghiệm một tác vụ nghiệp vụ thực tế.'
    },
    media: {
      consoleFocus: 'Thiết lập luồng xử lý hoặc chuyển mã media, định cấu hình độ phân giải (ABR profile) và phân phối qua mạng CDN.',
      verifyTip: 'Phát thử nghiệm video trên trình phát media thử nghiệm (Test Player) để kiểm tra chất lượng hình ảnh và độ trễ phát sóng.'
    },
    cost: {
      consoleFocus: 'Bật các thẻ phân bổ chi phí (Cost Allocation Tags), thiết lập ngân sách chi tiêu và cấu hình thông báo cảnh báo tự động khi chạm ngưỡng.',
      verifyTip: 'Xem bản đồ phân bổ chi tiêu trong báo cáo trực quan và kiểm tra email xác nhận đăng ký ngân sách.'
    }
  };

  const wf = categoryWorkflows[service.category] || {
    consoleFocus: 'Truy cập bảng điều khiển, cấu hình các tham số cốt lõi và thiết lập quyền truy cập bảo mật.',
    verifyTip: 'Kiểm tra trạng thái tài nguyên hiển thị Active/Available và xem log giám sát.'
  };

  return {
    title: `Thực Hành Thao Tác: Cấu Hình & Vận Hành ${service.code} (${service.name})`,
    objective: `Nắm vững thao tác thực tế từ giao diện AWS Console và lệnh AWS CLI để triển khai, kiểm thử và quản lý ${service.code}.`,
    consoleSteps: [
      `1. Đăng nhập AWS Management Console -> Gõ "${service.code}" hoặc "${service.name}" vào thanh tìm kiếm phía trên cùng và nhấn chọn dịch vụ.`,
      `2. Nhấp vào nút hành động chính (ví dụ: [Create ${service.code}], [Get Started] hoặc [Launch]) tại trang tổng quan của dịch vụ.`,
      `3. Bước Cấu Hình Cơ Bản: Đặt tên định danh tài nguyên theo quy ước rõ ràng, chọn AWS Region phù hợp với hệ thống của bạn.`,
      `4. Bước Tinh Chỉnh Tham Số: ${wf.consoleFocus}`,
      `5. Bước Bảo Mật & Thẻ: Gắn thẻ tag (Key: "Environment", Value: "Dev/Lab") để dễ theo dõi chi phí và kiểm soát quyền IAM.`,
      `6. Bấm [Review and Create] -> Kiểm tra lại toàn bộ thông số và nhấn xác nhận khởi tạo tài nguyên.`
    ],
    cliSteps: [
      `# 1. Kiểm tra tài nguyên hiện có hoặc trạng thái dịch vụ ${service.code}:`,
      service.cliSnippet,
      '',
      `# 2. Xem trợ giúp chi tiết về các tham số lệnh:`,
      `aws ${service.code.toLowerCase().replace(/[^a-z0-9]/g, '')} help`
    ],
    verification: `${wf.verifyTip} Đảm bảo tài nguyên hiển thị trạng thái sẵn sàng (Active/Available) và không có cảnh báo lỗi quyền IAM.`,
    cleanup: `Sau khi thực hành xong, chọn tài nguyên vừa tạo trong danh sách -> Bấm [Actions] -> Chọn [Delete] hoặc [Terminate] để không phát sinh chi phí duy trì.`
  };
}
