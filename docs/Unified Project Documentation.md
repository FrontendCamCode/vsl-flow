# Unified Project Documentation

## Project Requirements Document

### 1. Project Overview
VSL Flow is a web-based platform designed for experienced marketers to quickly script long-form video sales letters (VSLs) using AI-driven prompts and modular text blocks. It solves the common problem of writer’s block and inconsistency in high-word-count scripts by letting users define a single “master prompt” that captures product details and target customer personality. From there, VSL Flow generates, refines, and previews each script segment in real time.

The main goals of VSL Flow are to speed up the VSL creation process, maintain a consistent tone across hundreds or thousands of words, and give users full control over editing and ordering. Success is measured by how much time users save compared to manual writing, the quality and cohesion of the final scripts, and positive feedback on ease of use. By focusing on flexibility—such as custom AI model keys, subscription credits, version history, and export options—VSL Flow aims to become the go-to tool for agencies and solo entrepreneurs crafting 5,000–10,000+ word sales letters.

### 2. In-Scope vs. Out-of-Scope
**In-Scope**
- User registration, sign-in, password recovery, and free trial onboarding via Clerk
- Dashboard listing all saved scripts with metadata (word count, last edited, credits used)
- “New Script” flow that captures product features and customer personality as a master prompt
- Three-pane editor: (1) block list, (2) block builder, (3) live preview
- AI-driven block generation and custom enhancements per block with OpenAI, Anthropic Claude, Google Gemini or user’s own API key
- Block reordering via drag-and-drop and arrow controls, plus deletion
- Manual save with version history snapshots and undo/redo keyboard shortcuts
- Export final scripts as Word (.docx), PDF, Markdown, or copy-to-clipboard
- Settings page for billing (Stripe subscriptions with generation credits) and API key management (bring-your-own-key for multiple AI providers)
- Role-based access: regular users and administrators
- Admin dashboard for monitoring per-user API usage, credit allocation, troubleshooting, and plan management
- Real-time usage analytics showing calls per model and quota consumption

**Out-of-Scope**
- Team or multi-user collaboration on the same script in real time
- Custom domains or subdomains per customer workspace
- Third-party integrations beyond AI providers (e.g., Zapier, Slack)
- Multi-language support or localization beyond English
- Built-in content publishing pipelines to external platforms

### 3. User Flow
When a new visitor arrives at VSL Flow, they see a clean landing page with options to sign in or start a free trial. After registering via email or OAuth, they go through a brief guided tour highlighting the dashboard, script creation button, and settings area. Returning users simply sign in, bypass the tour, and land on the dashboard.

Once on the dashboard, users click “New Script,” fill out a modal form with product details and choose the dream customer’s personality archetype. After saving the master prompt, they enter the editor where script blocks are auto-generated. They select, edit, reorder, and enhance each block. At any point they can save, view versions, or export. Admin users access a separate admin area where they manage user credits, view analytics, and troubleshoot issues.

### 4. Core Features
- **Dashboard & Script Management**: Central hub displaying script thumbnails, metadata, usage stats, and a “New Script” button. Users resume or delete projects here.  
- **Master Prompt Setup**: Modal form capturing product name, feature list, and target personality. This context is reused in every block generation.  
- **Three-Pane Editor**: Left pane for block navigation, center pane for editing the selected block, right pane for a live compiled preview of the full script.  
- **Block Generation & Enhancement**: Merging block templates with master prompt for initial draft. Users can manually edit or click an “enhance” icon to invoke AI with custom prompts.  
- **Reordering & Deletion**: Drag-and-drop or arrow controls to move blocks; single-click delete. Blocks reindex automatically.  
- **Saving & Version History**: Manual save that snapshots the entire script. Users can view past versions and revert.  
- **Undo/Redo & Shortcuts**: Keyboard shortcuts (Ctrl+Z, Ctrl+Y) and on-screen buttons for undo/redo at both block and script levels.  
- **Export Options**: Download as .docx, PDF, Markdown, or copy full text to clipboard.  
- **Settings & API Key Management**: Stripe billing and subscription tier management. Input API keys for OpenAI, Anthropic Claude, Google Gemini, and any user-provided LLM.  
- **Roles & Admin Controls**: Regular user vs admin. Admin dashboard to monitor usage, add credits, manage plans, and handle support tasks.  
- **Usage Analytics**: Real-time charts showing API calls by model, credits consumed, and plan quotas.

