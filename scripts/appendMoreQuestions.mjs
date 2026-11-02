import fs from 'fs';
import path from 'path';

// Load base buildExamBank.mjs to get the first 60 questions
const buildBankPath = path.resolve('scripts/buildExamBank.mjs');
const buildBankContent = fs.readFileSync(buildBankPath, 'utf-8');

// Questions q61 to q110 (50 additional high-yield real exam questions)
const additionalQuestions = [
  // --- Storage & Hybrid Migration (q61 - q70) ---
  {
    id: 'q61',
    examCode: 'SAA-C03',
    domain: 'Hybrid Storage & Lưu trữ lai',
    serviceId: 'storage-gateway',
    scenario: 'Văn phòng chi nhánh doanh nghiệp cần truy cập tệp dùng chung qua giao thức NFS/SMB nội bộ với tốc độ mạng LAN cục bộ, nhưng muốn sao lưu và lưu trữ dài hạn toàn bộ dữ liệu trên Amazon S3 để tiết kiệm chi phí.',
    question: 'Cấu hình AWS Storage Gateway nào phù hợp nhất cho bài toán này?',
    options: [
      { key: 'A', text: 'Volume Gateway ở chế độ Stored Volume', explanation: 'Lưu toàn bộ dữ liệu tại chỗ rồi mới backup S3, không tối ưu dung lượng đĩa cục bộ.' },
      { key: 'B', text: 'S3 File Gateway', explanation: 'Chính xác! Cung cấp giao diện SMB/NFS gắn kết trực tiếp vào S3 với bộ nhớ cache cục bộ tốc độ LAN.' },
      { key: 'C', text: 'Tape Gateway (VTL)', explanation: 'Dùng để thay thế băng từ vật lý (Tape library) trong quy trình sao lưu backup, không dùng làm file share.' },
      { key: 'D', text: 'Amazon EFS với AWS Direct Connect', explanation: 'Không có bộ nhớ cache cục bộ tại văn phòng; chi phí băng thông Direct Connect và độ trễ cao hơn.' }
    ],
    correctKey: 'B',
    answer: 'S3 File Gateway',
    explanation: 'S3 File Gateway cho phép các ứng dụng tại văn phòng đọc/ghi file qua giao thức chuẩn SMB hoặc NFS. Gateway lưu cache cục bộ các file hay dùng để đạt tốc độ LAN, đồng thời tự động đồng bộ bất đồng bộ lên Amazon S3.',
    decisionRule: 'Truy cập SMB/NFS tại chỗ + Cache cục bộ + Lưu trữ dài hạn trên S3 ➔ S3 File Gateway.'
  },
  {
    id: 'q62',
    examCode: 'SAP-C02',
    domain: 'Hệ thống tệp hiệu năng cao (HPC Storage)',
    serviceId: 'fsx',
    scenario: 'Đội ngũ R&D chạy các mô hình mô phỏng tài chính và Machine Learning phân tán đòi hỏi hệ thống tệp chia sẻ tương thích chuẩn POSIX với thông lượng hàng chục GB/giây và hàng trăm nghìn IOPS độ trễ dưới 1 mili-giây, dữ liệu nguồn lưu tại Amazon S3.',
    question: 'Dịch vụ lưu trữ nào đáp ứng tối ưu yêu cầu trên?',
    options: [
      { key: 'A', text: 'Amazon EFS (Elastic File System)', explanation: 'Phù hợp chia sẻ file Linux nói chung, không đạt được thông lượng hàng chục GB/s và IOPS cực cao cho HPC như Lustre.' },
      { key: 'B', text: 'Amazon FSx for Lustre', explanation: 'Chính xác! Thiết kế riêng cho HPC, ML và render 3D, tích hợp hai chiều trực tiếp với S3.' },
      { key: 'C', text: 'Amazon FSx for Windows File Server', explanation: 'Dùng cho môi trường Windows Active Directory và giao thức SMB, không phải chuẩn POSIX hiệu năng HPC.' },
      { key: 'D', text: 'Amazon S3 Mountpoint trên EC2', explanation: 'Chỉ hỗ trợ thao tác đọc tuần tự cơ bản, không hỗ trợ đầy đủ ngữ nghĩa POSIX, không có locking file.' }
    ],
    correctKey: 'B',
    answer: 'Amazon FSx for Lustre',
    explanation: 'Amazon FSx for Lustre cung cấp hệ thống tệp song song (parallel file system) có thể liên kết trực tiếp với S3 bucket. Nó nạp dữ liệu từ S3 theo yêu cầu (lazy load), xử lý với thông lượng hàng trăm GB/s và xuất kết quả ngược lại S3.',
    decisionRule: 'HPC / ML phân tán + Thông lượng hàng chục GB/s + Tương thích POSIX liên kết S3 ➔ FSx for Lustre.'
  },
  {
    id: 'q63',
    examCode: 'SAA-C03',
    domain: 'Hệ thống tệp Windows & Active Directory',
    serviceId: 'fsx',
    scenario: 'Một tổ chức di chuyển ứng dụng doanh nghiệp chạy trên Windows Server lên AWS. Ứng dụng yêu cầu quyền phân quyền NTFS cấp thư mục, hỗ trợ giao thức SMB, tích hợp xác thực với Microsoft Active Directory hiện có và hỗ trợ Multi-AZ failover.',
    question: 'Giải pháp lưu trữ nào là chuẩn xác nhất?',
    options: [
      { key: 'A', text: 'Amazon EFS kết hợp Samba server trên EC2', explanation: 'Phức tạp, tốn công vận hành và không hỗ trợ chuẩn xác cơ chế phân quyền Windows NTFS native.' },
      { key: 'B', text: 'Amazon FSx for Windows File Server chế độ Multi-AZ', explanation: 'Chính xác! Native Windows File Server hỗ trợ SMB, DFS, tích hợp AD và Multi-AZ tự động chuyển vùng.' },
      { key: 'C', text: 'Amazon S3 với AWS Transfer Family', explanation: 'Dành cho SFTP/FTPS, không cung cấp tệp mạng SMB gắn trực tiếp (mount) vào Windows Server.' },
      { key: 'D', text: 'EBS Multi-Attach với io2 volume', explanation: 'EBS Multi-Attach chỉ hỗ trợ tối đa 16 instance Linux và yêu cầu phần mềm cluster file system quản lý.' }
    ],
    correctKey: 'B',
    answer: 'Amazon FSx for Windows File Server chế độ Multi-AZ',
    explanation: 'Amazon FSx for Windows File Server được xây dựng trên Windows Server thực tế, cung cấp đầy đủ khả năng tương thích SMB, hỗ trợ Active Directory, Shadow Copies, Deduplication và Multi-AZ chuyển đổi dự phòng đồng bộ.',
    decisionRule: 'Windows SMB + Active Directory + Quyền NTFS cấp thư mục + Multi-AZ ➔ FSx for Windows File Server.'
  },
  {
    id: 'q64',
    examCode: 'SAA-C03',
    domain: 'Di chuyển dữ liệu mạng tốc độ cao (Data Transfer)',
    serviceId: 'datasync',
    scenario: 'Doanh nghiệp cần chuyển 150 TB dữ liệu từ hệ thống lưu trữ NAS On-Premises lên AWS S3 và EFS theo lịch định kỳ hàng đêm. Quá trình di chuyển cần tự động mã hóa, xác thực tính toàn vẹn dữ liệu và kiểm soát băng thông mạng để không làm nghẽn Internet ban ngày.',
    question: 'Công cụ nào được AWS khuyến nghị?',
    options: [
      { key: 'A', text: 'Chạy script rsync hoặc AWS CLI qua cron job trên máy chủ tại chỗ', explanation: 'Tốn công tự code cơ chế kiểm soát băng thông, tính toàn vẹn, đa luồng và dễ đứt quãng.' },
      { key: 'B', text: 'AWS DataSync', explanation: 'Chính xác! Tự động hóa truyền dữ liệu với giao thức độc quyền tăng tốc gấp 10 lần, có điều tiết băng thông và xác thực sha256.' },
      { key: 'C', text: 'AWS Snowball Edge', explanation: 'Snowball là thiết bị phần cứng vận chuyển qua bưu điện, không phù hợp cho nhu cầu đồng bộ định kỳ hàng đêm qua mạng.' },
      { key: 'D', text: 'AWS Storage Gateway Volume Gateway', explanation: 'Volume Gateway duy trì iSCSI volume ảo, không phải công cụ đồng bộ dữ liệu NAS định kỳ theo lịch.' }
    ],
    correctKey: 'B',
    answer: 'AWS DataSync',
    explanation: 'AWS DataSync triển khai Agent ảo tại chỗ kết nối với NAS (NFS/SMB). Nó sử dụng giao thức tăng tốc song song, tự động kiểm tra tính toàn vẹn của dữ liệu trong quá trình truyền và hỗ trợ thiết lập lịch trình kèm giới hạn băng thông (Bandwidth Limiting).',
    decisionRule: 'Đồng bộ dữ liệu NAS lên S3/EFS định kỳ qua mạng + Tăng tốc + Giới hạn băng thông ➔ AWS DataSync.'
  },
  {
    id: 'q65',
    examCode: 'SAA-C03',
    domain: 'Di chuyển dữ liệu ngoại tuyến quy mô lớn (Offline Migration)',
    serviceId: 'snowball',
    scenario: 'Một viện nghiên cứu biển có 400 TB dữ liệu video thô lưu trên ổ đĩa vật lý. Đường truyền Internet tại trạm nghiên cứu chỉ có tốc độ 20 Mbps. Viện cần đưa toàn bộ dữ liệu này lên Amazon S3 trong vòng dưới 3 tuần với chi phí tiết kiệm nhất.',
    question: 'Phương án nào tối ưu nhất?',
    options: [
      { key: 'A', text: 'Tải trực tiếp qua Internet dùng AWS DataSync', explanation: 'Với đường truyền 20 Mbps, tải 400 TB dữ liệu sẽ mất hơn 5 năm liên tục.' },
      { key: 'B', text: 'Nâng cấp đường truyền Internet lên 1 Gbps và đẩy lên S3', explanation: 'Chi phí kéo cáp và thuê bao đường truyền đắt đỏ, không kịp tiến độ 3 tuần.' },
      { key: 'C', text: 'Đặt nhiều thiết bị AWS Snowball Edge Storage Optimized', explanation: 'Chính xác! Mỗi thiết bị chứa tới 80 TB hoặc 210 TB, giao nhận qua đường chuyển phát nhanh chỉ mất vài ngày.' },
      { key: 'D', text: 'Thuê xe tải AWS Snowmobile', explanation: 'Snowmobile dùng cho quy mô hàng chục tới hàng trăm Petabyte (tối đa 100 PB), quá dư thừa và đắt đỏ cho 400 TB.' }
    ],
    correctKey: 'C',
    answer: 'Đặt nhiều thiết bị AWS Snowball Edge Storage Optimized',
    explanation: 'Khi dung lượng dữ liệu lớn (trên vài chục TB) mà băng thông mạng hạn chế, AWS Snowball Edge là lựa chọn ngoại tuyến nhanh nhất và rẻ nhất. AWS gửi thiết bị phần cứng mã hóa an toàn, khách hàng copy dữ liệu qua cổng 10/25 GbE rồi gửi trả lại AWS để import vào S3.',
    decisionRule: 'Dữ liệu hàng trăm TB + Mạng chậm/không có mạng + Tiến độ ngắn ngày ➔ AWS Snowball Edge.'
  },
  {
    id: 'q66',
    examCode: 'SAA-C03',
    domain: 'Cung cấp giao thức SFTP/FTPS doanh nghiệp',
    serviceId: 'transfer-family',
    scenario: 'Các đối tác B2B bên ngoài yêu cầu tải hóa đơn và tệp đối soát hàng ngày lên công ty qua giao thức SFTP an toàn. Công ty muốn lưu trữ trực tiếp các tệp này vào Amazon S3 mà không muốn tự cài đặt, vá lỗi và mở rộng các cụm máy chủ SFTP trên EC2.',
    question: 'Giải pháp serverless nào đáp ứng bài toán?',
    options: [
      { key: 'A', text: 'Cài OpenSSH SFTP Server trên Auto Scaling Group EC2', explanation: 'Phải tự quản lý OS, vá lỗ hổng bảo mật, cấu hình tích hợp S3 và bảo trì server.' },
      { key: 'B', text: 'AWS Transfer Family (AWS SFTP)', explanation: 'Chính xác! Dịch vụ hoàn toàn được quản lý, hỗ trợ SFTP/FTPS/FTP, lưu file thẳng vào S3 hoặc EFS.' },
      { key: 'C', text: 'Amazon API Gateway với binary media types', explanation: 'API Gateway là REST/WebSocket API qua HTTPS, không hỗ trợ giao thức kết nối SFTP chuẩn của client.' },
      { key: 'D', text: 'AWS Storage Gateway File Gateway', explanation: 'File Gateway dùng giao thức NFS/SMB nội bộ, không an toàn và không khuyến nghị mở trực tiếp ra Internet cho SFTP.' }
    ],
    correctKey: 'B',
    answer: 'AWS Transfer Family (AWS SFTP)',
    explanation: 'AWS Transfer Family cung cấp các endpoint SFTP, FTPS và FTP hoàn toàn không máy chủ (serverless). Nó hỗ trợ xác thực qua IAM, Cognito hoặc Active Directory và ghi trực tiếp dữ liệu vào S3 bucket hoặc EFS file system mà không cần máy chủ.',
    decisionRule: 'Giao thức SFTP/FTPS B2B + Lưu trực tiếp S3/EFS + Không quản trị máy chủ ➔ AWS Transfer Family.'
  },
  {
    id: 'q67',
    examCode: 'SCS-C02',
    domain: 'Bảo mật lưu trữ & Sao lưu bất biến',
    serviceId: 'backup',
    scenario: 'Ngân hàng trung ương quy định tất cả bản sao lưu CSDL hàng ngày phải được bảo vệ chống mã hóa tống tiền (ransomware). Bất kỳ ai, kể cả tài khoản Quản trị viên AWS cao nhất, cũng không được phép xóa bản sao lưu trước hạn tối thiểu 90 ngày.',
    question: 'Tính năng nào của AWS Backup bảo đảm yêu cầu này?',
    options: [
      { key: 'A', text: 'Bật KMS mã hóa bản sao lưu với Custom Key Policy', explanation: 'Key Administrator vẫn có thể vô hiệu hóa khóa KMS hoặc người có quyền IAM admin vẫn xóa được bản backup.' },
      { key: 'B', text: 'AWS Backup Vault Lock ở chế độ Compliance Mode', explanation: 'Chính xác! Vault Lock Compliance ngăn chặn việc xóa bản sao lưu và không thể bị vô hiệu hóa sau thời gian ân hạn.' },
      { key: 'C', text: 'AWS Backup Vault Lock ở chế độ Governance Mode', explanation: 'Governance Mode vẫn cho phép người có quyền đặc biệt bypass để xóa bản sao lưu.' },
      { key: 'D', text: 'Tạo AWS Organizations SCP chặn action `backup:DeleteRecoveryPoint`', explanation: 'SCP không áp dụng cho tài khoản Root của chính Management Account trong AWS Organizations.' }
    ],
    correctKey: 'B',
    answer: 'AWS Backup Vault Lock ở chế độ Compliance Mode',
    explanation: 'AWS Backup Vault Lock ở chế độ Compliance Mode cung cấp tính năng khóa bất biến tuân thủ tiêu chuẩn WORM. Một khi đã khóa qua khoảng thời gian ân hạn (grace period), không ai có thể xóa bản sao lưu hoặc giảm thời hạn lưu trữ, kể cả AWS Support.',
    decisionRule: 'Bảo vệ bản sao lưu chống Ransomware / Xóa sớm + Kể cả Root không xóa được ➔ AWS Backup Vault Lock Compliance.'
  },
  {
    id: 'q68',
    examCode: 'SAP-C02',
    domain: 'Phục hồi thảm họa tự động (Disaster Recovery)',
    serviceId: 'drs',
    scenario: 'Doanh nghiệp có 200 máy chủ ảo VMware vSphere tại trung tâm dữ liệu on-premises. Doanh nghiệp cần xây dựng giải pháp khôi phục sau thảm họa (DR) lên AWS với mục tiêu RPO tính bằng giây và RTO dưới 15 phút, đồng thời muốn chi phí thường trực ở mức tối thiểu nhất.',
    question: 'Kiến trúc nào tối ưu chi phí và hiệu quả nhất?',
    options: [
      { key: 'A', text: 'Duy trì toàn bộ 200 máy chủ EC2 chạy sẵn ở chế độ Multi-AZ trên AWS (Hot Standby)', explanation: 'Chi phí tiền máy chủ EC2 chạy song song 24/7 cực kỳ đắt đỏ và lãng phí.' },
      { key: 'B', text: 'AWS Elastic Disaster Recovery (AWS DRS) sao chép tầng khối liên tục', explanation: 'Chính xác! Chỉ tốn chi phí cho Replication Server nhỏ và EBS volume giá rẻ ở Staging Area; chỉ bật EC2 lớn khi xảy ra sự cố.' },
      { key: 'C', text: 'Chụp snapshot VMware hàng ngày rồi đẩy tệp OVA lên S3 qua AWS DataSync', explanation: 'RPO sẽ bị trễ tới 24 giờ và RTO mất nhiều giờ để import chuyển đổi OVA sang AMI.' },
      { key: 'D', text: 'AWS Application Migration Service (MGN)', explanation: 'MGN được thiết kế cho việc di chuyển vĩnh viễn (cutover migration), không phải dịch vụ chuyên dụng duy trì DR liên tục.' }
    ],
    correctKey: 'B',
    answer: 'AWS Elastic Disaster Recovery (AWS DRS)',
    explanation: 'AWS Elastic Disaster Recovery (DRS) sao chép dữ liệu liên tục ở tầng block từ on-premise vào Staging Area giá rẻ trên AWS (sử dụng EC2 nhỏ và EBS thông thường). Khi có sự cố thảm họa, DRS tự động sinh ra các máy chủ EC2 mạnh mẽ theo cấu hình mục tiêu trong vài phút.',
    decisionRule: 'Disaster Recovery (DR) cho máy chủ On-Premise/Cloud + RPO vài giây, RTO vài phút + Chi phí thấp ➔ AWS DRS.'
  },
  {
    id: 'q69',
    examCode: 'SAP-C02',
    domain: 'Di chuyển ứng dụng toàn diện (Application Migration)',
    serviceId: 'mgn',
    scenario: 'Một tập đoàn có kế hoạch đóng cửa trung tâm dữ liệu vật lý và di chuyển 500 máy chủ Windows/Linux lên AWS trong vòng 6 tháng. Yêu cầu thời gian ngừng hoạt động (cutover downtime) của mỗi ứng dụng phải dưới 10 phút.',
    question: 'Dịch vụ nào được AWS khuyến nghị để thực hiện việc này?',
    options: [
      { key: 'A', text: 'VM Import/Export sử dụng các tệp VMDK/VHD', explanation: 'Thời gian export/import tệp ảnh đĩa thủ công rất lâu, downtime kéo dài hàng giờ, không đáp ứng dưới 10 phút.' },
      { key: 'B', text: 'AWS Application Migration Service (AWS MGN)', explanation: 'Chính xác! Dịch vụ chuẩn tự động hóa sao chép cấp độ khối liên tục không gián đoạn và cutover trong vài phút.' },
      { key: 'C', text: 'AWS Server Migration Service (SMS)', explanation: 'SMS đã ngừng phát triển (deprecated) và được thay thế hoàn toàn bởi AWS MGN với hiệu năng khối cao hơn.' },
      { key: 'D', text: 'AWS DataSync', explanation: 'DataSync chỉ di chuyển file và dữ liệu lưu trữ, không chuyển đổi hệ điều hành và cấu hình máy chủ ứng dụng.' }
    ],
    correctKey: 'B',
    answer: 'AWS Application Migration Service (AWS MGN)',
    explanation: 'AWS MGN (trước đây là CloudEndure Migration) là công cụ di chuyển máy chủ chủ lực của AWS. Agent cài trên máy chủ nguồn thực hiện đồng bộ đĩa thời gian thực lên AWS. Trong quá trình sao chép máy chủ vẫn hoạt động bình thường, khi chuyển đổi (cutover) chỉ cần vài phút.',
    decisionRule: 'Lift-and-shift di chuyển máy chủ hàng loạt lên AWS + Downtime tối thiểu (<10p) ➔ AWS Application Migration Service (MGN).'
  },
  {
    id: 'q70',
    examCode: 'SAA-C03',
    domain: 'Di chuyển cơ sở dữ liệu Zero-Downtime',
    serviceId: 'dms',
    scenario: 'Một công ty cần chuyển đổi CSDL Oracle on-premises dung lượng 8 TB sang Amazon Aurora PostgreSQL trên AWS. Ứng dụng thanh toán trực tuyến không thể dừng quá 5 phút trong quá trình di chuyển.',
    question: 'Quy trình kết hợp dịch vụ nào là giải pháp tiêu chuẩn?',
    options: [
      { key: 'A', text: 'Sử dụng công cụ `pg_dump` và `pg_restore` qua đường truyền mạng', explanation: 'Oracle và PostgreSQL có cấu trúc dữ liệu khác nhau, pg_dump không thể đọc trực tiếp từ Oracle.' },
      { key: 'B', text: 'AWS Schema Conversion Tool (SCT) để chuyển schema + AWS DMS với CDC để đồng bộ liên tục', explanation: 'Chính xác! SCT biên dịch schema/code PL/SQL; DMS CDC duy trì đồng bộ liên tục giúp cutover gần như tức thì.' },
      { key: 'C', text: 'Xuất Oracle Data Pump ra file đẩy lên S3 rồi import vào Aurora', explanation: 'Chỉ áp dụng khi chuyển sang Oracle trên AWS (RDS for Oracle), không hỗ trợ chuyển đổi dị thể sang PostgreSQL.' },
      { key: 'D', text: 'Sử dụng AWS DataSync để sao chép thư mục dữ liệu tablespace', explanation: 'DataSync không hiểu logic dữ liệu CSDL và không thể chuyển đổi giữa hai hệ quản trị CSDL khác loại.' }
    ],
    correctKey: 'B',
    answer: 'AWS Schema Conversion Tool (SCT) kết hợp AWS DMS với Change Data Capture (CDC)',
    explanation: 'Khi di chuyển CSDL dị thể (heterogeneous), AWS SCT được dùng trước để chuyển đổi schema, index và stored procedures từ Oracle sang PostgreSQL. Sau đó AWS DMS nạp dữ liệu ban đầu (Full Load) và kích hoạt CDC đọc transaction log để đồng bộ liên tục, cho phép chuyển đổi hệ thống với downtime tối thiểu.',
    decisionRule: 'Di chuyển CSDL khác loại (Oracle sang Aurora Postgres) + Zero-downtime ➔ AWS SCT + AWS DMS CDC.'
  },

  // --- Networking & Edge Security (q71 - q80) ---
  {
    id: 'q71',
    examCode: 'ANS-C01',
    domain: 'Định tuyến DNS lai (Hybrid DNS Resolution)',
    serviceId: 'route53',
    scenario: 'Doanh nghiệp có hệ thống mạng lai kết nối giữa AWS VPC và trung tâm dữ liệu On-Premises qua Direct Connect. Các máy chủ On-Premises cần phân giải tên miền nội bộ `.aws.internal` trên AWS Route 53 Private Hosted Zone.',
    question: 'Cần cấu hình tài nguyên Route 53 nào để thực hiện việc này?',
    options: [
      { key: 'A', text: 'Tạo Route 53 Resolver Outbound Endpoint', explanation: 'Outbound Endpoint dùng khi tài nguyên EC2 trong VPC cần phân giải tên miền On-Premises, không phải chiều ngược lại.' },
      { key: 'B', text: 'Tạo Route 53 Resolver Inbound Endpoint', explanation: 'Chính xác! Cung cấp địa chỉ IP nội bộ trong VPC để máy chủ On-Premises chuyển tiếp (forward) truy vấn DNS tới.' },
      { key: 'C', text: 'Mở public Route 53 Hosted Zone với định tuyến Geolocation', explanation: 'Lộ cấu trúc tên miền nội bộ và IP riêng ra Internet công cộng, vi phạm nghiêm trọng an ninh mạng.' },
      { key: 'D', text: 'Gán Elastic IP công cộng vào Route 53 Resolver', explanation: 'Route 53 Resolver Inbound chỉ hoạt động với IP riêng trong Private Subnet qua kết nối Direct Connect/VPN.' }
    ],
    correctKey: 'B',
    answer: 'Tạo Route 53 Resolver Inbound Endpoint',
    explanation: 'Route 53 Resolver Inbound Endpoint gắn các card mạng ENI có IP riêng vào các Subnet trong VPC của bạn. DNS server tại trung tâm dữ liệu On-Premises được cấu hình conditional forwarding để gửi các truy vấn đuôi `.aws.internal` về các IP Inbound này.',
    decisionRule: 'Máy chủ On-Premises phân giải tên miền Route 53 Private Hosted Zone ➔ Route 53 Resolver Inbound Endpoint.'
  },
  {
    id: 'q72',
    examCode: 'ANS-C01',
    domain: 'Kết nối mạng đa VPC quy mô lớn (Transit Gateway)',
    serviceId: 'transit-gateway',
    scenario: 'Một tổ chức có 50 VPC cần kết nối với nhau và kết nối về văn phòng trung tâm. Kiến trúc sư mạng yêu cầu tách biệt hoàn toàn môi trường Production và Development không được phép nói chuyện trực tiếp với nhau, nhưng cả hai đều có thể truy cập Shared Services VPC.',
    question: 'Giải pháp cấu hình nào đáp ứng với nỗ lực quản trị thấp nhất?',
    options: [
      { key: 'A', text: 'Thiết lập Full Mesh VPC Peering giữa tất cả 50 VPC', explanation: 'Đòi hỏi hơn 1200 peering connection, không hỗ trợ định tuyến bắc cầu (transitive) và không thể quản trị nổi.' },
      { key: 'B', text: 'Sử dụng một AWS Transit Gateway với nhiều Route Table riêng biệt', explanation: 'Chính xác! Transit Gateway Route Tables cho phép cô lập mạng ảo (Network Segmentation / VRF) dễ dàng.' },
      { key: 'C', text: 'Sử dụng Gateway Load Balancer tại mỗi VPC', explanation: 'GWLB dùng để chèn tường lửa kiểm tra gói tin, không thay thế cho bộ định tuyến mạng Transit Gateway.' },
      { key: 'D', text: 'Dùng AWS PrivateLink tạo endpoint cho mọi dịch vụ', explanation: 'PrivateLink chỉ dành cho dịch vụ client-server 1 chiều trên TCP, không cung cấp mạng lưới IP routing linh hoạt.' }
    ],
    correctKey: 'B',
    answer: 'Sử dụng một AWS Transit Gateway với nhiều Route Table riêng biệt',
    explanation: 'AWS Transit Gateway hoạt động như một Cloud Router cấp cao. Bằng cách tạo các Transit Gateway Route Table riêng cho Production, Development và Shared Services, bạn có thể kiểm soát chính xác VPC nào được định tuyến sang VPC nào tương tự công nghệ VRF trong mạng vật lý.',
    decisionRule: 'Nhiều VPC kết nối hình sao + Phân đoạn mạng cô lập (Network Segmentation) ➔ Transit Gateway với nhiều Route Table.'
  },
  {
    id: 'q73',
    examCode: 'ANS-C01',
    domain: 'Định tuyến bất đối xứng & Tăng tốc Anycast (Global Accelerator)',
    serviceId: 'global-accelerator',
    scenario: 'Một game mobile trực tuyến nhiều người chơi (multiplayer) sử dụng giao thức UDP nhạy cảm với độ trễ (latency). Game thủ toàn cầu phản ánh tình trạng giật lag và mất gói tin khi kết nối trực tiếp đến cụm máy chủ game đặt tại us-east-1 qua Internet công cộng.',
    question: 'Dịch vụ nào giúp tối ưu đường truyền và giảm thiểu jitter cho game thủ?',
    options: [
      { key: 'A', text: 'Amazon CloudFront với Cache-Control max-age=0', explanation: 'CloudFront tối ưu phân phối HTTP/HTTPS tĩnh/động, không hỗ trợ tối ưu lưu lượng trò chơi UDP thô.' },
      { key: 'B', text: 'AWS Global Accelerator', explanation: 'Chính xác! Cung cấp 2 IP Anycast tĩnh toàn cầu, lưu lượng UDP đi vào Edge Location gần nhất rồi đi qua mạng cáp quang riêng của AWS.' },
      { key: 'C', text: 'Route 53 với Geolocation Routing Policy', explanation: 'Route 53 chỉ trả về địa chỉ IP khi phân giải DNS, gói tin UDP sau đó vẫn phải di chuyển qua mạng Internet công cộng đầy rủi ro.' },
      { key: 'D', text: 'AWS Direct Connect', explanation: 'Direct Connect chỉ dùng để nối trung tâm dữ liệu doanh nghiệp cố định, không thể dùng cho hàng triệu game thủ di động.' }
    ],
    correctKey: 'B',
    answer: 'AWS Global Accelerator',
    explanation: 'AWS Global Accelerator cung cấp 2 địa chỉ IP Anycast tĩnh. Gói tin UDP/TCP của game thủ được tiếp nhận ngay tại Edge Location gần nhất của AWS và di chuyển toàn bộ chặng đường dài còn lại trên hạ tầng mạng xương sống cáp quang bảo mật, không tắc nghẽn của AWS.',
    decisionRule: 'Ứng dụng UDP / Voice / Gaming + Nhạy cảm độ trễ + 2 địa chỉ IP Anycast tĩnh toàn cầu ➔ AWS Global Accelerator.'
  },
  {
    id: 'q74',
    examCode: 'SAA-C03',
    domain: 'Phân phối nội dung bảo mật (Content Delivery & Security)',
    serviceId: 'cloudfront',
    scenario: 'Một ứng dụng đào tạo trực tuyến bán các khóa học video độc quyền. Chỉ những học viên đã thanh toán và đăng nhập mới được xem video trực tuyến từ CloudFront. Ứng dụng cần cơ chế xác thực từng lượt tải video mà không để lộ URL gốc trên S3.',
    question: 'Cơ chế nào của CloudFront bảo vệ nội dung này chuẩn xác nhất?',
    options: [
      { key: 'A', text: 'Cấu hình S3 Bucket Policy cho phép IP công cộng của học viên', explanation: 'Học viên dùng mạng 4G/Wifi thay đổi IP liên tục, không thể quản lý IP tĩnh trên S3 Policy.' },
      { key: 'B', text: 'Sử dụng CloudFront Signed URLs hoặc Signed Cookies với Origin Access Control (OAC)', explanation: 'Chính xác! CloudFront ký URL có thời hạn truy cập, đồng thời OAC chặn truy cập trực tiếp vào S3.' },
      { key: 'C', text: 'Bật mã hóa S3 SSE-KMS và chia sẻ khóa KMS cho học viên', explanation: 'Không thể cấp quyền IAM giải mã KMS cho người dùng Internet công cộng.' },
      { key: 'D', text: 'Đặt basic auth HTTP header trên S3 bucket', explanation: 'S3 không hỗ trợ HTTP Basic Authentication nguyên bản.' }
    ],
    correctKey: 'B',
    answer: 'CloudFront Signed URLs / Signed Cookies kết hợp S3 Origin Access Control (OAC)',
    explanation: 'CloudFront Signed URLs cho phép máy chủ ứng dụng tạo ra đường dẫn tạm thời có chữ ký số mã hóa và thời hạn hết hạn (expiration time) cho từng học viên. Kết hợp với S3 Origin Access Control (OAC), S3 bucket hoàn toàn private và chỉ chấp nhận request hợp lệ từ CloudFront.',
    decisionRule: 'Bảo vệ video/file trả phí qua CDN + Giới hạn thời gian xem cho từng người dùng ➔ CloudFront Signed URLs / Signed Cookies.'
  },
  {
    id: 'q75',
    examCode: 'SCS-C02',
    domain: 'Bảo vệ Web & Chống tấn công lớp 7',
    serviceId: 'waf',
    scenario: 'Trang web thương mại điện tử thường xuyên bị các bot mạng tấn công dò mật khẩu (brute-force) vào đường dẫn `/login` và vét dữ liệu sản phẩm (web scraping) với tần suất hơn 2.000 yêu cầu mỗi phút từ một địa chỉ IP.',
    question: 'Quy tắc AWS WAF nào ngăn chặn hành vi này tự động và hiệu quả nhất?',
    options: [
      { key: 'A', text: 'Tạo quy tắc Rate-based Rule trên AWS WAF khớp URI `/login` với ngưỡng giới hạn', explanation: 'Chính xác! Tự động chặn tạm thời IP vượt quá ngưỡng số request quy định trong cửa sổ 5 phút.' },
      { key: 'B', text: 'Cấu hình Security Group trên Application Load Balancer để drop gói tin IP đó', explanation: 'Security Group không hỗ trợ tự động đếm tần suất request và không thể đọc được đường dẫn URI lớp 7.' },
      { key: 'C', text: 'Viết cron job đọc VPC Flow Logs mỗi 15 phút rồi cập nhật NACL', explanation: 'Độ trễ quá lớn (15 phút), NACL tối đa chỉ hỗ trợ vài chục rule và không tự giải phóng IP sau khi hết tấn công.' },
      { key: 'D', text: 'Sử dụng AWS Shield Standard', explanation: 'Shield Standard chỉ bảo vệ tự động trước các đòn tấn công mạng Lớp 3 và Lớp 4 (SYN Flood, UDP reflection).' }
    ],
    correctKey: 'A',
    answer: 'Tạo quy tắc Rate-based Rule trên AWS WAF khớp URI `/login`',
    explanation: 'AWS WAF Rate-based Rule theo dõi tần suất yêu cầu đến từ từng địa chỉ IP trong các khung thời gian linh hoạt (từ 1 đến 5 phút). Khi một IP vượt ngưỡng (ví dụ 100 requests/phút vào `/login`), WAF sẽ tự động chặn (Block) hoặc trả mã CAPTCHA cho IP đó.',
    decisionRule: 'Chống Brute-force / Web scraping vượt tần suất request theo IP vào URL cụ thể ➔ AWS WAF Rate-based Rule.'
  },

  // --- Security, Governance & Identity (q76 - q85) ---
  {
    id: 'q76',
    examCode: 'SCS-C02',
    domain: 'Quản trị danh tính tập trung (Identity Federation)',
    serviceId: 'iam-identity-center',
    scenario: 'Tập đoàn đa quốc gia có hơn 100 tài khoản AWS trong AWS Organizations. Quản trị viên muốn nhân viên đăng nhập vào tất cả các tài khoản AWS bằng thông tin tài khoản Microsoft Entra ID (Azure AD) sẵn có của công ty, áp dụng xác thực đa yếu tố (MFA) và phân quyền dựa trên chức vụ.',
    question: 'Giải pháp xác thực và cấp quyền tập trung chuẩn xác nhất của AWS là gì?',
    options: [
      { key: 'A', text: 'Tạo tài khoản IAM User riêng lẻ trên từng tài khoản con', explanation: 'Cơn ác mộng quản trị với hàng trăm tài khoản, khó đồng bộ mật khẩu và thu hồi quyền khi nhân viên nghỉ việc.' },
      { key: 'B', text: 'AWS IAM Identity Center (tiền thân là AWS SSO) liên kết SAML 2.0 / SCIM với Entra ID', explanation: 'Chính xác! Đồng bộ người dùng/nhóm tự động qua SCIM và cấp quyền tập trung trên toàn bộ Organization.' },
      { key: 'C', text: 'Sử dụng Amazon Cognito User Pools', explanation: 'Cognito dành cho xác thực khách hàng của ứng dụng web/di động B2C, không dùng cho phân quyền quản trị AWS Console.' },
      { key: 'D', text: 'Sử dụng AWS Directory Service Simple AD', explanation: 'Không liên kết trực tiếp được với kiến trúc Cloud Identity Entra ID và không quản lý SSO đa tài khoản tối ưu bằng Identity Center.' }
    ],
    correctKey: 'B',
    answer: 'AWS IAM Identity Center (AWS SSO) tích hợp với Microsoft Entra ID',
    explanation: 'AWS IAM Identity Center là giải pháp khuyến nghị số 1 của AWS để quản lý truy cập bảng điều khiển (Console) và CLI tập trung. Tích hợp với IdP doanh nghiệp (như Entra ID, Okta) qua chuẩn SAML 2.0 và SCIM giúp tự động đồng bộ tài khoản nhân viên và gán quyền Permission Sets đa tài khoản.',
    decisionRule: 'Đăng nhập tập trung đa tài khoản AWS qua danh tính doanh nghiệp (Azure AD / Okta) ➔ AWS IAM Identity Center.'
  },
  {
    id: 'q77',
    examCode: 'SCS-C02',
    domain: 'Quản lý máy chủ không mở cổng (Secure Fleet Management)',
    serviceId: 'systems-manager',
    scenario: 'Đội bảo mật yêu cầu đóng hoàn toàn cổng 22 (SSH) và cổng 3389 (RDP) trên toàn bộ máy chủ EC2 đặt trong Private Subnet. Các kỹ sư DevOps vẫn cần truy cập dòng lệnh terminal và truyền tệp an toàn vào máy chủ, đồng thời toàn bộ thao tác gõ lệnh phải được ghi log kiểm toán.',
    question: 'Công cụ nào đáp ứng chính xác chính sách bảo mật này?',
    options: [
      { key: 'A', text: 'Dựng một máy chủ Bastion Host (Jump Box) trong Public Subnet mở cổng 22', explanation: 'Bastion host vẫn phải mở cổng 22 ra Internet, có rủi ro bị tấn công brute-force và phải quản lý SSH key.' },
      { key: 'B', text: 'AWS Systems Manager Session Manager', explanation: 'Chính xác! Không cần mở cổng inbound, không cần public IP, xác thực qua IAM và ghi log toàn bộ vào CloudWatch/S3.' },
      { key: 'C', text: 'Cấu hình EC2 Instance Connect', explanation: 'Vẫn yêu cầu máy chủ EC2 có đường mạng mở cổng 22 (qua Public IP hoặc qua Endpoint EC2 Instance Connect mới).' },
      { key: 'D', text: 'Sử dụng AWS Client VPN gắn vào VPC', explanation: 'Client VPN tốn thêm chi phí duy trì endpoint, quản lý chứng chỉ kết nối VPN phức tạp hơn SSM.' }
    ],
    correctKey: 'B',
    answer: 'AWS Systems Manager Session Manager',
    explanation: 'SSM Session Manager kết nối an toàn vào instance thông qua SSM Agent outbound tới AWS Systems Manager endpoint qua cổng 443 (hoặc qua VPC Endpoint). Bạn không cần mở bất kỳ cổng inbound nào trong Security Group, không cần Public IP và toàn bộ lịch sử gõ lệnh được ghi log bất biến.',
    decisionRule: 'Truy cập Shell EC2 không mở cổng 22/3389 + Không cần Public IP + Ghi log kiểm toán thao tác ➔ AWS Systems Manager Session Manager.'
  },
  {
    id: 'q78',
    examCode: 'SAP-C02',
    domain: 'Giám sát tuân thủ cấu hình tự động (Compliance & Remediation)',
    serviceId: 'config',
    scenario: 'Ngân hàng muốn đảm bảo tất cả các S3 bucket trên toàn bộ hệ thống phải luôn bật tính năng mã hóa (Default Encryption) và chặn truy cập công cộng (Block Public Access). Nếu một lập trình viên tạo bucket sai quy định, hệ thống phải tự động sửa lỗi (remediate) về trạng thái an toàn trong vài giây.',
    question: 'Cặp giải pháp nào của AWS thực hiện việc này tự động?',
    options: [
      { key: 'A', text: 'CloudWatch Alarms kích hoạt SNS gửi email nhắc nhở', explanation: 'Chỉ gửi email thông báo, không có khả năng tự động thực thi hành động chỉnh sửa cấu hình tài nguyên.' },
      { key: 'B', text: 'AWS Config Rules kết hợp Automatic Remediation qua SSM Automation Documents', explanation: 'Chính xác! Config phát hiện trạng thái Non-compliant và kích hoạt SSM Runbook tự động khắc phục.' },
      { key: 'C', text: 'Viết AWS IAM Policy chặn hành vi tạo S3 bucket', explanation: 'Chặn hoàn toàn việc tạo bucket sẽ làm ngưng trệ công việc phát triển của các đội nhóm.' },
      { key: 'D', text: 'Chạy AWS Inspector định kỳ mỗi tuần', explanation: 'Inspector quét lỗ hổng phần mềm CVE và gói cài đặt trên OS, không phải công cụ kiểm tra và remediate cấu hình S3 tức thì.' }
    ],
    correctKey: 'B',
    answer: 'AWS Config Rules với SSM Automation Remediation',
    explanation: 'AWS Config liên tục đánh giá cấu hình tài nguyên dựa trên các rule quy chuẩn (như `s3-bucket-server-side-encryption-enabled`). Khi phát hiện bucket không tuân thủ, AWS Config có thể tự động kích hoạt một SSM Automation document để bật mã hóa hoặc đóng quyền public ngay lập tức.',
    decisionRule: 'Phát hiện sai lệch cấu hình tài nguyên + Tự động sửa lỗi về chuẩn (Auto Remediation) ➔ AWS Config + SSM Automation.'
  },
  {
    id: 'q79',
    examCode: 'SCS-C02',
    domain: 'Kiểm toán sự kiện & Truy vết API (Auditing & Forensic)',
    serviceId: 'cloudtrail',
    scenario: 'Đội điều tra an ninh cần truy vết chính xác ai đã thực hiện thao tác xóa nhầm bảng DynamoDB thanh toán quan trọng lúc 02:00 sáng, bao gồm địa chỉ IP nguồn, tài khoản IAM và User-Agent của người thực hiện.',
    question: 'Dịch vụ nào ghi nhận đầy đủ bản ghi kiểm toán này?',
    options: [
      { key: 'A', text: 'Amazon CloudWatch Logs', explanation: 'Lưu log ứng dụng hoặc OS, không tự động ghi lại lịch sử gọi API quản trị trên AWS Account nếu không cấu hình stream.' },
      { key: 'B', text: 'AWS CloudTrail Event History & Trails', explanation: 'Chính xác! Ghi lại chi tiết mọi lời gọi API quản trị (Management Events) bao gồm danh tính, IP, thời gian, tham số.' },
      { key: 'C', text: 'VPC Flow Logs', explanation: 'Chỉ ghi thông tin địa chỉ IP nguồn/đích và port ở tầng mạng (Lớp 4), không biết được người dùng nào đã gọi lệnh gì.' },
      { key: 'D', text: 'AWS Trusted Advisor', explanation: 'Cung cấp khuyến nghị tối ưu chi phí, hiệu năng và bảo mật, không lưu lịch sử kiểm toán API.' }
    ],
    correctKey: 'B',
    answer: 'AWS CloudTrail Event History & Trails',
    explanation: 'AWS CloudTrail ghi nhận toàn bộ hoạt động của tài khoản dưới dạng sự kiện (events). Mọi cuộc gọi API thông qua AWS Console, AWS CLI hay SDK đều được ghi lại với đầy đủ metadata: tên hàm API (DeleteTable), danh tính IAM caller, thời điểm chính xác, IP nguồn và response code.',
    decisionRule: 'Truy vết ai gọi API gì, lúc mấy giờ, từ địa chỉ IP nào trên tài khoản AWS ➔ AWS CloudTrail.'
  },
  {
    id: 'q80',
    examCode: 'SCS-C02',
    domain: 'Phát hiện mối đe dọa thông minh (Intelligent Threat Detection)',
    serviceId: 'guardduty',
    scenario: 'Hệ thống bảo mật cần tự động phát hiện các hành vi bất thường: một máy chủ EC2 bắt đầu gửi lưu lượng bất thường đến các máy chủ điều khiển botnet (C&C) hoặc nghi vấn đang đào tiền điện tử (crypto mining), và có một IAM User đang gọi API từ một vị trí địa lý bất thường.',
    question: 'Dịch vụ nào cung cấp khả năng phát hiện mối đe dọa này mà không cần cài agent?',
    options: [
      { key: 'A', text: 'Amazon Inspector', explanation: 'Inspector tập trung quét lỗ hổng phần mềm CVE và mã độc trên file system, không phân tích luồng mạng và log hành vi bất thường thời gian thực.' },
      { key: 'B', text: 'Amazon GuardDuty', explanation: 'Chính xác! Phân tích thông minh độc lập từ VPC Flow Logs, DNS Logs, CloudTrail Logs không cần cài agent lên server.' },
      { key: 'C', text: 'AWS WAF', explanation: 'WAF bảo vệ trước request độc hại vào trang web ở tầng 7 (ALB/CloudFront), không theo dõi hoạt động nội bộ của máy chủ EC2.' },
      { key: 'D', text: 'AWS Security Hub', explanation: 'Security Hub tổng hợp phát hiện từ nhiều nguồn và đánh giá chuẩn tuân thủ, bản thân nó không phải engine phân tích máy học phát hiện mã độc.' }
    ],
    correctKey: 'B',
    answer: 'Amazon GuardDuty',
    explanation: 'Amazon GuardDuty là dịch vụ phát hiện mối đe dọa liên tục sử dụng Machine Learning và Threat Intelligence feeds. Nó phân tích hàng tỷ sự kiện từ AWS CloudTrail, VPC Flow Logs, DNS Query Logs và EKS audit logs hoàn toàn thụ động ở hạ tầng nền tảng, không làm ảnh hưởng hiệu năng máy chủ.',
    decisionRule: 'Phát hiện đào tiền ảo / Kết nối Botnet C&C / Bất thường API không cần cài agent ➔ Amazon GuardDuty.'
  },

  // --- Analytics & Big Data Systems (q81 - q90) ---
  {
    id: 'q81',
    examCode: 'DEA-C01',
    domain: 'Phân vùng dữ liệu động thời gian thực (Dynamic Partitioning)',
    serviceId: 'kinesis',
    scenario: 'Hệ thống IoT tiếp nhận hàng triệu bản ghi JSON mỗi phút và cần lưu trữ vào S3 Data Lake. Dữ liệu cần được tự động phân vùng vào các thư mục S3 theo cấu trúc `year/month/day/customer_id` dựa trên các trường nằm bên trong nội dung JSON của từng thông điệp.',
    question: 'Tính năng nào giúp thực hiện việc này trực tiếp mà không cần viết code Lambda?',
    options: [
      { key: 'A', text: 'Amazon Kinesis Data Firehose với Dynamic Partitioning', explanation: 'Chính xác! Firehose tự động bóc tách các trường JSON (JmesPath) và phân phối vào tiền tố S3 tương ứng.' },
      { key: 'B', text: 'Sử dụng Amazon SQS Event Source Mapping', explanation: 'SQS không có tính năng tự động ghi file S3 và phân vùng thư mục động theo nội dung tin nhắn.' },
      { key: 'C', text: 'Amazon Athena Partition Projection', explanation: 'Partition Projection là kỹ thuật tăng tốc truy vấn trên Athena, không phải cơ chế tự động ghi và phân chia file trên S3.' },
      { key: 'D', text: 'AWS Glue Crawler chạy mỗi 5 phút', explanation: 'Glue Crawler chỉ quét cấu trúc schema để cập nhật catalog, không thể tự di chuyển hay sắp xếp file vật lý theo thời gian thực.' }
    ],
    correctKey: 'A',
    answer: 'Amazon Kinesis Data Firehose với Dynamic Partitioning',
    explanation: 'Amazon Data Firehose (trước đây là Kinesis Data Firehose) hỗ trợ Dynamic Partitioning. Tính năng này cho phép bạn định nghĩa các biểu thức JQ/JmesPath để trích xuất các thuộc tính bên trong payload JSON (như customer_id, timestamp) và tự động ghi vào các tiền tố (prefix) S3 tùy biến mà không cần serverless compute đệm.',
    decisionRule: 'Ghi luồng stream vào S3 + Tự động chia thư mục theo giá trị trường trong JSON ➔ Kinesis Data Firehose Dynamic Partitioning.'
  },
  {
    id: 'q82',
    examCode: 'DEA-C01',
    domain: 'Hồ dữ liệu & Kiểm soát phân quyền chi tiết (Data Lake Governance)',
    serviceId: 'lake-formation',
    scenario: 'Một công ty chia sẻ S3 Data Lake chứa bảng thông tin khách hàng cho nhiều bộ phận. Bộ phận Marketing chỉ được phép đọc các cột `ten, email, khu_vuc` nhưng bị cấm xem cột `so_the_tin_dung` và chỉ được xem các khách hàng tại khu vực `VN`.',
    question: 'Dịch vụ nào cung cấp khả năng phân quyền cấp dòng và cấp cột (row/column-level) trên S3?',
    options: [
      { key: 'A', text: 'Sử dụng S3 Bucket Policies kết hợp IAM Policies', explanation: 'S3 Policy chỉ phân quyền theo đường dẫn prefix/object, không thể can thiệp sâu vào từng dòng hoặc từng cột trong file parquet/csv.' },
      { key: 'B', text: 'AWS Lake Formation', explanation: 'Chính xác! Cung cấp khả năng phân quyền dữ liệu hạt nhân (fine-grained access control) tới từng hàng, từng cột và ô tế bào.' },
      { key: 'C', text: 'Mã hóa từng cột bằng các khóa AWS KMS khác nhau', explanation: 'Quá phức tạp, chi phí gọi API KMS cao và các công cụ truy vấn SQL thông thường không giải mã được linh hoạt.' },
      { key: 'D', text: 'Tách dữ liệu ra thành hàng chục S3 bucket riêng biệt cho từng phòng ban', explanation: 'Gây trùng lặp dữ liệu, tăng chi phí lưu trữ và khó khăn trong việc duy trì đồng bộ tính nhất quán.' }
    ],
    correctKey: 'B',
    answer: 'AWS Lake Formation',
    explanation: 'AWS Lake Formation mở rộng khả năng quản trị Data Lake trên Amazon S3. Thay vì dựa vào quyền S3 thô, Lake Formation cung cấp cơ chế phân quyền tập trung cấp cơ sở dữ liệu, bảng, từng cột (column-level) và lọc từng dòng (row-level data filtering) cho các công cụ như Athena, Redshift Spectrum và EMR.',
    decisionRule: 'Phân quyền Data Lake S3 theo cột, theo dòng (Row/Column level security) ➔ AWS Lake Formation.'
  },
  {
    id: 'q83',
    examCode: 'DEA-C01',
    domain: 'Truy vấn liên kết dữ liệu đa nguồn (Federated Query)',
    serviceId: 'athena',
    scenario: 'Chuyên viên phân tích cần chạy một câu lệnh SQL duy nhất kết hợp (JOIN) dữ liệu lịch sử giao dịch 10 năm lưu dưới định dạng Parquet trên Amazon S3 với dữ liệu đơn hàng đang xử lý thời gian thực nằm trong cơ sở dữ liệu Amazon RDS PostgreSQL và Amazon DynamoDB.',
    question: 'Giải pháp serverless nào cho phép truy vấn trực tiếp mà không cần di chuyển dữ liệu (ETL)?',
    options: [
      { key: 'A', text: 'Amazon Athena Federated Query', explanation: 'Chính xác! Athena sử dụng Data Source Connectors chạy trên AWS Lambda để query và JOIN trực tiếp nhiều nguồn.' },
      { key: 'B', text: 'Amazon EMR chạy cụm Spark lớn', explanation: 'Đòi hỏi phải khởi tạo và quản lý cụm máy chủ, chi phí cao và không phải giải pháp SQL không máy chủ tức thì.' },
      { key: 'C', text: 'Xuất toàn bộ RDS và DynamoDB ra S3 mỗi lần chạy câu truy vấn', explanation: 'Tốn rất nhiều thời gian chờ đợi xuất dữ liệu, độ trễ cao và làm quá tải CSDL hoạt động.' },
      { key: 'D', text: 'AWS Glue DataBrew', explanation: 'DataBrew là công cụ chuẩn bị và làm sạch dữ liệu trực quan bằng giao diện, không phải engine SQL phân tán đa nguồn.' }
    ],
    correctKey: 'A',
    answer: 'Amazon Athena Federated Query',
    explanation: 'Amazon Athena Federated Query cho phép bạn thực thi các câu lệnh SQL trải dài qua nhiều nguồn dữ liệu quan hệ, phi quan hệ, kho đối tượng và nguồn tùy biến. Athena tận dụng các connector Lambda để đọc siêu dữ liệu và dữ liệu từ RDS, DynamoDB, OpenSearch và kết hợp trực tiếp với dữ liệu trên S3.',
    decisionRule: 'Chạy một câu lệnh SQL JOIN dữ liệu giữa S3, RDS và DynamoDB không cần nạp ETL ➔ Amazon Athena Federated Query.'
  },
  {
    id: 'q84',
    examCode: 'DEA-C01',
    domain: 'Tối ưu hóa chi phí nhật ký quy mô lớn (Log Analytics Tiering)',
    serviceId: 'opensearch',
    scenario: 'Hệ thống OpenSearch tiếp nhận 2 TB nhật ký (logs) mỗi ngày. Đội ngũ vận hành cần tìm kiếm tương tác cực nhanh trong 7 ngày gần nhất, nhưng sau 7 ngày các log này ít khi được tra cứu và chỉ cần lưu trữ trong 90 ngày phục vụ tuân thủ với chi phí thấp nhất.',
    question: 'Chiến lược phân tầng lưu trữ nào trên Amazon OpenSearch Service là chuẩn xác?',
    options: [
      { key: 'A', text: 'Sử dụng UltraWarm storage cho dữ liệu sau 7 ngày, sau đó chuyển tiếp sang Cold Storage', explanation: 'Chính xác! Hot tier (EBS) cho 7 ngày đầu, UltraWarm (S3 backed) cho dữ liệu ít đọc, và Cold Storage khi không dùng.' },
      { key: 'B', text: 'Tăng gấp đôi số lượng Data Node dùng ổ EBS gp3', explanation: 'Lãng phí chi phí phần cứng máy chủ đắt đỏ cho dữ liệu cũ ít khi tra cứu.' },
      { key: 'C', text: 'Tạo snapshot thủ công ra S3 và xóa index mỗi 7 ngày', explanation: 'Nếu cần tra cứu lại log ngày thứ 15 sẽ phải restore cả cluster tốn nhiều giờ đồng hồ.' },
      { key: 'D', text: 'Dùng CloudWatch Logs Insights thay thế toàn bộ OpenSearch', explanation: 'CloudWatch Logs Insights chi phí quét $0.005/GB, với lượng log nhiều TB mỗi ngày chi phí query sẽ rất lớn.' }
    ],
    correctKey: 'A',
    answer: 'Phân tầng lưu trữ Hot ➔ UltraWarm ➔ Cold Storage trên Amazon OpenSearch Service',
    explanation: 'Amazon OpenSearch Service hỗ trợ kiến trúc phân tầng: Hot storage sử dụng NVMe/EBS cho tốc độ ghi/đọc cao nhất; UltraWarm tận dụng Amazon S3 bên dưới với các node tính toán đệm giúp giảm tới 90% chi phí lưu trữ; Cold Storage cho phép lưu index không hoạt động trên S3 mà vẫn có thể mount lại khi cần.',
    decisionRule: 'Lưu trữ log lớn trên OpenSearch: Tìm kiếm nhanh ngày gần + Tiết kiệm 90% chi phí log cũ ➔ Phân tầng Hot sang UltraWarm/Cold.'
  },
  {
    id: 'q85',
    examCode: 'DEA-C01',
    domain: 'Quản lý cụm Kafka hoàn toàn không máy chủ (Serverless Kafka)',
    serviceId: 'msk',
    scenario: 'Doanh nghiệp muốn sử dụng Apache Kafka để tiếp nhận luồng sự kiện từ các ứng dụng Microservices, nhưng không muốn tự quản lý việc nâng cấp phiên bản Kafka, không muốn lập kế hoạch kích thước broker hay quản lý cụm Zookeeper/KRaft.',
    question: 'Tùy chọn dịch vụ nào đáp ứng hoàn toàn bài toán này?',
    options: [
      { key: 'A', text: 'Cài đặt Kafka trên các cụm máy chủ Amazon EC2 Auto Scaling', explanation: 'Tốn rất nhiều chi phí nhân sự DevOps vận hành cụm, cấu hình Zookeeper và xử lý rebalance phân vùng.' },
      { key: 'B', text: 'Amazon Managed Streaming for Apache Kafka (Amazon MSK) Serverless', explanation: 'Chính xác! Tự động mở rộng dung lượng tính toán và lưu trữ, hoàn toàn tương thích Kafka API mà không cần quản lý broker.' },
      { key: 'C', text: 'Amazon SQS FIFO Queues', explanation: 'SQS không tương thích chuẩn giao thức Apache Kafka và không hỗ trợ các consumer group đọc song song như Kafka.' },
      { key: 'D', text: 'Amazon Kinesis Data Streams', explanation: 'Kinesis sử dụng API riêng của AWS, không tương thích với mã nguồn ứng dụng hiện tại đang viết cho Kafka.' }
    ],
    correctKey: 'B',
    answer: 'Amazon MSK Serverless',
    explanation: 'Amazon MSK Serverless là loại cụm của Amazon MSK cho phép chạy Apache Kafka mà không cần quản lý và mở rộng dung lượng broker. MSK Serverless tự động cấp phát tài nguyên tính toán và lưu trữ theo lưu lượng nạp thực tế, tương thích 100% với các client Apache Kafka.',
    decisionRule: 'Apache Kafka tương thích nguyên bản + Hoàn toàn Serverless không quản trị broker ➔ Amazon MSK Serverless.'
  },

  // --- Generative AI & Machine Learning (q86 - q95) ---
  {
    id: 'q86',
    examCode: 'MLS-C01',
    domain: 'Hỏi đáp tài liệu thông minh & RAG được quản lý',
    serviceId: 'bedrock',
    scenario: 'Doanh nghiệp muốn xây dựng trợ lý AI có thể tra cứu và trả lời các câu hỏi dựa trên kho tài liệu PDF nội bộ 50 GB. Đội ngũ muốn giải pháp RAG hoàn chỉnh (tự động cắt nhỏ văn bản, tạo vector embeddings, lưu vào vector database và tìm kiếm ngữ nghĩa) mà không muốn tự dựng hạ tầng phức tạp.',
    question: 'Tính năng nào của Amazon Bedrock cung cấp toàn bộ quy trình này?',
    options: [
      { key: 'A', text: 'Amazon Bedrock Foundation Models Fine-tuning', explanation: 'Fine-tuning là huấn luyện lại trọng số mô hình với dữ liệu gán nhãn, tốn kém và không tự động cập nhật tri thức khi tài liệu thay đổi.' },
      { key: 'B', text: 'Knowledge Bases for Amazon Bedrock', explanation: 'Chính xác! Giải pháp RAG được quản lý hoàn toàn, tự động đồng bộ S3, chunking, embedding và kết nối OpenSearch/Pinecone.' },
      { key: 'C', text: 'Amazon Comprehend Custom Entity Recognition', explanation: 'Chỉ nhận diện các thực thể tùy biến trong văn bản, không phải giải pháp RAG sinh câu trả lời tự nhiên.' },
      { key: 'D', text: 'Amazon Kendra', explanation: 'Kendra là engine tìm kiếm doanh nghiệp truyền thống, kết hợp phức tạp hơn so với Knowledge Bases được tối ưu riêng cho Bedrock.' }
    ],
    correctKey: 'B',
    answer: 'Knowledge Bases for Amazon Bedrock',
    explanation: 'Knowledge Bases for Amazon Bedrock kết nối mô hình ngôn ngữ lớn (LLM) với nguồn dữ liệu của bạn trên Amazon S3. Dịch vụ tự động phân tách văn bản (chunking), tạo vector embeddings bằng mô hình Titan Embeddings, lưu vào vector database (OpenSearch Serverless, Pinecone, Aurora) và trích xuất ngữ cảnh chính xác cho LLM.',
    decisionRule: 'Xây dựng RAG tra cứu tài liệu nội bộ cho LLM hoàn toàn được quản lý ➔ Knowledge Bases for Amazon Bedrock.'
  },
  {
    id: 'q87',
    examCode: 'MLS-C01',
    domain: 'Kiểm soát an toàn AI & Loại bỏ ảo giác (AI Safety & Guardrails)',
    serviceId: 'bedrock',
    scenario: 'Một ngân hàng tích hợp mô hình ngôn ngữ lớn để trả lời khách hàng. Ngân hàng bắt buộc phải có cơ chế rào chắn chặn các câu trả lời chứa thông tin cá nhân (PII như CCCD, số thẻ ATM), ngăn chặn các hành vi tấn công prompt injection và không cho phép trợ lý tư vấn chủ đề đầu tư tiền mã hóa.',
    question: 'Giải pháp nào giúp ngân hàng kiểm soát an toàn tập trung độc lập với các mô hình AI?',
    options: [
      { key: 'A', text: 'Viết system prompt dài nhắc nhở mô hình không được nói về tiền mã hóa', explanation: 'Dễ dàng bị vượt qua bởi các kỹ thuật Jailbreak hoặc Prompt Injection tinh vi của người dùng.' },
      { key: 'B', text: 'Amazon Bedrock Guardrails', explanation: 'Chính xác! Độc lập với mô hình, lọc nội dung độc hại, chặn chủ đề cấm (Denied Topics), ẩn PII và kiểm tra ảo giác (Grounding).' },
      { key: 'C', text: 'Cài đặt tường lửa AWS WAF trước API Gateway', explanation: 'WAF chặn các payload SQLi, XSS thông thường ở tầng HTTP, không hiểu ngữ nghĩa câu từ và rủi ro Prompt Injection của LLM.' },
      { key: 'D', text: 'Amazon Macie', explanation: 'Macie quét dữ liệu PII tĩnh lưu trong S3 bucket, không có khả năng đánh chặn và che giấu PII trong luồng chat trực tiếp.' }
    ],
    correctKey: 'B',
    answer: 'Amazon Bedrock Guardrails',
    explanation: 'Amazon Bedrock Guardrails cho phép bạn áp dụng các biện pháp an toàn tùy chỉnh trên nhiều mô hình nền tảng khác nhau. Nó hỗ trợ cấu hình Denied Topics (chủ đề bị cấm), Content Filters (lọc thù địch, tình dục, bạo lực), Word Filters, PII Masking/Blocking và Grounding Checks để phát hiện ảo giác.',
    decisionRule: 'Bảo vệ an toàn ứng dụng GenAI / Chặn Prompt Injection / Che giấu PII thời gian thực ➔ Amazon Bedrock Guardrails.'
  },
  {
    id: 'q88',
    examCode: 'MLS-C01',
    domain: 'Tự động hóa học máy (AutoML & No-Code ML)',
    serviceId: 'sagemaker',
    scenario: 'Bộ phận rủi ro tín dụng có tập dữ liệu CSV dạng bảng (tabular data) về lịch sử vay vốn của khách hàng. Họ cần huấn luyện và tìm ra mô hình Machine Learning phân loại khách hàng có nguy cơ nợ xấu tốt nhất, đồng thời có bảng giải thích tầm quan trọng của từng đặc trưng (feature attribution) để giải trình thanh tra.',
    question: 'Tính năng nào của Amazon SageMaker đáp ứng nhanh nhất bài toán này?',
    options: [
      { key: 'A', text: 'Tự viết script thuật toán Scikit-Learn trên SageMaker Studio Notebook', explanation: 'Mất nhiều tuần thử nghiệm thủ công các mô hình, tinh chỉnh siêu tham số và viết code giải thích.' },
      { key: 'B', text: 'Amazon SageMaker Autopilot kết hợp SageMaker Clarify', explanation: 'Chính xác! Tự động thử nghiệm hàng chục mô hình, tối ưu siêu tham số và xuất báo cáo minh bạch feature attribution.' },
      { key: 'C', text: 'Amazon Comprehend', explanation: 'Comprehend là dịch vụ xử lý ngôn ngữ tự nhiên (NLP) cho văn bản, không dùng cho phân tích dữ liệu bảng số liệu tabular.' },
      { key: 'D', text: 'Amazon Forecast', explanation: 'Forecast chuyên biệt cho dữ liệu chuỗi thời gian (time-series forecasting), không phải phân loại nhị phân rủi ro tín dụng.' }
    ],
    correctKey: 'B',
    answer: 'Amazon SageMaker Autopilot kết hợp SageMaker Clarify',
    explanation: 'SageMaker Autopilot tự động khám phá dữ liệu dạng bảng, lựa chọn thuật toán phù hợp nhất, tối ưu siêu tham số và xếp hạng các mô hình tốt nhất theo độ chính xác. SageMaker Clarify tích hợp sẵn để đánh giá tính công bằng (bias) và giải thích tầm quan trọng của các yếu tố ảnh hưởng tới quyết định dự đoán.',
    decisionRule: 'AutoML cho dữ liệu bảng + Tự động chọn mô hình + Báo cáo giải thích tính minh bạch ➔ SageMaker Autopilot & Clarify.'
  },
  {
    id: 'q89',
    examCode: 'SAA-C03',
    domain: 'Trích xuất văn bản & biểu mẫu thông minh (Intelligent Document Processing)',
    serviceId: 'textract',
    scenario: 'Một công ty bảo hiểm nhận hàng triệu bản scan hóa đơn viện phí và giấy tờ tùy thân định dạng PDF/ảnh. Hệ thống cần trích xuất chính xác các bảng biểu (tables) và các cặp khóa-giá trị (key-value pairs như "Họ tên", "Số tiền") mà không cần huấn luyện mô hình OCR thủ công.',
    question: 'Dịch vụ AI nào của AWS chuyên dụng cho tác vụ này?',
    options: [
      { key: 'A', text: 'Amazon Rekognition', explanation: 'Chuyên nhận diện vật thể, khuôn mặt, cảnh quan trong ảnh/video, không chuyên sâu bóc tách cấu trúc bảng biểu tài liệu.' },
      { key: 'B', text: 'Amazon Textract', explanation: 'Chính xác! OCR thông minh bóc tách văn bản, form dữ liệu key-value và cấu trúc bảng bảng biểu nguyên vẹn.' },
      { key: 'C', text: 'Amazon Transcribe', explanation: 'Dịch vụ chuyển đổi giọng nói thành văn bản (Speech-to-Text), không liên quan đến xử lý tài liệu quét.' },
      { key: 'D', text: 'AWS Glue DataBrew', explanation: 'Công cụ làm sạch dữ liệu có cấu trúc, không đọc được ảnh quét hóa đơn hay giấy tờ scan.' }
    ],
    correctKey: 'B',
    answer: 'Amazon Textract',
    explanation: 'Amazon Textract vượt xa OCR thông thường bằng việc nhận diện bố cục tài liệu. Với các tính năng Analyze Document API, Textract trích xuất chính xác các cặp khóa-giá trị (Forms API) và giữ nguyên định dạng bảng biểu (Tables API) từ hóa đơn, hợp đồng và giấy tờ tùy thân.',
    decisionRule: 'Đọc hóa đơn/biểu mẫu scan + Trích xuất bảng biểu và cặp khóa-giá trị (Key-Value) ➔ Amazon Textract.'
  },
  {
    id: 'q90',
    examCode: 'SAA-C03',
    domain: 'Chuyển đổi âm thanh & Tổng hợp giọng nói (Speech Services)',
    serviceId: 'polly',
    scenario: 'Ứng dụng đọc báo điện tử muốn tự động chuyển đổi các bài viết chữ thành file âm thanh podcast chất lượng cao như phát thanh viên thực tế bằng tiếng Việt và nhiều ngôn ngữ khác để người dùng nghe trên xe hơi.',
    question: 'Dịch vụ nào cung cấp khả năng tổng hợp giọng đọc này?',
    options: [
      { key: 'A', text: 'Amazon Transcribe', explanation: 'Chuyển đổi từ âm thanh sang chữ viết (Speech to Text), ngược với yêu cầu của bài toán.' },
      { key: 'B', text: 'Amazon Polly', explanation: 'Chính xác! Dịch vụ chuyển văn bản thành giọng nói (Text to Speech) chất lượng Neural giống người thật.' },
      { key: 'C', text: 'Amazon Lex', explanation: 'Xây dựng giao diện trò chuyện chatbot thoại/chữ, không phải công cụ chuyên tổng hợp audio phát thanh từ bài viết dài.' },
      { key: 'D', text: 'Amazon Comprehend', explanation: 'Phân tích cảm xúc và trích xuất chủ đề trong văn bản, không sinh ra file âm thanh giọng nói.' }
    ],
    correctKey: 'B',
    answer: 'Amazon Polly',
    explanation: 'Amazon Polly là dịch vụ chuyển văn bản thành giọng nói sống động (Text-to-Speech - TTS). Polly cung cấp các giọng đọc Neural TTS thế hệ mới, hỗ trợ chuẩn SSML để điều chỉnh nhịp thở, ngữ điệu và phát âm tên riêng một cách tự nhiên.',
    decisionRule: 'Chuyển bài viết văn bản thành file âm thanh giọng đọc sống động ➔ Amazon Polly.'
  },

  // --- Compute, Containers & Enterprise Platforms (q91 - q100) ---
  {
    id: 'q91',
    examCode: 'SAP-C02',
    domain: 'Cấp phát Node Kubernetes tức thì (Kubernetes Node Autoscaling)',
    serviceId: 'eks',
    scenario: 'Cụm Amazon EKS chạy các ứng dụng thương mại điện tử vào ngày flash sale. Cluster Autoscaler truyền thống mất từ 3 đến 5 phút để tạo EC2 instance mới qua Auto Scaling Group, khiến nhiều Pod bị kẹt ở trạng thái `Pending` và gây nghẽn dịch vụ.',
    question: 'Giải pháp cấp phát tài nguyên node thế hệ mới nào được AWS khuyến nghị thay thế?',
    options: [
      { key: 'A', text: 'Cài đặt thêm nhiều Replica cho Cluster Autoscaler', explanation: 'Cluster Autoscaler vẫn bị giới hạn bởi cơ chế co giãn theo Auto Scaling Group và launch template cứng.' },
      { key: 'B', text: 'Karpenter', explanation: 'Chính xác! Cấp phát node trực tiếp với EC2 Fleet API chỉ trong 30-40 giây, tự động chọn loại instance rẻ nhất vừa khít pod.' },
      { key: 'C', text: 'Chuyển toàn bộ Pod sang chạy trên AWS Lambda', explanation: 'Ứng dụng Kubernetes phức tạp không thể chuyển đổi thẳng sang Lambda mà không viết lại mã nguồn hoàn toàn.' },
      { key: 'D', text: 'Sử dụng Spot Fleet gắn với Jenkins runner', explanation: 'Không liên quan đến cơ chế tự động mở rộng node theo nhu cầu pending pod của cụm EKS.' }
    ],
    correctKey: 'B',
    answer: 'Karpenter trên Amazon EKS',
    explanation: 'Karpenter là bộ điều phối cấp phát node mã nguồn mở linh hoạt cao cho Kubernetes. Thay vì dựa vào các nhóm EC2 Auto Scaling cứng nhắc, Karpenter trực tiếp quan sát các Pod không thể lập lịch (unschedulable pods), đánh giá yêu cầu CPU/RAM/GPU và gọi trực tiếp EC2 Fleet API để tạo node phù hợp nhất trong vòng chưa tới 1 phút.',
    decisionRule: 'Mở rộng node EKS cực nhanh (<1 phút) + Tự chọn loại EC2 tối ưu chi phí vừa khít Pod ➔ Karpenter.'
  },
  {
    id: 'q92',
    examCode: 'DVA-C02',
    domain: 'Nền tảng container ứng dụng đơn giản (Managed Container Runner)',
    serviceId: 'app-runner',
    scenario: 'Một nhóm khởi nghiệp phát triển ứng dụng web trên Node.js đóng gói bằng Docker. Họ muốn triển khai lên hạ tầng có HTTPS sẵn, tự động co giãn theo số lượng request và tích hợp pipeline CI/CD tự build lại khi push code lên GitHub, nhưng hoàn toàn không muốn học hoặc vận hành Kubernetes/ECS/VPC.',
    question: 'Dịch vụ nào phù hợp nhất với tiêu chí nhanh gọn và tối giản công việc vận hành?',
    options: [
      { key: 'A', text: 'Amazon EKS', explanation: 'Quá phức tạp đối với nhóm khởi nghiệp nhỏ, đòi hỏi kiến thức sâu về Kube-proxy, CNI, Ingress controller.' },
      { key: 'B', text: 'AWS App Runner', explanation: 'Chính xác! Dịch vụ container hoàn toàn tự động hóa từ source code/container image đến HTTPS và scaling mà không cần quản lý hạ tầng mạng.' },
      { key: 'C', text: 'Amazon EC2 cài đặt Docker Swarm', explanation: 'Phải tự quản trị máy chủ, cài chứng chỉ SSL, cấu hình load balancer và tự lo sao lưu cập nhật OS.' },
      { key: 'D', text: 'AWS Batch', explanation: 'Dành cho các tác vụ tính toán hàng loạt không đồng bộ chạy xong rồi tắt, không dùng để phục vụ ứng dụng web HTTP trực tuyến.' }
    ],
    correctKey: 'B',
    answer: 'AWS App Runner',
    explanation: 'AWS App Runner cung cấp trải nghiệm đơn giản nhất để chạy ứng dụng container hoặc mã nguồn trực tiếp trên AWS. Bạn chỉ cần trỏ vào repository GitHub hoặc ECR image, App Runner sẽ tự động xây dựng, cấu hình TLS certificate, cân bằng tải và co giãn tài nguyên theo tải thực tế.',
    decisionRule: 'Chạy web container có HTTPS + Tự động mở rộng + Tối giản vận hành, không cần quản trị VPC/K8s ➔ AWS App Runner.'
  },
  {
    id: 'q93',
    examCode: 'SAA-C03',
    domain: 'Tính toán hàng loạt quy mô lớn (Batch Computing)',
    serviceId: 'batch',
    scenario: 'Công ty dược phẩm cần phân tích hàng chục nghìn cấu trúc phân tử thuốc mỗi cuối tuần. Mỗi tác vụ mất khoảng 40 phút để chạy trên GPU. Công ty muốn hệ thống tự động khởi tạo hàng trăm máy chủ GPU khi có tác vụ trong hàng đợi và giải phóng hoàn toàn máy chủ khi xử lý xong để tối ưu hóa chi phí.',
    question: 'Dịch vụ nào được thiết kế riêng cho mô hình làm việc này?',
    options: [
      { key: 'A', text: 'AWS Lambda', explanation: 'Lambda có giới hạn thời gian chạy tối đa 15 phút, không đáp ứng được tác vụ 40 phút và cấu hình GPU chuyên sâu.' },
      { key: 'B', text: 'AWS Batch', explanation: 'Chính xác! Tự động quản lý hàng đợi công việc, cấp phát cụm EC2 Spot GPU theo tải và hủy node khi hoàn thành.' },
      { key: 'C', text: 'Amazon ECS chạy Service với desired count cố định', explanation: 'Duy trì số máy chủ cố định sẽ gây lãng phí chi phí máy chủ GPU đắt đỏ trong các ngày trong tuần khi không có việc.' },
      { key: 'D', text: 'Amazon Lightsail', explanation: 'Lightsail là dịch vụ VPS đóng gói sẵn cho ứng dụng nhỏ, không có khả năng mở rộng hàng loạt tính toán GPU phức tạp.' }
    ],
    correctKey: 'B',
    answer: 'AWS Batch',
    explanation: 'AWS Batch cho phép các nhà phát triển và nhà khoa học dễ dàng chạy hàng trăm nghìn tác vụ tính toán hàng loạt trên AWS. AWS Batch tự động quản lý tài nguyên tính toán (Compute Environments) sử dụng EC2 On-Demand hoặc Spot Instances, xử lý ưu tiên hàng đợi (Job Queues) và hủy bỏ máy chủ khi hoàn tất.',
    decisionRule: 'Tác vụ tính toán chạy theo lô > 15 phút + Cần GPU/Spot + Tự động cấp phát và hủy tài nguyên ➔ AWS Batch.'
  },
  {
    id: 'q94',
    examCode: 'SAA-C03',
    domain: 'Hệ thống thông điệp kế thừa (Legacy Message Broker Migration)',
    serviceId: 'mq',
    scenario: 'Doanh nghiệp di chuyển ứng dụng doanh nghiệp viết bằng Java Spring Boot từ On-Premises lên AWS. Ứng dụng phụ thuộc chặt chẽ vào giao thức hàng đợi JMS và MQTT của Apache ActiveMQ với các tính năng topic hierarchy phức tạp. Doanh nghiệp muốn di chuyển nhanh mà không cần sửa đổi mã nguồn.',
    question: 'Giải pháp hàng đợi nào của AWS tương thích nguyên bản?',
    options: [
      { key: 'A', text: 'Amazon SQS', explanation: 'SQS sử dụng REST API độc quyền của AWS, không hỗ trợ giao thức chuẩn JMS, AMQP hay MQTT.' },
      { key: 'B', text: 'Amazon MQ', explanation: 'Chính xác! Dịch vụ message broker được quản lý hỗ trợ Apache ActiveMQ và RabbitMQ, tương thích chuẩn JMS/AMQP.' },
      { key: 'C', text: 'Amazon Kinesis Data Streams', explanation: 'Dành cho truyền luồng dữ liệu lớn, không phải hàng đợi tin nhắn doanh nghiệp tương thích JMS.' },
      { key: 'D', text: 'Amazon SNS', explanation: 'Dịch vụ thông báo pub/sub đẩy tin nhắn, không hỗ trợ giao thức ActiveMQ cổ điển.' }
    ],
    correctKey: 'B',
    answer: 'Amazon MQ (ActiveMQ / RabbitMQ)',
    explanation: 'Amazon MQ là dịch vụ message broker được quản lý cho Apache ActiveMQ và RabbitMQ. Nó hỗ trợ các giao thức nhắn tin tiêu chuẩn công nghiệp như JMS, NMS, AMQP 1.0, STOMP, MQTT và WebSocket, giúp doanh nghiệp di chuyển ứng dụng lên đám mây mà không phải viết lại logic nhắn tin.',
    decisionRule: 'Di chuyển ứng dụng dùng ActiveMQ / RabbitMQ lên AWS + Giữ nguyên giao thức JMS / AMQP / MQTT ➔ Amazon MQ.'
  },
  {
    id: 'q95',
    examCode: 'DVA-C02',
    domain: 'API GraphQL thời gian thực (Serverless GraphQL)',
    serviceId: 'appsync',
    scenario: 'Ứng dụng di động quản lý kho cần đồng bộ dữ liệu hai chiều thời gian thực (real-time subscriptions) giữa hàng nghìn nhân viên kiểm kê, đồng thời phải hỗ trợ tính năng làm việc ngoại tuyến (offline access) tự động đồng bộ và giải quyết xung đột (conflict resolution) khi có mạng trở lại.',
    question: 'Dịch vụ nào của AWS cung cấp nền tảng này?',
    options: [
      { key: 'A', text: 'Amazon API Gateway REST API', explanation: 'REST API hoạt động theo mô hình request/response một chiều, không hỗ trợ sẵn đồng bộ offline và xung đột dữ liệu.' },
      { key: 'B', text: 'AWS AppSync', explanation: 'Chính xác! Managed GraphQL API hỗ trợ WebSockets subscriptions thời gian thực và tích hợp bộ SDK Amplify xử lý offline sync.' },
      { key: 'C', text: 'Application Load Balancer', explanation: 'Chỉ là bộ cân bằng tải mạng Lớp 7, không cung cấp cơ chế phân giải GraphQL schema và giải quyết xung đột ngoại tuyến.' },
      { key: 'D', text: 'Amazon Simple Notification Service (SNS)', explanation: 'SNS chỉ đẩy thông báo một chiều, không cung cấp tầng API truy vấn dữ liệu cho ứng dụng di động.' }
    ],
    correctKey: 'B',
    answer: 'AWS AppSync',
    explanation: 'AWS AppSync là dịch vụ GraphQL serverless được quản lý đầy đủ. Kết hợp với AWS Amplify SDK, AppSync cung cấp khả năng lưu trữ cục bộ trên thiết bị di động, tự động đồng bộ khi có kết nối mạng và hỗ trợ các thuật toán giải quyết xung đột dữ liệu (như Optimistic Concurrency, Auto-merge).',
    decisionRule: 'GraphQL API + Real-time subscriptions + Đồng bộ dữ liệu ngoại tuyến (Offline sync) ➔ AWS AppSync.'
  },

  // --- FinOps, Monitoring & Architecture Well-Architected (q96 - q105) ---
  {
    id: 'q96',
    examCode: 'SAA-C03',
    domain: 'Tối ưu hóa cam kết chi phí (Commitment-based Discounts)',
    serviceId: 'cost-explorer',
    scenario: 'Doanh nghiệp có lượng tải máy chủ ổn định trong năm tới bao gồm máy chủ EC2 nhiều dòng khác nhau (c5, m5), các container chạy trên AWS Fargate và các hàm tính toán trên AWS Lambda. Doanh nghiệp muốn cam kết chi tiêu để nhận mức giảm giá tối đa nhưng vẫn giữ được sự linh hoạt thay đổi giữa EC2, Fargate và Lambda.',
    question: 'Gói cam kết chi phí nào là lựa chọn tối ưu nhất?',
    options: [
      { key: 'A', text: 'EC2 Standard Reserved Instances kỳ hạn 3 năm', explanation: 'Bị cố định cứng vào một loại instance cụ thể và một vùng (Region), không áp dụng được cho Fargate hay Lambda.' },
      { key: 'B', text: 'Compute Savings Plans', explanation: 'Chính xác! Giảm tới 66% chi phí, tự động áp dụng linh hoạt trên EC2 (bất kỳ dòng/vùng nào), Fargate và Lambda.' },
      { key: 'C', text: 'EC2 Instance Savings Plans', explanation: 'Chỉ áp dụng trong một dòng instance cụ thể tại một vùng (ví dụ dòng c5 tại us-east-1), không áp dụng cho Fargate hay Lambda.' },
      { key: 'D', text: 'Sử dụng Spot Instances cho toàn bộ hệ thống', explanation: 'Spot instances có thể bị thu hồi bất kỳ lúc nào, không phù hợp cho hạ tầng cốt lõi ổn định của doanh nghiệp.' }
    ],
    correctKey: 'B',
    answer: 'Compute Savings Plans',
    explanation: 'Compute Savings Plans là mô hình định giá linh hoạt nhất của AWS. Bạn cam kết mức chi tiêu tính theo USD/giờ (ví dụ $10/giờ trong 1 hoặc 3 năm). AWS sẽ tự động áp dụng mức giá chiết khấu ưu đãi cho mọi tài nguyên tính toán bất kể bạn chuyển đổi từ EC2 sang Fargate hay Lambda.',
    decisionRule: 'Cam kết chi phí linh hoạt áp dụng xuyên suốt EC2, Fargate và Lambda ➔ Compute Savings Plans.'
  },
  {
    id: 'q97',
    examCode: 'SAP-C02',
    domain: 'Khuyến nghị quyền hạn tối thiểu (IAM Least Privilege & Access Analyzer)',
    serviceId: 'iam',
    scenario: 'Đội bảo mật cần rà soát quyền hạn của tất cả các IAM Role trên hệ thống để đảm bảo tuân thủ nguyên tắc quyền tối thiểu (Least Privilege). Họ muốn tự động tạo ra một chính sách IAM Policy mới chỉ chứa đúng các action API mà ứng dụng thực sự đã gọi trong suốt 60 ngày qua.',
    question: 'Tính năng nào của AWS IAM hỗ trợ tự động sinh policy này?',
    options: [
      { key: 'A', text: 'IAM Policy Simulator', explanation: 'Policy Simulator dùng để kiểm tra xem một policy hiện có có cho phép hay từ chối một action cụ thể hay không, không tự sinh policy.' },
      { key: 'B', text: 'IAM Access Analyzer Policy Generation dựa trên CloudTrail activity', explanation: 'Chính xác! Phân tích log CloudTrail của vai trò cụ thể và tự động tạo ra một fine-grained policy vừa khít.' },
      { key: 'C', text: 'AWS Trusted Advisor Security Checks', explanation: 'Chỉ cảnh báo chung về các port mở hoặc MFA chưa bật, không sinh ra code IAM Policy chi tiết.' },
      { key: 'D', text: 'Chạy lệnh `aws iam get-account-authorization-details`', explanation: 'Chỉ liệt kê danh sách policy hiện hành, không phân tích lịch sử sử dụng thực tế của ứng dụng.' }
    ],
    correctKey: 'B',
    answer: 'IAM Access Analyzer Policy Generation dựa trên hoạt động CloudTrail',
    explanation: 'Tính năng tạo chính sách của IAM Access Analyzer xem xét nhật ký hoạt động trong AWS CloudTrail của một vai trò hoặc người dùng trong khoảng thời gian xác định (tối đa 90 ngày) và tự động tạo ra một tài liệu chính sách IAM chỉ cấp các quyền đã được sử dụng thực tế.',
    decisionRule: 'Tự động tạo IAM Policy quyền tối thiểu (Least Privilege) dựa trên lịch sử gọi API thực tế ➔ IAM Access Analyzer Policy Generation.'
  },
  {
    id: 'q98',
    examCode: 'SAP-C02',
    domain: 'Phân tích phân bổ chi phí nội bộ (FinOps & Chargeback)',
    serviceId: 'billing-conductor',
    scenario: 'Một đối tác Managed Service Provider (MSP) hoặc công ty mẹ muốn xuất hóa đơn nội bộ cho 20 phòng ban con. Công ty mẹ nhận mức chiết khấu Enterprise Discount Program (EDP) từ AWS nhưng muốn hiển thị hóa đơn tính theo giá bán lẻ (Public On-Demand) cho các phòng ban, đồng thời cộng thêm 5% phí quản lý.',
    question: 'Dịch vụ nào của AWS cung cấp khả năng tùy biến biểu giá hóa đơn nội bộ này?',
    options: [
      { key: 'A', text: 'AWS Cost Explorer', explanation: 'Cost Explorer chỉ hiển thị dữ liệu chi phí thực tế mà tài khoản phải trả cho AWS, không hỗ trợ tạo bảng giá tùy chỉnh.' },
      { key: 'B', text: 'AWS Billing Conductor', explanation: 'Chính xác! Cho phép tạo nhóm thanh toán tùy chỉnh, định nghĩa bảng giá riêng (Custom Pricing Rules) và xuất pro forma bills.' },
      { key: 'C', text: 'AWS Budgets', explanation: 'Chỉ dùng để gửi cảnh báo khi chi phí vượt ngưỡng dự kiến, không thay đổi được cơ chế tính cước hóa đơn.' },
      { key: 'D', text: 'AWS Cost and Usage Report (CUR)', explanation: 'CUR chỉ là tệp dữ liệu thô xuất ra S3, cần phải tự lập trình xử lý tính toán lại biểu giá rất phức tạp.' }
    ],
    correctKey: 'B',
    answer: 'AWS Billing Conductor',
    explanation: 'AWS Billing Conductor là dịch vụ thanh toán tùy chỉnh cho phép bạn cấu hình, tạo và hiển thị tỷ lệ biểu giá chuyên biệt. Bạn có thể gom nhóm các tài khoản AWS thành các đơn vị tài chính riêng, áp dụng quy tắc tăng/giảm giá (Markup/Discount) và xuất hóa đơn Pro Forma cho khách hàng hoặc phòng ban nội bộ.',
    decisionRule: 'Tùy biến bảng giá hóa đơn nội bộ (Markup/Discount) cho phòng ban con / Pro Forma billing ➔ AWS Billing Conductor.'
  },
  {
    id: 'q99',
    examCode: 'SAA-C03',
    domain: 'Khuyến nghị kích thước tài nguyên tối ưu (Right-Sizing Compute)',
    serviceId: 'compute-optimizer',
    scenario: 'Doanh nghiệp có hơn 300 máy chủ EC2 và hàng trăm hàm Lambda. Giám đốc CNTT muốn biết máy chủ nào đang bị dư thừa tài nguyên (over-provisioned gây lãng phí tiền) và máy chủ nào đang bị thiếu hụt tài nguyên (under-provisioned gây nghẽn hiệu năng) dựa trên dữ liệu máy học.',
    question: 'Dịch vụ nào cung cấp các đề xuất điều chỉnh kích thước tự động này?',
    options: [
      { key: 'A', text: 'AWS Compute Optimizer', explanation: 'Chính xác! Ứng dụng Machine Learning phân tích CloudWatch metrics để đề xuất loại instance và dung lượng RAM/CPU tối ưu.' },
      { key: 'B', text: 'Amazon CloudWatch Alarms', explanation: 'Chỉ kích hoạt cảnh báo ngưỡng đơn giản (như CPU > 80%), không tự động phân tích và đưa ra đề xuất loại instance thay thế.' },
      { key: 'C', text: 'AWS Service Catalog', explanation: 'Quản lý danh mục các mẫu hạ tầng được phê duyệt để người dùng triển khai, không liên quan đến tối ưu tài nguyên.' },
      { key: 'D', text: 'AWS Systems Manager Patch Manager', explanation: 'Chuyên quản lý cài đặt bản vá hệ điều hành, không phân tích chỉ số sử dụng phần cứng.' }
    ],
    correctKey: 'A',
    answer: 'AWS Compute Optimizer',
    explanation: 'AWS Compute Optimizer sử dụng học máy để phân tích lịch sử sử dụng tài nguyên (CPU, Memory, Network, Storage) từ CloudWatch. Dịch vụ đưa ra các đề xuất cụ thể giúp bạn giảm tới 25% chi phí bằng cách giảm kích cỡ (downsize) hoặc cải thiện hiệu năng bằng cách nâng cấp loại instance phù hợp.',
    decisionRule: 'Đề xuất đổi loại instance EC2/Lambda để tránh lãng phí chi phí hoặc nghẽn tải dựa trên ML ➔ AWS Compute Optimizer.'
  },
  {
    id: 'q100',
    examCode: 'SAP-C02',
    domain: 'Đánh giá kiến trúc chuẩn theo 6 trụ cột (Well-Architected Review)',
    serviceId: 'well-architected',
    scenario: 'Trước khi chính thức go-live một hệ thống ngân hàng số quan trọng trên AWS, Giám đốc Công nghệ yêu cầu đánh giá toàn diện hạ tầng so với các tiêu chuẩn tốt nhất (Best Practices) của AWS theo 6 trụ cột: Bảo mật, Độ tin cậy, Hiệu năng, Tối ưu chi phí, Vận hành xuất sắc và Tính bền vững.',
    question: 'Công cụ chính thức nào của AWS hỗ trợ thực hiện quy trình đánh giá này?',
    options: [
      { key: 'A', text: 'AWS Well-Architected Tool', explanation: 'Chính xác! Công cụ chính thức cung cấp bộ câu hỏi đánh giá theo 6 trụ cột và đưa ra kế hoạch cải thiện (Improvement Plan).' },
      { key: 'B', text: 'AWS X-Ray', explanation: 'Công cụ distributed tracing theo dõi luồng request qua các microservices, không phải công cụ đánh giá chuẩn kiến trúc.' },
      { key: 'C', text: 'AWS CloudFormation Linter', explanation: 'Chỉ kiểm tra cú pháp và cấu trúc của template IaC CloudFormation.' },
      { key: 'D', text: 'Amazon Inspector', explanation: 'Chuyên quét lỗ hổng bảo mật hệ điều hành và container image, không đánh giá toàn diện 6 trụ cột kiến trúc.' }
    ],
    correctKey: 'A',
    answer: 'AWS Well-Architected Tool',
    explanation: 'AWS Well-Architected Tool hỗ trợ rà soát trạng thái của khối lượng công việc (workloads) dựa trên AWS Well-Architected Framework. Công cụ cung cấp hướng dẫn từng bước để đo lường kiến trúc, tạo tài liệu tóm tắt rủi ro (Milestones) và kế hoạch hành động khắc phục cụ thể.',
    decisionRule: 'Đánh giá khối lượng công việc theo 6 trụ cột Best Practices của AWS trước khi Go-Live ➔ AWS Well-Architected Tool.'
  },

  // --- IoT, Edge & Media Delivery (q101 - q110) ---
  {
    id: 'q101',
    examCode: 'SAA-C03',
    domain: 'Giao tiếp thiết bị IoT an toàn quy mô hàng triệu (IoT Connectivity)',
    serviceId: 'iot-core',
    scenario: 'Một hãng xe điện cần thu thập dữ liệu hành trình và trạng thái pin từ 500.000 xe thông minh trên đường. Mỗi xe giao tiếp qua mạng di động chập chờn với giao thức MQTT băng thông thấp, xác thực qua chứng chỉ X.509 hai chiều (Mutual TLS) và gửi dữ liệu vào hạ tầng AWS.',
    question: 'Dịch vụ cổng tiếp nhận trung tâm nào của AWS xử lý trực tiếp tải này?',
    options: [
      { key: 'A', text: 'Amazon API Gateway REST API', explanation: 'Giao thức HTTP có dung lượng header lớn, tốn băng thông 4G của xe và không tối ưu cho kết nối duy trì liên tục qua MQTT.' },
      { key: 'B', text: 'AWS IoT Core', explanation: 'Chính xác! Hỗ trợ hàng tỷ kết nối MQTT băng thông thấp, xác thực mTLS qua chứng chỉ X.509 và Rules Engine chuyển tiếp dữ liệu.' },
      { key: 'C', text: 'Amazon Elastic Load Balancing (NLB)', explanation: 'NLB chỉ cân bằng tải TCP/UDP thuần túy, không có trình thông dịch broker MQTT và không quản lý vòng đời thiết bị IoT.' },
      { key: 'D', text: 'AWS Direct Connect', explanation: 'Không thể nối dây vật lý Direct Connect vào xe ô tô đang di chuyển trên đường.' }
    ],
    correctKey: 'B',
    answer: 'AWS IoT Core',
    explanation: 'AWS IoT Core là nền tảng đám mây được quản lý cho phép các thiết bị kết nối dễ dàng và an toàn với các dịch vụ đám mây. Nó hỗ trợ giao thức MQTT nhẹ và bảo mật cao qua xác thực chứng chỉ số X.509, có khả năng mở rộng hàng triệu thiết bị đồng thời mà không cần quản lý cụm máy chủ.',
    decisionRule: 'Kết nối hàng triệu thiết bị qua giao thức MQTT + Xác thực chứng chỉ X.509 + Mạng băng thông thấp ➔ AWS IoT Core.'
  },
  {
    id: 'q102',
    examCode: 'SAA-C03',
    domain: 'Điện toán biên & Trí tuệ nhân tạo cục bộ (Edge Computing)',
    serviceId: 'greengrass',
    scenario: 'Một nhà máy thông minh tại khu vực xa xôi thường xuyên bị đứt kết nối Internet. Dây chuyền sản xuất cần phân tích camera bằng mô hình Machine Learning ngay tại xưởng với độ trễ dưới 20ms để tự động dừng băng chuyền khi phát hiện sản phẩm lỗi, đồng thời tự lưu đệm dữ liệu để đẩy lên AWS khi có mạng.',
    question: 'Phần mềm biên nào của AWS đáp ứng yêu cầu vận hành ngoại tuyến này?',
    options: [
      { key: 'A', text: 'AWS Lambda chạy trên CloudFront Edge Locations', explanation: 'Vẫn đòi hỏi thiết bị phải gửi dữ liệu qua Internet tới Edge Location của AWS, không hoạt động được khi đứt mạng tại xưởng.' },
      { key: 'B', text: 'AWS IoT Greengrass', explanation: 'Chính xác! Chạy cục bộ trên phần cứng tại nhà máy, thực thi Lambda/Docker container tại chỗ và đồng bộ dữ liệu khi online.' },
      { key: 'C', text: 'AWS DataSync', explanation: 'Chỉ dùng để đồng bộ file lưu trữ qua mạng, không có khả năng chạy code ứng dụng logic và inference mô hình AI cục bộ.' },
      { key: 'D', text: 'AWS Snowball Edge Compute Optimized', explanation: 'Thiết bị lưu trữ di chuyển dữ liệu theo lô, không phải phần mềm runtime triển khai liên tục trên phần cứng máy tính công nghiệp.' }
    ],
    correctKey: 'B',
    answer: 'AWS IoT Greengrass',
    explanation: 'AWS IoT Greengrass mở rộng chức năng AWS xuống các thiết bị biên. Thiết bị tại nhà máy có thể thu thập dữ liệu, chạy các thuật toán suy luận Machine Learning cục bộ, giao tiếp bảo mật với các thiết bị khác trong mạng nội bộ ngay cả khi mất kết nối Internet hoàn toàn.',
    decisionRule: 'Chạy logic/ML tại chỗ tại nhà máy biên khi mất mạng Internet (Offline operation) ➔ AWS IoT Greengrass.'
  },
  {
    id: 'q103',
    examCode: 'SAA-C03',
    domain: 'Chuyển mã video theo yêu cầu chất lượng truyền hình (VOD Transcoding)',
    serviceId: 'mediaconvert',
    scenario: 'Nền tảng xem phim trực tuyến nhận các tập phim chất lượng 4K ProRes từ các nhà sản xuất. Nền tảng cần tự động chuyển đổi các video này thành nhiều độ phân giải khác nhau (1080p, 720p, 480p) đóng gói dưới chuẩn phát trực tuyến Apple HLS và DASH kèm phụ đề đa ngôn ngữ và gắn bản quyền DRM.',
    question: 'Dịch vụ xử lý video không máy chủ nào của AWS thực hiện tác vụ này?',
    options: [
      { key: 'A', text: 'Cài đặt FFmpeg trên cụm máy chủ Amazon EC2', explanation: 'Phải tự quản lý cụm máy chủ, lập trình bộ điều phối hàng đợi và không có các tính năng đóng gói DRM chuẩn phát sóng.' },
      { key: 'B', text: 'AWS Elemental MediaConvert', explanation: 'Chính xác! Dịch vụ chuyển mã video tệp (file-based) chất lượng truyền hình, hỗ trợ HLS, DASH, phụ đề và DRM.' },
      { key: 'C', text: 'AWS Elemental MediaLive', explanation: 'MediaLive chuyên dùng cho phát sóng video trực tiếp thời gian thực (Live broadcast), không dùng cho file video đóng băng sẵn (VOD).' },
      { key: 'D', text: 'Amazon Kinesis Video Streams', explanation: 'Dành cho thu nạp luồng camera an ninh thời gian thực, không tối ưu cho quy trình xuất bản phim thương mại VOD.' }
    ],
    correctKey: 'B',
    answer: 'AWS Elemental MediaConvert',
    explanation: 'AWS Elemental MediaConvert là dịch vụ chuyển mã video dựa trên tệp với các tính năng cấp phát thanh truyền hình. Nó chuyển đổi nội dung video thành các định dạng phân phối trên internet (HLS/DASH) với tính năng Adaptive Bitrate Streaming, hỗ trợ chèn hình mờ, phụ đề và mã hóa DRM tiêu chuẩn.',
    decisionRule: 'Chuyển mã video VOD + Đóng gói HLS/DASH đa độ phân giải + Chất lượng truyền hình ➔ AWS Elemental MediaConvert.'
  },
  {
    id: 'q104',
    examCode: 'SAA-C03',
    domain: 'Phát sóng trực tiếp sự kiện độ sẵn sàng cao (Live Streaming)',
    serviceId: 'medialive',
    scenario: 'Đài truyền hình trực tiếp trận chung kết bóng đá thế giới cho hàng triệu khán giả trực tuyến. Tín hiệu video trực tiếp từ sân vận động được gửi lên đám mây qua hai đường truyền mạng độc lập. Hệ thống phát sóng phải đảm bảo không bị gián đoạn phát sóng ngay cả khi một luồng đầu vào hoặc một trung tâm dữ liệu gặp sự cố.',
    question: 'Kiến trúc dịch vụ nào đảm bảo luồng phát trực tiếp liên tục dự phòng kép?',
    options: [
      { key: 'A', text: 'Amazon EC2 cài đặt OBS Studio stream ra S3', explanation: 'Một điểm lỗi duy nhất (Single Point of Failure), không có khả năng failover liền mạch và khó chịu tải lớn.' },
      { key: 'B', text: 'AWS Elemental MediaLive ở chế độ Standard Channel (Redundant Inputs/Outputs)', explanation: 'Chính xác! MediaLive Standard Channel xử lý 2 luồng mã hóa song song độc lập trên 2 AZ đảm bảo failover tức thì.' },
      { key: 'C', text: 'Amazon Kinesis Data Streams', explanation: 'Kinesis Data Streams dùng để xử lý sự kiện dữ liệu JSON/binary, không hỗ trợ codec video phát sóng như RTMP, RTP hay Zixi.' },
      { key: 'D', text: 'AWS Elemental MediaConvert', explanation: 'MediaConvert chỉ xử lý tệp video lưu sẵn (file-based), không tiếp nhận được luồng phát trực tiếp thời gian thực (live stream).' }
    ],
    correctKey: 'B',
    answer: 'AWS Elemental MediaLive (Standard Channel)',
    explanation: 'AWS Elemental MediaLive là dịch vụ mã hóa video trực tiếp cấp phát thanh truyền hình. Khi cấu hình ở chế độ Standard Channel, dịch vụ chạy hai luồng xử lý độc lập phân tán qua hai Availability Zones khác nhau với hai luồng tín hiệu đầu vào riêng biệt, đảm bảo khả năng phát sóng không ngắt quãng 99.999%.',
    decisionRule: 'Phát sóng video trực tiếp thời gian thực (Live Stream) + Dự phòng kép hai luồng ➔ AWS Elemental MediaLive Standard Channel.'
  },
  {
    id: 'q105',
    examCode: 'SAA-C03',
    domain: 'Cụm máy chủ chuyên dụng trò chơi trực tuyến (Multiplayer Game Servers)',
    serviceId: 'gamelift',
    scenario: 'Một studio game phát hành trò chơi bắn súng góc nhìn thứ nhất (FPS) 3D đòi hỏi máy chủ trò chơi chuyên dụng (dedicated game server) chạy logic vật lý với độ trễ mạng dưới 40 mili-giây. Hệ thống cần tự động ghép trận (matchmaking) và mở rộng cụm máy chủ game toàn cầu theo số lượng người chơi trực tuyến.',
    question: 'Dịch vụ nào được AWS tối ưu riêng cho bài toán này?',
    options: [
      { key: 'A', text: 'Amazon GameLift', explanation: 'Chính xác! Quản lý cụm dedicated game server, tích hợp sẵn FlexMatch và tự động triển khai máy chủ gần người chơi nhất.' },
      { key: 'B', text: 'Amazon ECS Fargate', explanation: 'Fargate không tích hợp sẵn hệ thống ghép trận (matchmaking) và không có cơ chế quản lý vòng đời session game chuyên sâu.' },
      { key: 'C', text: 'AWS Elastic Beanstalk', explanation: 'Beanstalk dành cho ứng dụng web HTTP thông thường không phù hợp với giao thức UDP stateful của game thời gian thực.' },
      { key: 'D', text: 'Amazon CloudFront', explanation: 'CloudFront là mạng phân phối nội dung web tĩnh/động HTTP, không thể chạy engine tính toán vật lý game FPS.' }
    ],
    correctKey: 'A',
    answer: 'Amazon GameLift',
    explanation: 'Amazon GameLift là dịch vụ chuyên dụng để lưu trữ, mở rộng và quản lý máy chủ trò chơi nhiều người chơi. GameLift kết hợp tính năng FlexMatch để ghép trận người chơi có cùng trình độ và khu vực địa lý, tự động mở rộng và thu hẹp các máy chủ EC2 Spot để tiết kiệm tới 70% chi phí.',
    decisionRule: 'Lưu trữ dedicated game server nhiều người chơi + Matchmaking + Tối ưu độ trễ và chi phí Spot ➔ Amazon GameLift.'
  },
  {
    id: 'q106',
    examCode: 'SAP-C02',
    domain: 'Phân tích đồ thị mạng xã hội & Gian lận (Graph Database)',
    serviceId: 'neptune',
    scenario: 'Một trang mạng xã hội và sàn thương mại điện tử cần xây dựng công cụ phát hiện gian lận hoàn tiền bằng cách phân tích mạng lưới quan hệ phức tạp giữa hàng triệu tài khoản người dùng, địa chỉ IP, thiết bị đăng nhập và số thẻ ngân hàng với hàng chục mối liên kết chéo.',
    question: 'Cơ sở dữ liệu nào của AWS tối ưu cho các truy vấn duyệt đồ thị (Graph Traversal) này?',
    options: [
      { key: 'A', text: 'Amazon RDS for MySQL', explanation: 'CSDL quan hệ bị nghẽn hiệu năng nghiêm trọng khi phải thực hiện các phép JOIN đệ quy qua hàng chục bảng liên kết.' },
      { key: 'B', text: 'Amazon Neptune', explanation: 'Chính xác! CSDL Graph phân tán hỗ trợ chuẩn Apache TinkerPop Gremlin và SPARQL, truy vấn mối quan hệ độ trễ mili-giây.' },
      { key: 'C', text: 'Amazon DynamoDB', explanation: 'DynamoDB là CSDL Key-Value/Document, không tối ưu cho các câu lệnh truy vấn duyệt đồ thị nhiều nút liên kết phức tạp.' },
      { key: 'D', text: 'Amazon DocumentDB', explanation: 'CSDL lưu trữ tài liệu JSON (MongoDB), không hỗ trợ ngôn ngữ truy vấn đồ thị chuyên sâu.' }
    ],
    correctKey: 'B',
    answer: 'Amazon Neptune',
    explanation: 'Amazon Neptune là cơ sở dữ liệu đồ thị nhanh, đáng tin cậy và được quản lý hoàn toàn. Neptune được tối ưu hóa riêng biệt cho việc lưu trữ hàng tỷ mối quan hệ và truy vấn đồ thị với độ trễ mili-giây, hỗ trợ các mô hình đồ thị phổ biến như Property Graph (Gremlin, openCypher) và W3C RDF (SPARQL).',
    decisionRule: 'Mối quan hệ phức tạp nhiều tầng / Mạng xã hội / Phát hiện gian lận qua liên kết chéo ➔ Amazon Neptune.'
  },
  {
    id: 'q107',
    examCode: 'SAA-C03',
    domain: 'Cơ sở dữ liệu sổ cái bất biến (Immutable Ledger Database)',
    serviceId: 'qldb',
    scenario: 'Một cơ quan đăng ký quyền sở hữu đất đai và bảo hiểm cần một hệ thống cơ sở dữ liệu lưu trữ lịch sử giao dịch bất biến (cryptographically verifiable transaction log). Mọi thay đổi dữ liệu phải được ký số mã hóa và không một ai (kể cả quản trị viên hệ thống) có thể sửa hoặc xóa lịch sử.',
    question: 'Dịch vụ CSDL nào của AWS cung cấp tính năng này?',
    options: [
      { key: 'A', text: 'Amazon RDS PostgreSQL với bảng Audit log', explanation: 'Quản trị viên có quyền `SUPERUSER` vẫn có thể cập nhật hoặc xóa dữ liệu trực tiếp trong bảng audit.' },
      { key: 'B', text: 'Amazon QLDB (Quantum Ledger Database)', explanation: 'Chính xác! Sổ cái giao dịch bất biến chỉ ghi nối tiếp (append-only) với bằng chứng mã hóa mật mã học Merkle tree.' },
      { key: 'C', text: 'Amazon DynamoDB với Point-in-time Recovery', explanation: 'PITR dùng để khôi phục thảm họa, không cung cấp cơ chế bằng chứng xác thực tính toàn vẹn mật mã học cho từng dòng.' },
      { key: 'D', text: 'Amazon S3 với Versioning', explanation: 'Versioning chỉ lưu các phiên bản object, không phải hệ cơ sở dữ liệu truy vấn SQL giao dịch chuẩn ACID.' }
    ],
    correctKey: 'B',
    answer: 'Amazon QLDB (Quantum Ledger Database)',
    explanation: 'Amazon QLDB là cơ sở dữ liệu sổ cái được quản lý đầy đủ cung cấp nhật ký giao dịch minh bạch, bất biến và có thể xác minh bằng mật mã học (sử dụng hàm băm SHA-256 tương tự Merkle tree). Bất kỳ thay đổi nào cũng chỉ được ghi nối tiếp (append-only) và lịch sử không thể bị ghi đè hay xóa bỏ.',
    decisionRule: 'Sổ cái giao dịch bất biến không thể sửa xóa + Xác thực bằng mật mã học Merkle tree ➔ Amazon QLDB.'
  },
  {
    id: 'q108',
    examCode: 'SAA-C03',
    domain: 'Cơ sở dữ liệu chuỗi thời gian cho IoT (Time-Series Database)',
    serviceId: 'timestream',
    scenario: 'Hệ thống năng lượng mặt trời thông minh thu thập dữ liệu công suất, điện áp và nhiệt độ từ 100.000 tấm pin mặt trời với tần suất 5 giây một lần. Hệ thống cần lưu trữ hàng tỷ điểm dữ liệu, hỗ trợ các hàm phân tích nội suy thời gian và tự động chuyển dữ liệu cũ sang tầng lưu trữ giá rẻ.',
    question: 'Dịch vụ CSDL chuyên dụng nào đáp ứng tối ưu?',
    options: [
      { key: 'A', text: 'Amazon Timestream', explanation: 'Chính xác! Serverless time-series database chuyên dụng nạp hàng nghìn tỷ sự kiện/ngày với các hàm SQL chuỗi thời gian.' },
      { key: 'B', text: 'Amazon Redshift', explanation: 'Redshift là Data Warehouse cho BI/phân tích báo cáo theo đợt, không tối ưu cho việc ghi dữ liệu luồng IoT liên tục từng 5 giây.' },
      { key: 'C', text: 'Amazon Aurora MySQL', explanation: 'Cơ sở dữ liệu quan hệ sẽ nhanh chóng bị cạn kiệt chỉ mục IOPS và phình to dung lượng đĩa khi ghi hàng nghìn điểm dữ liệu/giây.' },
      { key: 'D', text: 'Amazon ElastiCache Redis', explanation: 'Redis lưu trên RAM với chi phí cực kỳ đắt đỏ, không kinh tế cho việc lưu trữ hàng tỷ bản ghi IoT lịch sử dài hạn.' }
    ],
    correctKey: 'A',
    answer: 'Amazon Timestream',
    explanation: 'Amazon Timestream là cơ sở dữ liệu chuỗi thời gian không máy chủ nhanh, có khả năng mở rộng hàng nghìn tỷ sự kiện mỗi ngày. Nó có công cụ phân tích thời gian tích hợp sẵn (interpolation, smoothing, approximation) và tự động quản lý vòng đời dữ liệu giữa tầng Memory (tốc độ cao) và Magnetic (chi phí thấp).',
    decisionRule: 'Dữ liệu chuỗi thời gian IoT/DevOps + Hàng nghìn tỷ sự kiện + Phân tích chuỗi thời gian theo giờ/ngày ➔ Amazon Timestream.'
  },
  {
    id: 'q109',
    examCode: 'SAP-C02',
    domain: 'Bảo mật khóa đa vùng & Khôi phục thảm họa (Multi-Region KMS)',
    serviceId: 'kms',
    scenario: 'Một ứng dụng thanh toán hoạt động song song ở cả hai vùng us-east-1 và eu-west-1 (Active-Active). Dữ liệu được mã hóa ở us-east-1 cần được giải mã ngay lập tức tại eu-west-1 mà không cần phải thực hiện cuộc gọi mạng xuyên vùng qua us-east-1 (để tránh tăng độ trễ và tránh phụ thuộc nếu us-east-1 gặp sự cố).',
    question: 'Giải pháp quản lý khóa KMS nào đáp ứng tiêu chí này?',
    options: [
      { key: 'A', text: 'Xuất (export) khóa KMS bí mật ra file rồi import thủ công sang Region kia', explanation: 'KMS không bao giờ cho phép xuất key material chưa được mã hóa ra ngoài mô-đun HSM của AWS.' },
      { key: 'B', text: 'Sử dụng AWS KMS Multi-Region Keys', explanation: 'Chính xác! Tạo khóa chính tại một vùng và nhân bản sang vùng khác với cùng Key ID và Key Material.' },
      { key: 'C', text: 'Tạo hai khóa KMS độc lập tại hai vùng và dùng Lambda re-encrypt dữ liệu', explanation: 'Gây ra độ trễ lớn và đòi hỏi dữ liệu phải được giải mã rồi mã hóa lại mỗi khi sao chép xuyên vùng.' },
      { key: 'D', text: 'Sử dụng AWS CloudHSM Classic', explanation: 'Đắt đỏ, phức tạp và không tự động giải quyết bài toán đồng bộ khóa KMS gốc giữa các Region một cách native.' }
    ],
    correctKey: 'B',
    answer: 'AWS KMS Multi-Region Keys',
    explanation: 'AWS KMS Multi-Region Keys là tập hợp các khóa KMS liên quan trong các Vùng AWS khác nhau có cùng ID khóa và tài liệu khóa (key material). Chúng cho phép bạn mã hóa dữ liệu ở một Region và giải mã dữ liệu đó ở một Region khác mà không cần thực hiện lệnh gọi API xuyên vùng.',
    decisionRule: 'Mã hóa ở Region A và giải mã tại Region B không gọi API xuyên Region ➔ AWS KMS Multi-Region Keys.'
  },
  {
    id: 'q110',
    examCode: 'SAA-C03',
    domain: 'Cân bằng tải kiểm tra an ninh mạng nội tuyến (Inline Security Appliances)',
    serviceId: 'gwlb',
    scenario: 'Doanh nghiệp muốn triển khai cụm thiết bị tường lửa ảo của bên thứ ba (như Palo Alto, Fortinet) để kiểm tra toàn bộ gói tin đi vào và đi ra khỏi các VPC. Hệ thống yêu cầu khả năng tự động cân bằng tải và tự động mở rộng cụm tường lửa ảo này theo lưu lượng mạng mà không cần thay đổi địa chỉ IP nguồn.',
    question: 'Loại Load Balancer nào của AWS được thiết kế riêng cho mục đích này?',
    options: [
      { key: 'A', text: 'Application Load Balancer (ALB)', explanation: 'ALB là bộ cân bằng tải lớp ứng dụng HTTP/HTTPS Lớp 7, không hỗ trợ định tuyến gói tin mạng IP thô Lớp 3.' },
      { key: 'B', text: 'Network Load Balancer (NLB)', explanation: 'NLB hoạt động ở Lớp 4 nhưng không hỗ trợ cơ chế chèn inline và đóng gói giao thức GENEVE cho thiết bị bảo mật ảo.' },
      { key: 'C', text: 'Gateway Load Balancer (GWLB)', explanation: 'Chính xác! Hoạt động ở Lớp 3 Gateway + Lớp 4 balancing, sử dụng giao thức GENEVE đóng gói toàn bộ gói tin thô gửi tới firewall.' },
      { key: 'D', text: 'Classic Load Balancer (CLB)', explanation: 'Công nghệ cũ (legacy) đã ngừng phát triển, không hỗ trợ các tính năng mạng cao cấp.' }
    ],
    correctKey: 'C',
    answer: 'AWS Gateway Load Balancer (GWLB)',
    explanation: 'Gateway Load Balancer (GWLB) kết hợp cổng vào mạng trong suốt (transparent network gateway) và bộ cân bằng tải lưu lượng. GWLB sử dụng giao thức GENEVE (cổng UDP 6081) để chuyển tiếp toàn bộ gói tin IP mà không làm thay đổi header, giúp dễ dàng tích hợp và mở rộng các thiết bị ảo bên thứ 3.',
    decisionRule: 'Triển khai cụm tường lửa ảo bên thứ 3 (Palo Alto / Fortinet) + Giao thức GENEVE ➔ Gateway Load Balancer (GWLB).'
  }
];

