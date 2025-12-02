# 用户验证码/令牌表设计文档

## 表名
`user_verification`

## 用途
存储用户绑定邮箱、手机等操作的验证码或令牌，支持多种验证场景，包括：
- **注册验证**：用户注册时的邮箱/手机验证码（user_id=0）
- **绑定验证**：已注册用户绑定邮箱/手机
- **重置验证**：重置密码、邮箱、手机等操作

## 表结构

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | 主键ID | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID，0表示未注册用户 | NOT NULL, DEFAULT 0 |
| type | VARCHAR(32) | 验证类型 | NOT NULL |
| code | VARCHAR(64) | 验证码或令牌 | NOT NULL |
| target | VARCHAR(255) | 目标值（邮箱/手机号等） | NOT NULL |
| status | TINYINT | 状态：0-未使用, 1-已使用, 2-已过期 | NOT NULL, DEFAULT 0 |
| expires_at | DATETIME | 过期时间 | NOT NULL |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| used_at | DATETIME | 使用时间 | NULL |

## 索引设计

1. **主键索引**: `id` - 用于唯一标识记录
2. **用户ID索引**: `idx_user_id` - 快速查询用户的验证记录（包括 user_id=0 的注册验证）
3. **验证码索引**: `idx_code` - 快速通过验证码查询
4. **类型状态索引**: `idx_type_status` - 查询特定类型和状态的记录
5. **过期时间索引**: `idx_expires_at` - 用于清理过期记录
6. **用户类型联合索引**: `idx_user_type` - 查询用户特定类型的验证记录
7. **目标类型状态联合索引**: `idx_target_type` - 用于注册场景，通过邮箱/手机号查询验证码

## user_id 字段说明

| user_id 值 | 说明 | 使用场景 |
|-----------|------|----------|
| 0 | 未注册用户 | 用户注册时的邮箱/手机验证 |
| >0 | 已注册用户ID | 绑定、重置等已注册用户的操作 |

## 验证类型 (type) 枚举

| 类型值 | 说明 | user_id | 示例 |
|--------|------|---------|------|
| `email_register` | 注册邮箱验证 | 0 | 用户注册时验证邮箱 |
| `phone_register` | 注册手机验证 | 0 | 用户注册时验证手机 |
| `email_bind` | 绑定邮箱 | >0 | 已注册用户绑定新邮箱 |
| `phone_bind` | 绑定手机 | >0 | 已注册用户绑定新手机号 |
| `email_reset` | 重置邮箱 | >0 | 用户更换邮箱 |
| `phone_reset` | 重置手机 | >0 | 用户更换手机号 |
| `password_reset` | 重置密码 | >0 | 用户忘记密码重置 |
| `email_verify` | 验证邮箱 | >0 | 验证邮箱有效性 |
| `phone_verify` | 验证手机 | >0 | 验证手机有效性 |

## 状态值 (status) 说明

| 状态值 | 说明 | 备注 |
|--------|------|------|
| 0 | 未使用 (pending) | 验证码已生成，等待使用 |
| 1 | 已使用 (used) | 验证码已被使用，不可再次使用 |
| 2 | 已过期 (expired) | 验证码已过期，不可使用 |

## 使用场景示例

### 1. 注册邮箱验证流程（user_id=0）

```sql
-- 1. 生成注册验证码（用户未注册，user_id=0）
INSERT INTO user_verification (user_id, type, code, target, expires_at)
VALUES (0, 'email_register', '123456', 'user@example.com', DATE_ADD(NOW(), INTERVAL 10 MINUTE));

-- 2. 验证注册验证码（通过邮箱和验证码查询）
SELECT * FROM user_verification 
WHERE user_id = 0 
  AND type = 'email_register' 
  AND target = 'user@example.com'
  AND code = '123456' 
  AND status = 0 
  AND expires_at > NOW();

-- 3. 用户注册成功后，标记验证码为已使用
UPDATE user_verification 
SET status = 1, used_at = NOW() 
WHERE id = ?;
```