### 5. Tech Stack & Tools
**Frontend**: Next.js with TypeScript, Tailwind CSS, ShadCN UI components. These give a fast, responsive user interface with a consistent design system.
**Backend & Storage**: Supabase for database, authentication integration via Clerk, and edge functions for server logic. Supabase simplifies real-time data syncing and user management.
**Authentication**: Clerk handles sign-up, sign-in, session management, and password recovery.
**AI Models & Libraries**: OpenAI, Anthropic Claude, Google Gemini API clients. The app merges user prompts with templates and sends requests to these endpoints. Users can also supply custom API keys.
**Deployment & CI/CD**: Vercel for hosting the Next.js app, GitHub Actions for testing and deployments.

### 6. Non-Functional Requirements
- **Performance**: UI updates (preview refresh) under 300ms. Save operations complete within 1 second.  
- **Scalability**: Must handle hundreds of concurrent users without degradation.  
- **Reliability**: 99.9% uptime SLA.  
- **Security**: All data in transit encrypted via TLS. Sensitive keys stored securely in environment variables. Role-based access controls enforced server-side.  
- **Compliance**: GDPR-ready data handling (user data deletion on request).

### 7. Constraints & Assumptions
- We assume availability of OpenAI, Anthropic Claude, and Google Gemini APIs with stable endpoints.  
- Hosting on a single domain via Vercel.  
- Stripe supports subscription tiers and credit allocations.  
- Supabase real-time features are sufficient for version history and analytics dashboards.  
- No need for complex SSR beyond initial dashboard load; dynamic data loaded client-side.

### 8. Known Issues & Potential Pitfalls
- **API Rate Limits**: High usage may hit model rate caps. Mitigation: queue requests, show user-friendly messages, allow fallback to alternative model.  
- **Draft Conflicts**: Simultaneous edits could overwrite saves. Mitigation: lock script on save, warn users of concurrent edits.  
- **Large Scripts**: Rendering 10,000+ words in preview might lag. Mitigation: virtualize preview pane, paginate blocks.  
- **Key Misconfiguration**: Users may enter invalid API keys. Mitigation: validate keys on entry, display clear error messages.

## App Flow Document

### Onboarding and Sign-In/Sign-Up
When someone visits VSL Flow for the first time they land on a welcoming sign-in page with options to register using email or OAuth providers managed by Clerk. New users click “Start Free Trial,” enter their details, and confirm their email. They are then guided through a short tutorial that highlights the dashboard, the “New Script” button, the script editor layout, and where to manage account settings. If users forget their password they click “Forgot password,” receive a reset link, and set a new password. Signing out is done via a user menu in the top right corner.

### Main Dashboard or Home Page
After signing in, users land on a clean dashboard showing thumbnails of their existing scripts, each labeled with title, word count, last edited date, and credits used. Above the list is a prominent “New Script” button and a usage summary showing how many AI calls they’ve made and credits remaining. A sidebar provides quick links to Settings, Analytics, and for admins, the Admin Dashboard. Clicking any script thumbnail opens it in the editor.

### Detailed Feature Flows and Page Transitions
When a user clicks “New Script,” a modal appears asking for the product name, list of features, and a personality type for the target audience. After saving these details the app transitions to the three-pane editor. On the left is a scrollable list of script blocks. Clicking a block label loads its content in the center builder. Each time a block is selected, the master prompt and block template merge to generate text via AI. The right pane updates instantly to show a live preview of the full script. Users can move blocks up or down by dragging them in the left list or by clicking arrow icons. Deleting a block removes it and shifts the rest.

Advanced users click the enhance icon inside any block to enter a custom instruction. This triggers a new AI request with their chosen model. Admins accessing the same flow can also jump into a user’s script in read-only mode to troubleshoot or add credits.

