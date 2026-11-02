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
  }
];
