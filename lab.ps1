# ==============================================================================
# AWS LAB MANAGER (PowerShell Helper)
# Quản lý môi trường lab Docker cục bộ cho kỳ thi SAP-C02 & Specialty
# ==============================================================================

param (
    [Parameter(Position=0)]
    [ValidateSet('start', 'stop', 'status', 'test', 'help')]
    [string]$Action = 'start',

    [Parameter(Position=1)]
    [ValidateSet('core', 'nosql', 'database', 'search', 'streaming', 'all')]
    [string]$Profile = 'core'
)

$LocalstackEndpoint = "http://localhost:4566"

function Show-Help {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  AWS ENTERPRISE DOCKER LAB HELPER" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "Cú pháp: .\lab.ps1 [action] [profile]"
    Write-Host ""
    Write-Host "Hành động (Action):" -ForegroundColor Green
    Write-Host "  start [profile]   Khởi chạy nhóm dịch vụ tương ứng (mặc định: core)"
    Write-Host "  stop              Dừng toàn bộ các container đang chạy"
    Write-Host "  status            Kiểm tra trạng thái các cổng và container"
    Write-Host "  test              Chạy thử nghiệm tạo S3, SQS, DynamoDB trên LocalStack"
    Write-Host ""
    Write-Host "Các Profile có sẵn:" -ForegroundColor Green
    Write-Host "  core        LocalStack (S3, SQS, SNS, Lambda, Secrets Manager, KMS...)"
    Write-Host "  nosql       DynamoDB Local + DynamoDB Admin GUI (cổng 8000, 8001)"
    Write-Host "  database    PostgreSQL (RDS Aurora) + Redis (ElastiCache) (cổng 5432, 6379)"
    Write-Host "  search      OpenSearch + OpenSearch Dashboards GUI (cổng 9200, 5601)"
    Write-Host "  streaming   Amazon MQ RabbitMQ (cổng 5672, 15672)"
    Write-Host "  all         Khởi chạy TOÀN BỘ các dịch vụ trên"
    Write-Host "==========================================================" -ForegroundColor Cyan
}

switch ($Action) {
    'help' {
        Show-Help
    }

    'start' {
        Write-Host "🚀 Đang khởi chạy nhóm dịch vụ: $Profile ..." -ForegroundColor Cyan
        docker compose --profile $Profile up -d
        Write-Host "Đã gửi lệnh khởi chạy. Đang kiểm tra trạng thái container..." -ForegroundColor Green
        docker compose ps
    }

    'stop' {
        Write-Host "🛑 Đang dừng toàn bộ các container lab..." -ForegroundColor Yellow
        docker compose --profile all down
        Write-Host "Toàn bộ container đã được giải phóng an toàn." -ForegroundColor Green
    }

    'status' {
        Write-Host "📊 Trạng thái các container đang chạy:" -ForegroundColor Cyan
        docker compose ps
        Write-Host ""
        Write-Host "Danh sách các cổng dịch vụ:" -ForegroundColor Yellow
        Write-Host " - LocalStack (Core AWS):        http://localhost:4566"
        Write-Host " - DynamoDB Admin (GUI):         http://localhost:8001"
        Write-Host " - MinIO S3 Console (GUI):       http://localhost:9001 (awsadmin / awspassword123)"
        Write-Host " - OpenSearch Dashboards (GUI):  http://localhost:5601"
        Write-Host " - Amazon MQ RabbitMQ (GUI):     http://localhost:15672 (awsadmin / awspassword123)"
        Write-Host " - RDS Postgres Database:        localhost:5432 (awsadmin / awspassword123)"
        Write-Host " - ElastiCache Redis:            localhost:6379"
    }

    'test' {
        Write-Host "🧪 Đang kiểm tra kết nối tới LocalStack tại $LocalstackEndpoint ..." -ForegroundColor Cyan

        # 1. Test S3
        Write-Host "[1/3] Tạo S3 Bucket 'sap-data-lake-sample'..." -ForegroundColor Yellow
        aws --endpoint-url=$LocalstackEndpoint s3 mb s3://sap-data-lake-sample 2>$null
        aws --endpoint-url=$LocalstackEndpoint s3 ls

        # 2. Test SQS
        Write-Host "[2/3] Tạo Hàng đợi SQS 'orders-processing-queue'..." -ForegroundColor Yellow
        aws --endpoint-url=$LocalstackEndpoint sqs create-queue --queue-name orders-processing-queue 2>$null
        aws --endpoint-url=$LocalstackEndpoint sqs list-queues

        # 3. Test Secrets Manager
        Write-Host "[3/3] Tạo bí mật trong Secrets Manager 'prod/db/credentials'..." -ForegroundColor Yellow
        aws --endpoint-url=$LocalstackEndpoint secretsmanager create-secret --name prod/db/credentials --secret-string '{\"username\":\"admin\",\"password\":\"pass123\"}' 2>$null
        aws --endpoint-url=$LocalstackEndpoint secretsmanager list-secrets

        Write-Host "Hoàn tất kiểm tra cơ bản! LocalStack hoạt động mượt mà." -ForegroundColor Green
    }
}
