#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-https://heggria.github.io/sbti-lab/}"
PASS=0
FAIL=0
WARN=0

pass() { PASS=$((PASS + 1)); echo "  ✅ $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  ❌ $1"; }
warn() { WARN=$((WARN + 1)); echo "  ⚠️  $1"; }

echo "=== SBTI Lab 每日健康检查 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

echo "--- 1. Lint ---"
if npm run lint --silent 2>&1; then
  pass "lint 通过"
else
  fail "lint 失败"
fi

echo ""
echo "--- 2. 测试 ---"
if npm test --silent 2>&1; then
  pass "所有测试通过"
else
  fail "测试失败"
fi

echo ""
echo "--- 3. 生产构建 ---"
BUILD_START=$(date +%s)
if npm run build --silent 2>&1; then
  BUILD_END=$(date +%s)
  BUILD_TIME=$((BUILD_END - BUILD_START))
  pass "构建成功 (${BUILD_TIME}s)"
else
  fail "构建失败"
fi

echo ""
echo "--- 4. 构建产物检查 ---"
if [ -f dist/index.html ]; then
  pass "dist/index.html 存在"
else
  fail "dist/index.html 缺失"
fi

HTML_SIZE=$(wc -c < dist/index.html 2>/dev/null || echo 0)
if [ "$HTML_SIZE" -gt 0 ]; then
  pass "HTML 非空 (${HTML_SIZE} bytes)"
else
  fail "HTML 为空"
fi

JS_COUNT=$(find dist/assets -name '*.js' 2>/dev/null | wc -l | tr -d ' ')
CSS_COUNT=$(find dist/assets -name '*.css' 2>/dev/null | wc -l | tr -d ' ')
if [ "$JS_COUNT" -gt 0 ] && [ "$CSS_COUNT" -gt 0 ]; then
  pass "JS 文件 ${JS_COUNT} 个, CSS 文件 ${CSS_COUNT} 个"
else
  fail "构建产物不完整 (JS:${JS_COUNT}, CSS:${CSS_COUNT})"
fi

TOTAL_SIZE=$(du -sh dist/ 2>/dev/null | cut -f1)
echo "  📦 总大小: ${TOTAL_SIZE}"

echo ""
echo "--- 5. 线上可访问性 ---"
HTTP_CODE=$(curl -sS -o /tmp/sbti-health-page.html -w "%{http_code}" --max-time 15 "$SITE_URL" 2>&1)
if [ "$HTTP_CODE" = "200" ]; then
  pass "HTTP 200 (${SITE_URL})"
else
  fail "HTTP ${HTTP_CODE} (${SITE_URL})"
fi

PAGE_SIZE=$(wc -c < /tmp/sbti-health-page.html 2>/dev/null || echo 0)
if [ "$PAGE_SIZE" -gt 500 ]; then
  pass "页面内容有效 (${PAGE_SIZE} bytes)"
else
  fail "页面内容过小 (${PAGE_SIZE} bytes)，可能异常"
fi

if grep -q '<title>' /tmp/sbti-health-page.html 2>/dev/null; then
  TITLE=$(sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' /tmp/sbti-health-page.html 2>/dev/null || echo "未知")
  pass "页面标题: ${TITLE}"
else
  fail "页面缺少 <title> 标签"
fi

if grep -q '<div id="root">' /tmp/sbti-health-page.html 2>/dev/null; then
  pass "React root 节点存在"
else
  warn "未找到 React root 节点（可能是非 SPA 部署或结构变化）"
fi

rm -f /tmp/sbti-health-page.html

echo ""
echo "=== 检查结果 ==="
echo "通过: ${PASS} | 失败: ${FAIL} | 警告: ${WARN}"
if [ "$FAIL" -gt 0 ]; then
  echo "状态: ❌ FAIL"
  exit 1
elif [ "$WARN" -gt 0 ]; then
  echo "状态: ⚠️  PASS WITH NOTES"
  exit 0
else
  echo "状态: ✅ ALL PASS"
  exit 0
fi