### Settings and Account Management
From the dashboard sidebar, users open Settings to update their profile, change passwords, and manage notification preferences. Under Billing they see subscription tiers, credit balances, and a “Change Plan” button that links to Stripe’s hosted page. The API Key Management section lists OpenAI, Anthropic Claude, and Google Gemini with fields to paste custom keys. Users toggle between built-in and BYO-Key modes. After saving settings, they click “Back to Dashboard” in the header.

### Error States and Alternate Paths
If a user enters invalid login credentials they see a clear error message under the input fields. During script editing, if an AI request fails due to network loss or API error, a toast notification appears saying “Unable to generate text. Check your connection or API key.” Users retry by clicking a retry icon in the block. If saving fails, a banner appears at the top offering to retry. In all cases, users can return to the dashboard or settings via the sidebar.

### Conclusion and Overall App Journey
From sign-up through finishing a VSL, users experience a guided flow: register, onboard, create a master prompt, generate and refine script blocks in a modular editor, and export the final document. Throughout this journey, they enjoy real-time previews, version history safety nets, and flexible billing and AI key management, culminating in a polished, exportable video sales letter.

## Tech Stack Document

### Frontend Technologies
- Next.js with React provides server-side rendering and fast page loads.  
- TypeScript ensures type safety and fewer runtime errors.  
- Tailwind CSS for utility-first styling, speeding up design consistency.  
- ShadCN UI for pre-built accessible components aligned with Tailwind.  
- React DnD or Framer Motion for intuitive drag-and-drop block reordering.  

### Backend Technologies
- Supabase handles Postgres-based data storage, real-time subscriptions, and edge functions.  
- Clerk manages authentication, user sessions, and role-based access control.  
- Stripe’s Node SDK for subscription billing, credit management, and webhook handling.  
- Custom serverless functions (Vercel or Supabase Edge) to merge prompts and proxy AI requests securely.  

### Infrastructure and Deployment
- Vercel hosting for automatic deployments, global CDN, and edge functions.  
- GitHub Actions CI/CD pipeline running linting, type checks, and tests on every pull request.  
- Git for version control with protected branches and PR reviews.  

### Third-Party Integrations
- OpenAI API for GPT-based text generation.  
- Anthropic Claude API for alternative AI responses.  
- Google Gemini API for diverse model options.  
- Stripe for subscription billing, webhooks, and invoice management.  

### Security and Performance Considerations
- All API keys and environment variables stored in Vercel’s secure secrets.  
- TLS enforced site-wide.  
- Rate limiting on AI proxy endpoints to prevent abuse.  
- Database row-level security in Supabase to isolate user data.  
- Lazy loading of heavy components (preview pane) to improve initial load times.  

### Conclusion and Overall Tech Stack Summary
This stack balances developer productivity and user experience. Next.js, TypeScript, Tailwind, and ShadCN deliver a fast, maintainable UI. Supabase and Clerk simplify backend and auth tasks. Stripe and a serverless architecture ensure scalable billing and AI integration. Together, these technologies align with VSL Flow’s goals of speed, flexibility, and reliability.

## Implementation Plan
1. Set up repository using the CodeGuide Starter Pro structure and configure Next.js, Tailwind, Clerk, and Supabase.  
2. Implement authentication flows (sign-up, sign-in, password reset) with Clerk.  
3. Build the dashboard UI listing scripts and usage analytics.  
4. Create the “New Script” modal to capture master prompt details.  
5. Scaffold the three-pane editor layout and integrate block templates.  
6. Develop AI proxy endpoints for OpenAI, Anthropic Claude, and Google Gemini with key validation.  
7. Add block generation logic merging templates with master prompt.  
8. Implement drag-and-drop and arrow-based reordering of blocks.  
9. Build save, version history, and undo/redo features using Supabase and client-side state.  
10. Create export functions for Word, PDF, Markdown, and clipboard.  
11. Develop Settings page with Stripe integration and API key management.  
12. Build Admin Dashboard for usage monitoring, credit adjustments, and support tools.  
13. Add error handling, toast notifications, and offline/fallback states.  
14. Write end-to-end and unit tests; set up CI/CD with GitHub Actions.  
15. Deploy to Vercel, perform load testing, and launch a beta for user feedback.  
16. Iterate based on feedback, fix issues, and prepare for GA release.
