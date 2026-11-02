#!/usr/bin/env bash
# ==============================================================================
# AWS LAB MANAGER (Bash Shell Helper for Linux & macOS)
# Cú pháp: ./lab.sh [start|stop|status|seed|test] [target]
# ==============================================================================

ACTION="${1:-start}"
TARGET="${2:-core}"
LOCALSTACK_ENDPOINT="http://localhost:4566"

show_help() {
  echo "=========================================================="
  echo "  AWS ENTERPRISE DOCKER LAB (Linux / macOS Shell Helper)"
  echo "=========================================================="
  echo "Cú pháp: ./lab.sh [action] [target]"
  echo ""
  echo "Hành động (Action):"
  echo "  start [target]    Khởi chạy nhóm dịch vụ"
  echo "  stop [target]     Dừng dịch vụ (hoặc dừng tất cả nếu để trống)"
  echo "  status            Kiểm tra trạng thái container"
  echo "  seed [target]     Nạp dữ liệu mẫu thực hành"
  echo ""
  echo "Target có sẵn: core, dynamodb, s3, rds, redis, kafka, mq, opensearch, ses, redshift, all"
  echo "=========================================================="
}

case "$ACTION" in
  start)
    echo "🚀 Đang khởi chạy lab dịch vụ: $TARGET ..."
    docker compose --profile "$TARGET" up -d
    docker compose ps
    ;;
  stop)
    if [ "$TARGET" = "core" ] || [ "$TARGET" = "all" ] || [ -z "$TARGET" ]; then
      echo "🛑 Đang dừng toàn bộ container lab..."
      docker compose --profile all down
    else
      echo "🛑 Đang dừng nhóm lab: $TARGET ..."
      docker compose --profile "$TARGET" down
    fi
    ;;
  status)
    echo "📊 Các container Lab đang hoạt động:"
    docker compose ps
    ;;
  seed)
    echo "🌱 Đang nạp dữ liệu mẫu cho $TARGET..."
    if [ "$TARGET" = "dynamodb" ]; then
      aws --endpoint-url=http://localhost:8000 dynamodb create-table \
        --table-name EnterpriseOrders \
        --attribute-definitions AttributeName=OrderId,AttributeType=S AttributeName=CustomerId,AttributeType=S \
        --key-schema AttributeName=OrderId,KeyType=HASH AttributeName=CustomerId,KeyType=RANGE \
        --billing-mode PAY_PER_REQUEST 2>/dev/null
      echo "Đã tạo bảng DynamoDB mẫu 'EnterpriseOrders'."
    fi
    ;;
  help|*)
    show_help
    ;;
esac
