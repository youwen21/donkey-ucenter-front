-- 用户验证码/令牌表
-- 用于存储用户绑定邮箱、手机等操作的验证码或令牌

CREATE TABLE `user_verification` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID，0表示未注册用户（注册验证场景）',
  `type` VARCHAR(32) NOT NULL COMMENT '验证类型: email_register, phone_register, email_bind, phone_bind, email_reset, phone_reset 等',
  `code` VARCHAR(64) NOT NULL COMMENT '验证码或令牌',
  `target` VARCHAR(255) NOT NULL COMMENT '目标值: 邮箱地址、手机号等',
  `status` TINYINT NOT NULL DEFAULT 0 COMMENT '状态: 0-未使用, 1-已使用, 2-已过期',
  `expires_at` DATETIME NOT NULL COMMENT '过期时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `used_at` DATETIME NULL DEFAULT NULL COMMENT '使用时间',
  PRIMARY KEY (`id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户验证码/令牌表';

-- 示例数据说明:
-- type 字段可选值:
--   - email_register: 注册邮箱验证（user_id=0）
--   - phone_register: 注册手机验证（user_id=0）
--   - email_bind: 绑定邮箱（已注册用户）
--   - phone_bind: 绑定手机（已注册用户）
--   - email_reset: 重置邮箱
--   - phone_reset: 重置手机
--   - password_reset: 重置密码
--   - email_verify: 验证邮箱
--   - phone_verify: 验证手机
--
-- user_id 字段说明:
--   - 0: 未注册用户，用于注册验证场景
--   - >0: 已注册用户ID，用于绑定、重置等场景
--
-- status 字段:
--   0: 未使用 (pending)
--   1: 已使用 (used)
--   2: 已过期 (expired)
--
-- 使用场景:
-- 1. 注册邮箱: user_id=0, type='email_register', target='user@example.com', code='6位数字验证码'
-- 2. 注册手机: user_id=0, type='phone_register', target='13800138000', code='6位数字验证码'
-- 3. 绑定邮箱: user_id>0, type='email_bind', target='user@example.com', code='6位数字验证码'
-- 4. 绑定手机: user_id>0, type='phone_bind', target='13800138000', code='6位数字验证码'
-- 5. 重置密码: user_id>0, type='password_reset', target='user@example.com', code='随机token字符串'

