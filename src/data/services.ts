import { AWSService, Flashcard, ArchitecturePattern } from '../types';
import { COMPUTE_SERVICES } from './services/compute';
import { STORAGE_SERVICES } from './services/storage';
import { DATABASE_SERVICES } from './services/database';
import { NETWORKING_SERVICES } from './services/networking';
import { SECURITY_SERVICES } from './services/security';
import { SERVERLESS_SERVICES } from './services/serverless';
import { AIML_SERVICES } from './services/aiml';
import { MANAGEMENT_SERVICES } from './services/management';
import { ANALYTICS_SERVICES } from './services/analytics';
import { DEVTOOLS_SERVICES } from './services/devtools';
import { MIGRATION_SERVICES } from './services/migration';
import { IOT_SERVICES } from './services/iot';
import { BUSINESS_SERVICES } from './services/business';
import { MEDIA_SERVICES } from './services/media';
import { COST_SERVICES } from './services/cost';

export const AWS_SERVICES: AWSService[] = [
  ...COMPUTE_SERVICES,
  ...STORAGE_SERVICES,
  ...DATABASE_SERVICES,
  ...NETWORKING_SERVICES,
  ...SECURITY_SERVICES,
  ...SERVERLESS_SERVICES,
  ...AIML_SERVICES,
  ...MANAGEMENT_SERVICES,
  ...ANALYTICS_SERVICES,
  ...DEVTOOLS_SERVICES,
  ...MIGRATION_SERVICES,
  ...IOT_SERVICES,
  ...BUSINESS_SERVICES,
  ...MEDIA_SERVICES,
  ...COST_SERVICES
];

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'q1',
    examCode: 'SAA-C03',
    serviceId: 'ec2',
    scenario: 'Một công ty cần chạy tác vụ xử lý video theo lô (batch job) có thể tạm dừng và chạy lại mà không hỏng dữ liệu, yêu cầu tối ưu chi phí thấp nhất có thể.',
    question: 'Loại hình EC2 instance nào là lựa chọn kinh tế nhất?',
    answer: 'EC2 Spot Instances',
    explanation: 'Spot Instances có mức giảm giá lên tới 90% so với On-Demand. Với các batch job có khả năng chịu lỗi và tiếp tục từ checkpoint, Spot là giải pháp tối ưu chi phí số 1.'
  },
  {
    id: 'q2',
    examCode: 'SAA-C03',
    serviceId: 's3',
    scenario: 'Hồ sơ bệnh án tài chính bắt buộc phải lưu trữ trong 7 năm theo quy định pháp lý, nghiêm cấm mọi hành vi chỉnh sửa hoặc xóa kể cả từ quản trị viên cấp cao.',
    question: 'Giải pháp cấu hình S3 nào đáp ứng yêu cầu trên?',
    answer: 'S3 Object Lock với chế độ Compliance Mode',
    explanation: 'S3 Object Lock theo mô hình WORM (Write Once, Read Many). Chế độ Compliance đảm bảo không ai, kể cả tài khoản AWS Root, có thể ghi đè hay xóa object trước khi hết thời gian khóa.'
  },
  {
    id: 'q3',
    examCode: 'SAA-C03',
    serviceId: 'vpc',
    scenario: 'Các máy chủ EC2 nằm trong Private Subnet cần kết nối ra ngoài Internet để tải các bản vá bảo mật HĐH, nhưng tuyệt đối không cho phép Internet bên ngoài chủ động kết nối vào.',
    question: 'Thành phần mạng nào cần được thiết lập và đặt ở đâu?',
    answer: 'NAT Gateway đặt trong Public Subnet',
    explanation: 'NAT Gateway chuyển đổi địa chỉ IP của các máy trong Private Subnet để ra ngoài Internet một chiều. Để hoạt động, NAT Gateway phải nằm ở Public Subnet và có Elastic IP.'
  },
  {
    id: 'q4',
    examCode: 'SAA-C03',
    serviceId: 'dynamodb',
    scenario: 'Ứng dụng bảng xếp hạng game trực tuyến cần lưu trữ điểm số với độ trễ phản hồi dưới 1 mili-giây (microsecond) cho hàng triệu lượt đọc liên tục trong giờ cao điểm.',
    question: 'Công nghệ tăng tốc nào nên được áp dụng cho DynamoDB?',
    answer: 'Amazon DynamoDB Accelerator (DAX)',
    explanation: 'DAX là cụm bộ đệm trong bộ nhớ (In-memory cache) tương thích hoàn toàn với DynamoDB API, giúp giảm độ trễ từ mili-giây xuống micro-giây mà không cần sửa đổi logic code ứng dụng.'
  },
  {
    id: 'q5',
    examCode: 'SAP-C02',
    serviceId: 'aurora',
    scenario: 'Hệ thống ngân hàng quốc tế yêu cầu cơ sở dữ liệu quan hệ có khả năng phục hồi thảm họa đa vùng (Multi-Region Disaster Recovery) với RPO gần bằng 0 và RTO dưới 1 phút.',
    question: 'Giải pháp cơ sở dữ liệu AWS nào đáp ứng tiêu chuẩn khắt khe này?',
    answer: 'Amazon Aurora Global Database',
    explanation: 'Aurora Global Database sử dụng cơ chế nhân bản chuyên dụng ở tầng lưu trữ đĩa, sao chép dữ liệu đa Region với độ trễ thông thường dưới 1 giây và có thể kích hoạt thăng hạng vùng phụ trong chưa đầy 1 phút.'
  },
  {
    id: 'q6',
    examCode: 'SAA-C03',
    serviceId: 'sqs',
    scenario: 'Trong đợt Flash Sale hàng nghìn đơn hàng đổ về cùng một lúc khiến cho dịch vụ thanh toán phía sau bị quá tải và sập máy chủ.',
    question: 'Mô hình kiến trúc nào giải quyết triệt để vấn đề nghẽn tải này?',
    answer: 'Đặt hàng đợi Amazon SQS làm bộ đệm (Decoupling)',
    explanation: 'Hàng đợi SQS nhận đơn hàng và lưu trữ an toàn. Dịch vụ thanh toán sẽ lấy (poll) từng đợt tin nhắn ra xử lý theo tốc độ phù hợp của nó, triệt tiêu hoàn toàn nghẽn tải.'
  },
  {
    id: 'q7',
    examCode: 'DVA-C02',
    serviceId: 'secrets-manager',
    scenario: 'Doanh nghiệp muốn định kỳ tự động thay đổi mật khẩu cơ sở dữ liệu RDS PostgreSQL mỗi 30 ngày một lần mà không cần nhân viên can thiệp thủ công.',
    question: 'Dịch vụ nào của AWS cung cấp tính năng này sẵn sàng?',
    answer: 'AWS Secrets Manager kết hợp với Lambda Rotation function',
    explanation: 'Secrets Manager tích hợp sẵn các mẫu hàm Lambda chuyên dụng để tự động kết nối vào RDS, cập nhật mật khẩu mới và lưu trữ phiên bản an toàn theo chu kỳ lịch trình.'
  },
  {
    id: 'q8',
    examCode: 'SAP-C02',
    serviceId: 'bedrock',
    scenario: 'Tổ chức muốn xây dựng chatbot tra cứu tri thức nội bộ dựa trên các tài liệu PDF mật, đảm bảo dữ liệu không bị đem đi huấn luyện lại mô hình công cộng.',
    question: 'Dịch vụ Generative AI nào là chuẩn mực doanh nghiệp trên AWS?',
    answer: 'Amazon Bedrock với Knowledge Bases (RAG)',
    explanation: 'Amazon Bedrock cung cấp API serverless truy cập các model hàng đầu (như Claude 3.5), cam kết không lưu trữ hoặc huấn luyện lại dữ liệu khách hàng, tích hợp sẵn RAG với Knowledge Bases.'
  },
  {
    id: 'q9',
    examCode: 'SAP-C02',
    serviceId: 'mgn',
    scenario: 'Doanh nghiệp cần chuyển dịch 500 máy chủ ảo VMware on-premises lên AWS với thời gian gián đoạn kinh doanh (cutover window) tối đa dưới 10 phút.',
    question: 'Chiến lược và công cụ nào tối ưu nhất?',
    answer: 'AWS Application Migration Service (MGN)',
    explanation: 'AWS MGN thực hiện sao chép khối liên tục (continuous block-level replication) ở chế độ ngầm. Khi đến lịch chuyển đổi (cutover window), chỉ cần chuyển hướng DNS và thời gian downtime chỉ mất vài phút.'
  },
  {
    id: 'q10',
    examCode: 'SAP-C02',
    serviceId: 'iot-greengrass',
    scenario: 'Một giàn khoan dầu ngoài khơi thường xuyên mất kết nối Internet vệ tinh nhưng các van cảm biến áp suất phải tự động ngắt nếu nhiệt độ vượt ngưỡng khẩn cấp dưới 5 mili-giây.',
    question: 'Kiến trúc điện toán AWS nào giải quyết được bài toán này?',
    answer: 'AWS IoT Greengrass chạy Local Lambda tại Gateway biên',
    explanation: 'AWS IoT Greengrass cho phép chạy logic Lambda, xử lý dữ liệu cảm biến và điều khiển thiết bị hoàn toàn ngoại tuyến tại chỗ (Edge computing) mà không phụ thuộc vào kết nối đám mây.'
  },
  {
    id: 'q11',
    examCode: 'SAP-C02',
    serviceId: 'cur',
    scenario: 'Tập đoàn đa quốc gia có hàng chục tài khoản AWS Organizations cần xây dựng hệ thống FinOps tự động phân tích chi phí từng tài nguyên tới từng giờ và xuất vào Data Lake.',
    question: 'Nguồn cấp dữ liệu chi phí nào là chính xác và chi tiết nhất?',
    answer: 'AWS Cost and Usage Report (CUR) xuất ra Amazon S3',
    explanation: 'CUR cung cấp dữ liệu chi tiết nhất với độ mịn theo giờ kèm metadata tag và ID tài nguyên, được tự động đưa vào S3 để phân tích với Amazon Athena hoặc Amazon QuickSight.'
  },
  {
    id: 'q12',
    examCode: 'SAP-C02',
    serviceId: 'mediaconvert',
    scenario: 'Hệ thống học trực tuyến cho phép giảng viên tải video bài giảng MP4 lên và cần tự động chuyển đổi sang định dạng HLS đa mức phân giải cho học viên xem trên di động.',
    question: 'Kiến trúc phi máy chủ (Serverless) nào tối ưu nhất?',
    answer: 'S3 Event Notification -> Lambda -> AWS Elemental MediaConvert',
    explanation: 'Khi file MP4 được upload lên S3, S3 kích hoạt Lambda để gửi Job đến MediaConvert chuyển mã thành các dải bitrate HLS, sau đó lưu kết quả vào S3 phân phối qua CloudFront.'
  },
  {
    id: 'q13',
    examCode: 'SCS-C02',
    serviceId: 'kms',
    scenario: 'Ứng dụng tài chính yêu cầu khóa mật mã CMK phải được xoay vòng định kỳ mỗi năm một lần, nhưng dữ liệu cũ đã mã hóa trước đó vẫn phải giải mã được tự động mà không cần can thiệp mã nguồn.',
    question: 'Cấu hình AWS KMS nào đáp ứng đúng chuẩn này?',
    answer: 'KMS Customer Managed Key (CMK) bật Automatic Key Rotation',
    explanation: 'Khi bật Automatic Key Rotation trên Customer Managed Key (CMK), AWS KMS tự động sinh key material mới mỗi năm một lần. KMS lưu trữ toàn bộ các phiên bản khóa cũ, tự động chọn phiên bản phù hợp để giải mã dữ liệu cũ hoàn toàn trong suốt với ứng dụng.'
  },
  {
    id: 'q14',
    examCode: 'ANS-C01',
    serviceId: 'transit-gateway',
    scenario: 'Doanh nghiệp có 20 VPC (gồm 10 Production VPC và 10 Development VPC). Yêu cầu nghiêm ngặt: Các VPC Production nói chuyện được với nhau, các VPC Development nói chuyện được với nhau, nhưng Production và Development tuyệt đối cách ly không thể truyền dữ liệu cho nhau.',
    question: 'Thiết kế định tuyến mạng nào trên AWS Transit Gateway là tối ưu nhất?',
    answer: 'Sử dụng 2 Route Tables riêng biệt trên Transit Gateway (Prod Route Table & Dev Route Table)',
    explanation: 'Transit Gateway hỗ trợ phân đoạn mạng (Network Segmentation) bằng nhiều Route Tables độc lập. Gắn kết (Attachment) của Prod VPC trỏ vào Prod Route Table; Attachment của Dev VPC trỏ vào Dev Route Table, ngăn chặn hoàn toàn việc rò rỉ gói tin giữa 2 môi trường.'
  },
  {
    id: 'q15',
    examCode: 'SAP-C02',
    serviceId: 'dynamodb',
    scenario: 'Nền tảng thanh toán toàn cầu phục vụ người dùng tại Châu Âu và Châu Mỹ, yêu cầu người dùng ở mỗi châu lục đều có thể đọc và ghi dữ liệu với độ trễ dưới 10ms, dữ liệu tự động đồng bộ hai chiều.',
    question: 'Giải pháp kiến trúc cơ sở dữ liệu NoSQL nào là chuẩn xác?',
    answer: 'Amazon DynamoDB Global Tables (Multi-Region Active-Active)',
    explanation: 'DynamoDB Global Tables cung cấp cơ chế sao chép hai chiều Active-Active giữa nhiều Region AWS được quản lý hoàn toàn. Ứng dụng đọc và ghi tại Region cục bộ, dữ liệu tự động nhân bản xuyên lục địa trong vòng dưới 1 giây.'
  },
  {
    id: 'q16',
    examCode: 'SAA-C03',
    serviceId: 's3',
    scenario: 'Một bucket S3 ở Singapore (ap-southeast-1) được cấu hình Cross-Region Replication (CRR) sang Sydney (ap-southeast-2). Tuy nhiên các file được mã hóa bằng KMS Customer Managed Key không tự động sao chép được sang Sydney.',
    question: 'Cần bổ sung cấu hình gì để CRR sao chép thành công các tệp mã hóa KMS?',
    answer: 'Cấu hình Replication Rule hỗ trợ KMS encryption và chỉ định Destination KMS Key ARN tại Sydney',
    explanation: 'Mặc định CRR không sao chép các tệp mã hóa KMS. Bạn phải bật tùy chọn replicate KMS-encrypted objects, cấp quyền `kms:Decrypt` trên key ở Singapore và `kms:Encrypt` trên Destination KMS Key ARN tại Sydney trong IAM Replication Role.'
  },
  {
    id: 'q17',
    examCode: 'DBS-C01',
    serviceId: 'aurora',
    scenario: 'Hệ thống thương mại điện tử có lượng truy cập dao động cực kỳ khó đoán (từ vài request/phút lúc nửa đêm đến hàng triệu request bất ngờ khi chạy quảng cáo TikTok). Yêu cầu CSDL quan hệ tự động tăng giảm công suất trong vài giây mà không làm đứt kết nối.',
    question: 'Lựa chọn công nghệ cơ sở dữ liệu nào tối ưu nhất?',
    answer: 'Amazon Aurora Serverless v2',
    explanation: 'Aurora Serverless v2 tăng giảm tài nguyên tính toán (ACUs - Aurora Capacity Units) theo từng gia số nhỏ (0.5 ACU) chỉ trong vài phần trăm giây mà không làm gián đoạn kết nối hay đóng các transaction đang xử lý.'
  },
  {
    id: 'q18',
    examCode: 'SAP-C02',
    serviceId: 'organizations',
    scenario: 'Giám đốc an ninh thông tin (CISO) yêu cầu chặn tuyệt đối không cho phép bất kỳ kỹ sư nào trong tập đoàn tạo tài nguyên tại các AWS Region ngoài Singapore (ap-southeast-1), áp dụng cho toàn bộ 50 tài khoản thành viên.',
    question: 'Chính sách quản trị tập trung nào đáp ứng yêu cầu trên?',
    answer: 'Áp dụng Service Control Policy (SCP) với điều kiện "aws:RequestedRegion" phủ định',
    explanation: 'Service Control Policy (SCP) áp dụng tại Root hoặc OU của AWS Organizations với hiệu lực Deny: Action: `*`, Resource: `*`, Condition: `StringNotEquals: {"aws:RequestedRegion": ["ap-southeast-1"]}` chặn đứng mọi thao tác tạo tài nguyên ở các Region khác kể cả quyền tài khoản Root thành viên.'
  },
  {
    id: 'q19',
    examCode: 'SCS-C02',
    serviceId: 'waf',
    scenario: 'Trang web đăng nhập của ngân hàng liên tục bị hacker dùng tool tự động dò mật khẩu (Credential Stuffing/Brute-force) từ hàng ngàn địa chỉ IP khác nhau, gửi hơn 200 request/phút vào đường dẫn /api/login.',
    question: 'Quy tắc AWS WAF nào ngăn chặn triệt để cuộc tấn công này?',
    answer: 'Tạo WAF Rate-based Rule lọc theo đường dẫn URI "/api/login" với giới hạn số request trên mỗi IP',
    explanation: 'Rate-based Rule trong AWS WAF theo dõi số lượng yêu cầu đến từ mỗi địa chỉ IP trong khung thời gian 5 phút. Khi một IP gửi vượt ngưỡng cấu hình (ví dụ 100 requests) tới URI /api/login, WAF tự động chặn tạm thời IP đó bằng mã phản hồi 403 Forbidden.'
  },
  {
    id: 'q20',
    examCode: 'ANS-C01',
    serviceId: 'route53',
    scenario: 'Các máy chủ on-premises trong trung tâm dữ liệu doanh nghiệp cần phân giải tên miền nội bộ của các dịch vụ AWS trong Private Hosted Zone (ví dụ: `corp.internal`).',
    question: 'Thành phần DNS nào của AWS Route 53 giải quyết kết nối này?',
    answer: 'Route 53 Resolver Inbound Endpoint',
    explanation: 'Route 53 Resolver Inbound Endpoint tạo các card mạng ENI gắn IP nội bộ trong Subnet của VPC. Máy chủ DNS on-premises chỉ cần cấu hình DNS Forwarder trỏ các truy vấn tên miền `corp.internal` về các IP Inbound Endpoint này qua Direct Connect hoặc VPN.'
  },
  {
    id: 'q21',
    examCode: 'SAP-C02',
    serviceId: 'control-tower',
    scenario: 'Doanh nghiệp muốn thiết lập môi trường đa tài khoản (Multi-Account Landing Zone) chuẩn Best Practices của AWS, tự động cấp phát tài khoản mới có sẵn cấu hình bảo mật, mạng và logging tập trung.',
    question: 'Dịch vụ nào giúp triển khai nhanh chóng và chuẩn hóa toàn bộ hạ tầng này?',
    answer: 'AWS Control Tower với Account Factory',
    explanation: 'AWS Control Tower tự động thiết lập Landing Zone chuẩn gồm SSO (IAM Identity Center), logging tập trung vào S3, kiểm toán bằng AWS Config và cung cấp Account Factory để các nhóm tự tạo tài khoản mới tuân thủ 100% Guardrails của tổ chức.'
  },
  {
    id: 'q22',
    examCode: 'DVA-C02',
    serviceId: 'step-functions',
    scenario: 'Hệ thống tiếp nhận luồng sự kiện cảm biến xe hơi thông minh với tần suất 50.000 sự kiện/giây, yêu cầu điều phối quy trình xử lý không quá 5 phút với chi phí cực thấp.',
    question: 'Loại hình State Machine nào của AWS Step Functions là lựa chọn bắt buộc?',
    answer: 'Step Functions Express Workflows',
    explanation: 'Express Workflows được thiết kế chuyên biệt cho khối lượng sự kiện khổng lồ (hơn 100.000 executions/giây), thời gian chạy tối đa 5 phút, thanh toán theo số execution và thời lượng GB-giây với chi phí rẻ hơn nhiều lần so với Standard Workflows.'
  },
  {
    id: 'q23',
    examCode: 'SAP-C02',
    serviceId: 'drs',
    scenario: 'Doanh nghiệp yêu cầu giải pháp Phục hồi thảm họa (DR) cho các máy chủ on-premises lên AWS với RPO dưới 1 giây và RTO dưới 15 phút, nhưng chi phí hạ tầng dự phòng thường trực trên AWS phải ở mức tối thiểu.',
    question: 'Chiến lược và dịch vụ DR nào đáp ứng hoàn hảo tiêu chí này?',
    answer: 'Chiến lược Pilot Light sử dụng AWS Elastic Disaster Recovery (DRS)',
    explanation: 'AWS DRS sao chép liên tục mức khối đĩa (block-level replication) vào một Staging Area gọn nhẹ trên AWS (chỉ gồm các ổ EBS giá rẻ và instance EC2 nhỏ làm replication server). Khi thảm họa xảy ra, DRS tự động kích hoạt máy chủ công suất lớn trong vòng vài phút.'
  },
  {
    id: 'q24',
    examCode: 'SCS-C02',
    serviceId: 'secrets-manager',
    scenario: 'Ứng dụng chạy trên tài khoản AWS A cần đọc chuỗi kết nối CSDL được lưu trữ trong AWS Secrets Manager tại tài khoản AWS B. Cả hai tài khoản đều thuộc cùng tổ chức AWS Organizations.',
    question: 'Các điều kiện cần thiết để cấp quyền truy cập chéo tài khoản an toàn là gì?',
    answer: 'Cấp quyền trong Secret Resource-based Policy, IAM Role Policy tài khoản A, và KMS Key Policy cho phép tài khoản A giải mã',
    explanation: 'Truy cập chéo tài khoản vào Secrets Manager yêu cầu: 1) Secret Resource Policy cho phép Principal từ tài khoản A; 2) IAM Role tại tài khoản A có quyền `secretsmanager:GetSecretValue`; 3) Khóa KMS dùng mã hóa secret phải là Customer Managed Key (CMK) và Key Policy cho phép tài khoản A quyền `kms:Decrypt`.'
  },
  {
    id: 'q25',
    examCode: 'DAS-C01',
    serviceId: 'kinesis-data-streams',
    scenario: 'Cần thu thập luồng dữ liệu clickstream của người dùng theo thời gian thực để 3 ứng dụng độc lập cùng đọc song song: 1 ứng dụng hiển thị dashboard, 1 ứng dụng phân tích gian lận, 1 ứng dụng lưu trữ raw data vào Data Lake.',
    question: 'Công nghệ trung chuyển nào đáp ứng yêu cầu trên tốt hơn SQS FIFO?',
    answer: 'Amazon Kinesis Data Streams',
    explanation: 'Kinesis Data Streams lưu trữ dữ liệu luồng theo Shards trong tối đa 365 ngày và cho phép nhiều Consumer Applications đọc song song độc lập tại các vị trí con trỏ khác nhau mà không làm mất dữ liệu của ứng dụng khác.'
  },
  {
    id: 'q26',
    examCode: 'SAP-C02',
    serviceId: 'route53',
    scenario: 'Triển khai phiên bản ứng dụng mới theo phương pháp Blue/Green Deployment cho hàng triệu người dùng toàn cầu mà không phát sinh bất kỳ giây downtime nào và có thể rollback tức thì nếu có lỗi.',
    question: 'Cơ chế chuyển hướng mạng nào là an toàn và nhanh nhất?',
    answer: 'Chuyển đổi bản ghi DNS Alias Record trên Route 53 (hoặc Swap Environment CNAME)',
    explanation: 'Bằng cách dựng môi trường Green hoàn chỉnh chạy song song với môi trường Blue, bạn kiểm thử tải toàn diện trên Green. Khi sẵn sàng, chỉ cần đổi Route 53 Alias Record trỏ sang ALB của Green (TTL = 0 trên Alias). Nếu có sự cố, đổi ngược lại Blue trong 1 thao tác.'
  },
  {
    id: 'q27',
    examCode: 'MLS-C01',
    serviceId: 'sagemaker',
    scenario: 'Mô hình học máy Deep Learning thị giác máy tính sau khi huấn luyện xong cần triển khai xuống các camera thông minh chạy chip ARM nhúng tại các cửa hàng bán lẻ để phát hiện hành vi trộm cắp với độ trễ dưới 20ms.',
    question: 'Công cụ nào trong hệ sinh thái SageMaker tối ưu hóa mô hình cho phần cứng biên?',
    answer: 'Amazon SageMaker Neo',
    explanation: 'SageMaker Neo tự động chuyển đổi và tối ưu hóa các mô hình ML (TensorFlow, PyTorch, ONNX) thành mã máy nhị phân chạy tối ưu riêng cho từng loại phần cứng cụ thể (NVIDIA Jetson, ARM Cortex, Intel) giúp giảm kích thước mô hình tới 10 lần và tăng tốc suy luận gấp đôi.'
  },
  {
    id: 'q28',
    examCode: 'SAA-C03',
    serviceId: 'privatelink',
    scenario: 'Một công ty SaaS cung cấp dịch vụ phân tích dữ liệu cho hàng trăm khách hàng doanh nghiệp trên AWS. Khách hàng yêu cầu kết nối an toàn tuyệt đối từ VPC của họ sang dịch vụ SaaS mà không đi qua Internet công cộng và không cần kết nối VPC Peering phức tạp.',
    question: 'Giải pháp kiến trúc mạng nào là tiêu chuẩn ngành?',
    answer: 'AWS PrivateLink (VPC Endpoint Service)',
    explanation: 'Nhà cung cấp SaaS cấu hình Network Load Balancer (NLB) làm Endpoint Service. Khách hàng tạo VPC Interface Endpoint trong VPC của họ để kết nối trực tiếp qua mạng ngầm AWS mà không lo trùng lặp dải IP CIDR và hoàn toàn không lộ IP ra Internet.'
  },
  {
    id: 'q29',
    examCode: 'SAP-C02',
    serviceId: 'storage-gateway',
    scenario: 'Doanh nghiệp on-premises có dung lượng ổ cứng NAS sắp cạn kiệt, cần giải pháp mở rộng dung lượng không giới hạn lên Amazon S3 qua giao thức chia sẻ tệp SMB/NFS quen thuộc cho nhân viên văn phòng mà vẫn duy trì tốc độ mở file nhanh với các file mới dùng.',
    question: 'Loại hình Storage Gateway nào phù hợp nhất?',
    answer: 'Amazon S3 File Gateway',
    explanation: 'S3 File Gateway triển khai dưới dạng máy ảo VM on-premises, cung cấp giao thức SMB/NFS cho người dùng cục bộ. Nó duy trì bộ nhớ đệm (Local Cache) cho các file thường xuyên truy cập và tự động đồng bộ bất đồng bộ dữ liệu vào S3 Bucket.'
  },
  {
    id: 'q30',
    examCode: 'SAP-C02',
    serviceId: 'lambda',
    scenario: 'Ứng dụng ngân hàng số sử dụng kiến trúc Serverless Microservices. Trong các đợt mở cổng đăng ký mở thẻ tín dụng, hiện tượng Cold Start của các hàm Lambda viết bằng Java khiến cho thời gian phản hồi API bị trễ hơn 5 giây gây trải nghiệm tiêu cực.',
    question: 'Tính năng nào của AWS Lambda giải quyết triệt để 100% hiện tượng Cold Start này?',
    answer: 'Bật AWS Lambda Provisioned Concurrency',
    explanation: 'Provisioned Concurrency khởi tạo và giữ ấm sẵn sàng một số lượng môi trường thực thi Lambda được cấu hình trước (ví dụ 100 execution environments). Khi request ập đến, code thực thi ngay lập tức với độ trễ phản hồi tính bằng mili-giây, triệt tiêu hoàn toàn Cold Start.'
  }
];

