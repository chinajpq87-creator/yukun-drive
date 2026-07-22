# OPC V1 AI Motion Solution Platform

## 项目定位

建立一个AI驱动的微型运动解决方案平台。

目标：
服务全球消费电子、智能硬件、机器人客户。

核心不是销售单一电机，而是提供：

Motion Solution
- 
Component Integration
- 
China Supply Chain Matching


## AI Agent分工

### ChatGPT
角色：
Market & Solution Architect

负责：
- 全球消费产品市场需求调研
- 客户应用场景分析
- Motion Solution设计
- 产品优先级判断


### Kimi
角色：
China Supply Chain Research Agent

负责：
- 中国微电机供应链调研
- DC Motor厂家
- Gear Motor厂家
- Vibration Motor厂家
- Driver Board厂家
- Micro Switch厂家
- Encoder/Sensor厂家


### Codex
角色：
CTO

负责：
- 系统架构
- 数据库
- 网站
- 工作流


### 豆包
角色：
Content Agent

负责：
- SEO内容
- 产品介绍
- 视频脚本


# 核心业务流程

Market Demand
        ↓
Motion Requirement Analysis
        ↓
Motion Solution
        ↓
Component Selection
        ↓
China Supplier Matching
        ↓
Website Display
        ↓
Customer Inquiry


# 核心数据库

## 1. market_demands

字段：

id
industry
application
product_name
customer_type
market_region
customer_problem
motion_requirement
technical_requirement
priority
business_value


## 2. supply_chain

字段：

id
company_name
location
category
product_type
technical_capability
application
oem_capability
moq
certification
contact
website


## 3. motion_solutions

字段：

id
solution_name
application
motion_type
description
recommended_components
supplier_links
target_customer
priority


## 4. components

字段：

id
component_type
model
specification
supplier
application


# 产品矩阵方向

## Smart Home
- Smart Lock
- Smart Curtain
- Smart Toilet
- Automatic Trash Bin


## Pet Device
- Pet Feeder
- Cat Litter Box
- Water Fountain


## Personal Care
- Beauty Device
- Massage Gun
- Electric Toothbrush


## Haptic
- ERM Vibration Motor
- LRA Vibration Motor
- Haptic Module


## Robotics
- Dexterous Hand
- Mini Robot
- AGV Module


# 技术要求

Frontend:
Astro + TypeScript

Backend:
Supabase

Database:
PostgreSQL


第一阶段目标：

先完成：
1. 数据模型设计
2. Supabase数据库结构
3. 基础后台管理
4. Solution页面模板

不要先开发复杂功能。