// Combine all 110 questions
// Read current questions from buildExamBank
const questionRegex = /const questions = (\[[\s\S]*?\]);\s*const outputPath/m;
const match = buildBankContent.match(questionRegex);
if (!match) {
  console.error("Could not find questions array in buildExamBank.mjs");
  process.exit(1);
}

const currentQuestions = eval(match[1]);
console.log(`Current questions count: ${currentQuestions.length}`);

const totalQuestions = [...currentQuestions, ...additionalQuestions];
console.log(`Total questions count after append: ${totalQuestions.length}`);

// Write back to buildExamBank.mjs and src/data/examQuestions.ts
const updatedBuildBankContent = buildBankContent.replace(
  questionRegex,
  `const questions = ${JSON.stringify(totalQuestions, null, 2)};\n\nconst outputPath`
);
fs.writeFileSync(buildBankPath, updatedBuildBankContent, 'utf-8');

const examQuestionsPath = path.resolve('src/data/examQuestions.ts');
const fileContent = `import { Flashcard } from '../types';

export const EXAM_QUESTIONS: Flashcard[] = ${JSON.stringify(totalQuestions, null, 2)};
`;
fs.writeFileSync(examQuestionsPath, fileContent, 'utf-8');

console.log(`Successfully updated exam questions to ${totalQuestions.length} questions at ${examQuestionsPath}`);