### 2. 注册手机验证流程（user_id=0）

```sql
-- 1. 生成注册验证码
INSERT INTO user_verification (user_id, type, code, target, expires_at)
VALUES (0, 'phone_register', '654321', '13800138000', DATE_ADD(NOW(), INTERVAL 5 MINUTE));

-- 2. 验证注册验证码（通过手机号和验证码查询）
SELECT * FROM user_verification 
WHERE user_id = 0 
  AND type = 'phone_register' 
  AND target = '13800138000'
  AND code = '654321' 
  AND status = 0 
  AND expires_at > NOW();

-- 3. 用户注册成功后，标记验证码为已使用
UPDATE user_verification 
SET status = 1, used_at = NOW() 
WHERE id = ?;
```

### 3. 绑定邮箱流程（已注册用户）

```sql
-- 1. 生成验证码
INSERT INTO user_verification (user_id, type, code, target, expires_at)
VALUES (123, 'email_bind', '123456', 'user@example.com', DATE_ADD(NOW(), INTERVAL 10 MINUTE));

-- 2. 验证验证码
SELECT * FROM user_verification 
WHERE user_id = 123 
  AND type = 'email_bind' 
  AND code = '123456' 
  AND status = 0 
  AND expires_at > NOW();

-- 3. 标记为已使用
UPDATE user_verification 
SET status = 1, used_at = NOW() 
WHERE id = ?;
```

### 4. 绑定手机流程（已注册用户）

```sql
-- 1. 生成验证码
INSERT INTO user_verification (user_id, type, code, target, expires_at)
VALUES (123, 'phone_bind', '654321', '13800138000', DATE_ADD(NOW(), INTERVAL 5 MINUTE));

-- 2. 验证验证码
SELECT * FROM user_verification 
WHERE user_id = 123 
  AND type = 'phone_bind' 
  AND code = '654321' 
  AND status = 0 
  AND expires_at > NOW();

-- 3. 标记为已使用
UPDATE user_verification 
SET status = 1, used_at = NOW() 
WHERE id = ?;
```

### 5. 重置密码流程（使用 token）

```sql
-- 1. 生成重置令牌
INSERT INTO user_verification (user_id, type, code, target, expires_at)
VALUES (123, 'password_reset', 'random_token_string_here', 'user@example.com', DATE_ADD(NOW(), INTERVAL 1 HOUR));

-- 2. 验证令牌
SELECT * FROM user_verification 
WHERE code = 'random_token_string_here' 
  AND type = 'password_reset' 
  AND status = 0 
  AND expires_at > NOW();
```

## 最佳实践

1. **验证码生成**:
   - 邮箱/手机验证码: 6位数字，有效期 5-10 分钟
   - 重置密码令牌: 随机字符串（32-64字符），有效期 1 小时

2. **安全性**:
   - 验证码使用后立即标记为已使用
   - 定期清理过期记录（建议使用定时任务）
   - 同一用户同一类型限制频率（如1分钟内只能发送一次）
   - 注册场景：通过 `target` + `type` 限制频率，防止恶意注册
   - 注册验证码验证时，必须同时匹配 `target`（邮箱/手机）和 `code`，确保安全性

3. **性能优化**:
   - 定期清理过期和已使用的旧记录
   - 使用索引优化查询性能
   - 考虑对历史数据进行归档

4. **清理过期记录**:
```sql
-- 定期执行，清理过期记录
DELETE FROM user_verification 
WHERE expires_at < NOW() 
  AND status IN (0, 2);
```

## 扩展建议

如果需要支持更多功能，可以考虑添加以下字段：

- `ip_address`: 记录请求IP，用于安全审计
- `attempts`: 验证尝试次数，防止暴力破解
- `metadata`: JSON字段，存储额外的元数据信息

