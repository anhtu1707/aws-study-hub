import fs from 'fs';
import path from 'path';

const patterns = [
  // --- 1. Web & Serverless Architectures (6) ---
  {
    id: 'serverless-web',
    category: 'Web & Serverless',
    title: 'Serverless Web Application',
    description: 'Kiến trúc website tĩnh kết hợp API không máy chủ có khả năng mở rộng vô hạn và chi phí bảo trì gần như bằng 0.',
    problem: 'Xây dựng ứng dụng web thương mại điện tử có lượng truy cập đột biến nhưng không muốn trả tiền cho máy chủ nhàn rỗi.',
    solution: 'CloudFront phân phối giao diện tĩnh từ S3. Các yêu cầu API gửi tới API Gateway, kích hoạt Lambda xử lý logic và lưu trữ dữ liệu vào DynamoDB.',
    services: ['CloudFront', 'S3', 'API Gateway', 'Lambda', 'DynamoDB', 'Cognito']
  },
  {
    id: 'resilient-3tier',
    category: 'Web & Serverless',
    title: 'Resilient Multi-AZ 3-Tier Architecture',
    description: 'Kiến trúc 3 tầng kinh điển phân tách Web, App và Database trên nhiều Availability Zones đảm bảo độ sẵn sàng 99.99%.',
    problem: 'Ứng dụng doanh nghiệp đòi hỏi vận hành liên tục, ngay cả khi một trung tâm dữ liệu (AZ) bị mất điện hoàn toàn.',
    solution: 'Application Load Balancer đặt ở Public Subnet. Máy chủ Web/App đặt trong Private Subnet quản lý bởi Auto Scaling Group. CSDL chạy trên Aurora/RDS Multi-AZ với failover tự động.',
    services: ['VPC', 'ALB', 'EC2', 'Auto Scaling', 'RDS', 'Aurora', 'Route 53', 'NAT Gateway']
  },
  {
    id: 'websocket-realtime-chat',
    category: 'Web & Serverless',
    title: 'Real-Time WebSocket Serverless Messaging',
    description: 'Kiến trúc nhắn tin thời gian thực hai chiều (duplex) duy trì kết nối hàng triệu người dùng không cần quản lý máy chủ.',
    problem: 'Hệ thống chat và thông báo chứng khoán cần đẩy dữ liệu tức thì xuống trình duyệt mà không dùng polling gây nghẽn máy chủ.',
    solution: 'API Gateway WebSocket API quản lý kết nối TCP persistent. Connection ID lưu trữ trong DynamoDB. Khi có tin nhắn, Lambda gửi ngược lại cho client qua PostToConnection API.',
    services: ['API Gateway', 'Lambda', 'DynamoDB', 'EventBridge', 'WAF']
  },
  {
    id: 'ssr-nextjs-amplify',
    category: 'Web & Serverless',
    title: 'Global SSR & Edge-Rendered Web Platform',
    description: 'Nền tảng thương mại điện tử Next.js kết hợp Server-Side Rendering (SSR) tại Edge và CDN toàn cầu.',
    problem: 'Trang web thương mại điện tử cần tối ưu hóa SEO và tốc độ First Contentful Paint (FCP) dưới 0.8 giây cho khách hàng toàn cầu.',
    solution: 'AWS Amplify Hosting kết hợp CloudFront và Lambda@Edge / CloudFront Functions thực hiện render HTML tại Edge gần người dùng nhất, nạp dữ liệu động từ DynamoDB.',
    services: ['Amplify', 'CloudFront', 'Lambda', 'Route 53', 'S3']
  },
  {
    id: 'api-caching-accelerator',
    category: 'Web & Serverless',
    title: 'High-Throughput Edge API Caching',
    description: 'Kiến trúc tăng tốc API toàn cầu với bộ nhớ đệm đa tầng giảm 90% tải cho cụm máy chủ gốc.',
    problem: 'Các truy vấn tra cứu danh mục sản phẩm và tỷ giá ngoại tệ gửi hàng triệu request/giây làm sập cơ sở dữ liệu backend.',
    solution: 'CloudFront phân phối API với API Gateway tích hợp ElastiCache for Redis và CloudFront Caching TTL, phục vụ dữ liệu trực tiếp tại 600+ điểm PoP.',
    services: ['CloudFront', 'API Gateway', 'ElastiCache', 'Lambda', 'Shield']
  },
  {
    id: 'graphql-appsync-offline',
    category: 'Web & Serverless',
    title: 'Enterprise GraphQL & Offline-First Mobile',
    description: 'Nền tảng API GraphQL tập trung kết hợp đồng bộ hóa dữ liệu ngoại tuyến (Offline Sync) cho thiết bị di động.',
    problem: 'Ứng dụng mobile của nhân viên thị trường thường xuyên mất sóng 4G nhưng vẫn phải nhập liệu và tự động đồng bộ khi có mạng.',
    solution: 'AWS AppSync làm điểm tập trung GraphQL, sử dụng Amplify DataStore lưu trữ cục bộ trên điện thoại và tự động giải quyết xung đột (Conflict Resolution) khi đồng bộ vào DynamoDB.',
    services: ['AppSync', 'DynamoDB', 'Cognito', 'Lambda', 'Amplify']
  },

  // --- 2. Microservices & Containers (6) ---
  {
    id: 'eks-microservices-mesh',
    category: 'Microservices & Containers',
    title: 'Enterprise Kubernetes Platform on AWS EKS',
    description: 'Nền tảng container điều phối hàng trăm microservices với Service Mesh, bảo mật IAM Role per Pod và Auto-scaling tức thì.',
    problem: 'Hệ thống microservices phức tạp gặp khó khăn trong việc quan sát luồng giao tiếp (observability), mở rộng cụm node chậm chạp và quản lý phân quyền bảo mật lỏng lẻo.',
    solution: 'Cụm Amazon EKS chạy trên AWS Graviton. Sử dụng Karpenter tự động cấp phát EC2 node tối ưu trong 30 giây. IAM Roles for Service Accounts (IRSA) cấp quyền hạt nhân cho từng Pod. AWS Load Balancer Controller điều phối Ingress.',
    services: ['EKS', 'ECR', 'ALB', 'IAM', 'CloudWatch', 'KMS']
  },
  {
    id: 'event-driven-fanout',
    category: 'Microservices & Containers',
    title: 'Event-Driven Microservices (Fan-Out)',
    description: 'Kiến trúc hướng sự kiện đẩy tin nhắn đồng thời tới nhiều dịch vụ độc lập xử lý song song.',
    problem: 'Khi khách hàng đặt đơn, cần đồng thời: trừ kho hàng, gửi email hóa đơn, phân tích gian lận và thông báo cho kho vận.',
    solution: 'Ứng dụng gửi sự kiện vào Amazon SNS Topic. SNS Topic tự động nhân bản thông điệp vào nhiều Amazon SQS Queues riêng biệt của từng microservice.',
    services: ['SNS', 'SQS', 'Lambda', 'EventBridge', 'Step Functions']
  },
  {
    id: 'ecs-fargate-serverless-containers',
    category: 'Microservices & Containers',
    title: 'Serverless Container Microservices with ECS Fargate',
    description: 'Chạy ứng dụng containerized mà không cần quản trị máy chủ EC2, vá lỗi hệ điều hành hay quản lý cụm.',
    problem: 'Đội ngũ phát triển muốn chạy các ứng dụng Docker nhưng không có đội vận hành hạ tầng chuyên trách cụm Kubernetes.',
    solution: 'Amazon ECS chạy task trên AWS Fargate. Application Load Balancer định tuyến tới các Task. AWS Secrets Manager cấp phát thông tin mật an toàn vào biến môi trường.',
    services: ['ECS', 'Fargate', 'ALB', 'ECR', 'Secrets Manager', 'CloudWatch']
  },
  {
    id: 'saga-orchestration-step-functions',
    category: 'Microservices & Containers',
    title: 'Distributed Transaction Saga Pattern',
    description: 'Mô hình điều phối giao dịch phân tán giữa các microservices có cơ chế bồi hoàn tự động (Compensating Transactions).',
    problem: 'Trong giao dịch đặt tour du lịch (Vé máy bay, Khách sạn, Thuê xe), nếu bước thuê xe thất bại thì phải tự động hủy phòng và hoàn tiền vé máy bay.',
    solution: 'AWS Step Functions điều phối State Machine quy trình Saga. Mỗi bước gọi Lambda thực thi một microservice; nếu có lỗi xảy ra (Catch Error), Step Functions tự động gọi nhánh bồi hoàn hoàn tác các bước trước.',
    services: ['Step Functions', 'Lambda', 'DynamoDB', 'SQS', 'SNS']
  },
  {
    id: 'cqrs-event-sourcing',
    category: 'Microservices & Containers',
    title: 'CQRS & Event Sourcing Architecture',
    description: 'Phân tách lệnh ghi (Command) và truy vấn đọc (Query) kết hợp lưu trữ chuỗi sự kiện bất biến.',
    problem: 'Hệ thống ngân hàng số yêu cầu kiểm toán từng thay đổi số dư và cần tốc độ đọc sao kê cực nhanh không bị ảnh hưởng bởi tải ghi.',
    solution: 'Lệnh ghi đẩy vào Kinesis Data Streams lưu trữ chuỗi sự kiện gốc vào DynamoDB (Event Store). Lambda nạp dữ liệu biến đổi vào OpenSearch Service để phục vụ truy vấn đọc (Read Model) với độ trễ cực thấp.',
    services: ['DynamoDB', 'Kinesis Data Streams', 'Lambda', 'OpenSearch', 'API Gateway']
  },
  {
    id: 'strangler-fig-migration',
    category: 'Microservices & Containers',
    title: 'Monolith to Microservices Strangler Fig Migration',
    description: 'Chiến lược bẻ nhỏ khối ứng dụng nguyên khối (Monolith) sang microservices từng bước mà không gián đoạn kinh doanh.',
    problem: 'Ứng dụng Monolith khổng lồ chạy trên On-Premises chứa rủi ro quá lớn nếu viết lại toàn bộ từ đầu (Big Bang Rewrite).',
    solution: 'Đặt AWS API Gateway hoặc Application Load Balancer làm Reverse Proxy phía trước. Từng API mới được bóc tách sẽ trỏ sang AWS Lambda/ECS, các API cũ tiếp tục định tuyến về Monolith cũ cho đến khi hoàn tất di chuyển.',
    services: ['API Gateway', 'ALB', 'ECS', 'Lambda', 'Direct Connect']
  },

  // --- 3. Generative AI & Machine Learning (6) ---
  {
    id: 'genai-rag-pipeline',
    category: 'Generative AI & ML',
    title: 'Enterprise GenAI RAG Pipeline',
    description: 'Kiến trúc hỏi đáp AI tạo sinh trên kho tài liệu nội bộ doanh nghiệp với độ bảo mật cao nhất.',
    problem: 'Mô hình AI bị ảo giác (hallucination) và không có kiến thức về quy trình chính sách nội bộ mật của công ty.',
    solution: 'Tài liệu PDF đưa vào S3, tự động phân đoạn và tạo vector embeddings qua Amazon Bedrock Titan đưa vào OpenSearch Serverless. Khi người dùng hỏi, hệ thống tìm đoạn văn bản liên quan nhất làm ngữ cảnh đưa cho Claude sinh câu trả lời.',
    services: ['Bedrock', 'S3', 'Lambda', 'OpenSearch', 'API Gateway']
  },
  {
    id: 'genai-multi-agent',
    category: 'Generative AI & ML',
    title: 'Autonomous Enterprise Multi-Agent AI Workflow',
    description: 'Kiến trúc điều phối mạng lưới trợ lý AI chuyên môn hóa, tự động gọi API nghiệp vụ và ra quyết định xử lý quy trình kinh doanh.',
    problem: 'Mô hình AI đơn lẻ không thể tự thực thi các quy trình phức tạp nhiều bước như phê duyệt hồ sơ vay vốn hay đối soát thanh toán đa hệ thống.',
    solution: 'Amazon Bedrock Agents sử dụng ReAct framework phân rã nhiệm vụ. Bedrock Guardrails kiểm soát nội dung độc hại và dữ liệu nhạy cảm PII. AWS Step Functions điều phối quy trình làm việc giữa các Agent. Các Action Groups kích hoạt Lambda kết nối vào CSDL Aurora và hệ thống backend doanh nghiệp.',
    services: ['Bedrock', 'Step Functions', 'Lambda', 'Aurora', 'KMS', 'CloudWatch']
  },
  {
    id: 'llm-fine-tuning-sagemaker',
    category: 'Generative AI & ML',
    title: 'Private LLM Fine-Tuning & Serving Infrastructure',
    description: 'Quy trình tinh chỉnh mô hình ngôn ngữ lớn (LoRA/PEFT) và phục vụ suy luận riêng tư trên cụm GPU.',
    problem: 'Doanh nghiệp y tế cần huấn luyện mô hình LLM chuyên sâu về hồ sơ bệnh án với dữ liệu bảo mật tuyệt đối không rời khỏi VPC.',
    solution: 'Amazon SageMaker Training Jobs chạy trên cụm GPU EC2 P4de với dữ liệu nạp từ FSx for Lustre. Mô hình triển khai qua SageMaker Asynchronous Inference Endpoints với Auto Scaling theo số lượng request.',
    services: ['SageMaker', 'FSx', 'S3', 'EBS', 'EC2', 'CloudWatch']
  },
  {
    id: 'fraud-detection-mlops',
    category: 'Generative AI & ML',
    title: 'Real-Time Fraud Detection & MLOps Pipeline',
    description: 'Phát hiện giao dịch gian lận thời gian thực dưới 50ms kết hợp quy trình CI/CD tự động huấn luyện lại mô hình.',
    problem: 'Các giao dịch thẻ tín dụng giả mạo cần bị ngăn chặn ngay trong luồng quẹt thẻ mà không làm trễ giao dịch của khách hàng hợp lệ.',
    solution: 'Amazon Fraud Detector kết hợp SageMaker Real-Time Endpoint phân tích đặc trưng từ SageMaker Feature Store. SageMaker Model Monitor phát hiện lệch dữ liệu (data drift) để tự động kích hoạt SageMaker Pipelines huấn luyện lại.',
    services: ['SageMaker', 'Kinesis Data Streams', 'DynamoDB', 'Lambda', 'EventBridge']
  },
  {
    id: 'computer-vision-edge-iot',
    category: 'Generative AI & ML',
    title: 'Edge Computer Vision & Defect Detection',
    description: 'Thị giác máy tính phát hiện lỗi sản phẩm trên băng chuyền nhà máy với độ trễ siêu thấp.',
    problem: 'Camera kiểm tra chất lượng linh kiện điện tử hoạt động tại nhà xưởng, đường truyền Internet chập chờn không thể gửi video lên đám mây.',
    solution: 'Amazon Lookout for Vision huấn luyện mô hình phát hiện dị vật. SageMaker Neo biên dịch mô hình chạy trực tiếp trên thiết bị AWS Panorama / IoT Greengrass tại biên, điều khiển cánh tay robot gạt sản phẩm lỗi dưới 10ms.',
    services: ['Lookout for Vision', 'SageMaker', 'IoT Greengrass', 'S3', 'SNS']
  },
  {
    id: 'speech-callcenter-analytics',
    category: 'Generative AI & ML',
    title: 'Call Center Intelligence & Voice Sentiment Analytics',
    description: 'Ghi âm cuộc gọi tổng đài, chuyển đổi giọng nói thành văn bản và phân tích cảm xúc khách hàng tự động bằng GenAI.',
    problem: 'Hàng chục nghìn cuộc gọi mỗi ngày của tổng đài chăm sóc khách hàng không được kiểm soát chất lượng kịp thời.',
    solution: 'Amazon Chime / Connect ghi âm cuộc gọi lưu vào S3. Amazon Transcribe bóc tách giọng nói thành chữ và nhận diện người nói. Amazon Bedrock phân tích mức độ hài lòng, tóm tắt nội dung cuộc gọi và gắn cờ các trường hợp khiếu nại gay gắt.',
    services: ['Transcribe', 'Bedrock', 'S3', 'Lambda', 'EventBridge', 'QuickSight']
  },

  // --- 4. Data Engineering & Analytics (6) ---
  {
    id: 'streaming-lakehouse-iceberg',
    category: 'Data & Analytics',
    title: 'Real-Time Streaming Lakehouse (Iceberg & Flink)',
    description: 'Kiến trúc hồ dữ liệu hiện đại nạp hàng triệu bản ghi mỗi giây, xử lý biến đổi luồng và cho phép truy vấn SQL chuẩn ACID tức thì.',
    problem: 'Hệ thống Data Warehouse truyền thống bị chậm trễ dữ liệu hàng giờ (Batch ETL trễ), không hỗ trợ cập nhật từng dòng và chi phí lưu trữ mở rộng quá cao.',
    solution: 'Dữ liệu sự kiện nạp vào Kinesis Data Streams. Managed Service for Apache Flink xử lý tính toán cửa sổ thời gian thực (tumbling windows). Ghi trực tiếp vào Amazon S3 dưới định dạng Apache Iceberg qua Glue Data Catalog, truy vấn trực tiếp bằng Amazon Athena.',
    services: ['Kinesis Data Streams', 'Apache Flink', 'S3', 'Glue', 'Athena', 'QuickSight']
  },
  {
    id: 'modern-data-warehouse-redshift',
    category: 'Data & Analytics',
    title: 'Modern Cloud Data Warehouse with Redshift Serverless',
    description: 'Kho dữ liệu phân tích quy mô Petabyte tự động co giãn hiệu năng theo tải truy vấn báo cáo.',
    problem: 'Doanh nghiệp phân tích lịch sử kinh doanh 5 năm gặp tình trạng truy vấn nghẽn vào cuối tháng khi các phòng ban cùng chạy báo cáo.',
    solution: 'Amazon Redshift Serverless tự động mở rộng RPUs theo nhu cầu. Tính năng Redshift Data Sharing chia sẻ dữ liệu an toàn giữa các tài khoản mà không cần sao chép. Tích hợp Redshift Spectrum truy vấn dữ liệu lạnh trên S3 Data Lake.',
    services: ['Redshift', 'S3', 'Glue', 'QuickSight', 'IAM']
  },
  {
    id: 'serverless-spark-emr',
    category: 'Data & Analytics',
    title: 'Large-Scale Batch Processing with EMR Serverless',
    description: 'Chạy các tác vụ Apache Spark và Hive quy mô lớn mà không cần quản trị cụm máy chủ hay cấu hình Hadoop.',
    problem: 'Tác vụ tính toán đối soát tài chính hàng đêm chạy mất 4 giờ trên hạ tầng on-premises cũ, tốn nhiều chi phí phần cứng nhàn rỗi ban ngày.',
    solution: 'Amazon EMR Serverless tự động cấp phát tài nguyên vCPU và bộ nhớ theo từng job Spark, đọc ghi trực tiếp trên Amazon S3 và tự động tắt hoàn toàn khi xong việc.',
    services: ['EMR', 'S3', 'Glue', 'Step Functions', 'CloudWatch']
  },
  {
    id: 'cdc-lakehouse-dms',
    category: 'Data & Analytics',
    title: 'Real-Time Change Data Capture (CDC) Lakehouse',
    description: 'Đồng bộ hóa thay đổi từ CSDL tác nghiệp (OLTP) sang Hồ dữ liệu phân tích theo thời gian thực dưới 1 phút.',
    problem: 'Trích xuất dữ liệu phân tích bằng câu lệnh SQL nặng vào ban ngày gây sập cơ sở dữ liệu bán hàng trực tiếp của khách.',
    solution: 'AWS DMS đọc Transaction Log của RDS PostgreSQL/MySQL liên tục nạp vào Amazon Kinesis Data Streams hoặc S3. AWS Glue Streaming ETL xử lý hợp nhất và ghi vào định dạng Apache Hudi/Iceberg.',
    services: ['DMS', 'RDS', 'Kinesis Data Streams', 'S3', 'Glue', 'Athena']
  },
  {
    id: 'opensearch-log-analytics',
    category: 'Data & Analytics',
    title: 'Centralized Log Analytics with OpenSearch Serverless',
    description: 'Thu thập, lập chỉ mục và trực quan hóa hàng tỷ dòng nhật ký ứng dụng và bảo mật tập trung.',
    problem: 'Hàng trăm microservices phân tán khiến kỹ sư mất hàng giờ để truy tìm nguyên nhân gốc rễ (Root Cause Analysis) khi có sự cố.',
    solution: 'Kinesis Data Firehose thu thập log từ CloudWatch Logs, nén và tự động chuyển đổi sang OpenSearch Serverless. Kỹ sư tìm kiếm lỗi và theo dõi chỉ số qua OpenSearch Dashboards.',
    services: ['OpenSearch', 'Kinesis Firehose', 'CloudWatch', 'S3', 'IAM']
  },
  {
    id: 'governed-data-mesh-lakeformation',
    category: 'Data & Analytics',
    title: 'Enterprise Governed Data Mesh with Lake Formation',
    description: 'Kiến trúc mạng lưới dữ liệu phân tán (Data Mesh) với phân quyền hạt nhân tới từng dòng và từng cột (Row/Column Level Security).',
    problem: 'Các phòng ban khác nhau (Marketing, Tài chính, R&D) cần chia sẻ dữ liệu nhưng bắt buộc phải che giấu thông tin PII và tuân thủ phân quyền nghiêm ngặt.',
    solution: 'AWS Lake Formation đóng vai trò trung tâm kiểm soát chính sách (Data Governance). Cấp quyền truy cập hạt nhân theo thẻ (Tag-based access control) cho Amazon Athena và Redshift mà không cần nhân bản dữ liệu.',
    services: ['Lake Formation', 'S3', 'Glue', 'Athena', 'Redshift', 'IAM']
  },

  // --- 5. Security, Governance & Compliance (6) ---
  {
    id: 'multi-account-finops',
    category: 'Security & Governance',
    title: 'Enterprise Multi-Account FinOps & Security Governance',
    description: 'Hạ tầng quản trị đa tài khoản tự động hóa với rào chắn bảo mật (Guardrails) và phân bổ ngân sách chi tiết cho từng phòng ban.',
    problem: 'Tập đoàn có hàng chục nhóm phát triển tự ý tạo tài nguyên gây mất an toàn thông tin, thiếu kiểm soát thẻ chi phí (Tagging) và hóa đơn đám mây tăng mất kiểm soát.',
    solution: 'AWS Control Tower thiết lập Landing Zone với Organizations và Service Control Policies (SCPs). AWS Config Rules liên tục đánh giá tuân thủ. AWS Billing Conductor chia sẻ mức giá chiết khấu nội bộ và xuất Cost & Usage Report (CUR) vào Data Lake phân tích FinOps.',
    services: ['Control Tower', 'Organizations', 'Config', 'Budgets', 'CUR', 'Cost Explorer']
  },
  {
    id: 'zero-trust-verified-access',
    category: 'Security & Governance',
    title: 'Zero Trust Remote Access with AWS Verified Access',
    description: 'Cho phép nhân viên truy cập ứng dụng nội bộ an toàn từ xa mà không cần kết nối mạng VPN truyền thống.',
    problem: 'Mạng VPN truyền thống cấp quyền truy cập toàn bộ mạng nội bộ (mô hình Castle-and-Moat), tiềm ẩn nguy cơ mã độc lây lan khi máy nhân viên bị hack.',
    solution: 'AWS Verified Access kiểm tra danh tính người dùng qua IdP (Okta/IAM Identity Center) và trạng thái an toàn thiết bị (CrowdStrike/Jamf) trước mỗi yêu cầu HTTP, định tuyến trực tiếp vào Private Subnet.',
    services: ['Verified Access', 'IAM', 'WAF', 'VPC', 'KMS']
  },
  {
    id: 'centralized-siem-securityhub',
    category: 'Security & Governance',
    title: 'Centralized Cloud SIEM & Automated Incident Response',
    description: 'Thu thập sự kiện an ninh từ hàng trăm tài khoản, tự động cô lập máy chủ bị nhiễm mã độc trong 10 giây.',
    problem: 'Đội ngũ SOC bị ngập trong hàng triệu cảnh báo an ninh rời rạc và mất hàng giờ phản ứng thủ công khi có tài khoản bị xâm nhập.',
    solution: 'AWS Security Hub tổng hợp phát hiện từ GuardDuty, Macie, Inspector. Khi có cảnh báo mức CRITICAL, EventBridge kích hoạt Step Functions tự động thay đổi Security Group cô lập máy chủ EC2 và chụp snapshot điều tra pháp y.',
    services: ['Security Hub', 'GuardDuty', 'Inspector', 'EventBridge', 'Step Functions', 'Systems Manager']
  },
  {
    id: 'automated-secrets-rotation',
    category: 'Security & Governance',
    title: 'Automated Database Password & API Key Rotation',
    description: 'Tự động xoay vòng mật khẩu CSDL và khóa API định kỳ 30 ngày một lần không làm gián đoạn ứng dụng.',
    problem: 'Nhân viên vô tình lưu mật khẩu CSDL cố định vào mã nguồn Git dẫn đến nguy cơ lộ lọt dữ liệu nghiêm trọng.',
    solution: 'Ứng dụng đọc mật khẩu động từ AWS Secrets Manager qua SDK. Secrets Manager định kỳ kích hoạt hàm Lambda kết nối vào RDS đổi mật khẩu mới và lưu trữ phiên bản an toàn.',
    services: ['Secrets Manager', 'KMS', 'Lambda', 'RDS', 'CloudTrail']
  },
  {
    id: 'pci-dss-cde-isolated',
    category: 'Security & Governance',
    title: 'PCI-DSS Compliant Cardholder Data Environment (CDE)',
    description: 'Môi trường xử lý thẻ thanh toán cô lập đạt chứng nhận PCI-DSS Level 1 với mã hóa đường truyền và lưu trữ.',
    problem: 'Doanh nghiệp fintech cần lưu trữ và xử lý số thẻ tín dụng tuân thủ tiêu chuẩn an ninh thanh toán quốc tế PCI-DSS.',
    solution: 'Thiết lập VPC chuyên dụng được bảo vệ bởi AWS Network Firewall. Mã hóa toàn bộ dữ liệu bằng AWS KMS CMK có HSM chuyên dụng (AWS CloudHSM). Toàn bộ thao tác truy cập được ghi nhật ký bất biến qua AWS CloudTrail và CloudWatch.',
    services: ['CloudHSM', 'KMS', 'Network Firewall', 'VPC', 'CloudTrail', 'Config']
  },
  {
    id: 'ddos-resilient-perimeter',
    category: 'Security & Governance',
    title: 'DDoS-Resilient Edge Security Perimeter',
    description: 'Lá chắn phòng vệ biên giới chống tấn công từ chối dịch vụ phân tán quy mô lớn lên tới hàng Terabit/giây.',
    problem: 'Hệ thống ngân hàng trực tuyến bị tấn công DDoS liên tục trong các dịp lễ tết làm tê liệt giao dịch khách hàng.',
    solution: 'Đặt CloudFront và AWS WAF phía trước hệ thống với các bộ quy tắc Managed Rules và Rate-based Rules. Kích hoạt AWS Shield Advanced với sự hỗ trợ 24/7 của Đội ngũ Ứng phó Shield (SRT) và bảo hiểm chi phí tấn công.',
    services: ['CloudFront', 'WAF', 'Shield', 'Route 53', 'CloudWatch']
  },

  // --- 6. Networking & Hybrid Cloud (6) ---
  {
    id: 'hybrid-hub-spoke-network',
    category: 'Networking & Hybrid',
    title: 'Enterprise Hub-and-Spoke Network Security Architecture',
    description: 'Mô hình mạng doanh nghiệp hình sao tập trung kiểm soát toàn bộ lưu lượng vào ra Internet và kết nối On-Premises.',
    problem: 'Hàng chục VPC phân tán thiếu sự kiểm soát an ninh mạng tập trung, nguy cơ rò rỉ dữ liệu và chi phí nhân bản thiết bị tường lửa quá đắt đỏ.',
    solution: 'AWS Transit Gateway làm trung tâm kết nối hình sao. Mọi lưu lượng kết nối ra Internet và liên VPC đều được định tuyến qua một Inspection VPC có đặt cụm AWS Network Firewall kiểm tra gói tin sâu (Deep Packet Inspection IDS/IPS). Đường truyền vật lý kết nối qua AWS Direct Connect có dự phòng VPN.',
    services: ['Transit Gateway', 'Network Firewall', 'Direct Connect', 'VPC', 'Route 53']
  },
  {
    id: 'hybrid-dns-resolver',
    category: 'Networking & Hybrid',
    title: 'Seamless Hybrid Cloud DNS Resolution',
    description: 'Phân giải tên miền hai chiều thông suốt giữa trung tâm dữ liệu On-Premises và AWS Private Hosted Zones.',
    problem: 'Máy chủ On-Premises không thể truy cập dịch vụ AWS qua tên miền nội bộ `.aws.internal` và máy chủ EC2 không thể gọi tên miền nội bộ công ty `.corp.local`.',
    solution: 'Route 53 Resolver Inbound Endpoint cho phép DNS On-Premises chuyển tiếp truy vấn vào AWS. Route 53 Resolver Outbound Endpoint kết hợp Resolver Rules chuyển tiếp truy vấn `.corp.local` về máy chủ DNS on-premises qua Direct Connect.',
    services: ['Route 53', 'Direct Connect', 'VPC', 'RAM']
  },
  {
    id: 'direct-connect-high-resilience',
    category: 'Networking & Hybrid',
    title: 'High-Resilience Dual Direct Connect with BFD & VPN Backup',
    description: 'Mô hình kết nối vật lý dự phòng tối đa (Maximum Resiliency) đáp ứng các yêu cầu kinh doanh khắt khe nhất.',
    problem: 'Mất kết nối mạng giữa nhà máy sản xuất và trung tâm dữ liệu AWS gây thiệt hại hàng triệu USD mỗi giờ ngừng hoạt động.',
    solution: 'Thiết lập hai đường cáp quang Direct Connect tại hai điểm kết nối vật lý PoP độc lập, bật tính năng phát hiện chuyển tiếp hai chiều Bidirectional Forwarding Detection (BFD) để chuyển mạch dưới 1 giây. Đường hầm Site-to-Site VPN qua Internet làm dự phòng cấp 3.',
    services: ['Direct Connect', 'Site-to-Site VPN', 'Transit Gateway', 'Route 53']
  },
  {
    id: 'gwlb-firewall-inspection',
    category: 'Networking & Hybrid',
    title: 'Scalable Third-Party Firewall Inspection with GWLB',
    description: 'Chèn cụm thiết bị tường lửa ảo của bên thứ ba (Palo Alto, Fortinet) tự động co giãn vào luồng mạng hai chiều.',
    problem: 'Cụm thiết bị tường lửa ảo truyền thống gặp nút thắt cổ chai về băng thông và khó khăn trong việc co giãn mở rộng khi lưu lượng tăng.',
    solution: 'Gateway Load Balancer (GWLB) kết hợp giao thức GENEVE (UDP 6081) cân bằng tải đối xứng tới các thiết bị tường lửa ảo trong Security VPC, đảm bảo gói tin đi và về đều đi qua cùng một instance kiểm tra.',
    services: ['GWLB', 'Transit Gateway', 'VPC', 'EC2']
  },
  {
    id: 'privatelink-saas-ecosystem',
    category: 'Networking & Hybrid',
    title: 'Secure SaaS Ecosystem Integration with PrivateLink',
    description: 'Chia sẻ dịch vụ an toàn cho hàng trăm đối tác và khách hàng mà không làm lộ địa chỉ IP và không sợ trùng lặp CIDR.',
    problem: 'Kết nối mạng giữa các công ty thành viên bằng VPC Peering bị thất bại do dải địa chỉ mạng IP 10.0.0.0/16 bị trùng lặp ở khắp mọi nơi.',
    solution: 'Nhà cung cấp dịch vụ tạo VPC Endpoint Service gắn với Network Load Balancer. Khách hàng tạo VPC Interface Endpoint trong VPC của họ, kết nối hoàn toàn thông qua địa chỉ IP riêng nội bộ không bị ảnh hưởng bởi trùng CIDR.',
    services: ['PrivateLink', 'NLB', 'VPC', 'IAM']
  },
  {
    id: 'global-anycast-accelerator',
    category: 'Networking & Hybrid',
    title: 'Global Anycast IP Routing with Global Accelerator',
    description: 'Tối ưu hóa định tuyến cho các ứng dụng nhạy cảm về độ trễ qua mạng trục cáp quang toàn cầu của AWS.',
    problem: 'Người dùng toàn cầu truy cập ứng dụng giao dịch tài chính hoặc VoIP gặp hiện tượng giật lag và mất gói tin do hạ tầng mạng Internet công cộng bất ổn.',
    solution: 'AWS Global Accelerator cung cấp 2 địa chỉ IP tĩnh Anycast tĩnh. Lưu lượng truy cập được đưa vào mạng trục riêng của AWS tại PoP gần nhất, tự động chuyển vùng tức thì nếu một Region phía sau gặp sự cố.',
    services: ['Global Accelerator', 'ALB', 'NLB', 'EC2', 'Route 53']
  },

  // --- 7. Disaster Recovery & Business Continuity (6) ---
  {
    id: 'multi-region-active-active',
    category: 'Disaster Recovery',
    title: 'Global Multi-Region Active-Active Resilience',
    description: 'Kiến trúc phục hồi thảm họa cấp cao nhất với dữ liệu đồng bộ hai chiều xuyên lục địa, RPO gần 0 và RTO dưới 10 giây.',
    problem: 'Hệ thống tài chính toàn cầu bắt buộc phải hoạt động liên tục 99.999%, nếu một Region AWS bị cô lập thì lưu lượng phải tự động chuyển ngay sang Region khác.',
    solution: 'Route 53 Application Recovery Controller (ARC) định tuyến lưu lượng thông minh. Dữ liệu ghi phân tán vào DynamoDB Global Tables và Aurora Global Database sao chép ở tầng đĩa. S3 Multi-Region Access Points tối ưu hóa tải tệp.',
    services: ['Route 53', 'DynamoDB', 'Aurora', 'S3', 'CloudFront', 'Global Accelerator']
  },
  {
    id: 'pilot-light-drs-dr',
    category: 'Disaster Recovery',
    title: 'Cost-Effective Pilot Light DR with AWS DRS',
    description: 'Giải pháp khôi phục thảm họa từ On-Premises lên AWS với chi phí duy trì tối thiểu và thời gian phục hồi nhanh.',
    problem: 'Doanh nghiệp cần phương án dự phòng khi Data Center bị ngập lụt hoặc cháy nổ nhưng không đủ ngân sách duy trì máy chủ lớn chạy song song.',
    solution: 'AWS Elastic Disaster Recovery (DRS) sao chép khối đĩa liên tục vào Staging Area giá rẻ trên AWS. Khi thảm họa xảy ra, DRS tự động kích hoạt máy chủ công suất lớn trong vòng 10 phút.',
    services: ['DRS', 'EBS', 'EC2', 'VPC', 'Route 53']
  },
  {
    id: 'warm-standby-aurora-dr',
    category: 'Disaster Recovery',
    title: 'Warm Standby Disaster Recovery for Enterprise Apps',
    description: 'Mô hình dự phòng nóng thu nhỏ (Warm Standby) phục vụ lượng tải nhỏ và sẵn sàng scale-up tức thì khi Region chính sập.',
    problem: 'Ứng dụng bệnh viện yêu cầu RPO dưới 1 phút và RTO dưới 5 phút, không thể chấp nhận thời gian chờ đợi dựng hạ tầng từ đầu.',
    solution: 'Duy trì cụm máy chủ EC2 phiên bản tối thiểu tại Region phụ phía sau ALB. CSDL chạy Aurora Global Database sao chép dữ liệu liên tục. Khi Region chính có sự cố, Route 53 chuyển DNS và Auto Scaling tăng số máy chủ trong 2 phút.',
    services: ['Aurora', 'Route 53', 'EC2', 'Auto Scaling', 'ALB']
  },
  {
    id: 's3-mrap-active-active',
    category: 'Disaster Recovery',
    title: 'Multi-Region Active-Active Object Storage (S3 MRAP)',
    description: 'Lưu trữ tệp đa vùng với một điểm truy cập toàn cầu duy nhất tự động định tuyến đến bucket gần nhất và có độ trễ thấp nhất.',
    problem: 'Các chi nhánh toàn cầu tải tệp dung lượng lớn lên S3 bị chậm trễ và nếu Region bucket bị sự cố thì toàn bộ ứng dụng bị ngưng trệ.',
    solution: 'S3 Multi-Region Access Points (MRAP) cung cấp một endpoint DNS duy nhất kết hợp với S3 Cross-Region Replication (CRR) hai chiều và cơ chế Failover Controls tự động chuyển hướng lưu lượng tải tệp.',
    services: ['S3', 'Global Accelerator', 'CloudWatch', 'KMS']
  },
  {
    id: 'immutable-backup-vault-lock',
    category: 'Disaster Recovery',
    title: 'Ransomware-Proof Immutable Backup Vault',
    description: 'Kho lưu trữ bản sao lưu bất biến (WORM) chống mã hóa, chống sửa đổi và chống xóa sớm bởi tin tặc.',
    problem: 'Tin tặc xâm nhập vào tài khoản quản trị và cố tình xóa sạch toàn bộ bản sao lưu (snapshots) trước khi tống tiền doanh nghiệp.',
    solution: 'AWS Backup tự động sao chép snapshot chéo sang một tài khoản Backup riêng biệt và kích hoạt tính năng AWS Backup Vault Lock ở chế độ Compliance Mode, nghiêm cấm mọi quyền xóa trước hạn.',
    services: ['Backup', 'Organizations', 'KMS', 'S3', 'EBS']
  },
  {
    id: 'automated-cross-region-rds-failover',
    category: 'Disaster Recovery',
    title: 'Automated Cross-Region RDS Promotion Pipeline',
    description: 'Tự động phát hiện Region chính ngừng hoạt động và thăng hạng CSDL phụ thành CSDL chính không cần người can thiệp.',
    problem: 'Quản trị viên mất hơn 30 phút để phát hiện sự cố Region vào ban đêm và thao tác dòng lệnh thăng hạng CSDL phụ bằng tay gây gián đoạn kéo dài.',
    solution: 'Route 53 Health Checks giám sát endpoint của Region chính. Khi phát hiện lỗi liên tiếp, CloudWatch Alarm kích hoạt EventBridge gọi Step Functions thực hiện thao tác RDS Promote Read Replica và cập nhật Route 53 DNS record tức thì.',
    services: ['RDS', 'Route 53', 'CloudWatch', 'EventBridge', 'Step Functions', 'SNS']
  },

  // --- 8. IoT & Edge Computing (6) ---
  {
    id: 'iot-smart-telematics',
    category: 'IoT & Edge',
    title: 'Automotive IoT & Predictive Analytics',
    description: 'Kiến trúc thu thập và phân tích dữ liệu xe thông minh thời gian thực phát hiện cảnh báo sớm hỏng hóc.',
    problem: 'Hàng trăm nghìn xe điện di chuyển liên tục, cần thu thập chỉ số pin và động cơ để bảo trì dự đoán mà không làm tốn băng thông 4G.',
    solution: 'AWS IoT FleetWise lọc và giải mã dữ liệu CAN bus trên xe, gửi sự kiện bất thường về AWS IoT Core. IoT Events quản lý trạng thái pin, lưu chuỗi thời gian vào Timestream và cảnh báo kỹ thuật viên qua SNS.',
    services: ['IoT FleetWise', 'IoT Core', 'IoT Events', 'Timestream', 'SNS', 'QuickSight']
  },
  {
    id: 'industrial-iot-greengrass',
    category: 'IoT & Edge',
    title: 'Industrial IoT (IIoT) Smart Factory Monitoring',
    description: 'Thu thập dữ liệu cảm biến rung lắc và nhiệt độ máy móc công nghiệp qua giao thức OPC-UA tại biên.',
    problem: 'Dây chuyền sản xuất cần ngắt khẩn cấp động cơ khi nhiệt độ vượt ngưỡng trong vòng vài mili-giây, không thể chờ gửi dữ liệu lên đám mây.',
    solution: 'AWS IoT Greengrass chạy trên máy chủ công nghiệp tại nhà máy, đọc dữ liệu OPC-UA, chạy thuật toán đánh giá tại chỗ qua Local Lambda/Docker và đồng bộ dữ liệu tóm tắt lên AWS IoT SiteWise.',
    services: ['IoT Greengrass', 'IoT SiteWise', 'IoT Core', 'Timestream', 'S3']
  },
  {
    id: 'smart-metering-serverless',
    category: 'IoT & Edge',
    title: 'Smart Metering & Energy Grid Analytics',
    description: 'Thu thập chỉ số điện nước từ hàng triệu công tơ thông minh mỗi 15 phút một lần phục vụ tính toán hóa đơn tự động.',
    problem: 'Hàng triệu thiết bị đồng loạt gửi chỉ số vào cùng một thời điểm gây nghẽn máy chủ tiếp nhận dữ liệu.',
    solution: 'Thiết bị gửi dữ liệu qua MQTT vào AWS IoT Core. IoT Rules Engine nạp thẳng vào Kinesis Data Firehose, tự động gom lô nén Parquet và lưu vào Amazon S3 Data Lake, tính cước bằng AWS Glue và Athena.',
    services: ['IoT Core', 'Kinesis Firehose', 'S3', 'Glue', 'Athena', 'QuickSight']
  },
  {
    id: 'connected-vehicle-fleet',
    category: 'IoT & Edge',
    title: 'Connected Vehicle Fleet Tracking & Geofencing',
    description: 'Theo dõi hành trình xe tải vận chuyển hàng hóa thời gian thực và tự động kích hoạt cảnh báo khi xe đi lệch cung đường.',
    problem: 'Doanh nghiệp vận tải cần biết chính xác vị trí xe chở hàng giá trị cao và nhận cảnh báo nếu tài xế mở cửa thùng xe ngoài khu vực kho hàng.',
    solution: 'Thiết bị GPS gắn trên xe gửi tọa độ về AWS IoT Core. Amazon Location Service theo dõi vị trí trên bản đồ và quản lý hàng rào địa lý (Geofencing), tự động kích hoạt EventBridge gửi thông báo khi vi phạm.',
    services: ['IoT Core', 'Location Service', 'EventBridge', 'SNS', 'DynamoDB']
  },
  {
    id: 'edge-video-analytics-kinesis',
    category: 'IoT & Edge',
    title: 'Edge Video Streaming & AI Surveillance',
    description: 'Truyền phát luồng video từ camera an ninh tại các tòa nhà và phân tích nhận diện khuôn mặt người lạ thời gian thực.',
    problem: 'Băng thông mạng tại các tòa nhà có giới hạn, không thể truyền đồng thời hàng chục luồng video 4K liên tục lên đám mây.',
    solution: 'Camera sử dụng Kinesis Video Streams Producer SDK nạp luồng video vào Amazon Kinesis Video Streams. Amazon Rekognition Video phân tích nhận diện khuôn mặt từ danh sách đen và gửi cảnh báo tới bảo vệ qua SNS.',
    services: ['Kinesis Video Streams', 'Rekognition', 'Lambda', 'SNS', 'S3']
  },
  {
    id: 'asset-tracking-lorawan',
    category: 'IoT & Edge',
    title: 'Long-Range Low-Power Asset Tracking (LoRaWAN)',
    description: 'Theo dõi tài sản trên các cánh đồng nông nghiệp hoặc cảng biển rộng lớn bằng sóng vô tuyến tầm xa LoRaWAN.',
    problem: 'Cảm biến theo dõi container ở cảng biển không có sóng WiFi, pin phải hoạt động liên tục trong 3 năm không sạc.',
    solution: 'Cảm biến truyền tín hiệu qua trạm LoRaWAN Gateway kết nối vào AWS IoT Core for LoRaWAN. Dữ liệu giải mã được lưu vào DynamoDB và hiển thị trên ứng dụng web theo dõi vị trí container.',
    services: ['IoT Core', 'DynamoDB', 'Lambda', 'API Gateway', 'CloudWatch']
  },

  // --- 9. Media & Gaming (6) ---
  {
    id: 'vod-transcoding-pipeline',
    category: 'Media & Gaming',
    title: 'Serverless Video-on-Demand (VOD) Transcoding',
    description: 'Quy trình xử lý và chuyển mã video tự động cấp doanh nghiệp hỗ trợ truyền phát đa màn hình chuẩn HLS/DASH.',
    problem: 'Người dùng tải lên video ở nhiều định dạng thô khác nhau, cần tự động chuyển mã sang các độ phân giải 4K, 1080p, 720p và đóng dấu bản quyền logo.',
    solution: 'Khi tệp video tải lên S3, sự kiện S3 Event Notifications kích hoạt AWS Step Functions. Step Functions điều phối AWS Elemental MediaConvert chuyển mã sang chuẩn HLS, lưu vào S3 và phân phối qua CloudFront.',
    services: ['MediaConvert', 'S3', 'Step Functions', 'Lambda', 'CloudFront', 'SNS']
  },
  {
    id: 'live-video-streaming',
    category: 'Media & Gaming',
    title: 'Resilient Multi-AZ Live Event Video Streaming',
    description: 'Truyền hình trực tiếp các sự kiện thể thao và giải trí cho hàng triệu khán giả đồng thời với độ trễ thấp.',
    problem: 'Sự kiện trực tiếp đòi hỏi tín hiệu liên tục không bị gián đoạn, ngay cả khi một bộ mã hóa tín hiệu bị mất nguồn điện.',
    solution: 'Tín hiệu máy quay đẩy vào AWS Elemental MediaLive với cấu hình kênh Standard Channel (chạy dự phòng trên 2 AZ). MediaPackage đóng gói định dạng thích ứng và CloudFront phân phối nội dung toàn cầu.',
    services: ['MediaLive', 'MediaPackage', 'CloudFront', 'S3', 'Route 53']
  },
  {
    id: 'multiplayer-game-gamelift',
    category: 'Media & Gaming',
    title: 'Global Real-Time Multiplayer Game Infrastructure',
    description: 'Hạ tầng máy chủ game nhiều người chơi tự động ghép trận (Matchmaking) và co giãn máy chủ theo phiên đấu.',
    problem: 'Game bắn súng trực tuyến yêu cầu độ trễ mạng cực thấp (ping dưới 30ms) và cần tự động tắt máy chủ khi trận đấu kết thúc để tránh lãng phí.',
    solution: 'Amazon GameLift quản lý vòng đời cụm máy chủ game chuyên dụng (Dedicated Game Server Fleet), tích hợp tính năng ghép trận FlexMatch và tự động mở rộng cụm node Spot Instance giúp giảm 70% chi phí.',
    services: ['GameLift', 'EC2', 'DynamoDB', 'Cognito', 'CloudWatch']
  },
  {
    id: 'low-latency-leaderboard-memorydb',
    category: 'Media & Gaming',
    title: 'Ultra Low-Latency Gaming Leaderboard with MemoryDB',
    description: 'Bảng xếp hạng game trực tuyến triệu người chơi với độ trễ phản hồi micro-giây và khả năng phục hồi dữ liệu bền vững.',
    problem: 'Hàng triệu game thủ cập nhật điểm số liên tục, bộ nhớ đệm cache thông thường dễ bị mất dữ liệu nếu cụm máy chủ bị mất điện.',
    solution: 'Amazon MemoryDB for Redis hoạt động như một CSDL chính In-memory tương thích Redis API, kết hợp cơ chế ghi nhật ký giao dịch phân tán (Multi-AZ Transaction Log) đảm bảo không mất dữ liệu điểm số.',
    services: ['MemoryDB', 'API Gateway', 'Lambda', 'Cognito']
  },
  {
    id: 'digital-rights-management-drm',
    category: 'Media & Gaming',
    title: 'Secure Media Streaming with Multi-DRM Protection',
    description: 'Bảo vệ nội dung phim và âm nhạc bản quyền bằng các chuẩn mã hóa DRM hàng đầu (Apple FairPlay, Google Widevine, Microsoft PlayReady).',
    problem: 'Nội dung phim chiếu rạp độc quyền đối mặt với nguy cơ bị sao chép lậu nếu không được mã hóa đầu cuối bằng chuẩn DRM tiêu chuẩn.',
    solution: 'AWS Elemental MediaPackage tích hợp với máy chủ cấp phép khóa DRM của bên thứ ba qua đặc tả SPEKE. Video được mã hóa động khi truyền phát tới người xem qua mạng phân phối CloudFront.',
    services: ['MediaPackage', 'CloudFront', 'S3', 'KMS', 'WAF']
  },
  {
    id: 'game-analytics-telemetry',
    category: 'Media & Gaming',
    title: 'Real-Time Player Telemetry & Game Analytics',
    description: 'Thu thập chỉ số hành vi người chơi game, tỷ lệ rơi vật phẩm và tình trạng lỗi game để cân bằng trò chơi.',
    problem: 'Nhà phát hành game cần phát hiện ngay lập tức các lỗ hổng gian lận (hack/cheat) hoặc các màn chơi quá khó khiến người chơi bỏ game.',
    solution: 'SDK trong game gửi sự kiện telemetry về Amazon Kinesis Data Streams. Managed Apache Flink tính toán chỉ số thời gian thực và lưu trữ lâu dài vào S3 Iceberg Lakehouse phục vụ truy vấn phân tích bằng Amazon Athena.',
    services: ['Kinesis Data Streams', 'Apache Flink', 'S3', 'Athena', 'QuickSight']
  },

  // --- 10. Migration & Enterprise IT (6) ---
  {
    id: 'hybrid-cloud-migration',
    category: 'Migration & Enterprise',
    title: 'Large-Scale Enterprise Migration & Modernization',
    description: 'Mô hình di chuyển hàng trăm máy chủ từ On-Premises lên AWS kết hợp Direct Connect và MGN.',
    problem: 'Doanh nghiệp đóng cửa Data Center vật lý, cần chuyển đổi hệ thống với downtime tối thiểu và quản lý tập trung.',
    solution: 'Sử dụng AWS Direct Connect thiết lập đường truyền chuyên dụng. Thu thập dependency bằng Discovery Service, sao chép đĩa ngầm liên tục bằng MGN, chuyển đổi CSDL bằng DMS và quản lý tiến độ tổng thể qua Migration Hub.',
    services: ['Direct Connect', 'MGN', 'DMS', 'Migration Hub', 'EC2', 'RDS']
  },
  {
    id: 'hybrid-active-directory-sso',
    category: 'Migration & Enterprise',
    title: 'Enterprise Hybrid Active Directory & Single Sign-On (SSO)',
    description: 'Tích hợp tài khoản nhân viên từ Microsoft Active Directory on-premises cho phép đăng nhập một lần vào hàng trăm tài khoản AWS.',
    problem: 'Nhân viên công ty phải nhớ hàng chục tài khoản mật khẩu AWS riêng lẻ, khó khăn cho bộ phận IT khi cần thu hồi quyền của nhân viên nghỉ việc.',
    solution: 'Triển khai AWS Directory Service (AD Connector hoặc Managed Microsoft AD) thiết lập quan hệ tin cậy với Active Directory on-premises. Tích hợp IAM Identity Center (AWS SSO) phân quyền tập trung.',
    services: ['Directory Service', 'IAM Identity Center', 'Direct Connect', 'Organizations']
  },
  {
    id: 'mainframe-modernization-bluage',
    category: 'Migration & Enterprise',
    title: 'Legacy Mainframe Modernization to Cloud-Native',
    description: 'Chuyển đổi các ứng dụng Mainframe COBOL cũ kỹ sang kiến trúc Java microservices hiện đại trên AWS.',
    problem: 'Hệ thống máy tính lớn Mainframe tại ngân hàng tốn chi phí bảo trì hàng triệu USD mỗi năm và thiếu hụt nhân sự hiểu ngôn ngữ COBOL.',
    solution: 'Sử dụng AWS Mainframe Modernization với công nghệ tự động chuyển đổi mã nguồn AWS Blu Age, tái cấu trúc ứng dụng COBOL thành các dịch vụ Java chạy trên container serverless AWS Fargate.',
    services: ['Mainframe Modernization', 'Fargate', 'Aurora', 'CodePipeline', 'CloudWatch']
  },
  {
    id: 'sap-high-availability-aws',
    category: 'Migration & Enterprise',
    title: 'Mission-Critical SAP S/4HANA High Availability',
    description: 'Mô hình triển khai hệ thống quản trị doanh nghiệp SAP S/4HANA chuẩn Enterprise với độ sẵn sàng cao nhất trên AWS.',
    problem: 'Hệ thống SAP ERP của tập đoàn sản xuất bắt buộc phải vận hành 24/7, nếu máy chủ CSDL HANA gặp sự cố thì toàn bộ nhà máy phải ngừng hoạt động.',
    solution: 'Triển khai cụm máy chủ EC2 High Memory Instances (RAM hàng Terabyte) trên 2 Availability Zones. Thiết lập cơ chế sao chép đồng bộ SAP HANA System Replication (HSR) kết hợp cụm Pacemaker tự động failover.',
    services: ['EC2', 'EBS', 'EFS', 'VPC', 'Route 53', 'Backup']
  },
  {
    id: 'vmware-cloud-on-aws',
    category: 'Migration & Enterprise',
    title: 'Hybrid Cloud Extension with VMware Cloud on AWS',
    description: 'Mở rộng cụm máy ảo VMware vSphere on-premises lên hạ tầng bare-metal chuyên dụng của AWS mà không cần chuyển đổi định dạng VM.',
    problem: 'Trung tâm dữ liệu doanh nghiệp hết dung lượng máy chủ nhưng không muốn mất thời gian chuyển đổi các máy ảo VMware sang định dạng AMI của EC2.',
    solution: 'Triển khai cụm VMware Cloud on AWS chạy trực tiếp trên các máy chủ EC2 Bare Metal. Kết nối mạng qua VMware NSX và AWS Direct Connect, cho phép di chuyển máy ảo nóng (vMotion) giữa hai môi trường không gián đoạn.',
    services: ['EC2 Bare Metal', 'Direct Connect', 'Transit Gateway', 'VPC']
  },
  {
    id: 'petabyte-data-transfer-snowball',
    category: 'Migration & Enterprise',
    title: 'Petabyte-Scale Data Migration with AWS Snowball Edge',
    description: 'Di chuyển hàng Petabyte dữ liệu từ trung tâm dữ liệu lên Amazon S3 khi băng thông đường truyền Internet bị hạn chế.',
    problem: 'Hồ dữ liệu 5 Petabyte tại mỏ khai thác quặng cần chuyển lên AWS nhưng đường truyền Internet tại hiện trường chỉ có tốc độ 100 Mbps, nếu tải qua mạng sẽ mất hơn 10 năm.',
    solution: 'Yêu cầu nhiều thiết bị vật lý AWS Snowball Edge Storage Optimized (mỗi thiết bị dung lượng 80 TB). Sao chép dữ liệu cục bộ qua cổng mạng 10/25 GbE tốc độ cao, sau đó chuyển phát an toàn về cơ sở hạ tầng AWS để nạp thẳng vào S3.',
    services: ['Snowball Edge', 'S3', 'KMS', 'IAM']
  }
];

const outputPath = path.resolve('src/data/architecturePatterns.ts');
const fileContent = `import { ArchitecturePattern } from '../types';

export interface ExtendedArchitecturePattern extends ArchitecturePattern {
  category: string;
}

export const ARCHITECTURE_PATTERNS: ExtendedArchitecturePattern[] = ${JSON.stringify(patterns, null, 2)};
`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log(`Successfully generated ${patterns.length} enterprise architecture patterns at ${outputPath}`);
