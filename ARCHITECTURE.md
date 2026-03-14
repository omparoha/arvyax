# System Architecture

## 1. Scaling to 100k Users
To handle high traffic, I would:
- Move LLM analysis to a **Background Worker** using a message queue (RabbitMQ/BullMQ).
- Implement **Database Indexing** on `userId` and `createdAt` for fast lookups.
- Deploy the backend as **Stateless Microservices** in Docker to allow horizontal scaling.

## 2. Reducing LLM Costs
- **Prompt Engineering:** Use the most efficient models (e.g., Gemini 1.5 Flash).
- **Batching:** Aggregate analysis for users who edit their journals frequently.
- **Heuristics:** Use basic NLP for simple entries and reserve the LLM for complex text.

## 3. Caching Strategy
- **Redis:** Store the results of analyzed text hashes. If a user submits identical text, we serve the cached emotion result instantly.
- **React Query:** Implement frontend caching to prevent unnecessary API calls on page refresh.

## 4. Security & Data Protection
- **Encryption:** Encrypt journal text at rest using AES-256.
- **Sanitization:** Scrub PII (Personally Identifiable Information) before sending data to the LLM.
- **Authentication:** Use JWT to ensure private journal access.