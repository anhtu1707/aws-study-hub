# ==============================================================================
# AWS LAB MANAGER (PowerShell Helper - Full Professional / Specialty Edition)
# Học dịch vụ nào -> Bật đúng dịch vụ đó -> Học xong tắt giải phóng RAM
# ==============================================================================

param (
    [Parameter(Position=0)]
    [ValidateSet('start', 'stop', 'status', 'test', 'seed', 'help')]
    [string]$Action = 'start',

    [Parameter(Position=1)]
    [string]$Target = 'core'
)

$LocalstackEndpoint = "http://localhost:4566"

function Show-Help {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  AWS ENTERPRISE DOCKER LAB (SAP-C02 & SPECIALTY)" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "Cú pháp: .\lab.ps1 [action] [target]"
    Write-Host ""
    Write-Host "Hành động (Action):" -ForegroundColor Green
    Write-Host "  start [target]    Khởi chạy đúng dịch vụ/nhóm bạn cần học"
    Write-Host "  stop [target]     Dừng dịch vụ (hoặc bỏ trống để tắt tất cả)"
    Write-Host "  status            Kiểm tra trạng thái container và cổng web"
    Write-Host "  seed [target]     Nạp sẵn dữ liệu mẫu thực chiến để thực hành"
    Write-Host "  test              Chạy thử nghiệm tạo S3, SQS, DynamoDB trên LocalStack"
    Write-Host ""
    Write-Host "Các Target dịch vụ có sẵn:" -ForegroundColor Green
    Write-Host "  core / serverless LocalStack (S3, SQS, SNS, Lambda, KMS, Secrets Manager...)"
    Write-Host "  dynamodb / nosql  DynamoDB Local + DynamoDB Admin GUI (cổng 8000, 8001)"
    Write-Host "  s3 / storage      MinIO S3 Server + Web Console UI (cổng 9000, 9001)"
    Write-Host "  rds / database    PostgreSQL & MySQL (Aurora mô phỏng) + Redis (cổng 5432, 3306, 6379)"
    Write-Host "  redis / cache     ElastiCache Redis (cổng 6379)"
    Write-Host "  kafka / msk       Amazon MSK Kafka (cổng 9092)"
    Write-Host "  mq / streaming    Amazon MQ RabbitMQ (cổng 5672, 15672)"
    Write-Host "  opensearch        OpenSearch + OpenSearch Dashboards Kibana (cổng 9200, 5601)"
    Write-Host "  ses / email       Amazon SES Mock + Web Mailbox (cổng 1025, 8025)"
    Write-Host "  redshift          ClickHouse OLAP mô phỏng Redshift/Athena (cổng 8123)"
    Write-Host "  all               Khởi chạy TOÀN BỘ (chỉ dùng khi máy có >16GB RAM)"
    Write-Host "==========================================================" -ForegroundColor Cyan
}

switch ($Action) {
    'help' {
        Show-Help
    }

    'start' {
        Write-Host "🚀 Đang khởi chạy lab dịch vụ: $Target ..." -ForegroundColor Cyan
        docker compose --profile $Target up -d
        Write-Host "Đã khởi chạy. Kiểm tra trạng thái bên dưới:" -ForegroundColor Green
        docker compose ps
    }

    'stop' {
        if ($Target -eq 'core' -or $Target -eq 'all' -or [string]::IsNullOrEmpty($Target)) {
            Write-Host "🛑 Đang dừng toàn bộ các container lab để giải phóng RAM..." -ForegroundColor Yellow
            docker compose --profile all down
        } else {
            Write-Host "🛑 Đang dừng nhóm lab: $Target ..." -ForegroundColor Yellow
            docker compose --profile $Target down
        }
        Write-Host "Đã giải phóng tài nguyên an toàn." -ForegroundColor Green
    }

    'status' {
        Write-Host "📊 Các container Lab đang hoạt động:" -ForegroundColor Cyan
        docker compose ps
        Write-Host ""
        Write-Host "Đường dẫn các giao diện Web GUI trực quan:" -ForegroundColor Yellow
        Write-Host " • LocalStack (Core AWS):         http://localhost:4566"
        Write-Host " • DynamoDB Admin (GUI NoSQL):    http://localhost:8001"
        Write-Host " • MinIO S3 Console (GUI):        http://localhost:9001 (awsadmin / awspassword123)"
        Write-Host " • OpenSearch Dashboards (GUI):   http://localhost:5601"
        Write-Host " • Amazon MQ RabbitMQ (GUI):      http://localhost:15672 (awsadmin / awspassword123)"
        Write-Host " • Amazon SES Mailbox (GUI):      http://localhost:8025"
        Write-Host " • RDS Postgres Database:         localhost:5432 (awsadmin / awspassword123)"
        Write-Host " • RDS MySQL Database:            localhost:3306 (awsadmin / awspassword123)"
        Write-Host " • ElastiCache Redis:             localhost:6379"
        Write-Host " • Amazon MSK Kafka:              localhost:9092"
        Write-Host " • Redshift / Athena (OLAP):      http://localhost:8123"
    }

    'seed' {
        Write-Host "🌱 Đang nạp dữ liệu mẫu thực chiến cho: $Target ..." -ForegroundColor Cyan
        switch ($Target) {
            'dynamodb' {
                aws --endpoint-url=http://localhost:8000 dynamodb create-table `
                    --table-name EnterpriseOrders `
                    --attribute-definitions AttributeName=OrderId,AttributeType=S AttributeName=CustomerId,AttributeType=S `
                    --key-schema AttributeName=OrderId,KeyType=HASH AttributeName=CustomerId,KeyType=RANGE `
                    --billing-mode PAY_PER_REQUEST 2>$null
                Write-Host "Đã tạo bảng DynamoDB mẫu 'EnterpriseOrders'. Mở http://localhost:8001 để xem!" -ForegroundColor Green
            }
            's3' {
                aws --endpoint-url=$LocalstackEndpoint s3 mb s3://enterprise-data-lake-raw 2>$null
                aws --endpoint-url=$LocalstackEndpoint s3 mb s3://enterprise-data-lake-processed 2>$null
                Write-Host "Đã tạo 2 S3 Buckets mẫu: raw và processed." -ForegroundColor Green
            }
            default {
                Write-Host "Chưa có kịch bản seed riêng cho $Target. Đang chạy test chung..." -ForegroundColor Yellow
                & $PSCommandPath test
            }
        }
    }

    'test' {
        Write-Host "🧪 Đang kiểm tra kết nối tới LocalStack tại $LocalstackEndpoint ..." -ForegroundColor Cyan
        aws --endpoint-url=$LocalstackEndpoint s3 mb s3://sap-data-lake-sample 2>$null
        aws --endpoint-url=$LocalstackEndpoint s3 ls
        aws --endpoint-url=$LocalstackEndpoint sqs create-queue --queue-name orders-processing-queue 2>$null
        aws --endpoint-url=$LocalstackEndpoint sqs list-queues
        aws --endpoint-url=$LocalstackEndpoint secretsmanager create-secret --name prod/db/credentials --secret-string '{\"username\":\"admin\",\"password\":\"pass123\"}' 2>$null
        aws --endpoint-url=$LocalstackEndpoint secretsmanager list-secrets
        Write-Host "Hoàn tất kiểm tra cơ bản! LocalStack hoạt động mượt mà." -ForegroundColor Green
    }
}
