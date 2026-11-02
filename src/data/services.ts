import { AWSService, Flashcard, ArchitecturePattern } from '../types';
import { EXAM_QUESTIONS } from './examQuestions';
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

export const FLASHCARDS: Flashcard[] = EXAM_QUESTIONS;

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