export const ARCHITECTURE_PATTERNS: ArchitecturePattern[] = [
  {
    id: 'serverless-web',
    title: 'Serverless Web Application',
    description: 'Kiến trúc website tĩnh kết hợp API không máy chủ có khả năng mở rộng vô hạn và chi phí bảo trì gần như bằng 0.',
    problem: 'Xây dựng ứng dụng web thương mại điện tử có lượng truy cập đột biến nhưng không muốn trả tiền cho máy chủ nhàn rỗi.',
    solution: 'CloudFront phân phối giao diện tĩnh từ S3. Các yêu cầu API gửi tới API Gateway, kích hoạt Lambda xử lý logic và lưu trữ dữ liệu vào DynamoDB.',
    services: ['CloudFront', 'S3', 'API Gateway', 'Lambda', 'DynamoDB', 'Cognito']
  },
  {
    id: 'resilient-3tier',
    title: 'Resilient Multi-AZ 3-Tier Architecture',
    description: 'Kiến trúc 3 tầng kinh điển phân tách Web, App và Database trên nhiều Availability Zones đảm bảo độ sẵn sàng 99.99%.',
    problem: 'Ứng dụng doanh nghiệp đòi hỏi vận hành liên tục, ngay cả khi một trung tâm dữ liệu (AZ) bị mất điện hoàn toàn.',
    solution: 'Application Load Balancer đặt ở Public Subnet. Máy chủ Web/App đặt trong Private Subnet quản lý bởi Auto Scaling Group. CSDL chạy trên Aurora/RDS Multi-AZ với failover tự động.',
    services: ['VPC', 'ALB', 'EC2', 'Auto Scaling', 'RDS', 'Aurora', 'Route 53', 'NAT Gateway']
  },
  {
    id: 'event-driven-fanout',
    title: 'Event-Driven Microservices (Fan-Out)',
    description: 'Kiến trúc hướng sự kiện đẩy tin nhắn đồng thời tới nhiều dịch vụ độc lập xử lý song song.',
    problem: 'Khi khách hàng đặt đơn, cần đồng thời: trừ kho hàng, gửi email hóa đơn, phân tích gian lận và thông báo cho kho vận.',
    solution: 'Ứng dụng gửi sự kiện vào Amazon SNS Topic. SNS Topic tự động nhân bản thông điệp vào nhiều Amazon SQS Queues riêng biệt của từng microservice.',
    services: ['SNS', 'SQS', 'Lambda', 'EventBridge', 'Step Functions']
  },
  {
    id: 'genai-rag-pipeline',
    title: 'Enterprise GenAI RAG Pipeline',
    description: 'Kiến trúc hỏi đáp AI tạo sinh trên kho tài liệu nội bộ doanh nghiệp với độ bảo mật cao nhất.',
    problem: 'Mô hình AI bị ảo giác (hallucination) và không có kiến thức về quy trình chính sách nội bộ mật của công ty.',
    solution: 'Tài liệu PDF đưa vào S3, tự động phân đoạn và tạo vector embeddings qua Amazon Bedrock Titan đưa vào OpenSearch Serverless. Khi người dùng hỏi, hệ thống tìm đoạn văn bản liên quan nhất làm ngữ cảnh đưa cho Claude sinh câu trả lời.',
    services: ['Bedrock', 'S3', 'Lambda', 'OpenSearch', 'API Gateway']
  },
  {
    id: 'hybrid-cloud-migration',
    title: 'Large-Scale Enterprise Migration & Modernization',
    description: 'Mô hình di chuyển hàng trăm máy chủ từ On-Premises lên AWS kết hợp Direct Connect và MGN.',
    problem: 'Doanh nghiệp đóng cửa Data Center vật lý, cần chuyển đổi hệ thống với downtime tối thiểu và quản lý tập trung.',
    solution: 'Sử dụng AWS Direct Connect thiết lập đường truyền chuyên dụng. Thu thập dependency bằng Discovery Service, sao chép đĩa ngầm liên tục bằng MGN, chuyển đổi CSDL bằng DMS và quản lý tiến độ tổng thể qua Migration Hub.',
    services: ['Direct Connect', 'MGN', 'DMS', 'Migration Hub', 'EC2', 'RDS']
  },
  {
    id: 'iot-smart-telematics',
    title: 'Automotive IoT & Predictive Analytics',
    description: 'Kiến trúc thu thập và phân tích dữ liệu xe thông minh thời gian thực phát hiện cảnh báo sớm hỏng hóc.',
    problem: 'Hàng trăm nghìn xe điện di chuyển liên tục, cần thu thập chỉ số pin và động cơ để bảo trì dự đoán mà không làm tốn băng thông 4G.',
    solution: 'AWS IoT FleetWise lọc và giải mã dữ liệu CAN bus trên xe, gửi sự kiện bất thường về AWS IoT Core. IoT Events quản lý trạng thái pin, lưu chuỗi thời gian vào Timestream và cảnh báo kỹ thuật viên qua SNS.',
    services: ['IoT FleetWise', 'IoT Core', 'IoT Events', 'Timestream', 'SNS', 'QuickSight']
  },
  {
    id: 'multi-region-active-active',
    title: 'Global Multi-Region Active-Active Resilience',
    description: 'Kiến trúc phục hồi thảm họa cấp cao nhất với dữ liệu đồng bộ hai chiều xuyên lục địa, RPO gần 0 và RTO dưới 10 giây.',
    problem: 'Hệ thống tài chính toàn cầu bắt buộc phải hoạt động liên tục 99.999%, nếu một Region AWS bị cô lập thì lưu lượng phải tự động chuyển ngay sang Region khác.',
    solution: 'Route 53 Application Recovery Controller (ARC) định tuyến lưu lượng thông minh. Dữ liệu ghi phân tán vào DynamoDB Global Tables và Aurora Global Database sao chép ở tầng đĩa. S3 Multi-Region Access Points tối ưu hóa tải tệp.',
    services: ['Route 53', 'DynamoDB', 'Aurora', 'S3', 'CloudFront', 'Global Accelerator']
  },
  {
    id: 'eks-microservices-mesh',
    title: 'Enterprise Kubernetes Platform on AWS EKS',
    description: 'Nền tảng container điều phối hàng trăm microservices với Service Mesh, bảo mật IAM Role per Pod và Auto-scaling tức thì.',
    problem: 'Hệ thống microservices phức tạp gặp khó khăn trong việc quan sát luồng giao tiếp (observability), mở rộng cụm node chậm chạp và quản lý phân quyền bảo mật lỏng lẻo.',
    solution: 'Cụm Amazon EKS chạy trên AWS Graviton. Sử dụng Karpenter tự động cấp phát EC2 node tối ưu trong 30 giây. IAM Roles for Service Accounts (IRSA) cấp quyền hạt nhân cho từng Pod. AWS Load Balancer Controller điều phối Ingress.',
    services: ['EKS', 'ECR', 'ALB', 'IAM', 'CloudWatch', 'KMS']
  },
  {
    id: 'streaming-lakehouse-iceberg',
    title: 'Real-Time Streaming Lakehouse (Iceberg & Flink)',
    description: 'Kiến trúc hồ dữ liệu hiện đại nạp hàng triệu bản ghi mỗi giây, xử lý biến đổi luồng và cho phép truy vấn SQL chuẩn ACID tức thì.',
    problem: 'Hệ thống Data Warehouse truyền thống bị chậm trễ dữ liệu hàng giờ (Batch ETL trễ), không hỗ trợ cập nhật từng dòng và chi phí lưu trữ mở rộng quá cao.',
    solution: 'Dữ liệu sự kiện nạp vào Kinesis Data Streams. Managed Service for Apache Flink xử lý tính toán cửa sổ thời gian thực (tumbling windows). Ghi trực tiếp vào Amazon S3 dưới định dạng Apache Iceberg qua Glue Data Catalog, truy vấn trực tiếp bằng Amazon Athena.',
    services: ['Kinesis Data Streams', 'Apache Flink', 'S3', 'Glue', 'Athena', 'QuickSight']
  },
  {
    id: 'hybrid-hub-spoke-network',
    title: 'Enterprise Hub-and-Spoke Network Security Architecture',
    description: 'Mô hình mạng doanh nghiệp hình sao tập trung kiểm soát toàn bộ lưu lượng vào ra Internet và kết nối On-Premises.',
    problem: 'Hàng chục VPC phân tán thiếu sự kiểm soát an ninh mạng tập trung, nguy cơ rò rỉ dữ liệu và chi phí nhân bản thiết bị tường lửa quá đắt đỏ.',
    solution: 'AWS Transit Gateway làm trung tâm kết nối hình sao. Mọi lưu lượng kết nối ra Internet và liên VPC đều được định tuyến qua một Inspection VPC có đặt cụm AWS Network Firewall kiểm tra gói tin sâu (Deep Packet Inspection IDS/IPS). Đường truyền vật lý kết nối qua AWS Direct Connect có dự phòng VPN.',
    services: ['Transit Gateway', 'Network Firewall', 'Direct Connect', 'VPC', 'Route 53']
  },
  {
    id: 'multi-account-finops',
    title: 'Enterprise Multi-Account FinOps & Security Governance',
    description: 'Hạ tầng quản trị đa tài khoản tự động hóa với rào chắn bảo mật (Guardrails) và phân bổ ngân sách chi tiết cho từng phòng ban.',
    problem: 'Tập đoàn có hàng chục nhóm phát triển tự ý tạo tài nguyên gây mất an toàn thông tin, thiếu kiểm soát thẻ chi phí (Tagging) và hóa đơn đám mây tăng mất kiểm soát.',
    solution: 'AWS Control Tower thiết lập Landing Zone với Organizations và Service Control Policies (SCPs). AWS Config Rules liên tục đánh giá tuân thủ. AWS Billing Conductor chia sẻ mức giá chiết khấu nội bộ và xuất Cost & Usage Report (CUR) vào Data Lake phân tích FinOps.',
    services: ['Control Tower', 'Organizations', 'Config', 'Budgets', 'CUR', 'Cost Explorer']
  },
  {
    id: 'genai-multi-agent',
    title: 'Autonomous Enterprise Multi-Agent AI Workflow',
    description: 'Kiến trúc điều phối mạng lưới trợ lý AI chuyên môn hóa, tự động gọi API nghiệp vụ và ra quyết định xử lý quy trình kinh doanh.',
    problem: 'Mô hình AI đơn lẻ không thể tự thực thi các quy trình phức tạp nhiều bước như phê duyệt hồ sơ vay vốn hay đối soát thanh toán đa hệ thống.',
    solution: 'Amazon Bedrock Agents sử dụng ReAct framework phân rã nhiệm vụ. Bedrock Guardrails kiểm soát nội dung độc hại và dữ liệu nhạy cảm PII. AWS Step Functions điều phối quy trình làm việc giữa các Agent. Các Action Groups kích hoạt Lambda kết nối vào CSDL Aurora và hệ thống backend doanh nghiệp.',
    services: ['Bedrock', 'Step Functions', 'Lambda', 'Aurora', 'KMS', 'CloudWatch']
  }
];
